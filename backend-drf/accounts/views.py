from django.shortcuts import render
from .serializers import UserSerializer
from rest_framework import generics, permissions
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):

    # In a CreateAPIView, queryset = User.objects.all() mainly provides model context to DRF, tell Django REST Framework that the model associated with this view is User.
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]