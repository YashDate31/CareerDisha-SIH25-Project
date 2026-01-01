# 04 - Architecture Overview: Technical Deep Dive 🏗️

## System Architecture

CareerDisha follows a **modern three-tier architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React.js)    │◄──►│   (Django)      │◄──►│  (SQLite/       │
│                 │    │                 │    │   PostgreSQL)   │
│  - UI Components│    │ - REST APIs     │    │ - User Data     │
│  - State Mgmt   │    │ - Business Logic│    │ - Content Data  │
│  - API Calls    │    │ - Authentication│    │ - System Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture (React.js)

### **Component Structure**

```
src/
├── components/
│   ├── pages/                  # Main page components
│   │   ├── HomePage.tsx        # Landing page with stats
│   │   ├── ResourcesPage.tsx   # Resource library
│   │   ├── CareerQuizPage.tsx  # Career assessment
│   │   ├── CollegesPage.tsx    # College database
│   │   ├── ScholarshipsPage.tsx# Scholarship portal
│   │   ├── ParentSectionPage.tsx# Parent guidance
│   │   └── ProfilePage.tsx     # User profile
│   │
│   ├── ui/                     # Reusable UI components
│   │   ├── button.tsx          # Custom button component
│   │   ├── card.tsx            # Card container component
│   │   ├── modal.tsx           # Modal dialog component
│   │   ├── input.tsx           # Form input component
│   │   └── navigation.tsx      # Navigation components
│   │
│   └── shared/                 # Shared components
│       ├── Header.tsx          # App header
│       ├── Footer.tsx          # App footer
│       ├── Loading.tsx         # Loading indicators
│       └── ErrorBoundary.tsx   # Error handling
│
├── services/
│   ├── api.ts                  # API communication layer
│   ├── auth.ts                 # Authentication services
│   └── storage.ts              # Local storage utilities
│
├── utils/
│   ├── youtube.ts              # YouTube URL utilities
│   ├── formatting.ts           # Data formatting helpers
│   └── validation.ts           # Input validation
│
├── styles/
│   ├── globals.css             # Global styles
│   └── components.css          # Component-specific styles
│
└── types/
    └── index.ts                # TypeScript type definitions
```

### **Key Frontend Technologies**

| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **React 18** | UI Framework | Virtual DOM, component reusability, large ecosystem |
| **TypeScript** | Type Safety | Better development experience, fewer runtime errors |
| **Tailwind CSS** | Styling | Utility-first, mobile-responsive, consistent design |
| **Vite** | Build Tool | Fast development server, optimized builds |
| **React Router** | Navigation | Client-side routing for SPA experience |

### **State Management Pattern**

CareerDisha uses **React Hooks** for state management:

```typescript
// Example: Resource loading with hooks
const [resources, setResources] = useState<Resource[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await api.getResources();
      setResources(data);
    } catch (err) {
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };
  
  loadResources();
}, []);
```

**Benefits of this approach:**
- ✅ Simple and predictable
- ✅ No additional dependencies
- ✅ Easy to test and debug
- ✅ Perfect for medium-sized applications

## Backend Architecture (Django)

### **Project Structure**

```
backend/careerdisha_backend/
├── careerdisha_backend/        # Main project configuration
│   ├── settings.py             # Django settings
│   ├── urls.py                 # URL routing
│   ├── wsgi.py                 # WSGI application
│   └── asgi.py                 # ASGI application (future WebSocket support)
│
├── accounts/                   # User management app
│   ├── models.py               # User model and profile
│   ├── views.py                # Authentication views
│   ├── serializers.py          # API serializers
│   └── admin.py                # Admin interface
│
├── resources/                  # Content management app
│   ├── models.py               # Content models
│   │   ├── Article             # Career articles
│   │   ├── Video               # Video resources
│   │   ├── PDFResource         # PDF documents
│   │   ├── College             # College database
│   │   ├── Scholarship         # Scholarship opportunities
│   │   └── CareerQuiz          # Quiz questions and results
│   │
│   ├── views.py                # API views
│   ├── serializers.py          # Data serialization
│   ├── admin.py                # Admin interface customization
│   └── urls.py                 # App-specific URLs
│
├── api/                        # API configuration
│   ├── urls.py                 # API URL patterns
│   └── permissions.py          # API permissions
│
└── static/                     # Static files (CSS, JS, images)
    └── media/                  # User uploaded files
```

