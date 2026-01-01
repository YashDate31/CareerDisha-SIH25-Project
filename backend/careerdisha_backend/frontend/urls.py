from django.urls import path
from . import views

urlpatterns = [
    # React app routes - catch all frontend routes
    path('', views.react_app, name='react_app'),
    path('login/', views.react_app, name='react_login'),
    path('home/', views.react_app, name='react_home'),
    path('resources/', views.react_app, name='react_resources'),
    path('colleges/', views.react_app, name='react_colleges'),
    path('scholarships/', views.react_app, name='react_scholarships'),
    path('chatbot/', views.react_app, name='react_chatbot'),
    path('career-quiz/', views.react_app, name='react_career_quiz'),
    path('profile/', views.react_app, name='react_profile'),
    path('parent-section/', views.react_app, name='react_parent_section'),
]