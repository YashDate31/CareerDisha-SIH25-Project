import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Play, Search, MapPin, BookOpen, Award, Users, Building, TrendingUp } from 'lucide-react';
import Footer from './Footer';

interface HomePageProps {
  onNavigate: (screen: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [stats, setStats] = useState({
    scholarships: 0,
    colleges: 0,
    videos: 0,
    articles: 0,
    totalApplications: 0
  });

  useEffect(() => {
    fetchRealTimeStats();
    // Update stats every 30 seconds for real-time effect
    const interval = setInterval(fetchRealTimeStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeStats = async () => {
    try {
      let scholarshipsCount = 0;
      let collegesCount = 0;
      let videosCount = 0;
      let articlesCount = 0;
      let totalApplications = 0;

      // Fetch scholarships
      try {
        const scholarshipsRes = await fetch('/api/scholarships/');
        if (scholarshipsRes.ok) {
          const scholarshipsData = await scholarshipsRes.json();
          const scholarships = scholarshipsData.results || scholarshipsData;
          scholarshipsCount = scholarships.length;
          totalApplications = scholarships.reduce((total: number, s: any) => total + (s.application_count || 0), 0);
        }
      } catch (e) {
        console.log('Failed to fetch scholarships');
      }

      // Fetch colleges
      try {
        const collegesRes = await fetch('/api/colleges/');
        if (collegesRes.ok) {
          const collegesData = await collegesRes.json();
          const colleges = collegesData.results || collegesData;
          collegesCount = colleges.length;
        }
      } catch (e) {
        console.log('Failed to fetch colleges');
      }

      // Fetch videos
      try {
        const videosRes = await fetch('/api/videos/');
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          const videos = videosData.results || videosData;
          videosCount = videos.length;
        }
      } catch (e) {
        console.log('Failed to fetch videos');
      }

      // Fetch articles
      try {
        const articlesRes = await fetch('/api/articles/');
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          const articles = articlesData.results || articlesData;
          articlesCount = articles.length;
        }
      } catch (e) {
        console.log('Failed to fetch articles');
      }

      setStats({
        scholarships: scholarshipsCount,
        colleges: collegesCount,
        videos: videosCount,
        articles: articlesCount,
        totalApplications
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const quickActions = [
    { id: 'quiz', icon: MapPin, title: 'Explore Careers', subtitle: 'Find your ideal profession', count: null },
    { id: 'colleges', icon: Building, title: 'Nearby Colleges', subtitle: `${stats.colleges} institutions available`, count: stats.colleges },
    { id: 'resources', icon: BookOpen, title: 'Resources', subtitle: `${stats.videos + stats.articles} materials`, count: stats.videos + stats.articles },
    { id: 'scholarships', icon: Award, title: 'Scholarships', subtitle: `${stats.scholarships} opportunities`, count: stats.scholarships },
    { id: 'parents', icon: Users, title: 'For Parents', subtitle: 'Guidance for supporting your child\'s career journey', count: null }
  ];

  return (
    <div className="px-4 py-6 pb-8 max-w-md mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1659080914827-85ce7868939f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBndWlkYW5jZSUyMHN0dWRlbnRzJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc1OTAzNDcxMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Students studying"
            className="w-full h-32 object-cover rounded-xl mb-4"
          />
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome Back! 👋
          </h1>
          <p className="text-muted-foreground mb-6">
            Ready to explore your career path today?
          </p>
          <Button 
            onClick={() => onNavigate('quiz')}
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3"
            size="lg"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Career Quiz
          </Button>
        </div>
      </div>

      {/* Real-Time Statistics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Live Statistics</h2>
          <TrendingUp className="w-5 h-5 text-green-600" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="rounded-2xl border-border">
            <CardContent className="p-3 text-center">
              <h3 className="text-xl font-bold text-blue-600">{stats.scholarships}</h3>
              <p className="text-xs text-muted-foreground">Scholarships</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-3 text-center">
              <h3 className="text-xl font-bold text-green-600">{stats.colleges}</h3>
              <p className="text-xs text-muted-foreground">Colleges</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border">
            <CardContent className="p-3 text-center">
              <h3 className="text-xl font-bold text-orange-600">{stats.totalApplications}</h3>
              <p className="text-xs text-muted-foreground">Applications</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.slice(0, 4).map((action, index) => {
            const Icon = action.icon;
            return (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow rounded-2xl border-border aspect-square"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="flex flex-col items-center justify-center text-center p-4 h-full">
                  <div className="bg-primary/10 p-3 rounded-xl mb-3">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                    <p className="text-xs text-muted-foreground leading-tight">{action.subtitle}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* For Parents - Full Width Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow rounded-2xl border-border"
          onClick={() => onNavigate('parents')}
        >
          <CardContent className="flex flex-col items-center justify-center text-center p-6">
            <div className="bg-primary/10 p-3 rounded-xl mb-3">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">For Parents</h3>
              <p className="text-sm text-muted-foreground">Guidance for supporting your child's career journey</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Slogans Section */}
      <div className="space-y-4 mb-6">
        <Card className="rounded-2xl border-border bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">✨ "Your Future Starts Here" ✨</h3>
            <p className="text-sm text-gray-600 italic">Discover your potential, explore endless possibilities, and shape your dreams into reality.</p>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-border bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 "Success is a Journey, Not a Destination"</h3>
            <p className="text-sm text-gray-600 italic">Every step you take today builds the career you'll have tomorrow.</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-semibold text-primary">{stats.totalApplications || '1K+'}</h3>
            <p className="text-sm text-muted-foreground">Applications Submitted</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-semibold text-primary">50K+</h3>
            <p className="text-sm text-muted-foreground">Students Helped</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Features Section */}
      <div className="space-y-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Why Choose CareerDisha?</h2>
        
        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Expert Guidance</h4>
                <p className="text-sm text-gray-600">Get personalized career recommendations from industry experts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Comprehensive Resources</h4>
                <p className="text-sm text-gray-600">Access thousands of educational materials and career guides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Real Opportunities</h4>
                <p className="text-sm text-gray-600">Connect with top colleges and scholarship programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Stories Section */}
      <div className="space-y-4 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Success Stories</h2>
        
        <Card className="rounded-2xl border-border bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700 italic">"CareerDisha helped me find the perfect engineering college. Their guidance was invaluable!"</p>
                <p className="text-xs text-gray-500 mt-1">- Priya S., Engineering Student</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-500 p-2 rounded-full">
                <Award className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700 italic">"Got a ₹2 lakh scholarship through their platform. Amazing support!"</p>
                <p className="text-xs text-gray-500 mt-1">- Rahul M., Medical Aspirant</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <Card className="rounded-2xl border-border bg-gradient-to-r from-primary/10 to-primary/20 mb-4">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Ready to Start Your Journey?</h3>
          <p className="text-sm text-gray-600 mb-4">Take our career assessment quiz and discover your ideal path!</p>
          <Button 
            onClick={() => onNavigate('quiz')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Start Career Quiz Now 🚀
          </Button>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-12 pt-8">
        <div className="w-full border-t border-border text-sm text-muted-foreground">
          <div className="mx-auto py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="font-semibold text-foreground mb-2">Career Disha</div>
              <p className="text-xs">Guiding students and parents to informed career choices.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-2">Quick Links</div>
              <ul className="space-y-1 text-xs">
                <li><a href="/admin/" target="_blank" rel="noreferrer" className="hover:text-primary">Admin Panel</a></li>
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="font-semibold text-foreground mb-2">Contact</div>
              <ul className="space-y-1 text-xs">
                <li>Email: support@careerdisha.example</li>
                <li>Phone: +91-99999-99999</li>
                <li className="pt-1">
                  <a href="#" className="hover:text-primary">Privacy Policy</a> • 
                  <a href="#" className="hover:text-primary ml-1">Terms of Service</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs py-3 border-t">
            © {new Date().getFullYear()} Career Disha. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}