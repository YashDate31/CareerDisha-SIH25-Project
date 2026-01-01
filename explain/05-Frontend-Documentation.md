# 05 - Frontend Implementation Guide 🎨

## React Component Architecture

CareerDisha's frontend follows modern React patterns with TypeScript for type safety and maintainability.

## Core Components Deep Dive

### **1. HomePage.tsx - Landing Page**

**Purpose:** Main entry point showcasing platform statistics and navigation

```typescript
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

const HomePage: React.FC = () => {
  const stats = [
    { title: "Students Guided", value: "50,000+", color: "text-blue-600" },
    { title: "Career Paths", value: "200+", color: "text-green-600" },
    { title: "Success Stories", value: "15,000+", color: "text-purple-600" },
    { title: "Expert Counselors", value: "100+", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">
            Your Career Journey Starts Here
          </h1>
          <p className="text-gray-600 mb-8">
            Discover your passion, explore career paths, and get personalized guidance
          </p>
          <Button className="bg-blue-600 text-white px-8 py-3 rounded-lg">
            Start Exploring
          </Button>
        </div>
      </section>

      {/* Statistics Grid */}
      <section className="px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-gray-600 text-sm mt-1">
                  {stat.title}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

**Key Features:**
- **Responsive Grid:** 2-column layout on mobile, expands on larger screens
- **Dynamic Statistics:** Stats rendered from array for easy maintenance
- **Gradient Background:** Modern visual appeal
- **Call-to-Action:** Clear primary action button

---

### **2. ResourcesPage.tsx - Content Library**

**Purpose:** Main resource hub for articles, videos, and PDFs with search/filter functionality

```typescript
import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, FileText, Download } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'article' | 'video' | 'pdf';
  category: string;
  url?: string;
  content?: string;
}

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch resources from API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        
        // Fetch different resource types
        const [articles, videos, pdfs] = await Promise.all([
          fetch('/api/articles/').then(res => res.json()),
          fetch('/api/videos/').then(res => res.json()),
          fetch('/api/pdfs/').then(res => res.json())
        ]);

        // Combine and format resources
        const allResources = [
          ...articles.results.map(item => ({ ...item, type: 'article' })),
          ...videos.results.map(item => ({ ...item, type: 'video' })),
          ...pdfs.results.map(item => ({ ...item, type: 'pdf' }))
        ];

        setResources(allResources);
        setFilteredResources(allResources);
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    let filtered = resources;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => 
        resource.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredResources(filtered);
  }, [searchQuery, selectedCategory, resources]);

  // Convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('youtube.com/watch?v=', 'youtube.com/embed/');
    } else if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return url;
  };

  // Resource type icons
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-5 w-5 text-red-600" />;
      case 'pdf':
        return <Download className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5 text-green-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Resource Library</h1>
          <p className="text-gray-600">Explore articles, videos, and guides</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {['all', 'career guidance', 'skills', 'engineering', 'medical'].map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Resource Grid */}
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="p-4">
              <div className="flex items-start space-x-3">
                {getResourceIcon(resource.type)}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{resource.title}</h3>
                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500 capitalize">
                      {resource.type}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => setSelectedResource(resource)}
                    >
                      {resource.type === 'video' ? 'Watch' : 'Read'}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Resource Modal */}
        {selectedResource && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold pr-4">{selectedResource.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedResource(null)}
                  >
                    ×
                  </Button>
                </div>

                {/* Modal Content */}
                {selectedResource.type === 'video' && selectedResource.url ? (
                  <div className="mb-4">
                    <iframe
                      src={convertToEmbedUrl(selectedResource.url)}
                      title={selectedResource.title}
                      className="w-full h-48 rounded"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedResource.content || selectedResource.description 
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
```

**Key Features:**
- **Multi-Type Content:** Handles articles, videos, and PDFs seamlessly
- **Search & Filter:** Real-time search with category filtering
- **Modal Display:** Full-screen modal for content viewing
- **YouTube Integration:** Automatic URL conversion to embed format
- **Responsive Design:** Mobile-first with overflow handling
- **Loading States:** Proper loading indicators for better UX

---

### **3. CareerQuizPage.tsx - Assessment System**

**Purpose:** Interactive career assessment with personalized recommendations

```typescript
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface QuizResult {
  category: string;
  score: number;
  careers: string[];
  description: string;
}

const CareerQuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/quizzes/');
        const data = await response.json();
        setQuestions(data.results || []);
      } catch (error) {
        console.error('Failed to fetch quiz questions:', error);
        // Fallback questions for demo
        setQuestions([
          {
            id: 1,
            question: "What type of work environment do you prefer?",
            options: [
              "Working alone with focus",
              "Collaborative team environment", 
              "Dynamic, fast-paced setting",
              "Structured, organized workplace"
            ],
            category: "work_style"
          },
          // ... more questions
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Handle answer selection
  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answerIndex
    }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      submitQuiz();
    }
  };

  // Submit quiz and get results
  const submitQuiz = async () => {
    try {
      const response = await fetch('/api/quizzes/submit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      const result = await response.json();
      setResults(result);
      setQuizComplete(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      // Fallback result for demo
      setResults({
        category: "Technology",
        score: 85,
        careers: ["Software Developer", "Data Scientist", "UX Designer"],
        description: "You show strong aptitude for technology-related careers..."
      });
      setQuizComplete(true);
    }
  };

  // Reset quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setQuizComplete(false);
    setResults(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-md mx-auto p-4">
        {!quizComplete ? (
          <>
            {/* Quiz Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">Career Assessment</h1>
              <p className="text-gray-600 mb-4">
                Discover your ideal career path with our personalized quiz
              </p>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                </div>
                <Progress 
                  value={((currentQuestion + 1) / questions.length) * 100}
                  className="h-2"
                />
              </div>
              
              <div className="text-sm text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
            </div>

            {/* Current Question */}
            {questions[currentQuestion] && (
              <Card className="p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  {questions[currentQuestion].question}
                </h2>
                
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left justify-start p-4 h-auto"
                      onClick={() => handleAnswer(index)}
                    >
                      <span className="mr-3 text-blue-600 font-semibold">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          /* Quiz Results */
          <div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-gray-600">Here are your personalized results</p>
            </div>

            {results && (
              <>
                {/* Score Display */}
                <Card className="p-6 mb-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {results.score}%
                  </div>
                  <div className="text-lg font-semibold mb-2">
                    {results.category} Match
                  </div>
                  <p className="text-gray-600 text-sm">
                    {results.description}
                  </p>
                </Card>

                {/* Career Recommendations */}
                <Card className="p-6 mb-6">
                  <h3 className="font-semibold mb-4">Recommended Careers</h3>
                  <div className="space-y-3">
                    {results.careers.map((career, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-blue-600 font-semibold mr-3">
                          {index + 1}.
                        </span>
                        {career}
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    onClick={() => {/* Navigate to detailed results */}}
                  >
                    View Detailed Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={restartQuiz}
                  >
                    Take Quiz Again
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerQuizPage;
```

**Key Features:**
- **Progressive Quiz Flow:** Step-by-step question navigation
- **Real-time Progress:** Visual progress bar and question counter
- **Dynamic Results:** Personalized career recommendations
- **Restart Functionality:** Option to retake the quiz
- **Responsive Design:** Optimized for mobile interaction

---

## State Management Patterns

### **Custom Hooks for API Calls**

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export const useApi = <T>(url: string): ApiState<T> => {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setState({ data, loading: false, error: null });
      } catch (error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    fetchData();
  }, [url]);

  return state;
};

// Usage in components
const ArticlesPage: React.FC = () => {
  const { data: articles, loading, error } = useApi<Article[]>('/api/articles/');
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <div>
      {articles?.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
};
```

### **Authentication Context**

```typescript
// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Validate token with backend
      validateToken(token).then(userData => {
        setUser(userData);
        setLoading(false);
      }).catch(() => {
        localStorage.removeItem('auth_token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const { token, user: userData } = await response.json();
        localStorage.setItem('auth_token', token);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

## UI Component Library

### **Custom Button Component**

```typescript
// components/ui/button.tsx
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
        ghost: "hover:bg-gray-100",
        link: "text-blue-600 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
```

**Benefits of This Approach:**
- **Consistent Design:** Unified button styles across the app
- **Type Safety:** TypeScript ensures correct prop usage
- **Flexible Variants:** Easy to add new button styles
- **Performance:** No runtime style calculations

## Styling Architecture

### **Tailwind CSS Configuration**

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ]
};
```

### **Global Styles**

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .card {
    @apply bg-white rounded-lg shadow-sm border border-gray-200 p-4;
  }
  
  .btn-primary {
    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors;
  }
  
  .loading-spinner {
    @apply animate-spin rounded-full border-b-2 border-blue-600;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}

/* Custom animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Performance Optimization Techniques

### **Code Splitting and Lazy Loading**

```typescript
// App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./components/HomePage'));
const ResourcesPage = lazy(() => import('./components/ResourcesPage'));
const CareerQuizPage = lazy(() => import('./components/CareerQuizPage'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/quiz" element={<CareerQuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
```

### **Memoization for Expensive Operations**

```typescript
// Optimized search functionality
import React, { useMemo, useCallback } from 'react';
import { debounce } from 'lodash';

const SearchableList: React.FC<{ items: any[] }> = ({ items }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Memoize filtered results
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    return items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);
  
  // Debounce search input
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300),
    []
  );
  
  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />
      
      {filteredItems.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
```

---

**Next:** Learn about backend implementation → [06-Backend-Documentation.md](06-Backend-Documentation.md)