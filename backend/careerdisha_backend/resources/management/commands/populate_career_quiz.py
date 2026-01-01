from django.core.management.base import BaseCommand
from resources.models import CareerQuiz, QuizQuestion, QuizAnswer

class Command(BaseCommand):
    help = 'Populate career quiz with 10 questions and career matching data'

    def handle(self, *args, **options):
        # Define 50 career options with their categories
        careers = {
            # Technology & Engineering
            'software_engineer': 'Software Engineer',
            'data_scientist': 'Data Scientist',
            'cybersecurity_specialist': 'Cybersecurity Specialist',
            'web_developer': 'Web Developer',
            'ai_engineer': 'AI/ML Engineer',
            'mobile_app_developer': 'Mobile App Developer',
            'cloud_architect': 'Cloud Solutions Architect',
            'game_developer': 'Game Developer',
            'robotics_engineer': 'Robotics Engineer',
            'blockchain_developer': 'Blockchain Developer',
            
            # Healthcare & Medical
            'doctor': 'Medical Doctor',
            'nurse': 'Registered Nurse',
            'pharmacist': 'Pharmacist',
            'physiotherapist': 'Physiotherapist',
            'dentist': 'Dentist',
            'medical_researcher': 'Medical Researcher',
            'veterinarian': 'Veterinarian',
            'psychologist': 'Clinical Psychologist',
            'biomedical_engineer': 'Biomedical Engineer',
            'radiologist': 'Radiologist',
            
            # Business & Finance
            'business_analyst': 'Business Analyst',
            'financial_advisor': 'Financial Advisor',
            'marketing_manager': 'Marketing Manager',
            'hr_manager': 'HR Manager',
            'investment_banker': 'Investment Banker',
            'entrepreneur': 'Entrepreneur',
            'management_consultant': 'Management Consultant',
            'accountant': 'Accountant',
            'project_manager': 'Project Manager',
            'sales_manager': 'Sales Manager',
            
            # Creative & Arts
            'graphic_designer': 'Graphic Designer',
            'video_editor': 'Video Editor',
            'photographer': 'Photographer',
            'writer': 'Content Writer',
            'musician': 'Musician',
            'fashion_designer': 'Fashion Designer',
            'architect': 'Architect',
            'interior_designer': 'Interior Designer',
            'animator': 'Animator',
            'ui_ux_designer': 'UI/UX Designer',
            
            # Education & Research
            'teacher': 'Teacher',
            'professor': 'Professor',
            'research_scientist': 'Research Scientist',
            'librarian': 'Librarian',
            'education_counselor': 'Education Counselor',
            
            # Social Services & Law
            'lawyer': 'Lawyer',
            'social_worker': 'Social Worker',
            'diplomat': 'Diplomat',
            'journalist': 'Journalist',
            'police_officer': 'Police Officer'
        }

        # Clear existing quiz data
        CareerQuiz.objects.all().delete()
        
        # Create the main quiz
        quiz = CareerQuiz.objects.create(
            title="Career Assessment Quiz",
            description="Discover your ideal career path through this comprehensive 10-question assessment that matches your interests, skills, and personality with over 50 different career options."
        )

        # Define 10 comprehensive questions with answers and career weights
        questions_data = [
            {
                'question': "Which type of activities do you enjoy most in your free time?",
                'answers': [
                    {
                        'text': "Coding, building apps, or solving technical problems",
                        'weights': {
                            'software_engineer': 10, 'data_scientist': 8, 'ai_engineer': 9,
                            'web_developer': 10, 'mobile_app_developer': 10, 'game_developer': 8,
                            'blockchain_developer': 7, 'cloud_architect': 8
                        }
                    },
                    {
                        'text': "Reading, writing, or creating content",
                        'weights': {
                            'writer': 10, 'journalist': 9, 'teacher': 7, 'professor': 8,
                            'librarian': 6, 'marketing_manager': 6, 'education_counselor': 5
                        }
                    },
                    {
                        'text': "Drawing, designing, or creating visual art",
                        'weights': {
                            'graphic_designer': 10, 'ui_ux_designer': 9, 'architect': 8,
                            'interior_designer': 9, 'fashion_designer': 10, 'animator': 9,
                            'photographer': 8, 'video_editor': 7
                        }
                    },
                    {
                        'text': "Helping others or volunteering",
                        'weights': {
                            'social_worker': 10, 'teacher': 9, 'nurse': 8, 'psychologist': 9,
                            'education_counselor': 10, 'hr_manager': 6, 'doctor': 7
                        }
                    }
                ]
            },
            {
                'question': "What type of work environment appeals to you most?",
                'answers': [
                    {
                        'text': "High-tech office or laboratory with cutting-edge equipment",
                        'weights': {
                            'software_engineer': 9, 'data_scientist': 10, 'ai_engineer': 10,
                            'cybersecurity_specialist': 8, 'research_scientist': 10, 'biomedical_engineer': 9,
                            'robotics_engineer': 10, 'medical_researcher': 9
                        }
                    },
                    {
                        'text': "Hospital, clinic, or healthcare facility",
                        'weights': {
                            'doctor': 10, 'nurse': 10, 'pharmacist': 9, 'physiotherapist': 9,
                            'dentist': 10, 'radiologist': 9, 'veterinarian': 8, 'psychologist': 7
                        }
                    },
                    {
                        'text': "Creative studio or artistic workspace",
                        'weights': {
                            'graphic_designer': 10, 'photographer': 10, 'video_editor': 9,
                            'animator': 10, 'fashion_designer': 10, 'musician': 10,
                            'architect': 8, 'interior_designer': 9
                        }
                    },
                    {
                        'text': "Corporate office or business setting",
                        'weights': {
                            'business_analyst': 10, 'financial_advisor': 9, 'marketing_manager': 9,
                            'hr_manager': 10, 'investment_banker': 10, 'management_consultant': 9,
                            'accountant': 8, 'project_manager': 9, 'sales_manager': 8
                        }
                    }
                ]
            },
            {
                'question': "Which skills do you feel are your strongest?",
                'answers': [
                    {
                        'text': "Logical thinking and problem-solving",
                        'weights': {
                            'software_engineer': 10, 'data_scientist': 10, 'cybersecurity_specialist': 9,
                            'ai_engineer': 10, 'research_scientist': 9, 'lawyer': 8,
                            'business_analyst': 9, 'management_consultant': 8
                        }
                    },
                    {
                        'text': "Communication and interpersonal skills",
                        'weights': {
                            'teacher': 10, 'hr_manager': 10, 'sales_manager': 10,
                            'marketing_manager': 9, 'social_worker': 9, 'journalist': 9,
                            'education_counselor': 10, 'diplomat': 10, 'lawyer': 8
                        }
                    },
                    {
                        'text': "Creativity and artistic abilities",
                        'weights': {
                            'graphic_designer': 10, 'fashion_designer': 10, 'architect': 9,
                            'ui_ux_designer': 10, 'video_editor': 9, 'photographer': 9,
                            'animator': 10, 'interior_designer': 9, 'musician': 10
                        }
                    },
                    {
                        'text': "Attention to detail and precision",
                        'weights': {
                            'accountant': 10, 'pharmacist': 9, 'dentist': 10,
                            'radiologist': 9, 'financial_advisor': 8, 'nurse': 8,
                            'biomedical_engineer': 8, 'research_scientist': 9
                        }
                    }
                ]
            },
            {
                'question': "What motivates you most in a career?",
                'answers': [
                    {
                        'text': "Making a positive impact on society",
                        'weights': {
                            'doctor': 10, 'teacher': 10, 'social_worker': 10,
                            'nurse': 9, 'psychologist': 9, 'education_counselor': 10,
                            'research_scientist': 8, 'environmental_scientist': 9
                        }
                    },
                    {
                        'text': "Financial success and stability",
                        'weights': {
                            'investment_banker': 10, 'financial_advisor': 9, 'lawyer': 9,
                            'business_analyst': 8, 'management_consultant': 9, 'entrepreneur': 8,
                            'sales_manager': 8, 'accountant': 7
                        }
                    },
                    {
                        'text': "Innovation and creating new things",
                        'weights': {
                            'software_engineer': 9, 'entrepreneur': 10, 'ai_engineer': 10,
                            'architect': 8, 'game_developer': 9, 'blockchain_developer': 9,
                            'research_scientist': 9, 'biomedical_engineer': 8
                        }
                    },
                    {
                        'text': "Personal expression and creativity",
                        'weights': {
                            'graphic_designer': 10, 'musician': 10, 'writer': 10,
                            'photographer': 10, 'fashion_designer': 10, 'video_editor': 9,
                            'animator': 10, 'interior_designer': 8
                        }
                    }
                ]
            },
            {
                'question': "How do you prefer to work?",
                'answers': [
                    {
                        'text': "Independently with minimal supervision",
                        'weights': {
                            'writer': 10, 'photographer': 9, 'graphic_designer': 9,
                            'software_engineer': 8, 'research_scientist': 8, 'entrepreneur': 9,
                            'web_developer': 8, 'mobile_app_developer': 8
                        }
                    },
                    {
                        'text': "In a team with collaborative projects",
                        'weights': {
                            'project_manager': 10, 'software_engineer': 9, 'marketing_manager': 9,
                            'business_analyst': 8, 'ui_ux_designer': 8, 'game_developer': 9,
                            'management_consultant': 9, 'hr_manager': 8
                        }
                    },
                    {
                        'text': "Directly helping individuals one-on-one",
                        'weights': {
                            'doctor': 10, 'psychologist': 10, 'teacher': 9,
                            'nurse': 10, 'physiotherapist': 10, 'dentist': 10,
                            'education_counselor': 10, 'social_worker': 9
                        }
                    },
                    {
                        'text': "Leading and managing others",
                        'weights': {
                            'project_manager': 10, 'hr_manager': 10, 'sales_manager': 10,
                            'marketing_manager': 9, 'entrepreneur': 10, 'management_consultant': 9,
                            'business_analyst': 7, 'investment_banker': 8
                        }
                    }
                ]
            },
            {
                'question': "Which subject area interests you most?",
                'answers': [
                    {
                        'text': "Mathematics and Computer Science",
                        'weights': {
                            'software_engineer': 10, 'data_scientist': 10, 'ai_engineer': 10,
                            'cybersecurity_specialist': 9, 'web_developer': 9, 'blockchain_developer': 9,
                            'cloud_architect': 8, 'game_developer': 8
                        }
                    },
                    {
                        'text': "Biology and Health Sciences",
                        'weights': {
                            'doctor': 10, 'nurse': 10, 'pharmacist': 10,
                            'biomedical_engineer': 9, 'medical_researcher': 10, 'physiotherapist': 9,
                            'veterinarian': 9, 'research_scientist': 8
                        }
                    },
                    {
                        'text': "Business and Economics",
                        'weights': {
                            'business_analyst': 10, 'financial_advisor': 10, 'investment_banker': 10,
                            'marketing_manager': 9, 'management_consultant': 9, 'entrepreneur': 8,
                            'accountant': 9, 'project_manager': 7
                        }
                    },
                    {
                        'text': "Arts and Humanities",
                        'weights': {
                            'writer': 10, 'journalist': 10, 'teacher': 9,
                            'historian': 8, 'librarian': 9, 'social_worker': 7,
                            'diplomat': 8, 'education_counselor': 7
                        }
                    }
                ]
            },
            {
                'question': "What type of problems do you enjoy solving?",
                'answers': [
                    {
                        'text': "Technical and logical puzzles",
                        'weights': {
                            'software_engineer': 10, 'cybersecurity_specialist': 10, 'ai_engineer': 9,
                            'data_scientist': 9, 'robotics_engineer': 9, 'web_developer': 8,
                            'blockchain_developer': 8, 'cloud_architect': 8
                        }
                    },
                    {
                        'text': "Human behavior and social issues",
                        'weights': {
                            'psychologist': 10, 'social_worker': 10, 'hr_manager': 9,
                            'education_counselor': 9, 'teacher': 8, 'journalist': 7,
                            'diplomat': 8, 'lawyer': 7
                        }
                    },
                    {
                        'text': "Business and strategic challenges",
                        'weights': {
                            'business_analyst': 10, 'management_consultant': 10, 'entrepreneur': 9,
                            'project_manager': 9, 'marketing_manager': 8, 'investment_banker': 8,
                            'financial_advisor': 7, 'sales_manager': 7
                        }
                    },
                    {
                        'text': "Creative and design challenges",
                        'weights': {
                            'graphic_designer': 10, 'ui_ux_designer': 10, 'architect': 10,
                            'interior_designer': 9, 'fashion_designer': 9, 'video_editor': 8,
                            'photographer': 7, 'animator': 9
                        }
                    }
                ]
            },
            {
                'question': "How important is job security to you?",
                'answers': [
                    {
                        'text': "Very important - I prefer stable, traditional careers",
                        'weights': {
                            'teacher': 10, 'nurse': 9, 'accountant': 9,
                            'pharmacist': 9, 'government_jobs': 8, 'librarian': 8,
                            'police_officer': 8, 'professor': 7
                        }
                    },
                    {
                        'text': "Somewhat important - I want growth opportunities",
                        'weights': {
                            'business_analyst': 9, 'project_manager': 9, 'hr_manager': 8,
                            'marketing_manager': 8, 'software_engineer': 8, 'financial_advisor': 8,
                            'management_consultant': 7, 'sales_manager': 7
                        }
                    },
                    {
                        'text': "Not very important - I'm willing to take risks for rewards",
                        'weights': {
                            'entrepreneur': 10, 'investment_banker': 9, 'sales_manager': 8,
                            'freelance_designer': 8, 'photographer': 7, 'musician': 7,
                            'writer': 7, 'video_editor': 6
                        }
                    },
                    {
                        'text': "Flexible - depends on the opportunity",
                        'weights': {
                            'software_engineer': 8, 'data_scientist': 8, 'lawyer': 7,
                            'doctor': 7, 'ai_engineer': 8, 'cybersecurity_specialist': 8,
                            'web_developer': 7, 'mobile_app_developer': 7
                        }
                    }
                ]
            },
            {
                'question': "Which work schedule appeals to you most?",
                'answers': [
                    {
                        'text': "Regular 9-5 office hours",
                        'weights': {
                            'business_analyst': 9, 'accountant': 10, 'hr_manager': 9,
                            'teacher': 8, 'librarian': 9, 'financial_advisor': 8,
                            'project_manager': 8, 'marketing_manager': 8
                        }
                    },
                    {
                        'text': "Flexible hours with remote work options",
                        'weights': {
                            'software_engineer': 10, 'web_developer': 10, 'graphic_designer': 9,
                            'writer': 10, 'data_scientist': 9, 'ui_ux_designer': 9,
                            'mobile_app_developer': 9, 'video_editor': 8
                        }
                    },
                    {
                        'text': "Varied schedules including evenings/weekends",
                        'weights': {
                            'doctor': 8, 'nurse': 9, 'journalist': 8,
                            'photographer': 9, 'musician': 10, 'social_worker': 7,
                            'police_officer': 8, 'veterinarian': 7
                        }
                    },
                    {
                        'text': "Project-based with intensive periods",
                        'weights': {
                            'management_consultant': 10, 'architect': 9, 'game_developer': 8,
                            'video_editor': 8, 'entrepreneur': 9, 'investment_banker': 8,
                            'research_scientist': 8, 'fashion_designer': 7
                        }
                    }
                ]
            },
            {
                'question': "What level of education are you willing to pursue?",
                'answers': [
                    {
                        'text': "Bachelor's degree",
                        'weights': {
                            'software_engineer': 8, 'web_developer': 9, 'graphic_designer': 9,
                            'business_analyst': 8, 'marketing_manager': 8, 'hr_manager': 8,
                            'sales_manager': 9, 'photographer': 8
                        }
                    },
                    {
                        'text': "Master's degree or specialized training",
                        'weights': {
                            'data_scientist': 10, 'ai_engineer': 9, 'management_consultant': 9,
                            'psychologist': 8, 'financial_advisor': 8, 'project_manager': 8,
                            'cybersecurity_specialist': 8, 'ui_ux_designer': 7
                        }
                    },
                    {
                        'text': "Professional degree (Medical, Law, etc.)",
                        'weights': {
                            'doctor': 10, 'lawyer': 10, 'dentist': 10,
                            'pharmacist': 10, 'veterinarian': 10, 'professor': 9,
                            'radiologist': 10, 'investment_banker': 8
                        }
                    },
                    {
                        'text': "Certification or portfolio-based careers",
                        'weights': {
                            'graphic_designer': 8, 'photographer': 9, 'video_editor': 8,
                            'musician': 9, 'animator': 8, 'fashion_designer': 8,
                            'interior_designer': 7, 'writer': 7
                        }
                    }
                ]
            }
        ]

        # Create questions and answers
        for i, q_data in enumerate(questions_data, 1):
            question = QuizQuestion.objects.create(
                quiz=quiz,
                question_text=q_data['question'],
                question_type='multiple_choice',
                order=i
            )
            
            for answer_data in q_data['answers']:
                QuizAnswer.objects.create(
                    question=question,
                    answer_text=answer_data['text'],
                    career_weight=answer_data['weights']
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created career quiz with {len(questions_data)} questions '
                f'and {len(careers)} career options'
            )
        )