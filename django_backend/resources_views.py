from rest_framework import generics
from rest_framework.permissions import AllowAny
from .models import Video, PDFResource, Article
from .serializers import VideoSerializer, PDFResourceSerializer, ArticleSerializer

class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Video.objects.filter(is_parent_content=False)

class VideoDetailView(generics.RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]

class PDFResourceListView(generics.ListAPIView):
    serializer_class = PDFResourceSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return PDFResource.objects.filter(is_parent_content=False)

class PDFResourceDetailView(generics.RetrieveAPIView):
    queryset = PDFResource.objects.all()
    serializer_class = PDFResourceSerializer
    permission_classes = [AllowAny]

class ArticleListView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Article.objects.filter(is_parent_content=False)

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]

# Parent section views
class ParentVideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Video.objects.filter(is_parent_content=True)

class ParentArticleListView(generics.ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Article.objects.filter(is_parent_content=True)