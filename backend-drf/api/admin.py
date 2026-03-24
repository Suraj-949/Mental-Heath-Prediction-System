from django.contrib import admin

from .models import PredictionRecord


@admin.register(PredictionRecord)
class PredictionRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "prediction", "confidence", "created_at")
    list_filter = ("prediction", "created_at")
    search_fields = ("input_text", "prediction", "user__username")
    readonly_fields = ("created_at",)
