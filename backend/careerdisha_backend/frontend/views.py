from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
import os

def react_app(request):
    """
    Serve the React application for all frontend routes
    """
    try:
        with open(os.path.join(settings.BASE_DIR, 'static', 'index.html'), 'r', encoding='utf-8') as f:
            response = HttpResponse(f.read(), content_type='text/html')
            # Add cache-busting headers
            response['Cache-Control'] = 'no-cache, no-store, must-revalidate'
            response['Pragma'] = 'no-cache'
            response['Expires'] = '0'
            return response
    except FileNotFoundError:
        return HttpResponse(
            '<h1>Frontend not found</h1><p>Please run <code>npm run build</code> first.</p>', 
            content_type='text/html'
        )