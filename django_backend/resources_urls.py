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
]