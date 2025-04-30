
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # API endpoints for your apps
    path('api/accounts/', include('accounts.urls')),
    path('api/books/', include('books.urls')),
    path('api/social/', include('social.urls')),
    path('api/core/', include('core.urls')),
]
