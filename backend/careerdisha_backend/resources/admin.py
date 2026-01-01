from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from .models import Video, PDFResource, Article, CareerQuiz, QuizQuestion, QuizAnswer, Scholarship, College

@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'duration', 'is_parent_content', 'is_featured', 'thumbnail_preview', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'is_featured', 'uploaded_at']
    search_fields = ['title', 'description', 'tags']
    ordering = ['-uploaded_at']
    readonly_fields = ['ai_generated_summary', 'get_video_id', 'get_thumbnail_url', 'get_embed_url']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'youtube_url', 'description', 'duration')
        }),
        ('Categorization', {
            'fields': ('category', 'is_parent_content', 'is_featured', 'tags')
        }),
        ('AI Generated Content', {
            'fields': ('ai_generated_summary',),
            'classes': ('collapse',)
        }),
        ('YouTube Details', {
            'fields': ('get_video_id', 'get_thumbnail_url', 'get_embed_url'),
            'classes': ('collapse',)
        }),
    )
    
    def thumbnail_preview(self, obj):
        if obj.get_thumbnail_url():
            return format_html(
                '<img src="{}" width="60" height="40" style="border-radius: 4px;" />',
                obj.get_thumbnail_url()
            )
        return "No thumbnail"
    thumbnail_preview.short_description = "Thumbnail"
    
    actions = ['generate_ai_summaries', 'mark_as_featured', 'mark_as_parent_content', 'delete_selected_videos']
    
    def generate_ai_summaries(self, request, queryset):
        count = 0
        for video in queryset:
            if not video.ai_generated_summary:
                video.ai_generated_summary = video.generate_ai_summary()
                video.save()
                count += 1
        self.message_user(request, f"Generated AI summaries for {count} videos.")
    generate_ai_summaries.short_description = "Generate AI summaries for selected videos"
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} videos marked as featured.")
    mark_as_featured.short_description = "Mark selected videos as featured"
    
    def mark_as_parent_content(self, request, queryset):
        updated = queryset.update(is_parent_content=True)
        self.message_user(request, f"{updated} videos marked as parent content.")
    mark_as_parent_content.short_description = "Mark selected videos as parent content"
    
    def delete_selected_videos(self, request, queryset):
        count = queryset.count()
        queryset.delete()
        self.message_user(request, f"Successfully deleted {count} videos.", level='success')
    delete_selected_videos.short_description = "🗑️ Delete selected videos"

