import logging
import re
from collections import Counter
from pathlib import Path
from string import punctuation
from typing import Any

import joblib
from django.conf import settings
from django.db.models import Avg, Count
from django.utils import timezone
from rest_framework import permissions, status, views
from rest_framework.exceptions import ParseError
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from .models import PredictionRecord
from .serializers import MoodHistorySerializer, PredictionInputSerializer, SaveEntrySerializer

logger = logging.getLogger(__name__)

MODEL_DIR = Path(settings.BASE_DIR) / "models"
MODEL_FILE = MODEL_DIR / "model.pkl"
VECTORIZER_FILE = MODEL_DIR / "vectorizer.pkl"
PUNCTUATION_TABLE = str.maketrans("", "", punctuation)
STOP_WORDS = set(ENGLISH_STOP_WORDS)
MOOD_SCORE_MAP = {
    "Normal": 1,
    "Stress": 2,
    "Anxiety": 2,
    "Depression": 3,
    "Bipolar": 3,
    "Personality disorder": 3,
    "Suicidal": 4,
}

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


def get_prediction_confidence(model, transformed_text, prediction: str) -> float:
    confidence = 0.0

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(transformed_text)[0]
        class_labels = list(model.classes_)
        predicted_index = class_labels.index(prediction)
        confidence = float(probabilities[predicted_index])

    return confidence


def create_prediction_record(
    *,
    user,
    input_text: str,
    cleaned_text: str,
    prediction: str,
    confidence: float,
    entry_date=None,
    entry_source=PredictionRecord.ENTRY_SOURCE_PREDICTION,
):
    return PredictionRecord.objects.create(
        user=user if getattr(user, "is_authenticated", False) else None,
        input_text=input_text,
        cleaned_text=cleaned_text,
        prediction=prediction,
        confidence=confidence,
        entry_date=entry_date or timezone.localdate(),
        entry_source=entry_source,
    )


def build_mood_history_payload(queryset):
    serialized_entries = MoodHistorySerializer(queryset, many=True).data

    trend_rows = (
        queryset.values("entry_date")
        .annotate(
            average_confidence=Avg("confidence"),
            total=Count("id"),
        )
        .order_by("entry_date")
    )
    trend = []

    for row in trend_rows:
        same_day_entries = queryset.filter(entry_date=row["entry_date"])
        scores = [MOOD_SCORE_MAP.get(entry.prediction, 2) for entry in same_day_entries]
        labels = list(same_day_entries.values_list("prediction", flat=True))
        most_common_label = Counter(labels).most_common(1)[0][0] if labels else "Normal"
        trend.append(
            {
                "date": row["entry_date"],
                "mood_score": round(sum(scores) / len(scores), 2) if scores else 0,
                "average_confidence": round(row["average_confidence"] or 0, 4),
                "entries": row["total"],
                "dominant_mood": most_common_label,
            }
        )

    distribution_rows = queryset.values("prediction").annotate(count=Count("id")).order_by("prediction")
    total_entries = sum(row["count"] for row in distribution_rows) or 1
    distribution = [
        {
            "name": row["prediction"],
            "value": row["count"],
            "percentage": round((row["count"] / total_entries) * 100, 2),
        }
        for row in distribution_rows
    ]

    return {
        "entries": serialized_entries,
        "trend": trend,
        "distribution": distribution,
    }


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
            confidence = get_prediction_confidence(MODEL, transformed_text, prediction)

            create_prediction_record(
                user=request.user,
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


class SaveMoodEntryView(views.APIView):
    parser_classes = [JSONParser]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = SaveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        input_text = serializer.validated_data.get("text", "").strip()
        prediction = serializer.validated_data["prediction"].strip()
        confidence = serializer.validated_data.get("confidence", 0)
        entry_date = serializer.validated_data.get("date") or timezone.localdate()
        entry_source = serializer.validated_data.get("entry_source", PredictionRecord.ENTRY_SOURCE_MANUAL)
        cleaned_text = preprocess_text(input_text) if input_text else ""

        record = create_prediction_record(
            user=request.user,
            input_text=input_text,
            cleaned_text=cleaned_text,
            prediction=prediction,
            confidence=confidence,
            entry_date=entry_date,
            entry_source=entry_source,
        )

        return Response(MoodHistorySerializer(record).data, status=status.HTTP_201_CREATED)


class MoodHistoryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = PredictionRecord.objects.filter(user=request.user).order_by("-entry_date", "-created_at")
        return Response(build_mood_history_payload(queryset), status=status.HTTP_200_OK)
