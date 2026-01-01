import React, { useState } from 'react';
import { Button } from "./components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Home, MessageSquare, MapPin, BookOpen, Award, ArrowLeft } from 'lucide-react';
import Logo from './components/Logo';
import NotificationPanel from './components/NotificationPanel';
import SplashScreen from './components/SplashScreen';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import CareerQuizPage from './components/CareerQuizPage';
import ChatbotPage from './components/ChatbotPage';
import CollegesPage from './components/CollegesPage';
import CollegeDetailPage from './components/CollegeDetailPage';
import ResourcesPage from './components/ResourcesPage';
import ScholarshipsPage from './components/ScholarshipsPage';
import ParentSectionPage from './components/ParentSectionPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCollege, setSelectedCollege] = useState<any>(null);

  const [user, setUser] = useState(() => {
    // Check for existing user in localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [showSplash, setShowSplash] = useState(true);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', userData.access || 'mock-token');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleNavigate = (screen: string, data?: any) => {
    if (screen === 'college-detail' && data) {
      setSelectedCollege(data);
    }
    setCurrentScreen(screen);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  if (!user) {
    return <LoginPage onNavigate={setCurrentScreen} onLogin={handleLogin} />;
  }

  const screens: Record<string, React.ReactElement> = {
    home: <HomePage onNavigate={handleNavigate} />,
    quiz: <CareerQuizPage onNavigate={handleNavigate} />,
    chat: <ChatbotPage onNavigate={handleNavigate} />,
    colleges: <CollegesPage onNavigate={handleNavigate} />,
    'college-detail': <CollegeDetailPage college={selectedCollege} onBack={() => handleNavigate('colleges')} />,
    resources: <ResourcesPage onNavigate={handleNavigate} />,
    scholarships: <ScholarshipsPage onNavigate={handleNavigate} />,
    parents: <ParentSectionPage onNavigate={handleNavigate} />,
    settings: <SettingsPage onNavigate={handleNavigate} />,
    profile: <ProfilePage onNavigate={handleNavigate} user={user} onUpdateUser={setUser} />
  };

  const navigationItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'colleges', icon: MapPin, label: 'Colleges' },
    { id: 'resources', icon: BookOpen, label: 'Resources' },
    { id: 'scholarships', icon: Award, label: 'Scholarships' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      {currentScreen !== 'college-detail' && (
        <header className="bg-white border-b border-border px-4 py-3 sticky top-0 z-50">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              {currentScreen !== 'home' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentScreen('home')}
                  className="p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <Logo size="md" showText={true} />
            </div>

            <div className="flex items-center space-x-2">
              <NotificationPanel />
              <div className="relative group">
                <button
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setCurrentScreen('profile')}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-white text-sm">
                      {user?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`min-h-screen overflow-y-auto ${currentScreen !== 'college-detail' ? 'pb-28' : ''}`}>
        {screens[currentScreen]}
      </main>

      {/* Bottom Navigation */}
      {currentScreen !== 'college-detail' && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-40">
          <div className="max-w-md mx-auto px-2 py-2">
            <div className="flex justify-between items-center">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors min-w-0 flex-1 ${isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary'
                      }`}
                  >
                    <Icon className="w-5 h-5 mb-1 flex-shrink-0" />
                    <span className="text-xs font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}