@admin.register(PDFResource)
class PDFResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'file_size', 'download_count', 'is_parent_content', 'is_featured', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'is_featured', 'uploaded_at']
    search_fields = ['title', 'description', 'tags']
    ordering = ['-uploaded_at']
    readonly_fields = ['file_size', 'download_count', 'ai_generated_summary']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'file', 'description', 'pages')
        }),
        ('Categorization', {
            'fields': ('category', 'is_parent_content', 'is_featured', 'tags')
        }),
        ('Statistics', {
            'fields': ('file_size', 'download_count'),
            'classes': ('collapse',)
        }),
        ('AI Generated Content', {
            'fields': ('ai_generated_summary',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['generate_ai_summaries', 'mark_as_featured', 'reset_download_counts', 'delete_selected_pdfs']
    
    def generate_ai_summaries(self, request, queryset):
        count = 0
        for pdf in queryset:
            if not pdf.ai_generated_summary:
                pdf.ai_generated_summary = pdf.generate_ai_summary()
                pdf.save()
                count += 1
        self.message_user(request, f"Generated AI summaries for {count} PDFs.")
    generate_ai_summaries.short_description = "Generate AI summaries for selected PDFs"
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} PDFs marked as featured.")
    mark_as_featured.short_description = "Mark selected PDFs as featured"
    
    def reset_download_counts(self, request, queryset):
        updated = queryset.update(download_count=0)
        self.message_user(request, f"Reset download counts for {updated} PDFs.")
    reset_download_counts.short_description = "Reset download counts for selected PDFs"
    
    def delete_selected_pdfs(self, request, queryset):
        count = queryset.count()
        # Delete associated files
        for pdf in queryset:
            if pdf.file:
                try:
                    pdf.file.delete()
                except:
                    pass
        queryset.delete()
        self.message_user(request, f"Successfully deleted {count} PDFs and their files.", level='success')
    delete_selected_pdfs.short_description = "🗑️ Delete selected PDFs"

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'read_time', 'view_count', 'is_published', 'is_parent_content', 'is_featured', 'uploaded_at']
    list_filter = ['category', 'is_parent_content', 'is_featured', 'is_published', 'author', 'uploaded_at']
    search_fields = ['title', 'description', 'content', 'tags', 'author']
    ordering = ['-uploaded_at']
    readonly_fields = ['read_time', 'view_count', 'ai_enhanced_content']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'author', 'description')
        }),
        ('Content', {
            'fields': ('content',)
        }),
        ('Categorization', {
            'fields': ('category', 'is_parent_content', 'is_featured', 'is_published', 'tags')
        }),
        ('Statistics', {
            'fields': ('read_time', 'view_count'),
            'classes': ('collapse',)
        }),
        ('AI Enhanced Content', {
            'fields': ('ai_enhanced_content',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['enhance_with_ai', 'mark_as_featured', 'publish_articles', 'unpublish_articles']
    
    def enhance_with_ai(self, request, queryset):
        count = 0
        for article in queryset:
            if not article.ai_enhanced_content:
                article.ai_enhanced_content = article.enhance_content_with_ai()
                article.save()
                count += 1
        self.message_user(request, f"Enhanced {count} articles with AI.")
    enhance_with_ai.short_description = "Enhance selected articles with AI"
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"{updated} articles marked as featured.")
    mark_as_featured.short_description = "Mark selected articles as featured"
    
    def publish_articles(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} articles published.")
    publish_articles.short_description = "Publish selected articles"
    
    def unpublish_articles(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} articles unpublished.")
    unpublish_articles.short_description = "Unpublish selected articles"

class QuizAnswerInline(admin.TabularInline):
    model = QuizAnswer
    extra = 4
    fields = ['answer_text', 'career_weight']

class QuizQuestionInline(admin.TabularInline):
    model = QuizQuestion
    extra = 1
    fields = ['question_text', 'question_type', 'order']
    ordering = ['order']

@admin.register(CareerQuiz)
class CareerQuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'question_count', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['title', 'description']
    inlines = [QuizQuestionInline]
    
    def question_count(self, obj):
        return obj.questions.count()
    question_count.short_description = "Questions"

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['quiz', 'question_text_short', 'question_type', 'order', 'answer_count']
    list_filter = ['quiz', 'question_type']
    search_fields = ['question_text']
    inlines = [QuizAnswerInline]
    ordering = ['quiz', 'order']
    
    def question_text_short(self, obj):
        return obj.question_text[:50] + "..." if len(obj.question_text) > 50 else obj.question_text
    question_text_short.short_description = "Question"
    
    def answer_count(self, obj):
        return obj.answers.count()
    answer_count.short_description = "Answers"

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'scholarship_type', 'education_level', 'application_deadline', 'provider_name', 'application_count', 'is_active']
    list_filter = ['scholarship_type', 'education_level', 'is_active', 'application_deadline']
    search_fields = ['title', 'provider_name', 'field_of_study', 'description']
    ordering = ['-application_deadline']
    date_hierarchy = 'application_deadline'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'amount')
        }),
        ('Eligibility & Type', {
            'fields': ('scholarship_type', 'education_level', 'field_of_study', 'eligibility_criteria')
        }),
        ('Provider Information', {
            'fields': ('provider_name', 'provider_website', 'application_link')
        }),
        ('Timeline & Status', {
            'fields': ('application_deadline', 'is_active', 'application_count')
        }),
    )
    
    readonly_fields = ['application_count']
    
    actions = ['mark_as_active', 'mark_as_inactive']
    
    def mark_as_active(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"Marked {updated} scholarships as active.")
    mark_as_active.short_description = "Mark selected scholarships as active"
    
    def mark_as_inactive(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"Marked {updated} scholarships as inactive.")
    mark_as_inactive.short_description = "Mark selected scholarships as inactive"

@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'college_type', 'ranking', 'established_year', 'view_count', 'is_featured']
    list_filter = ['college_type', 'ranking', 'country', 'is_featured', 'established_year']
    search_fields = ['name', 'location', 'state', 'popular_programs']
    ordering = ['-view_count', 'name']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'college_type')
        }),
        ('Location', {
            'fields': ('location', 'state', 'country')
        }),
        ('Academic Information', {
            'fields': ('established_year', 'ranking', 'accreditation', 'total_students', 'acceptance_rate')
        }),
        ('Programs & Fees', {
            'fields': ('popular_programs', 'tuition_fees', 'admission_requirements')
        }),
        ('Contact Information', {
            'fields': ('website', 'contact_email', 'contact_phone')
        }),
        ('Additional Details', {
            'fields': ('campus_facilities', 'is_featured', 'view_count')
        }),
    )
    
    readonly_fields = ['view_count']
    
    actions = ['mark_as_featured', 'unmark_as_featured']
    
    def mark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f"Marked {updated} colleges as featured.")
    mark_as_featured.short_description = "Mark selected colleges as featured"
    
    def unmark_as_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f"Unmarked {updated} colleges as featured.")
    unmark_as_featured.short_description = "Unmark selected colleges as featured"

# Customize admin site
admin.site.site_header = "CareerDisha Admin Panel"
admin.site.site_title = "CareerDisha Admin"
admin.site.index_title = "Welcome to CareerDisha Administration"