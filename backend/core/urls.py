# social/urls.py
from django.urls import path
from django.http import JsonResponse

urlpatterns = [
    path('', lambda request: JsonResponse({"message": "core API placeholder"})),
]
