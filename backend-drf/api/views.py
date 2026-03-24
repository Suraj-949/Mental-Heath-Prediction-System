import logging
import re
from pathlib import Path
from string import punctuation
from typing import Any

import joblib
from django.conf import settings
from rest_framework import permissions, status, views
from rest_framework.exceptions import ParseError
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from .models import PredictionRecord
from .serializers import PredictionInputSerializer

logger = logging.getLogger(__name__)

MODEL_DIR = Path(settings.BASE_DIR) / "models"
MODEL_FILE = MODEL_DIR / "model.pkl"
VECTORIZER_FILE = MODEL_DIR / "vectorizer.pkl"
PUNCTUATION_TABLE = str.maketrans("", "", punctuation)
STOP_WORDS = set(ENGLISH_STOP_WORDS)

try:
    from nltk.stem import PorterStemmer
except ImportError:
    PorterStemmer = None


def load_joblib(path: Path) -> Any:
    with path.open("rb") as file:
        return joblib.load(file)


class SimpleStemmer:
    common_suffixes = ("ingly", "edly", "ing", "ed", "ly", "ness", "ment", "s")

    def stem(self, word: str) -> str:
        for suffix in self.common_suffixes:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                return word[: -len(suffix)]
        return word


STEMMER = PorterStemmer() if PorterStemmer else SimpleStemmer()
MODEL = None
VECTORIZER = None
MODEL_LOAD_ERROR = None

try:
    MODEL = load_joblib(MODEL_FILE)
    VECTORIZER = load_joblib(VECTORIZER_FILE)
except Exception as exc:
    MODEL_LOAD_ERROR = str(exc)
    logger.exception("Failed to load ML artifacts from %s", MODEL_DIR)


def preprocess_text(text: str) -> str:
    lowered_text = text.lower()
    without_punctuation = lowered_text.translate(PUNCTUATION_TABLE)
    normalized_text = re.sub(r"\s+", " ", without_punctuation).strip()
    processed_tokens = []

    for word in normalized_text.split():
        if word in STOP_WORDS:
            continue
        stemmed_word = STEMMER.stem(word)
        if stemmed_word:
            processed_tokens.append(stemmed_word)

    return " ".join(processed_tokens)


class MentalHealthPredictView(views.APIView):
    parser_classes = [JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if MODEL_LOAD_ERROR:
            return Response(
                {"detail": "Model artifacts are unavailable.", "error": MODEL_LOAD_ERROR},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            if not isinstance(request.data, dict):
                return Response(
                    {"detail": "Invalid payload. Expected a JSON object."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            serializer = PredictionInputSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            input_text = serializer.validated_data["text"].strip()
            if not input_text:
                return Response(
                    {"detail": "Text input cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            cleaned_text = preprocess_text(input_text)
            if not cleaned_text:
                return Response(
                    {"detail": "Text input did not contain enough meaningful words after preprocessing."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            transformed_text = VECTORIZER.transform([cleaned_text])
            prediction = str(MODEL.predict(transformed_text)[0])

            confidence = 0.0
            if hasattr(MODEL, "predict_proba"):
                probabilities = MODEL.predict_proba(transformed_text)[0]
                class_labels = list(MODEL.classes_)
                predicted_index = class_labels.index(prediction)
                confidence = float(probabilities[predicted_index])

            PredictionRecord.objects.create(
                user=request.user if request.user.is_authenticated else None,
                input_text=input_text,
                cleaned_text=cleaned_text,
                prediction=prediction,
                confidence=confidence,
            )

            return Response(
                {
                    "prediction": prediction,
                    "confidence": round(confidence, 4),
                },
                status=status.HTTP_200_OK,
            )
        except ParseError:
            return Response(
                {"detail": "Invalid JSON. Please send a valid JSON body."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception:
            logger.exception("Prediction failed")
            return Response(
                {"detail": "Internal server error during prediction."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
