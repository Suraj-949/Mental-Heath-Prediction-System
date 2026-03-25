from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class PredictionRecord(models.Model):
    ENTRY_SOURCE_PREDICTION = "prediction"
    ENTRY_SOURCE_CHECKIN = "checkin"
    ENTRY_SOURCE_MANUAL = "manual"

    ENTRY_SOURCE_CHOICES = [
        (ENTRY_SOURCE_PREDICTION, "Prediction"),
        (ENTRY_SOURCE_CHECKIN, "Daily check-in"),
        (ENTRY_SOURCE_MANUAL, "Manual entry"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="prediction_records",
        null=True,
        blank=True,
    )
    input_text = models.TextField(blank=True, default="")
    cleaned_text = models.TextField(blank=True, default="")
    prediction = models.CharField(max_length=100)
    confidence = models.FloatField(default=0)
    entry_date = models.DateField(default=timezone.localdate, db_index=True)
    entry_source = models.CharField(
        max_length=20,
        choices=ENTRY_SOURCE_CHOICES,
        default=ENTRY_SOURCE_PREDICTION,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.prediction} on {self.entry_date}"
