import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ExternalLink, Shield, UserCog } from 'lucide-react';

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Basic options and quick links</p>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">Admin Panel</div>
                <div className="text-xs text-muted-foreground">Add Colleges and Scholarships</div>
              </div>
            </div>
            <a href="/admin/" target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center gap-1">
              Open <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <div className="pt-2 border-t">
            <Button onClick={() => onNavigate('profile')} variant="outline" className="w-full">
              <UserCog className="w-4 h-4 mr-2" /> Back to Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
