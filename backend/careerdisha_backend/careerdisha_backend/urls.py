"""
URL configuration for careerdisha_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.shortcuts import render
from django.views.generic import TemplateView
from django.views.static import serve
from django.http import Http404
import os

# Customize admin site
admin.site.site_header = settings.ADMIN_SITE_HEADER
admin.site.site_title = settings.ADMIN_SITE_TITLE
admin.site.index_title = settings.ADMIN_INDEX_TITLE

# React app view
class ReactAppView(TemplateView):
    template_name = 'index.html'

# Assets view
def serve_react_assets(request, path):
    """Serve React build assets"""
    assets_path = settings.BASE_DIR.parent.parent / 'build' / 'assets'
    try:
        return serve(request, path, document_root=assets_path)
    except Http404:
        raise Http404("Asset not found")

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API Authentication
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # API endpoints
    path('api/', include('resources.urls')),
    path('api/accounts/', include('accounts.urls')),
    
    # Serve React assets
    path('assets/<path:path>', serve_react_assets, name='react_assets'),
    
    # Serve React app
    path('', ReactAppView.as_view(), name='react_app'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)