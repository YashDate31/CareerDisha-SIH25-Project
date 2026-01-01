import React, { useEffect } from 'react';
import Logo from './Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Logo with animation */}
        <div className="animate-bounce">
          <Logo size="xl" showText={true} className="justify-center" />
        </div>
        
        {/* Tagline */}
        <div className="space-y-2 animate-slide-up">
          <h2 className="text-xl font-semibold text-foreground">
            Your Career Journey Starts Here
          </h2>
          <p className="text-muted-foreground">
            Discover, Learn, and Achieve Your Dreams
          </p>
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.5s both;
        }
      `}</style>
    </div>
  );
}