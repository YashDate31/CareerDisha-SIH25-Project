import React from 'react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = '' }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className={`w-full border-t border-border text-sm text-muted-foreground ${className}`}>
      <div className="max-w-md mx-auto px-4 py-6 grid gap-4 grid-cols-3">
        <div>
          <div className="font-semibold text-foreground mb-2">Career Disha</div>
          <p className="text-xs">Guiding students and parents to informed career choices.</p>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-2">Links</div>
          <ul className="space-y-1 text-xs">
            <li><a href="/admin/" target="_blank" rel="noreferrer" className="hover:text-primary">Admin Panel</a></li>
            <li><a href="#" className="hover:text-primary">About Us</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-foreground mb-2">Contact</div>
          <ul className="space-y-1 text-xs">
            <li>Email: support@careerdisha.example</li>
            <li>Phone: +91-99999-99999</li>
            <li><a href="#" className="hover:text-primary">Privacy Policy</a> • <a href="#" className="hover:text-primary">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs py-3 border-t">© {year} Career Disha. All rights reserved.</div>
    </footer>
  );
}
