import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Play, FileText, BookOpen, Clock, Download, Search, ChevronRight, X, Bookmark } from 'lucide-react';
import api, { Video, PDFResource, Article } from '../services/api';
import { convertToEmbedUrl } from '../utils/youtube';
import Footer from './Footer';
import { motion } from 'framer-motion';

interface ResourcesPageProps {
  onNavigate: (screen: string) => void;
}

interface ResourceItem {
  id: number;
  type: 'video' | 'pdf' | 'article';
  duration: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  url?: string;
  file?: string;
  content?: string;
  thumbnail?: string;
}

export default function ResourcesPage({ onNavigate }: ResourcesPageProps) {
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(new Set([1, 3]));
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);

      const [videos, pdfs, articles] = await Promise.all([
        api.getVideos().catch(() => []),
        api.getPDFs().catch(() => []),
        api.getArticles().catch(() => [])
      ]);

      const combinedResources: ResourceItem[] = [
        ...videos.map((video: Video) => ({
          id: video.id,
          type: 'video' as const,
          duration: video.duration || '5 min',
          title: video.title,
          description: video.description || '',
          icon: Play,
          color: 'bg-red-500',
          url: video.youtube_url,
          thumbnail: `https://img.youtube.com/vi/${video.youtube_url.split('v=')[1]}/0.jpg`
        })),
        ...pdfs.map((pdf: PDFResource) => ({
          id: pdf.id + 1000,
          type: 'pdf' as const,
          duration: pdf.pages || '12 pages',
          title: pdf.title,
          description: pdf.description || '',
          icon: FileText,
          color: 'bg-blue-500',
          file: pdf.file
        })),
        ...articles.map((article: Article) => ({
          id: article.id + 2000,
          type: 'article' as const,
          duration: '5 min read',
          title: article.title,
          description: article.description,
          icon: BookOpen,
          color: 'bg-green-500',
          content: article.content
        }))
      ];

      setResources(combinedResources);

      // Fallback to mocks if no data
      if (combinedResources.length === 0) {
        setResources(getMockResources());
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
      setResources(getMockResources());
    } finally {
      setLoading(false);
    }
  };

  const getMockResources = (): ResourceItem[] => [
    {
      id: 1, type: 'video', duration: '12 min', title: 'Day in Life of a Software Engineer at Google',
      description: 'See what it is really like to work at a top tech company.',
      icon: Play, color: 'bg-red-500',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80'
    },
    {
      id: 2, type: 'pdf', duration: '45 pages', title: 'Complete JEE Mains 2026 Syllabus Guide',
      description: 'Detailed topic-wise breakdown for Physics, Chemistry, and Maths.',
      icon: FileText, color: 'bg-blue-500',
      file: '#'
    },
    {
      id: 3, type: 'article', duration: '8 min read', title: 'Top 10 Emerging Careers in India (2025)',
      description: 'Explore new fields like AI, Green Energy, and Biotech.',
      icon: BookOpen, color: 'bg-green-500',
      content: 'Artificial Intelligence and Machine Learning are transforming industries...'
    },
    {
      id: 4, type: 'video', duration: '15 min', title: 'NEET Preparation Strategy by Toppers',
      description: 'Tips and tricks to crack the medical entrance exam.',
      icon: Play, color: 'bg-red-500',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80'
    }
  ];

  const toggleBookmark = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' ||
      (activeTab === 'Watch' && r.type === 'video') ||
      (activeTab === 'Read' && (r.type === 'article' || r.type === 'pdf'));
    return matchesSearch && matchesTab;
  });

  const featuredResource = resources.find(r => r.type === 'video') || resources[0];

  if (loading) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto space-y-4">
        <div className="h-64 bg-gray-100 rounded-3xl animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map(i => <div key={i} className="h-10 w-20 bg-gray-100 rounded-full animate-pulse" />)}
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search library..."
            className="w-full pl-10 pr-4 h-10 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-primary/20 outline-none text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Featured Section */}
        {!searchTerm && featuredResource && (
          <div className="p-4 pb-2">
            <div
              className="relative h-64 rounded-3xl overflow-hidden shadow-lg cursor-pointer group"
              onClick={() => setSelectedResource(featuredResource)}
            >
              {featuredResource.thumbnail ? (
                <img src={featuredResource.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className={`w-full h-full ${featuredResource.color} flex items-center justify-center`}>
                  <featuredResource.icon className="w-16 h-16 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                <Badge className="self-start mb-2 bg-primary text-white border-none">Featured</Badge>
                <h2 className="text-white font-bold text-xl leading-tight mb-1">{featuredResource.title}</h2>
                <div className="flex items-center text-gray-300 text-xs gap-3">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {featuredResource.duration}</span>
                  <span className="capitalize">{featuredResource.type}</span>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white fill-current" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 px-4 py-4 overflow-x-auto no-scrollbar">
          {['All', 'Watch', 'Read'].map(tab =>
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === tab
                  ? 'bg-gray-900 text-white shadow-lg shadow-gray-400/50'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {tab}
            </button>
          )}
        </div>

        {/* List Grid */}
        <div className="px-4 space-y-4">
          <h3 className="font-bold text-gray-900 text-lg">Latest Resources</h3>
          <div className="grid gap-4">
            {filteredResources.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white group rounded-2xl"
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex p-3 gap-4">
                    <div className={`w-24 h-24 rounded-xl flex-shrink-0 relative overflow-hidden ${resource.color}`}>
                      {resource.thumbnail ? (
                        <img src={resource.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <resource.icon className="w-8 h-8 text-white/70" />
                        </div>
                      )}
                      {resource.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                            <Play className="w-3 h-3 text-black fill-current ml-0.5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider mb-1 bg-gray-100 text-gray-500">
                          {resource.type}
                        </Badge>
                        <button onClick={(e) => toggleBookmark(e, resource.id)} className="text-gray-400 hover:text-primary transition-colors">
                          <Bookmark className={`w-4 h-4 ${bookmarkedItems.has(resource.id) ? 'fill-current text-primary' : ''}`} />
                        </button>
                      </div>

                      <h4 className="font-semibold text-gray-900 leading-tight line-clamp-2 mb-auto">
                        {resource.title}
                      </h4>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {resource.duration}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center pt-8 pb-4">
            <Button variant="ghost" onClick={() => onNavigate('home')} className="text-muted-foreground hover:text-foreground">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Reader/Player Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${selectedResource.color} bg-opacity-10 text-${selectedResource.color.split('-')[1]}-600`}>
                  <selectedResource.icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm truncate max-w-[200px]">{selectedResource.type === 'pdf' ? 'Document Viewer' : selectedResource.type === 'video' ? 'Video Player' : 'Article Reader'}</span>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100" onClick={() => setSelectedResource(null)}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50">
              {selectedResource.type === 'video' && selectedResource.url ? (
                <div className="w-full aspect-video bg-black">
                  <iframe
                    src={convertToEmbedUrl(selectedResource.url)}
                    className="w-full h-full"
                    allowFullScreen
                    title={selectedResource.title}
                  />
                </div>
              ) : selectedResource.type === 'pdf' ? (
                <div className="flex flex-col items-center justify-center p-12 text-center h-full">
                  <FileText className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedResource.title}</h3>
                  <p className="text-sm text-gray-500 mb-6">This document is ready for download.</p>
                  <Button onClick={() => window.open(selectedResource.file, '_blank')} className="rounded-xl">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </Button>
                </div>
              ) : (
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedResource.title}</h2>
                  <div className="text-sm text-gray-500 mb-6 flex items-center gap-4 border-b border-gray-100 pb-4">
                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {selectedResource.duration}</span>
                    <span>•</span>
                    <span>CareerDisha Editorial</span>
                  </div>
                  <div className="prose prose-gray prose-sm max-w-none">
                    <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                      {selectedResource.content || selectedResource.description || "The full content of this article is currently being updated by our editorial team. Please check back shortly for the complete guide."}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {selectedResource.type !== 'pdf' && (
              <div className="p-4 border-t bg-white flex justify-between items-center text-xs text-gray-400">
                <span>Recommmended for you</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleBookmark({ stopPropagation: () => { } } as any, selectedResource.id)}>
                    {bookmarkedItems.has(selectedResource.id) ? 'Saved' : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}