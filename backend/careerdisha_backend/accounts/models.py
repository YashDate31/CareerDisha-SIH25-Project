from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    """Extended user model with additional fields"""
    phone_number = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    grade = models.CharField(max_length=20, blank=True, help_text="Current grade/class")
    school = models.CharField(max_length=200, blank=True)
    interests = models.TextField(blank=True, help_text="Comma-separated interests")
    career_preferences = models.TextField(blank=True, help_text="Career fields of interest")
    is_parent = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}" if self.first_name else self.username

class UserProfile(models.Model):
    """Additional profile information"""
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, max_length=500)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    preferred_language = models.CharField(max_length=50, default='English')
    notification_preferences = models.JSONField(default=dict)
    quiz_scores = models.JSONField(default=dict, help_text="Career quiz results")
    bookmarked_content = models.JSONField(default=list, help_text="Bookmarked content IDs")
    
    def __str__(self):
        return f"{self.user.username}'s Profile"