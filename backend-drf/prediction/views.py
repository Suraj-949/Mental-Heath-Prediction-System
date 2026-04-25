import logging
import re
from collections import Counter, defaultdict
from datetime import timedelta
from pathlib import Path
from string import punctuation
from typing import Any


import joblib   # For loading ML model(.pkl) and vectorizer
from django.conf import settings
from django.utils import timezone


from rest_framework import permissions, status, views
from rest_framework.exceptions import ParseError
from rest_framework.parsers import JSONParser
from rest_framework.response import Response


from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS

from .models import PredictionRecord
from .serializers import MoodHistorySerializer, PredictionInputSerializer, SaveEntrySerializer

# Logger for debugging and error tracking
logger = logging.getLogger(__name__) 

# Paths to ML model and vectorizer files
MODEL_DIR = Path(settings.BASE_DIR) / "models"
MODEL_FILE = MODEL_DIR / "model.pkl"
VECTORIZER_FILE = MODEL_DIR / "vectorizer.pkl"

# Preprocessing helpers
PUNCTUATION_TABLE = str.maketrans("", "", punctuation)
STOP_WORDS = set(ENGLISH_STOP_WORDS)





# Try importing advanced stemmer, fallback if unavailable
try:
    from nltk.stem import PorterStemmer
except ImportError:
    PorterStemmer = None


# Utility function to load .pkl files using joblib
def load_joblib(path: Path) -> Any:
    with path.open("rb") as file:
        return joblib.load(file)


# Simple fallback stemmer if nltk is not installed
class SimpleStemmer:
    common_suffixes = ("ingly", "edly", "ing", "ed", "ly", "ness", "ment", "s")

    def stem(self, word: str) -> str:
        for suffix in self.common_suffixes:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                return word[: -len(suffix)]
        return word


# Choose best available stemmer
STEMMER = PorterStemmer() if PorterStemmer else SimpleStemmer()





# Global variables for model and vectorizer
MODEL = None
VECTORIZER = None
MODEL_LOAD_ERROR = None

MOOD_SCORE_MAP = {
    "Normal": 1,
    "Stress": 2,
    "Anxiety": 2,
    "Depression": 3,
    "Bipolar": 3,
    "Personality disorder": 4,
    "Suicidal": 4,
}






# Load model and vectorizer at server startup
try:
    MODEL = load_joblib(MODEL_FILE)
    VECTORIZER = load_joblib(VECTORIZER_FILE)
except Exception as exc:
    MODEL_LOAD_ERROR = str(exc)
    logger.exception("Failed to load ML artifacts from %s", MODEL_DIR)






# Function to preprocess input text before prediction
def preprocess_text(text: str) -> str:
    # Convert text to lowercase
    lowered_text = text.lower()

    # Remove punctuation
    without_punctuation = lowered_text.translate(PUNCTUATION_TABLE)

    # Normalize whitespace
    normalized_text = re.sub(r"\s+", " ", without_punctuation).strip()

    processed_tokens = []

    # Token processing loop
    for word in normalized_text.split():
        # Remove stopwords
        if word in STOP_WORDS:
            continue

        # Apply stemming
        stemmed_word = STEMMER.stem(word)

        if stemmed_word:
            processed_tokens.append(stemmed_word)

    # Return cleaned text
    return " ".join(processed_tokens)






def build_trend_data(entries):
    grouped_entries = defaultdict(list)

    for entry in entries:
        grouped_entries[entry.entry_date].append(entry)

    trend = []
    for entry_date in sorted(grouped_entries):
        daily_entries = grouped_entries[entry_date]
        average_confidence = sum(float(item.confidence or 0) for item in daily_entries) / len(daily_entries)
        average_mood_score = sum(MOOD_SCORE_MAP.get(item.prediction, 2) for item in daily_entries) / len(daily_entries)

        trend.append(
            {
                "date": entry_date.isoformat(),
                "mood_score": round(average_mood_score, 2),
                "average_confidence": round(average_confidence, 2),
            }
        )

    return trend







