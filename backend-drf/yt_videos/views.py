import logging

from urllib.error import URLError
from urllib.parse import urlencode
from urllib.request import urlopen

from django.conf import settings

from rest_framework import views, permissions, status
from rest_framework.response import Response



logger = logging.getLogger(__name__)


VIDEO_SEARCH_MAP = {
    "Normal": "positive mental health habits mindfulness self care",
    "Stress": "stress relief breathing exercises guided relaxation",
    "Anxiety": "anxiety relief breathing grounding meditation",
    "Depression": "depression support self care gentle motivation",  
    "Bipolar": "emotional regulation coping skills mental wellness",
    "Personality disorder": "emotional regulation therapy skills mindfulness",
    "Suicidal": "mental health crisis support grounding calming techniques",
}


def build_youtube_videos(items):
    videos = []
    for item in items:
        video_id = item.get("id", {}).get("videoId")
        snippet = item.get("snippet", {})
        if not video_id:
            continue

        videos.append(
            {
                "videoId": video_id,
                "title": snippet.get("title", "YouTube video"),
                "channel": snippet.get("channelTitle", "YouTube"),
                "watchUrl": f"https://www.youtube.com/watch?v={video_id}",
                "embedUrl": f"https://www.youtube.com/embed/{video_id}",
            }
        )

    return videos




def fetch_youtube_recommendations(mood: str, limit: int):
    api_key = settings.YOUTUBE_API_KEY.strip()
    if not api_key:
        return []

    query = VIDEO_SEARCH_MAP.get(mood, VIDEO_SEARCH_MAP["Normal"])
    query_params = urlencode(
        {
            "part": "snippet",
            "type": "video",
            "videoEmbeddable": "true",
            "safeSearch": "strict",
            "maxResults": limit,
            "order": "relevance",
            "q": query,
            "key": api_key,
        }
    )
    request_url = f"https://www.googleapis.com/youtube/v3/search?{query_params}"

    try:
        with urlopen(request_url, timeout=10) as response:
            payload = response.read().decode("utf-8")
        
        import json
        data = json.loads(payload)
        return build_youtube_videos(data.get("items", []))
    except (URLError, TimeoutError, ValueError):
        logger.exception("Failed to fetch YouTube recommendations for mood '%s'", mood)
        return []



class MoodVideoRecommendationView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        mood = (request.query_params.get("mood") or "Normal").strip() or "Normal"
        try:
            limit = int(request.query_params.get("limit", 5))
        except (TypeError, ValueError):
            limit = 5

        limit = max(1, min(limit, 10))
        videos = fetch_youtube_recommendations(mood, limit)

        return Response(
            {
                "mood": mood,
                "videos": videos,
            },
            status=status.HTTP_200_OK,
        )
