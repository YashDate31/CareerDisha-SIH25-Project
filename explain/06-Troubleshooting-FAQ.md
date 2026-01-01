# 06 - Troubleshooting & FAQ 🔧

## Common Issues & Solutions

### **Frontend Issues**

#### **1. React Development Server Won't Start**

**Error:** `npm run dev` fails or shows port conflicts

**Solutions:**
```bash
# Check if port 3000 is already in use
netstat -ano | findstr :3000

# Kill process using the port (replace PID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001

# Clear npm cache if dependencies are corrupted
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### **2. TypeScript Compilation Errors**

**Error:** Type errors in React components

**Solutions:**
```typescript
// Common type fixes

// 1. Event handler types
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // handle form submission
};

// 2. Ref types
const inputRef = useRef<HTMLInputElement>(null);

// 3. Props interface
interface ComponentProps {
  title: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

// 4. State with complex types
const [user, setUser] = useState<User | null>(null);
const [resources, setResources] = useState<Resource[]>([]);
```

#### **3. CSS/Tailwind Not Working**

**Issue:** Styles not applying or Tailwind classes not working

**Solutions:**
```bash
# Rebuild Tailwind CSS
npm run build:css

# Check Tailwind config path
# Ensure content paths in tailwind.config.js are correct
content: [
  "./src/**/*.{js,ts,jsx,tsx}",
  "./public/index.html"
]

# Clear browser cache and hard refresh
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

#### **4. API Connection Issues**

**Error:** Cannot connect to Django backend from React

**Solutions:**
```typescript
// 1. Check API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

// 2. Add CORS headers to requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('auth_token');
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
};

// 3. Check network tab in browser dev tools
// Ensure requests are reaching the backend
```

---

### **Backend Issues**

#### **1. Django Server Won't Start**

**Error:** `python manage.py runserver` fails

**Solutions:**
```bash
# Check Python environment
python --version
pip list

# Install missing dependencies
pip install -r requirements.txt

# Check for port conflicts
netstat -ano | findstr :8000

# Run on different port if needed
python manage.py runserver 127.0.0.1:8001

# Check for migration issues
python manage.py makemigrations
python manage.py migrate

# Create superuser if needed
python manage.py createsuperuser
```

#### **2. Database Migration Errors**

**Error:** Migration files conflicting or database locked

**Solutions:**
```bash
# Reset migrations (DEVELOPMENT ONLY!)
rm -rf */migrations/
python manage.py makemigrations
python manage.py migrate

# Or fix specific migration conflicts
python manage.py showmigrations
python manage.py migrate --fake 0001
python manage.py migrate

# SQLite database locked
# Close Django admin/shell and restart server
```

#### **3. CORS Configuration Issues**

**Error:** Frontend can't access Django APIs due to CORS

**Solution in `settings.py`:**
```python
# Install django-cors-headers
pip install django-cors-headers

# Add to INSTALLED_APPS
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

# Add to MIDDLEWARE (at the top)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    # ... other middleware
]

# CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",  # Alternative port
]

# For development only
CORS_ALLOW_ALL_ORIGINS = True
```

#### **4. API Authentication Issues**

**Error:** JWT token authentication failing

**Solutions:**
```python
# Check JWT settings in settings.py
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# Verify token in views
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@permission_classes([IsAuthenticated])
def protected_view(request):
    # This view requires authentication
    pass
```

---

### **Database Issues**

#### **1. SQLite Database Corruption**

**Symptoms:** Random database errors, data not saving

**Solutions:**
```bash
# Backup database
cp db.sqlite3 db.sqlite3.backup

# Check database integrity
sqlite3 db.sqlite3 "PRAGMA integrity_check;"

# If corrupted, restore from backup or recreate
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser

# Import data from backup if available
python manage.py loaddata backup.json
```

#### **2. Model Field Errors**

**Error:** Field type conflicts or missing fields

**Solutions:**
```python
# Common model fixes

# 1. Adding new fields with defaults
class Article(models.Model):
    title = models.CharField(max_length=200)
    # New field with default value
    category = models.CharField(max_length=100, default='general')
    
# 2. Handling null values
description = models.TextField(blank=True, null=True)

# 3. Foreign key relationships
category = models.ForeignKey(
    'Category', 
    on_delete=models.CASCADE,
    null=True,  # Allow null during migration
    blank=True
)
```

---

## Performance Issues

### **1. Slow Page Loading**

**Causes and Solutions:**

```typescript
// 1. Implement code splitting
const HomePage = React.lazy(() => import('./HomePage'));

// 2. Optimize images
const optimizeImage = (src: string, width: number) => {
  // Use appropriate image formats (WebP, AVIF)
  // Implement lazy loading for images
};

// 3. Minimize API calls
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

### **2. Slow API Responses**

**Backend Optimization:**

```python
# 1. Database query optimization
# Use select_related for foreign keys
articles = Article.objects.select_related('category').all()

# Use prefetch_related for many-to-many relationships
articles = Article.objects.prefetch_related('tags').all()

# 2. Add database indexing
class Article(models.Model):
    title = models.CharField(max_length=200, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

# 3. Implement pagination
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
```

---

## Deployment Issues

### **1. Build Failures**

**Common build errors and fixes:**

```bash
# React build errors
npm run build

# Fix common issues:
# 1. Remove unused imports
# 2. Fix TypeScript errors
# 3. Optimize bundle size

# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer
npm run build -- --analyze
```

### **2. Environment Configuration**

**Production environment setup:**

```bash
# Create .env files for different environments

# .env.development
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_DEBUG=true

# .env.production
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_DEBUG=false
```

```python
# Django production settings
import os
from pathlib import Path

# Security settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', '127.0.0.1']

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = '/static/'

# Database (PostgreSQL for production)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT'),
    }
}
```

---

## Frequently Asked Questions

### **General Questions**

**Q: How do I add new content to the platform?**
A: Use the Django admin panel at `http://127.0.0.1:8000/admin/` to add articles, videos, colleges, and scholarships.