def build_distribution_data(entries):
    prediction_counts = Counter(entry.prediction for entry in entries)
    total_entries = sum(prediction_counts.values())

    if not total_entries:
        return []

    distribution = []
    for prediction, count in prediction_counts.most_common():
        distribution.append(
            {
                "name": prediction,
                "value": count,
                "percentage": round((count / total_entries) * 100, 1),
            }
        )
    return distribution








# API View for mental health prediction
class MentalHealthPredictView(views.APIView):
    parser_classes = [JSONParser]  # Accept JSON input only
    permission_classes = [permissions.IsAuthenticated]  # Require login

    def post(self, request, *args, **kwargs):

        # Check if model failed to load
        if MODEL_LOAD_ERROR:
            return Response(
                {"detail": "Model artifacts are unavailable.", "error": MODEL_LOAD_ERROR},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        try:
            # Ensure request body is JSON object
            if not isinstance(request.data, dict):
                return Response(
                    {"detail": "Invalid payload. Expected a JSON object."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Validate input using serializer
            serializer = PredictionInputSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            # Extract and clean input text
            input_text = serializer.validated_data["text"].strip()

            # Reject empty input
            if not input_text:
                return Response(
                    {"detail": "Text input cannot be empty."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Preprocess text
            cleaned_text = preprocess_text(input_text)

            # Reject if no meaningful content after cleaning
            if not cleaned_text:
                return Response(
                    {"detail": "Text input did not contain enough meaningful words after preprocessing."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Convert text into vector form (numerical features)
            transformed_text = VECTORIZER.transform([cleaned_text])

            # Make prediction using ML model
            prediction = str(MODEL.predict(transformed_text)[0])

            # Default confidence
            confidence = 0.0

            # If model supports probability, calculate confidence
            if hasattr(MODEL, "predict_proba"):
                probabilities = MODEL.predict_proba(transformed_text)[0]
                class_labels = list(MODEL.classes_)
                predicted_index = class_labels.index(prediction)
                confidence = float(probabilities[predicted_index])

            # Save prediction result to database
            PredictionRecord.objects.create(
                user=request.user if request.user.is_authenticated else None,
                input_text=input_text,
                cleaned_text=cleaned_text,
                prediction=prediction,
                confidence=confidence,
            )

            # Return response to frontend
            return Response(
                {
                    "prediction": prediction,
                    "confidence": round(confidence, 4),
                },
                status=status.HTTP_200_OK,
            )

        # Handle invalid JSON format
        except ParseError:
            return Response(
                {"detail": "Invalid JSON. Please send a valid JSON body."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Handle unexpected errors
        except Exception:
            logger.exception("Prediction failed")
            return Response(
                {"detail": "Internal server error during prediction."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )





class SaveMoodEntryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [JSONParser]

    def post(self, request, *args, **kwargs):
        serializer = SaveEntrySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data
        input_text = validated.get("text", "").strip()

        entry = PredictionRecord.objects.create(
            user=request.user,
            input_text=input_text,
            cleaned_text=preprocess_text(input_text) if input_text else "",
            prediction=validated["prediction"],
            confidence=validated.get("confidence", 0),
            entry_date=validated.get("date", timezone.localdate()),
            entry_source=validated.get("entry_source", PredictionRecord.ENTRY_SOURCE_MANUAL),
        )

        return Response(
            {
                "detail": "Mood entry saved successfully.",
                "entry": MoodHistorySerializer(entry).data,
            },
            status=status.HTTP_201_CREATED,
        )







class MoodHistoryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        entries = list(
            PredictionRecord.objects.filter(user=request.user).order_by("-created_at", "-id")
        )

        return Response(
            {
                "entries": MoodHistorySerializer(entries, many=True).data,
                "trend": build_trend_data(entries),
                "distribution": build_distribution_data(entries),
            },
            status=status.HTTP_200_OK,
        )







