import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-sm' },
    md: { icon: 'w-8 h-8', text: 'text-lg' },
    lg: { icon: 'w-12 h-12', text: 'text-xl' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl' }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizes[size].icon} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Compass Circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="url(#gradient2)"
          />
          
          {/* Compass Needle */}
          <path
            d="M20 8L24 16L20 14L16 16L20 8Z"
            fill="#2563EB"
          />
          <path
            d="M20 32L16 24L20 26L24 24L20 32Z"
            fill="#60A5FA"
          />
          
          {/* Center Dot */}
          <circle
            cx="20"
            cy="20"
            r="2"
            fill="#2563EB"
          />
          
          {/* Direction Lines */}
          <line
            x1="20"
            y1="4"
            x2="20"
            y2="8"
            stroke="#2563EB"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="36"
            y1="20"
            x2="32"
            y2="20"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="20"
            y1="36"
            x2="20"
            y2="32"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="4"
            y1="20"
            x2="8"
            y2="20"
            stroke="#60A5FA"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          
          {/* Graduation Cap Element */}
          <path
            d="M12 12L20 9L28 12L20 15L12 12Z"
            fill="#2563EB"
            opacity="0.8"
          />
          <path
            d="M28 12V16C28 17 24 18 20 18C16 18 12 17 12 16V12"
            stroke="#2563EB"
            strokeWidth="1"
            fill="none"
          />
          
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EBF4FF" />
              <stop offset="100%" stopColor="#DBEAFE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-primary ${sizes[size].text} leading-none`}>
            Career
          </span>
          <span className={`font-bold text-primary ${sizes[size].text} leading-none -mt-1`}>
            Disha
          </span>
        </div>
      )}
    </div>
  );
}