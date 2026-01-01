from rest_framework import serializers
from .models import Video, PDFResource, Article, CareerQuiz, QuizQuestion, QuizAnswer, Scholarship, College

class VideoSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    embed_url = serializers.SerializerMethodField()
    video_id = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'youtube_url', 'description', 'duration', 'views',
            'category', 'is_parent_content', 'is_featured', 'ai_generated_summary',
            'tags', 'uploaded_at', 'thumbnail_url', 'embed_url', 'video_id'
        ]
    
    def get_thumbnail_url(self, obj):
        return obj.get_thumbnail_url()
    
    def get_embed_url(self, obj):
        return obj.get_embed_url()
    
    def get_video_id(self, obj):
        return obj.get_video_id()

class PDFResourceSerializer(serializers.ModelSerializer):
    file_size_display = serializers.SerializerMethodField()
    download_url = serializers.SerializerMethodField()
    
    class Meta:
        model = PDFResource
        fields = [
            'id', 'title', 'file', 'description', 'pages', 'file_size',
            'category', 'is_parent_content', 'is_featured', 'download_count',
            'ai_generated_summary', 'tags', 'uploaded_at', 'file_size_display',
            'download_url'
        ]
    
    def get_file_size_display(self, obj):
        return obj.get_file_size_display()
    
    def get_download_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None

class ArticleSerializer(serializers.ModelSerializer):
    excerpt = serializers.SerializerMethodField()
    
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'content', 'read_time', 'author',
            'category', 'is_parent_content', 'is_featured', 'is_published',
            'view_count', 'ai_enhanced_content', 'tags', 'uploaded_at',
            'excerpt'
        ]
    
    def get_excerpt(self, obj):
        return obj.get_excerpt()

class ArticleListSerializer(ArticleSerializer):
    """Serializer for article list view (excludes full content)"""
    class Meta:
        model = Article
        fields = [
            'id', 'title', 'description', 'read_time', 'author',
            'category', 'is_parent_content', 'is_featured', 'is_published',
            'view_count', 'tags', 'uploaded_at', 'excerpt'
        ]

class QuizAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAnswer
        fields = ['id', 'answer_text', 'career_weight']

class QuizQuestionSerializer(serializers.ModelSerializer):
    answers = QuizAnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = QuizQuestion
        fields = ['id', 'question_text', 'question_type', 'order', 'answers']

class CareerQuizSerializer(serializers.ModelSerializer):
    questions = QuizQuestionSerializer(many=True, read_only=True)
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = CareerQuiz
        fields = ['id', 'title', 'description', 'is_active', 'created_at', 'questions', 'question_count']
    
    def get_question_count(self, obj):
        return obj.questions.count()

class CareerQuizListSerializer(CareerQuizSerializer):
    """Serializer for quiz list view (excludes questions)"""
    class Meta:
        model = CareerQuiz
        fields = ['id', 'title', 'description', 'is_active', 'created_at', 'question_count']

class ScholarshipSerializer(serializers.ModelSerializer):
    formatted_amount = serializers.SerializerMethodField()
    days_until_deadline = serializers.SerializerMethodField()
    is_deadline_approaching = serializers.SerializerMethodField()
    
    class Meta:
        model = Scholarship
        fields = [
            'id', 'title', 'description', 'amount', 'formatted_amount',
            'eligibility_criteria', 'application_deadline', 'scholarship_type',
            'education_level', 'field_of_study', 'provider_name', 'provider_website',
            'application_link', 'is_active', 'application_count', 'created_at',
            'days_until_deadline', 'is_deadline_approaching'
        ]
    
    def get_formatted_amount(self, obj):
        try:
            if obj.amount:
                amount = float(obj.amount) if isinstance(obj.amount, str) else obj.amount
                return f"₹{amount:,.2f}"
            return "Amount not specified"
        except (ValueError, TypeError):
            return "Amount not specified"
    
    def get_days_until_deadline(self, obj):
        from datetime import datetime
        if obj.application_deadline:
            today = datetime.now().date()
            delta = obj.application_deadline - today
            return delta.days if delta.days >= 0 else -1
        return None
    
    def get_is_deadline_approaching(self, obj):
        days_left = self.get_days_until_deadline(obj)
        return days_left is not None and 0 <= days_left <= 30

class CollegeSerializer(serializers.ModelSerializer):
    formatted_tuition_fees = serializers.SerializerMethodField()
    ranking_display = serializers.SerializerMethodField()
    
    class Meta:
        model = College
        fields = [
            'id', 'name', 'description', 'college_type', 'location', 'state',
            'country', 'established_year', 'ranking', 'ranking_display',
            'accreditation', 'total_students', 'tuition_fees', 'formatted_tuition_fees',
            'acceptance_rate', 'popular_programs', 'admission_requirements',
            'website', 'contact_email', 'contact_phone', 'campus_facilities',
            'is_featured', 'view_count', 'created_at'
        ]
    
    def get_formatted_tuition_fees(self, obj):
        try:
            if obj.tuition_fees:
                fees = float(obj.tuition_fees) if isinstance(obj.tuition_fees, str) else obj.tuition_fees
                return f"₹{fees:,.2f} per year"
            return "Fees not specified"
        except (ValueError, TypeError):
            return "Fees not specified"
    
    def get_ranking_display(self, obj):
        ranking_labels = {
            'top_10': 'Top 10',
            'top_50': 'Top 50', 
            'top_100': 'Top 100',
            'top_500': 'Top 500',
            'unranked': 'Unranked'
        }
        return ranking_labels.get(obj.ranking, obj.ranking)