from django.urls import path
from . import views

urlpatterns = [
    # Regular resources
    path('videos/', views.VideoListView.as_view(), name='video-list'),
    path('videos/<int:pk>/', views.VideoDetailView.as_view(), name='video-detail'),
    
    path('pdfs/', views.PDFResourceListView.as_view(), name='pdf-list'),
    path('pdfs/<int:pk>/', views.PDFResourceDetailView.as_view(), name='pdf-detail'),
    
    path('articles/', views.ArticleListView.as_view(), name='article-list'),
    path('articles/<int:pk>/', views.ArticleDetailView.as_view(), name='article-detail'),
    
    # Parent section resources
    path('parent-videos/', views.ParentVideoListView.as_view(), name='parent-video-list'),
    path('parent-articles/', views.ParentArticleListView.as_view(), name='parent-article-list'),
    path('parent-pdfs/', views.ParentPDFListView.as_view(), name='parent-pdf-list'),
    
    # Career quizzes
    path('quizzes/', views.CareerQuizListView.as_view(), name='quiz-list'),
    path('quizzes/<int:pk>/', views.CareerQuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/submit/', views.submit_quiz, name='quiz-submit'),
    
    # Scholarships
    path('scholarships/', views.ScholarshipListView.as_view(), name='scholarship-list'),
    path('scholarships/<int:pk>/', views.ScholarshipDetailView.as_view(), name='scholarship-detail'),
    
    # Colleges
    path('colleges/', views.CollegeListView.as_view(), name='college-list'),
    path('colleges/<int:pk>/', views.CollegeDetailView.as_view(), name='college-detail'),
    
    # Utility endpoints
    path('featured/', views.featured_content, name='featured-content'),
    path('statistics/', views.content_statistics, name='content-statistics'),
    path('search/', views.search_content, name='search-content'),
]