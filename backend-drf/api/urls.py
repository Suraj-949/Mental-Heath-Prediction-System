from accounts import views as UserViews
from django.urls import path

urlpatterns = [
    path('register/', UserViews.RegisterView.as_view(), name='registerView'),
]