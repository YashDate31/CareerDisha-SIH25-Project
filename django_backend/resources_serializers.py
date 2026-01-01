from rest_framework import serializers
from .models import Video, PDFResource, Article

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

class PDFResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = PDFResource
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = '__all__'