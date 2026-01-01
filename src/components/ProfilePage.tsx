import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { User, BookOpen, Download, Edit, Settings, Star, Calendar, Award, Camera, MapPin, Phone, Mail, GraduationCap, Target, Linkedin, Github, FileText, Upload, Link } from 'lucide-react';
import api from '../services/api';
import { toast } from 'sonner';

interface ProfilePageProps {
  onNavigate: (screen: string) => void;
  user: any;
  onUpdateUser?: (next: any) => void;
}

export default function ProfilePage({ onNavigate, user, onUpdateUser }: ProfilePageProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || 'Student Name',
    email: user?.email || 'student@example.com',
    phone: user?.phone || '+91 98765 43210',
    location: user?.location || 'Mumbai, Maharashtra',
    bio: user?.bio || 'Aspiring student exploring career opportunities in technology and innovation.',
    interests: user?.interests || 'Technology, Science, Innovation',
    goals: user?.goals || 'To become a software engineer and contribute to meaningful projects',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  });

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await api.updateProfile(editedProfile);

      const updatedUser = { ...user, ...editedProfile };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdateUser?.(updatedUser);

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      toast.success(`Resume "${e.target.files[0].name}" uploaded!`);
    }
  };

  const quizResults = [
    {
      id: 1,
      name: 'Science Aptitude Quiz',
      result: 'Doctor / Medical Professional',
      score: '85%',
      date: '15 Dec 2024',
      badge: 'High Match'
    },
    {
      id: 2,
      name: 'Technology Interest Assessment',
      result: 'Software Engineer',
      score: '78%',
      date: '10 Dec 2024',
      badge: 'Good Match'
    },
    {
      id: 3,
      name: 'Creative Skills Evaluation',
      result: 'Graphic Designer',
      score: '72%',
      date: '5 Dec 2024',
      badge: 'Moderate Match'
    }
  ];

  const bookmarkedResources = [
    {
      id: 1,
      title: 'Introduction to Engineering Careers',
      type: 'Video',
      duration: '8 min',
      category: 'Career Guidance'
    },
    {
      id: 2,
      title: 'Top 10 Emerging Jobs',
      type: 'Article',
      duration: '5 min read',
      category: 'Future Careers'
    }
  ];

  const getScoreBadgeColor = (badge: string) => {
    switch (badge) {
      case 'High Match': return 'bg-green-100 text-green-700';
      case 'Good Match': return 'bg-blue-100 text-blue-700';
      case 'Moderate Match': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'pdf': return '📚';
      default: return '📖';
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6 pb-24">
      {/* Profile Header */}
      <Card className="rounded-3xl border-none shadow-lg bg-gradient-to-br from-white to-gray-50 overflow-hidden">
        <div className="h-24 bg-primary/10 w-full relative">
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm" className="rounded-full h-8 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-xs font-medium text-gray-500 uppercase">Name</Label>
                      <Input
                        id="name"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="email" className="text-xs font-medium text-gray-500 uppercase">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editedProfile.email}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className="rounded-xl mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs font-medium text-gray-500 uppercase">Phone</Label>
                        <Input
                          id="phone"
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          className="rounded-xl mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-xs font-medium text-gray-500 uppercase">Location</Label>
                      <Input
                        id="location"
                        value={editedProfile.location}
                        onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio" className="text-xs font-medium text-gray-500 uppercase">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editedProfile.bio}
                        onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                        rows={3}
                        className="rounded-xl mt-1 resize-none"
                      />
                    </div>
                    <div>
                      <Label htmlFor="interests" className="text-xs font-medium text-gray-500 uppercase">Interests</Label>
                      <Input
                        id="interests"
                        value={editedProfile.interests}
                        onChange={(e) => setEditedProfile({ ...editedProfile, interests: e.target.value })}
                        className="rounded-xl mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goals" className="text-xs font-medium text-gray-500 uppercase">Career Goals</Label>
                      <Textarea
                        id="goals"
                        value={editedProfile.goals}
                        onChange={(e) => setEditedProfile({ ...editedProfile, goals: e.target.value })}
                        rows={2}
                        className="rounded-xl mt-1 resize-none"
                      />
                    </div>
                    {/* Social Links */}
                    <div className="space-y-3 pt-2 border-t">
                      <h4 className="text-sm font-semibold">Social Links</h4>
                      <div>
                        <div className="relative">
                          <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <Input
                            className="pl-9 rounded-xl"
                            placeholder="LinkedIn URL"
                            value={editedProfile.linkedin}
                            onChange={(e) => setEditedProfile({ ...editedProfile, linkedin: e.target.value })}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="relative">
                          <Github className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                          <Input
                            className="pl-9 rounded-xl"
                            placeholder="GitHub URL"
                            value={editedProfile.github}
                            onChange={(e) => setEditedProfile({ ...editedProfile, github: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button onClick={handleSaveProfile} className="flex-1 rounded-xl" disabled={isLoading}>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingProfile(false)} className="flex-1 rounded-xl">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" size="sm" className="rounded-full h-8 w-8 p-0 bg-white/50 backdrop-blur-sm hover:bg-white/80" onClick={() => onNavigate('settings')}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="flex justify-between items-start -mt-10 mb-4">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-sm">
                <AvatarImage src={user?.avatar} alt={editedProfile.name} />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  {editedProfile.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full p-0 bg-primary hover:bg-primary/90 border-2 border-white shadow-sm"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">{editedProfile.name}</h2>
            <p className="text-sm text-gray-500 font-medium mb-3">Student • Class 12</p>

            <div className="flex flex-col space-y-1.5 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {editedProfile.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {editedProfile.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {editedProfile.location}
              </div>
            </div>

            {/* Socials */}
            {(editedProfile.linkedin || editedProfile.github) && (
              <div className="flex items-center space-x-3 mb-4">
                {editedProfile.linkedin && (
                  <a href={editedProfile.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-[#0077b5] transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {editedProfile.github && (
                  <a href={editedProfile.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-black transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                )}
              </div>
            )}

            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
              {editedProfile.bio}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume Section */}
      <Card className="rounded-3xl border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <FileText className="w-5 h-5 text-primary" />
            <span>Resume / CV</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {resumeFile ? (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100 text-green-700">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="bg-white p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium truncate">{resumeFile.name}</span>
              </div>
              <Button variant="ghost" size="sm" className="text-green-700 hover:text-green-800 hover:bg-green-100" onClick={() => setResumeFile(null)}>
                ×
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleResumeUpload}
              />
              <div className="flex flex-col items-center space-y-2 text-gray-500">
                <div className="bg-gray-100 p-3 rounded-full">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-sm font-medium text-gray-900">Upload your Resume</div>
                <div className="text-xs">PDF, DOC up to 5MB</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests & Goals */}
      <div className="grid grid-cols-1 gap-4">
        <Card className="rounded-3xl border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="bg-orange-100 p-2 rounded-lg mr-3">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedProfile.interests.split(',').map((interest, i) => (
                <Badge key={i} variant="secondary" className="rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border-none px-3 py-1">
                  {interest.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-border shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Career Goals</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {editedProfile.goals}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Quizzes', value: '3', icon: Award, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Resources', value: '12', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Colleges', value: '5', icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-2xl border-none shadow-sm text-center py-3 bg-white">
            <div className="flex flex-col items-center justify-center p-2">
              <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>


      {/* Quiz Results Section */}
      <Card className="rounded-3xl border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-gray-100">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Recent Results</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => onNavigate('quiz')}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-4">
          {quizResults.map((result) => (
            <div key={result.id} className="p-4 bg-gray-50 rounded-2xl">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{result.name}</h4>
                  <p className="text-primary font-medium text-xs mt-0.5">
                    {result.result}
                  </p>
                </div>
                <Badge className={`text-[10px] px-2 py-0.5 rounded-full border-none shadow-none ${getScoreBadgeColor(result.badge)}`}>
                  {result.score}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {result.date}
                </div>
                <span className={`text-[10px] ${getScoreBadgeColor(result.badge).split(' ')[1]}`}>{result.badge}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-14 rounded-2xl flex items-center justify-center space-x-2 border-dashed border-2 hover:bg-gray-50 hover:border-primary/50"
        >
          <Download className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-600">Download CV</span>
        </Button>
        <Button
          variant="outline"
          className="h-14 rounded-2xl flex items-center justify-center space-x-2 border-dashed border-2 hover:bg-gray-50 hover:border-primary/50"
          onClick={() => window.open('https://linkedin.com', '_blank')}
        >
          <Linkedin className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">Connect</span>
        </Button>
      </div>
    </div>
  );
}