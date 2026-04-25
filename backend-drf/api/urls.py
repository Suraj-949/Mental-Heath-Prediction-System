from accounts import views as UserViews
from yt_videos import views as YTViews
from prediction import views as PredViews
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
    path('profile/', UserViews.UserProfileView.as_view(), name='user_profile'),

    path('predict/', PredViews.MentalHealthPredictView.as_view(), name="mental_health_predict"),
    path('save-entry/', PredViews.SaveMoodEntryView.as_view(), name='save_mood_entry'),
    path('mood-history/', PredViews.MoodHistoryView.as_view(), name='mood_history'),
    path('video-recommendation/', YTViews.MoodVideoRecommendationView.as_view(), name='mood_video_recommendation'),
]
