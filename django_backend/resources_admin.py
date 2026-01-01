from django.contrib import admin
from .models import Video, PDFResource, Article

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'duration', 'is_parent_content', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'uploaded_at']
    search_fields = ['title', 'description']
    ordering = ['-uploaded_at']

@admin.register(PDFResource)
class PDFResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'pages', 'is_parent_content', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'uploaded_at']
    search_fields = ['title', 'description']
    ordering = ['-uploaded_at']

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'read_time', 'is_parent_content', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'uploaded_at', 'author']
    search_fields = ['title', 'description', 'content']
    ordering = ['-uploaded_at']