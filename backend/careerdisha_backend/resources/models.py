import re
import google.generativeai as genai
from django.db import models
from django.core.validators import URLValidator
from django.conf import settings
from django.utils.html import strip_tags

# Configure Google AI
if settings.GOOGLE_API_KEY:
    genai.configure(api_key=settings.GOOGLE_API_KEY)

class Video(models.Model):
    CATEGORY_CHOICES = [
        ('engineering', 'Engineering'),
        ('medical', 'Medical'),
        ('business', 'Business'),
        ('arts', 'Arts & Humanities'),
        ('science', 'Science'),
        ('technology', 'Technology'),
        ('parenting', 'Parenting'),
        ('career_guidance', 'Career Guidance'),
        ('education', 'Education'),
        ('general', 'General'),
    ]
    
    title = models.CharField(max_length=200)
    youtube_url = models.URLField(validators=[URLValidator()])
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=20, blank=True)
    views = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    is_parent_content = models.BooleanField(default=False, help_text="Check if this content is for parents")
    is_featured = models.BooleanField(default=False)
    ai_generated_summary = models.TextField(blank=True, help_text="AI-generated content summary")
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        super().clean()
        # Extract video ID and validate YouTube URL
        if self.youtube_url:
            self.youtube_url = self._normalize_youtube_url(self.youtube_url)
    
    def _normalize_youtube_url(self, url):
        """Convert various YouTube URL formats to standard watch format"""
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
            r'youtube\.com\/v\/([^&\n?#]+)',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                video_id = match.group(1)
                return f'https://www.youtube.com/watch?v={video_id}'
        return url
    
    def get_video_id(self):
        """Extract YouTube video ID from URL"""
        match = re.search(r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)', self.youtube_url)
        return match.group(1) if match else None
    
    def get_thumbnail_url(self):
        """Get YouTube thumbnail URL"""
        video_id = self.get_video_id()
        if video_id:
            return f'https://img.youtube.com/vi/{video_id}/maxresdefault.jpg'
        return None
    
    def get_embed_url(self):
        """Get YouTube embed URL"""
        video_id = self.get_video_id()
        if video_id:
            return f'https://www.youtube.com/embed/{video_id}'
        return None
    
    def generate_ai_summary(self):
        """Generate AI summary using Google Generative AI"""
        if not settings.GOOGLE_API_KEY:
            return "AI summary not available - API key not configured"
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""
            Create a brief, engaging summary for this career guidance video:
            Title: {self.title}
            Description: {self.description}
            Category: {self.get_category_display()}
            
            The summary should be 2-3 sentences, highlighting key career insights and benefits for students.
            """
            
            response = model.generate_content(prompt)
            return response.text if response.text else "Unable to generate summary at this time"
        except Exception as e:
            return f"Summary generation failed: {str(e)}"
    
    def save(self, *args, **kwargs):
        # Auto-generate AI summary if not provided
        if not self.ai_generated_summary and self.description:
            self.ai_generated_summary = self.generate_ai_summary()
        
        # Auto-extract duration from title if not provided
        if not self.duration:
            duration_match = re.search(r'(\d+)\s*(?:min|minute)', self.title, re.IGNORECASE)
            if duration_match:
                self.duration = f"{duration_match.group(1)} min"
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = "Video Resource"
        verbose_name_plural = "Video Resources"

class PDFResource(models.Model):
    CATEGORY_CHOICES = [
        ('career_guides', 'Career Guides'),
        ('academic_planning', 'Academic Planning'),
        ('skill_development', 'Skill Development'),
        ('interview_prep', 'Interview Preparation'),
        ('college_admission', 'College Admission'),
        ('parenting_guides', 'Parenting Guides'),
        ('industry_reports', 'Industry Reports'),
        ('general', 'General'),
    ]
    
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='pdfs/', help_text="Upload PDF file (Max 10MB)")
    description = models.TextField(blank=True)
    pages = models.CharField(max_length=20, blank=True)
    file_size = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    is_parent_content = models.BooleanField(default=False, help_text="Check if this content is for parents")
    is_featured = models.BooleanField(default=False)
    download_count = models.PositiveIntegerField(default=0)
    ai_generated_summary = models.TextField(blank=True, help_text="AI-generated content summary")
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def get_file_size_display(self):
        """Convert file size to human readable format"""
        if self.file:
            size = self.file.size
            if size < 1024:
                return f"{size} B"
            elif size < 1024 * 1024:
                return f"{size / 1024:.1f} KB"
            else:
                return f"{size / (1024 * 1024):.1f} MB"
        return "Unknown"
    
    def increment_download_count(self):
        """Increment download counter"""
        self.download_count += 1
        self.save(update_fields=['download_count'])
    
    def generate_ai_summary(self):
        """Generate AI summary using Google Generative AI"""
        if not settings.GOOGLE_API_KEY:
            return "AI summary not available - API key not configured"
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""
            Create a brief, engaging summary for this career guidance PDF resource:
            Title: {self.title}
            Description: {self.description}
            Category: {self.get_category_display()}
            
            The summary should be 2-3 sentences, highlighting key career insights and practical value for students or parents.
            """
            
            response = model.generate_content(prompt)
            return response.text if response.text else "Unable to generate summary at this time"
        except Exception as e:
            return f"Summary generation failed: {str(e)}"
    
    def save(self, *args, **kwargs):
        # Auto-generate file size if not provided
        if self.file and not self.file_size:
            self.file_size = self.get_file_size_display()
        
        # Auto-generate AI summary if not provided
        if not self.ai_generated_summary and self.description:
            self.ai_generated_summary = self.generate_ai_summary()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = "PDF Resource"
        verbose_name_plural = "PDF Resources"

