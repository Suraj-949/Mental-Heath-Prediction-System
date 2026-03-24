from django.contrib.auth.models import User
from django.db import models


class PredictionRecord(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="prediction_records",
        null=True,
        blank=True,
    )
    input_text = models.TextField()
    cleaned_text = models.TextField()
    prediction = models.CharField(max_length=100)
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.prediction} ({self.confidence:.2f})"
