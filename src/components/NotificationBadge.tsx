import React from 'react';

interface NotificationBadgeProps {
  count?: number;
  className?: string;
}

export default function NotificationBadge({ count = 0, className = '' }: NotificationBadgeProps) {
  if (count === 0) return null;
  
  return (
    <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center ${className}`}>
      {count > 99 ? '99+' : count}
    </span>
  );
}