class Article(models.Model):
    CATEGORY_CHOICES = [
        ('career_trends', 'Career Trends'),
        ('job_market', 'Job Market Analysis'),
        ('skill_development', 'Skill Development'),
        ('industry_insights', 'Industry Insights'),
        ('education_guidance', 'Education Guidance'),
        ('parenting_tips', 'Parenting Tips'),
        ('interview_tips', 'Interview Tips'),
        ('personal_development', 'Personal Development'),
        ('general', 'General'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(help_text="Brief description or excerpt")
    content = models.TextField(help_text="Full article content")
    read_time = models.CharField(max_length=20, blank=True)
    author = models.CharField(max_length=100, blank=True, default="CareerDisha Team")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    is_parent_content = models.BooleanField(default=False, help_text="Check if this content is for parents")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    view_count = models.PositiveIntegerField(default=0)
    ai_enhanced_content = models.TextField(blank=True, help_text="AI-enhanced version of content")
    tags = models.CharField(max_length=500, blank=True, help_text="Comma-separated tags")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def calculate_read_time(self):
        """Calculate estimated reading time based on word count"""
        word_count = len(strip_tags(self.content).split())
        # Average reading speed: 200 words per minute
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"
    
    def increment_view_count(self):
        """Increment view counter"""
        self.view_count += 1
        self.save(update_fields=['view_count'])
    
    def get_excerpt(self, word_limit=50):
        """Get excerpt from content"""
        words = strip_tags(self.content).split()
        if len(words) <= word_limit:
            return ' '.join(words)
        return ' '.join(words[:word_limit]) + '...'
    
    def enhance_content_with_ai(self):
        """Enhance content using Google Generative AI"""
        if not settings.GOOGLE_API_KEY:
            return "AI enhancement not available - API key not configured"
        
        try:
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""
            Enhance this career guidance article to make it more engaging and informative for students and parents:
            
            Title: {self.title}
            Current Content: {self.content[:1000]}...
            Category: {self.get_category_display()}
            
            Please:
            1. Add relevant career insights and practical tips
            2. Include current industry trends if applicable
            3. Make the language engaging but professional
            4. Keep the enhanced version under 800 words
            5. Structure with clear headings and bullet points where appropriate
            """
            
            response = model.generate_content(prompt)
            return response.text if response.text else "Unable to enhance content at this time"
        except Exception as e:
            return f"Content enhancement failed: {str(e)}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate read time if not provided
        if not self.read_time:
            self.read_time = self.calculate_read_time()
        
        # Auto-generate enhanced content if not provided and content is substantial
        if not self.ai_enhanced_content and len(self.content) > 200:
            self.ai_enhanced_content = self.enhance_content_with_ai()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']
        verbose_name = "Article"
        verbose_name_plural = "Articles"

class CareerQuiz(models.Model):
    """Model for career assessment quizzes"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class QuizQuestion(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('rating_scale', 'Rating Scale'),
        ('yes_no', 'Yes/No'),
    ]
    
    quiz = models.ForeignKey(CareerQuiz, on_delete=models.CASCADE, related_name='questions')
    question_text = models.TextField()
    question_type = models.CharField(max_length=20, choices=QUESTION_TYPES, default='multiple_choice')
    order = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return f"{self.quiz.title} - Question {self.order}"

class QuizAnswer(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=200)
    career_weight = models.JSONField(default=dict, help_text="Career field weights as JSON")
    
    def __str__(self):
        return f"{self.question} - {self.answer_text}"

class Scholarship(models.Model):
    ELIGIBILITY_CHOICES = [
        ('undergraduate', 'Undergraduate'),
        ('graduate', 'Graduate'),
        ('postgraduate', 'Postgraduate'),
        ('diploma', 'Diploma'),
        ('all_levels', 'All Levels'),
    ]
    
    SCHOLARSHIP_TYPE_CHOICES = [
        ('merit', 'Merit-based'),
        ('need', 'Need-based'),
        ('sports', 'Sports'),
        ('minority', 'Minority'),
        ('subject_specific', 'Subject-specific'),
        ('government', 'Government'),
        ('private', 'Private'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    amount = models.CharField(max_length=100, help_text="e.g., '$5,000', 'Full tuition', '₹1,00,000'")
    eligibility_criteria = models.TextField()
    application_deadline = models.DateField()
    scholarship_type = models.CharField(max_length=50, choices=SCHOLARSHIP_TYPE_CHOICES, default='merit')
    education_level = models.CharField(max_length=50, choices=ELIGIBILITY_CHOICES, default='undergraduate')
    field_of_study = models.CharField(max_length=200, blank=True)
    provider_name = models.CharField(max_length=200)
    provider_website = models.URLField(blank=True)
    application_link = models.URLField()
    is_active = models.BooleanField(default=True)
    application_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def increment_application_count(self):
        self.application_count += 1
        self.save(update_fields=['application_count'])

class College(models.Model):
    COLLEGE_TYPE_CHOICES = [
        ('public', 'Public University'),
        ('private', 'Private University'),
        ('community', 'Community College'),
        ('technical', 'Technical Institute'),
        ('art', 'Art School'),
        ('medical', 'Medical College'),
        ('engineering', 'Engineering College'),
        ('business', 'Business School'),
    ]
    
    RANKING_CHOICES = [
        ('tier1', 'Tier 1 (Top 50)'),
        ('tier2', 'Tier 2 (51-150)'),
        ('tier3', 'Tier 3 (151-300)'),
        ('tier4', 'Tier 4 (300+)'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    college_type = models.CharField(max_length=50, choices=COLLEGE_TYPE_CHOICES, default='public')
    location = models.CharField(max_length=200)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    website = models.URLField()
    established_year = models.IntegerField()
    ranking = models.CharField(max_length=50, choices=RANKING_CHOICES, blank=True)
    accreditation = models.CharField(max_length=200, blank=True)
    total_students = models.IntegerField(blank=True, null=True)
    acceptance_rate = models.CharField(max_length=50, blank=True, help_text="e.g., '15%', '85%'")
    tuition_fees = models.CharField(max_length=100, blank=True, help_text="Annual tuition fees")
    popular_programs = models.TextField(help_text="Comma-separated list of popular programs")
    admission_requirements = models.TextField(blank=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    campus_facilities = models.TextField(blank=True, help_text="Library, Labs, Sports, etc.")
    is_featured = models.BooleanField(default=False)
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-view_count', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.location}"
    
    def increment_view_count(self):
        self.view_count += 1
        self.save(update_fields=['view_count'])