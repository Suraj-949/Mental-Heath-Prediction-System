from rest_framework import serializers


class PredictionInputSerializer(serializers.Serializer):
    text = serializers.CharField(required=True, allow_blank=False, trim_whitespace=True)