**Q: Can I customize the UI colors and styles?**
A: Yes! Edit the `tailwind.config.js` file to customize colors, fonts, and other design tokens.

**Q: How do I add a new page to the application?**
A: 
1. Create a new component in `src/components/`
2. Add the route in `App.tsx`
3. Update navigation menus if needed

### **Technical Questions**

**Q: How do I switch from SQLite to PostgreSQL?**
A:
```bash
# Install PostgreSQL adapter
pip install psycopg2-binary

# Update settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'careerdisha_db',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# Run migrations
python manage.py migrate
```

**Q: How do I add user authentication to new pages?**
A:
```typescript
// Use the authentication context
import { useAuth } from '../contexts/AuthContext';

const ProtectedPage: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPrompt />;
  
  return <div>Protected content</div>;
};
```

**Q: How do I implement real-time notifications?**
A: Consider using WebSockets with Django Channels or integrate with services like Pusher or Socket.io.

### **Development Workflow**

**Q: What's the recommended development workflow?**
A:
1. Start Django backend: `python manage.py runserver`
2. Start React frontend: `npm run dev`
3. Make changes and test locally
4. Run tests: `npm test` and `python manage.py test`
5. Create git commits with clear messages
6. Deploy to staging environment for testing

**Q: How do I debug API issues?**
A:
1. Check browser Network tab for HTTP requests
2. Use Django's built-in logging
3. Add `console.log()` statements in React components
4. Use React Developer Tools browser extension
5. Check Django admin for data verification

---

## Testing Guidelines

### **Frontend Testing**

```typescript
// Example Jest test for React component
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../components/ui/Button';

describe('Button Component', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### **Backend Testing**

```python
# Example Django test
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Article

User = get_user_model()

class ArticleAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_get_articles(self):
        response = self.client.get('/api/articles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_create_article(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Test Article',
            'content': 'This is a test article',
            'description': 'Test description'
        }
        response = self.client.post('/api/articles/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
```

---

## Getting Help

### **Development Resources**
- **React Documentation:** https://react.dev/
- **Django Documentation:** https://docs.djangoproject.com/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript Handbook:** https://www.typescriptlang.org/docs/

### **Community Support**
- **Stack Overflow:** Tag questions with `reactjs`, `django`, `typescript`
- **GitHub Issues:** Check project repository for known issues
- **Discord/Slack:** Join React and Django community servers

### **Debugging Tools**
- **Browser DevTools:** F12 for debugging React components
- **React Developer Tools:** Browser extension for React debugging
- **Django Debug Toolbar:** Visual debugging for Django
- **Postman/Insomnia:** API testing tools

---

**Remember:** When encountering issues, always check:
1. ✅ Console errors in browser DevTools
2. ✅ Django server logs in terminal
3. ✅ Network requests in browser Network tab
4. ✅ Database data through Django admin
5. ✅ Environment variables and configuration

**Need more help?** Check the project documentation in the `explain/` folder or contact the development team!

---

**Complete Documentation:** [Return to README](README.md) | [Project Overview](01-Project-Overview.md) | [Getting Started](02-Getting-Started.md) | [User Guide](03-User-Guide.md) | [Architecture](04-Architecture-Overview.md) | [Frontend Guide](05-Frontend-Documentation.md)