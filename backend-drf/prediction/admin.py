from django.contrib import admin

from .models import PredictionRecord


@admin.register(PredictionRecord)
class PredictionRecordAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "prediction", "confidence", "entry_source", "entry_date", "created_at")
    list_filter = ("prediction", "entry_source", "entry_date", "created_at")
    search_fields = ("input_text", "prediction", "user__username")
    readonly_fields = ("created_at",)
