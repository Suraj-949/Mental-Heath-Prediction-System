from rest_framework import serializers

from .models import PredictionRecord


class PredictionInputSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True)


class SaveEntrySerializer(serializers.Serializer):
    text = serializers.CharField(required=False, allow_blank=True, trim_whitespace=True, default="")
    prediction = serializers.CharField(required=True, allow_blank=False, max_length=100)
    confidence = serializers.FloatField(required=False, min_value=0, max_value=1, default=0)
    date = serializers.DateField(required=False)
    entry_source = serializers.ChoiceField(
        choices=PredictionRecord.ENTRY_SOURCE_CHOICES,
        required=False,
        default=PredictionRecord.ENTRY_SOURCE_MANUAL,
    )


class MoodHistorySerializer(serializers.ModelSerializer):
    date = serializers.DateField(source="entry_date")
    text = serializers.CharField(source="input_text")

    class Meta:
        model = PredictionRecord
        fields = (
            "id",
            "text",
            "prediction",
            "confidence",
            "date",
            "entry_source",
            "created_at",
        )