### **Database Models**

#### **Core Models Relationship:**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Article   │    │   Category  │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ username    │◄─┐ │ title       │ ┌──│ name        │
│ email       │  │ │ content     │ │  │ description │
│ password    │  │ │ description │ │  └─────────────┘
│ created_at  │  │ │ category_id │─┘
└─────────────┘  │ │ created_at  │
                 │ └─────────────┘
                 │
                 │ ┌─────────────┐
                 │ │    Video    │
                 │ ├─────────────┤
                 │ │ id (PK)     │
                 │ │ title       │
                 └─│ youtube_url │
                   │ description │
                   │ category_id │
                   └─────────────┘
```

#### **Model Definitions Example:**

```python
# resources/models.py
class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    description = models.TextField(max_length=500)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return self.title

class Video(models.Model):
    title = models.CharField(max_length=200)
    youtube_url = models.URLField()
    description = models.TextField(max_length=500)
    duration = models.CharField(max_length=20, blank=True)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
```

### **API Design**

CareerDisha follows **REST API principles**:

#### **API Endpoints:**

```
Authentication:
POST   /api/auth/login/          # User login
POST   /api/auth/logout/         # User logout
POST   /api/auth/register/       # User registration

Content:
GET    /api/articles/            # List all articles
GET    /api/articles/{id}/       # Get specific article
GET    /api/videos/              # List all videos
GET    /api/videos/{id}/         # Get specific video
GET    /api/pdfs/                # List all PDFs
GET    /api/colleges/            # List all colleges
GET    /api/scholarships/        # List all scholarships

Parent Content:
GET    /api/parent-articles/     # Parent-specific articles
GET    /api/parent-videos/       # Parent-specific videos

Quiz:
GET    /api/quizzes/             # List available quizzes
POST   /api/quizzes/submit/      # Submit quiz responses
GET    /api/quiz-results/{id}/   # Get quiz results

