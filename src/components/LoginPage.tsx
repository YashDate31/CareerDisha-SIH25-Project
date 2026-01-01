import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Logo from './Logo';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import api from '../services/api';

interface LoginPageProps {
  onNavigate: (screen: string) => void;
  onLogin: (userData: any) => void;
}

export default function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login
        const response = await api.login({
          username: formData.email,
          password: formData.password
        });
        onLogin(response.user);
      } else {
        // For now, just simulate signup and login
        const response = await api.login({
          username: formData.email,
          password: formData.password
        });
        onLogin(response.user);
      }
      onNavigate('home');
    } catch (error) {
      console.error('Authentication failed:', error);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <Logo size="xl" showText={true} className="justify-center" />
          <p className="text-muted-foreground mt-4">
            Your personal career guide
          </p>
        </div>

        {/* Login/Signup Card */}
        <Card className="rounded-3xl border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl">
              {isLogin ? 'Welcome Back!' : 'Join CareerDisha'}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {isLogin ? 'Sign in to continue your journey' : 'Start your career discovery journey'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 rounded-xl"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 rounded-xl"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="flex justify-end">
                  <Button variant="link" className="text-primary text-sm p-0 h-auto">
                    Forgot Password?
                  </Button>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full rounded-xl py-3 bg-primary hover:bg-primary/90"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-muted-foreground text-sm">
                or
              </span>
            </div>

            {/* Social Login */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full rounded-xl py-3" size="lg">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button variant="outline" className="w-full rounded-xl py-3" size="lg">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.312-.623-.312-1.543c0-1.445.839-2.524 1.885-2.524.889 0 1.318.667 1.318 1.466 0 .893-.568 2.229-.861 3.467-.245 1.035.520 1.879 1.543 1.879 1.833 0 3.081-2.209 3.081-4.991 0-2.052-1.378-3.580-3.890-3.580-2.808 0-4.595 2.053-4.595 4.353 0 .794.279 1.352.703 1.776.199.240.199.334.136.550-.04.179-.127.497-.168.636-.061.179-.240.240-.419.179-1.332-.497-1.929-1.789-1.929-3.264 0-2.209 1.889-4.906 5.748-4.906 3.081 0 5.194 2.209 5.194 4.653 0 3.080-1.693 5.194-4.180 5.194-.839 0-1.629-.458-1.889-1.013l-.520 2.209c-.199.708-.520 1.352-.781 1.929-.520-.160-1.040-.360-1.540-.520z"/>
                </svg>
                Continue with Facebook
              </Button>
            </div>

            {/* Toggle Login/Signup */}
            <div className="text-center">
              <span className="text-muted-foreground text-sm">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </span>
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary font-medium ml-1 p-0 h-auto"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Button variant="link" className="text-primary text-xs p-0 h-auto">
            Terms of Service
          </Button>{' '}
          and{' '}
          <Button variant="link" className="text-primary text-xs p-0 h-auto">
            Privacy Policy
          </Button>
        </div>
      </div>
    </div>
  );
}