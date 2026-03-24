from accounts import views as UserViews
from . import views
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', UserViews.RegisterView.as_view(), name='registerView'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('protected-view/', UserViews.ProtectedView.as_view(), name='protectedView'),

    path('predict/', views.MentalHealthPredictView.as_view(), name="mental_health_predict")
]