Search:
GET    /api/search/?q={query}    # Global search across content
```

#### **API Response Format:**

```json
{
  "count": 25,
  "next": "http://127.0.0.1:8000/api/articles/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Complete Guide to Career Planning",
      "description": "A comprehensive guide covering all aspects...",
      "content": "<h2>Introduction to Career Planning</h2>...",
      "category": {
        "id": 1,
        "name": "Career Guidance"
      },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### **Authentication System**

CareerDisha uses **JWT (JSON Web Token) authentication**:

```python
# Authentication Flow
1. User submits credentials → Django validates
2. Django generates JWT token → Returns to frontend  
3. Frontend stores token → Includes in API requests
4. Django validates token → Processes authorized requests
```

**Benefits:**
- ✅ Stateless authentication
- ✅ Scalable across multiple servers
- ✅ Secure token-based system
- ✅ Industry standard approach

## Data Flow Architecture

### **Complete Request Flow:**

```
┌─────────────┐    HTTP Request    ┌─────────────┐
│  Frontend   │ ──────────────────► │   Django    │
│  (React)    │                    │  Backend    │
│             │ ◄────────────────── │             │
└─────────────┘    JSON Response   └─────────────┘
       │                                  │
       │ 1. User clicks "Resources"       │ 2. API call to /api/articles/
       │                                  │
       ▼                                  ▼
┌─────────────┐                  ┌─────────────┐
│ Component   │                  │   View      │
│ State       │                  │ Function    │
│ Updates     │                  │             │
└─────────────┘                  └─────────────┘
       │                                  │
       │ 6. UI Re-renders                 │ 3. Query database
       │                                  │
       ▼                                  ▼
┌─────────────┐                  ┌─────────────┐
│  User sees  │                  │  Database   │
│   content   │                  │   Query     │
└─────────────┘                  └─────────────┘
       ▲                                  │
       │ 5. Data displayed                │ 4. Return results
       └──────────────────────────────────┘
```

### **Key Architectural Decisions**

#### **1. Single Page Application (SPA)**
**Decision:** Use React Router for client-side routing
**Benefits:**
- Faster navigation (no page reloads)
- Better user experience
- Reduced server load
- Native app-like feel

#### **2. Mobile-First Design**
**Decision:** Design for mobile devices first, then enhance for larger screens
**Implementation:**
```css
/* Mobile-first CSS approach */
.container {
  max-width: 28rem;  /* Mobile default */
  margin: 0 auto;
}

@media (min-width: 768px) {
  .container {
    max-width: 42rem;  /* Tablet enhancement */
  }
}
```

#### **3. Component-Based Architecture**
**Decision:** Reusable UI components with props and state
**Example:**
```typescript
// Reusable Card component
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      {children}
    </div>
  );
};
```

#### **4. API-First Development**
**Decision:** Design APIs before implementing frontend
**Benefits:**
- Clear data contracts
- Parallel frontend/backend development
- Easy testing and documentation
- Future mobile app compatibility

## Security Architecture

### **Frontend Security:**
- **XSS Prevention:** React's built-in protection against cross-site scripting
- **CSRF Protection:** Django's CSRF middleware for form submissions
- **Input Validation:** Client-side validation with server-side verification
- **Secure Storage:** JWT tokens in httpOnly cookies (production)

### **Backend Security:**
- **Authentication:** JWT token-based authentication
- **Authorization:** Role-based permissions (admin, user, etc.)
- **SQL Injection Prevention:** Django ORM's built-in protection
- **CORS Configuration:** Controlled cross-origin resource sharing
- **Input Sanitization:** Django's form validation and serializers

### **Database Security:**
- **Data Validation:** Model-level constraints and validations
- **Secure Connections:** SSL/TLS for database connections in production
- **Backup Strategy:** Regular automated backups
- **Access Control:** Minimal necessary database permissions

## Performance Optimization

### **Frontend Optimizations:**
```typescript
// Lazy loading for better performance
const HomePage = lazy(() => import('./components/HomePage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));

// Memoization for expensive calculations
const expensiveCalculation = useMemo(() => {
  return processLargeDataset(data);
}, [data]);

// Debounced search to reduce API calls
const debouncedSearch = useCallback(
  debounce((query: string) => {
    searchResources(query);
  }, 300),
  []
);
```

### **Backend Optimizations:**
```python
# Database query optimization
class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.select_related('category').prefetch_related('tags')
    
    # Pagination for large datasets
    pagination_class = StandardResultsSetPagination
    
    # Filtering and search
    filter_backends = [DjangoFilterBackend, SearchFilter]
    search_fields = ['title', 'description', 'content']
```

### **Caching Strategy:**
- **Frontend:** Browser caching for static assets
- **Backend:** Django's caching framework for database queries
- **CDN:** Content delivery network for media files (production)
- **API Caching:** Response caching for frequently accessed data

## Scalability Considerations

### **Horizontal Scaling Ready:**
- **Stateless Backend:** No server-side sessions (JWT tokens)
- **Database Separation:** Can split read/write databases
- **API Design:** RESTful APIs easy to load balance
- **Static Assets:** Can be served from CDN

### **Monitoring and Analytics:**
```python
# Example logging configuration
LOGGING = {
    'version': 1,
    'handlers': {
        'file': {
            'class': 'logging.FileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
        },
    },
}
```

## Technology Choices Justification

### **Why React.js?**
- **Large Ecosystem:** Extensive library support
- **Performance:** Virtual DOM for efficient updates
- **Developer Experience:** Excellent debugging tools
- **Community:** Large community and learning resources
- **Future-Proof:** Actively maintained by Meta/Facebook

### **Why Django?**
- **Batteries Included:** Built-in admin, ORM, authentication
- **Security:** Security best practices built-in
- **Scalability:** Used by Instagram, Spotify, YouTube
- **Python Ecosystem:** Access to AI/ML libraries for future features
- **Documentation:** Excellent documentation and community

### **Why Tailwind CSS?**
- **Utility-First:** Faster development with utility classes
- **Consistency:** Design system built-in
- **Mobile-First:** Responsive design made easy
- **Small Bundle Size:** Only used utilities included in final build
- **Customization:** Easy to customize design tokens

---

**Next:** Learn about frontend implementation details → [05-Frontend-Documentation.md](05-Frontend-Documentation.md)