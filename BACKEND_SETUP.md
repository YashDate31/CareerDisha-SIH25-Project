# Django Backend Setup Guide

## Prerequisites
- Python 3.8+
- pip

## Setup Instructions

### 1. Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install django djangorestframework django-cors-headers pillow python-decouple djangorestframework-simplejwt
```

### 3. Create Django Project
```bash
django-admin startproject careerdisha_backend
cd careerdisha_backend
```

### 4. Create Apps
```bash
python manage.py startapp accounts
python manage.py startapp resources
```

### 5. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

### 6. Run Server
```bash
python manage.py runserver
```

## API Endpoints (after setup)

### Authentication
- POST `/api/auth/login/` - Login
- POST `/api/auth/register/` - Register
- POST `/api/auth/refresh/` - Refresh token

### Resources
- GET `/api/videos/` - List all videos
- GET `/api/videos/{id}/` - Get specific video
- GET `/api/pdfs/` - List all PDFs
- GET `/api/pdfs/{id}/` - Get specific PDF
- GET `/api/articles/` - List all articles
- GET `/api/articles/{id}/` - Get specific article

### Parent Resources
- GET `/api/parent-videos/` - List parent section videos
- GET `/api/parent-articles/` - List parent section articles

## Configuration

Create a `.env` file in your Django project root:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

## Admin Panel
Access admin panel at `http://localhost:8000/admin/` with superuser credentials.

## Current Status
The frontend is set up with:
- ✅ Mock API service that simulates Django responses
- ✅ Axios integration for HTTP requests
- ✅ Authentication state management
- ✅ Resource fetching for videos, PDFs, and articles
- ✅ Parent section resources
- ✅ YouTube video embedding
- ✅ PDF download functionality
- ✅ Article display with modal popups
- ✅ Responsive design maintained
- ✅ All existing UI components preserved

## Next Steps
1. Set up the Django backend following the above instructions
2. Replace the mock API in `src/services/api.ts` with actual axios calls
3. Configure CORS settings in Django
4. Set up media file serving for PDFs and images
5. Implement JWT authentication endpoints