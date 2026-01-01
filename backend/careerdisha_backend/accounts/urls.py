from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/update/', views.update_profile, name='update-profile'),
    path('bookmark/', views.bookmark_content, name='bookmark-content'),
    path('bookmarks/', views.get_bookmarks, name='get-bookmarks'),
    path('quiz-result/', views.save_quiz_result, name='save-quiz-result'),
]