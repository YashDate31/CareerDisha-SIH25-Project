from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Video, PDFResource, Article, CareerQuiz, Scholarship, College
from .serializers import (
    VideoSerializer, PDFResourceSerializer, 
    ArticleSerializer, ArticleListSerializer,
    CareerQuizSerializer, CareerQuizListSerializer,
    ScholarshipSerializer, CollegeSerializer
)

# Video Views
class VideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Video.objects.filter(is_parent_content=False)
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset

class VideoDetailView(generics.RetrieveAPIView):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]

# PDF Resource Views
class PDFResourceListView(generics.ListAPIView):
    serializer_class = PDFResourceSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = PDFResource.objects.filter(is_parent_content=False)
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset

class PDFResourceDetailView(generics.RetrieveAPIView):
    queryset = PDFResource.objects.all()
    serializer_class = PDFResourceSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment download count when PDF is accessed
        instance.increment_download_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Article Views
class ArticleListView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Article.objects.filter(is_parent_content=False, is_published=True)
        category = self.request.query_params.get('category', None)
        featured = self.request.query_params.get('featured', None)
        
        if category:
            queryset = queryset.filter(category=category)
        if featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset

class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.filter(is_published=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count when article is accessed
        instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

# Parent Section Views
class ParentVideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Video.objects.filter(is_parent_content=True)
        category = self.request.query_params.get('category', None)
        
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class ParentArticleListView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Article.objects.filter(is_parent_content=True, is_published=True)
        category = self.request.query_params.get('category', None)
        
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class ParentPDFListView(generics.ListAPIView):
    serializer_class = PDFResourceSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return PDFResource.objects.filter(is_parent_content=True)

# Career Quiz Views
class CareerQuizListView(generics.ListAPIView):
    serializer_class = CareerQuizListSerializer
    permission_classes = [AllowAny]
    queryset = CareerQuiz.objects.filter(is_active=True)

class CareerQuizDetailView(generics.RetrieveAPIView):
    queryset = CareerQuiz.objects.filter(is_active=True)
    serializer_class = CareerQuizSerializer
    permission_classes = [AllowAny]

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def submit_quiz(request):
    """Submit quiz answers and get career recommendations"""
    try:
        quiz_id = request.data.get('quiz_id')
        answers = request.data.get('answers', [])  # List of answer IDs
        
        if not quiz_id or not answers:
            return Response(
                {'error': 'Quiz ID and answers are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get the quiz
        quiz = get_object_or_404(CareerQuiz, id=quiz_id, is_active=True)
        
        # Calculate career scores
        career_scores = {}
        
        from .models import QuizAnswer
        for answer_id in answers:
            try:
                answer = QuizAnswer.objects.get(id=answer_id, question__quiz=quiz)
                career_weights = answer.career_weight
                
                for career, weight in career_weights.items():
                    if career in career_scores:
                        career_scores[career] += weight
                    else:
                        career_scores[career] = weight
                        
            except QuizAnswer.DoesNotExist:
                continue
        
        # Sort careers by score and get top 5
        sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
        top_careers = sorted_careers[:5]
        
        # Career information mapping
        career_info = {
            'software_engineer': {
                'name': 'Software Engineer',
                'description': 'Design, develop, and maintain software applications and systems.',
                'avg_salary': '$85,000 - $150,000',
                'growth_outlook': 'Excellent (22% growth expected)',
                'required_skills': ['Programming', 'Problem-solving', 'Teamwork', 'Continuous learning'],
                'education': 'Bachelor\'s degree in Computer Science or related field'
            },
            'data_scientist': {
                'name': 'Data Scientist',
                'description': 'Analyze complex data to help organizations make informed decisions.',
                'avg_salary': '$95,000 - $165,000',
                'growth_outlook': 'Excellent (35% growth expected)',
                'required_skills': ['Statistics', 'Python/R', 'Machine Learning', 'Data Visualization'],
                'education': 'Master\'s degree in Data Science, Statistics, or related field'
            },
            'cybersecurity_specialist': {
                'name': 'Cybersecurity Specialist',
                'description': 'Protect organizations from cyber threats and security breaches.',
                'avg_salary': '$90,000 - $160,000',
                'growth_outlook': 'Excellent (33% growth expected)',
                'required_skills': ['Network Security', 'Risk Assessment', 'Ethical Hacking', 'Compliance'],
                'education': 'Bachelor\'s degree in Cybersecurity or Computer Science'
            },
            'web_developer': {
                'name': 'Web Developer',
                'description': 'Create and maintain websites and web applications.',
                'avg_salary': '$60,000 - $120,000',
                'growth_outlook': 'Very Good (13% growth expected)',
                'required_skills': ['HTML/CSS', 'JavaScript', 'Responsive Design', 'Version Control'],
                'education': 'Associate or Bachelor\'s degree in Web Development'
            },
            'doctor': {
                'name': 'Medical Doctor',
                'description': 'Diagnose, treat, and prevent illnesses and injuries.',
                'avg_salary': '$200,000 - $400,000',
                'growth_outlook': 'Good (4% growth expected)',
                'required_skills': ['Medical Knowledge', 'Empathy', 'Communication', 'Problem-solving'],
                'education': 'Medical degree (MD) plus residency training'
            },
            'nurse': {
                'name': 'Registered Nurse',
                'description': 'Provide patient care and support in healthcare settings.',
                'avg_salary': '$65,000 - $90,000',
                'growth_outlook': 'Excellent (7% growth expected)',
                'required_skills': ['Patient Care', 'Communication', 'Critical Thinking', 'Compassion'],
                'education': 'Associate or Bachelor\'s degree in Nursing'
            },
            'teacher': {
                'name': 'Teacher',
                'description': 'Educate and inspire students in various subjects and grade levels.',
                'avg_salary': '$45,000 - $75,000',
                'growth_outlook': 'Good (5% growth expected)',
                'required_skills': ['Subject Expertise', 'Communication', 'Patience', 'Creativity'],
                'education': 'Bachelor\'s degree in Education or subject area'
            },
            'business_analyst': {
                'name': 'Business Analyst',
                'description': 'Analyze business processes and recommend improvements.',
                'avg_salary': '$70,000 - $110,000',
                'growth_outlook': 'Good (14% growth expected)',
                'required_skills': ['Analytical Thinking', 'Communication', 'Process Mapping', 'Data Analysis'],
                'education': 'Bachelor\'s degree in Business or related field'
            },
            'graphic_designer': {
                'name': 'Graphic Designer',
                'description': 'Create visual concepts to communicate ideas and inspire audiences.',
                'avg_salary': '$40,000 - $70,000',
                'growth_outlook': 'Average (3% growth expected)',
                'required_skills': ['Creative Design', 'Adobe Creative Suite', 'Typography', 'Branding'],
                'education': 'Bachelor\'s degree in Graphic Design or related field'
            },
            'marketing_manager': {
                'name': 'Marketing Manager',
                'description': 'Develop and implement marketing strategies to promote products or services.',
                'avg_salary': '$75,000 - $130,000',
                'growth_outlook': 'Good (10% growth expected)',
                'required_skills': ['Strategic Planning', 'Digital Marketing', 'Analytics', 'Leadership'],
                'education': 'Bachelor\'s degree in Marketing or Business'
            }
        }
        
        # Prepare recommendations
        recommendations = []
        for career_key, score in top_careers:
            career_data = career_info.get(career_key, {
                'name': career_key.replace('_', ' ').title(),
                'description': 'A promising career option based on your interests and skills.',
                'avg_salary': 'Varies by location and experience',
                'growth_outlook': 'Positive outlook expected',
                'required_skills': ['Relevant technical skills', 'Communication', 'Problem-solving'],
                'education': 'Appropriate degree or certification required'
            })
            
            recommendations.append({
                'career': career_data['name'],
                'match_score': round((score / max(career_scores.values()) * 100), 1),
                'description': career_data['description'],
                'avg_salary': career_data['avg_salary'],
                'growth_outlook': career_data['growth_outlook'],
                'required_skills': career_data['required_skills'],
                'education': career_data['education']
            })
        
        return Response({
            'quiz_title': quiz.title,
            'total_questions': quiz.questions.count(),
            'answers_submitted': len(answers),
            'top_careers': recommendations,
            'message': f'Based on your responses, here are your top {len(recommendations)} career matches!'
        })
        
    except Exception as e:
        return Response(
            {'error': f'An error occurred: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# API endpoints for statistics and featured content
@api_view(['GET'])
@permission_classes([AllowAny])
def featured_content(request):
    """Get featured content from all categories"""
    featured_videos = Video.objects.filter(is_featured=True)[:3]
    featured_pdfs = PDFResource.objects.filter(is_featured=True)[:3]
    featured_articles = Article.objects.filter(is_featured=True, is_published=True)[:3]
    
    data = {
        'videos': VideoSerializer(featured_videos, many=True, context={'request': request}).data,
        'pdfs': PDFResourceSerializer(featured_pdfs, many=True, context={'request': request}).data,
        'articles': ArticleListSerializer(featured_articles, many=True, context={'request': request}).data,
    }
    
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def content_statistics(request):
    """Get content statistics for dashboard"""
    stats = {
        'total_videos': Video.objects.count(),
        'total_pdfs': PDFResource.objects.count(),
        'total_articles': Article.objects.filter(is_published=True).count(),
        'parent_videos': Video.objects.filter(is_parent_content=True).count(),
        'parent_articles': Article.objects.filter(is_parent_content=True, is_published=True).count(),
        'total_quizzes': CareerQuiz.objects.filter(is_active=True).count(),
    }
    
    return Response(stats)

@api_view(['GET'])
@permission_classes([AllowAny])
def search_content(request):
    """Search across all content types"""
    query = request.query_params.get('q', '')
    if not query:
        return Response({'error': 'Search query is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Search videos
    videos = Video.objects.filter(
        title__icontains=query
    ) | Video.objects.filter(
        description__icontains=query
    ) | Video.objects.filter(
        tags__icontains=query
    )
    
    # Search PDFs
    pdfs = PDFResource.objects.filter(
        title__icontains=query
    ) | PDFResource.objects.filter(
        description__icontains=query
    ) | PDFResource.objects.filter(
        tags__icontains=query
    )
    
    # Search articles
    articles = Article.objects.filter(
        is_published=True
    ).filter(
        title__icontains=query
    ) | Article.objects.filter(
        is_published=True
    ).filter(
        description__icontains=query
    ) | Article.objects.filter(
        is_published=True
    ).filter(
        content__icontains=query
    ) | Article.objects.filter(
        is_published=True
    ).filter(
        tags__icontains=query
    )
    
    data = {
        'videos': VideoSerializer(videos[:10], many=True, context={'request': request}).data,
        'pdfs': PDFResourceSerializer(pdfs[:10], many=True, context={'request': request}).data,
        'articles': ArticleListSerializer(articles[:10], many=True, context={'request': request}).data,
        'total_results': videos.count() + pdfs.count() + articles.count()
    }
    
    return Response(data)

# Scholarship Views
class ScholarshipListView(generics.ListAPIView):
    serializer_class = ScholarshipSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Scholarship.objects.filter(is_active=True)
        scholarship_type = self.request.query_params.get('type', None)
        education_level = self.request.query_params.get('education_level', None)
        field_of_study = self.request.query_params.get('field', None)
        
        if scholarship_type:
            queryset = queryset.filter(scholarship_type=scholarship_type)
        if education_level:
            queryset = queryset.filter(education_level=education_level)
        if field_of_study:
            queryset = queryset.filter(field_of_study__icontains=field_of_study)
            
        return queryset.order_by('application_deadline')

class ScholarshipDetailView(generics.RetrieveAPIView):
    queryset = Scholarship.objects.filter(is_active=True)
    serializer_class = ScholarshipSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        scholarship = self.get_object()
        # Increment application count when viewed
        scholarship.application_count += 1
        scholarship.save()
        return super().get(request, *args, **kwargs)

# College Views
class CollegeListView(generics.ListAPIView):
    serializer_class = CollegeSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = College.objects.all()
        college_type = self.request.query_params.get('type', None)
        ranking = self.request.query_params.get('ranking', None)
        location = self.request.query_params.get('location', None)
        featured = self.request.query_params.get('featured', None)
        
        if college_type:
            queryset = queryset.filter(college_type=college_type)
        if ranking:
            queryset = queryset.filter(ranking=ranking)
        if location:
            queryset = queryset.filter(location__icontains=location)
        if featured:
            queryset = queryset.filter(is_featured=True)
            
        return queryset.order_by('-view_count', 'name')

class CollegeDetailView(generics.RetrieveAPIView):
    queryset = College.objects.all()
    serializer_class = CollegeSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        college = self.get_object()
        # Increment view count when accessed
        college.view_count += 1
        college.save()
        return super().get(request, *args, **kwargs)