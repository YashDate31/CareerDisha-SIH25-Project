from django.db import models

class Video(models.Model):
    title = models.CharField(max_length=200)
    youtube_url = models.URLField()
    description = models.TextField(blank=True)
    duration = models.CharField(max_length=20, blank=True)
    views = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, blank=True)
    is_parent_content = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']

class PDFResource(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='pdfs/')
    description = models.TextField(blank=True)
    pages = models.CharField(max_length=20, blank=True)
    category = models.CharField(max_length=50, blank=True)
    is_parent_content = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']

class Article(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    content = models.TextField()
    read_time = models.CharField(max_length=20, blank=True)
    author = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=50, blank=True)
    is_parent_content = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-uploaded_at']