#!/usr/bin/env python
import os
import django
import sys
import json

# Setup Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careerdisha_backend.settings')
django.setup()

from resources.models import Video, PDFResource, Article, CareerQuiz, QuizQuestion, QuizAnswer

def create_sample_data():
    print("Creating sample data...")
    
    # Create Videos
    videos = [
        {
            'title': 'Career Guidance: Choosing the Right Path',
            'youtube_url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'description': 'Comprehensive guide on choosing the right career path based on your interests and skills.',
            'category': 'career_guidance',
            'is_featured': True
        },
        {
            'title': 'Engineering vs Medical: Which to Choose?',
            'youtube_url': 'https://www.youtube.com/watch?v=example2',
            'description': 'Detailed comparison between engineering and medical career paths.',
            'category': 'engineering',
            'is_featured': False
        },
        {
            'title': 'Parents Guide: Supporting Your Child Career',
            'youtube_url': 'https://www.youtube.com/watch?v=parent1',
            'description': 'How parents can support their children in career decisions.',
            'category': 'parenting',
            'is_parent_content': True,
            'is_featured': True
        }
    ]
    
    for video_data in videos:
        video, created = Video.objects.get_or_create(
            title=video_data['title'],
            defaults=video_data
        )
        if created:
            print(f"Created video: {video.title}")
        else:
            print(f"Video already exists: {video.title}")
    
    # Create PDFs
    pdfs = [
        {
            'title': 'Complete Guide to College Admissions',
            'description': 'Everything you need to know about college admissions process.',
            'category': 'education',
            'is_featured': True
        },
        {
            'title': 'Scholarship Opportunities for Students',
            'description': 'Comprehensive list of available scholarships.',
            'category': 'education',
            'is_featured': False
        },
        {
            'title': 'Parenting Tips for Academic Success',
            'description': 'Guide for parents to help children succeed academically.',
            'category': 'parenting',
            'is_parent_content': True,
            'is_featured': True
        }
    ]
    
    for pdf_data in pdfs:
        pdf, created = PDFResource.objects.get_or_create(
            title=pdf_data['title'],
            defaults=pdf_data
        )
        if created:
            print(f"Created PDF: {pdf.title}")
        else:
            print(f"PDF already exists: {pdf.title}")
    
    # Create Career Quiz
    quiz_data = {
        'title': 'Career Interest Assessment',
        'description': 'Discover your ideal career path based on your interests and skills.',
        'is_active': True
    }
    
    quiz, created = CareerQuiz.objects.get_or_create(
        title=quiz_data['title'],
        defaults=quiz_data
    )
    
    if created:
        print(f"Created quiz: {quiz.title}")
        
        # Add questions and answers
        questions = [
            {
                'text': 'What type of activities do you enjoy most?',
                'answers': [
                    ('Solving complex technical problems', {'engineering': 5, 'technology': 4, 'science': 3}),
                    ('Helping and caring for others', {'healthcare': 5, 'education': 4, 'social_work': 3}),
                    ('Creating and designing things', {'arts': 5, 'technology': 3, 'business': 2}),
                    ('Managing and leading teams', {'business': 5, 'management': 4, 'education': 2})
                ]
            },
            {
                'text': 'Which work environment appeals to you?',
                'answers': [
                    ('Laboratory or technical workspace', {'science': 5, 'engineering': 4, 'technology': 4}),
                    ('Hospital or clinic', {'healthcare': 5, 'medical': 5}),
                    ('Office or corporate setting', {'business': 4, 'management': 3, 'finance': 4}),
                    ('Creative studio or flexible workspace', {'arts': 5, 'technology': 3, 'media': 4})
                ]
            },
            {
                'text': 'What motivates you most in work?',
                'answers': [
                    ('Innovation and discovery', {'technology': 5, 'science': 5, 'engineering': 4}),
                    ('Making a difference in peoples lives', {'healthcare': 5, 'education': 4, 'social_work': 5}),
                    ('Financial success and growth', {'business': 5, 'finance': 4, 'sales': 3}),
                    ('Creative expression and artistic fulfillment', {'arts': 5, 'media': 4, 'entertainment': 4})
                ]
            }
        ]
        
        for i, q_data in enumerate(questions, 1):
            question = QuizQuestion.objects.create(
                quiz=quiz,
                question_text=q_data['text'],
                order=i
            )
            
            for answer_text, weights in q_data['answers']:
                QuizAnswer.objects.create(
                    question=question,
                    answer_text=answer_text,
                    career_weight=json.dumps(weights)
                )
            
            print(f"Created question {i}: {question.question_text}")
    else:
        print(f"Quiz already exists: {quiz.title}")
    
    # Create Articles
    articles = [
        {
            'title': 'Top 10 Careers in Technology',
            'content': '''Technology is rapidly evolving and creating new career opportunities. Here are the top 10 careers in technology:

1. Software Developer - Design and build applications
2. Data Scientist - Analyze complex data to drive decisions
3. Cybersecurity Specialist - Protect digital assets
4. AI/ML Engineer - Develop intelligent systems
5. Cloud Architect - Design cloud infrastructure
6. DevOps Engineer - Bridge development and operations
7. UX/UI Designer - Create user-friendly interfaces
8. Product Manager - Guide product development
9. Blockchain Developer - Build decentralized applications
10. IoT Specialist - Connect devices and systems''',
            'author': 'Career Expert',
            'category': 'technology',
            'is_featured': True
        }
    ]
    
    for article_data in articles:
        article, created = Article.objects.get_or_create(
            title=article_data['title'],
            defaults=article_data
        )
        if created:
            print(f"Created article: {article.title}")
        else:
            print(f"Article already exists: {article.title}")
    
    print("\nSample data creation completed!")
    print(f"Total Videos: {Video.objects.count()}")
    print(f"Total PDFs: {PDFResource.objects.count()}")
    print(f"Total Articles: {Article.objects.count()}")
    print(f"Total Quizzes: {CareerQuiz.objects.count()}")
    print(f"Total Quiz Questions: {QuizQuestion.objects.count()}")
    print(f"Total Quiz Answers: {QuizAnswer.objects.count()}")

if __name__ == '__main__':
    create_sample_data()