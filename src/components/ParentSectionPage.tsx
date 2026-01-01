import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Play, FileText, BookOpen, Clock, Download, Share2, ExternalLink } from 'lucide-react';
import api, { Video, Article } from '../services/api';
import Footer from './Footer';
import { convertToEmbedUrl, getYouTubeThumbnail } from '../utils/youtube';

interface ParentSectionPageProps {
  onNavigate: (screen: string) => void;
}

export default function ParentSectionPage({ onNavigate }: ParentSectionPageProps) {
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    loadParentResources();
  }, []);

  const loadParentResources = async () => {
    try {
      setLoading(true);
      const [parentVideos, parentArticles] = await Promise.all([
        api.getParentVideos(),
        api.getParentArticles()
      ]);
      setVideos(parentVideos);
      setArticles(parentArticles);
    } catch (error) {
      console.error('Failed to load parent resources:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Parent Guidance</h1>
        <p className="text-muted-foreground">
          Resources to help parents support their child's career journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-primary">25+</h3>
            <p className="text-xs text-muted-foreground">Videos</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-primary">40+</h3>
            <p className="text-xs text-muted-foreground">Articles</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-primary">15+</h3>
            <p className="text-xs text-muted-foreground">PDF Guides</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-xl">
          <TabsTrigger value="videos" className="rounded-lg">Videos</TabsTrigger>
          <TabsTrigger value="articles" className="rounded-lg">Articles</TabsTrigger>
          <TabsTrigger value="guides" className="rounded-lg">PDF Guides</TabsTrigger>
        </TabsList>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading videos...</p>
            </div>
          ) : (
            videos.map((video) => (
              <Card key={video.id} className="rounded-2xl border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedVideo(video)}>
                <CardContent className="p-4">
                  <div className="flex space-x-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-xl flex-shrink-0 overflow-hidden">
                      <img
                        src={getYouTubeThumbnail(video.youtube_url)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center hidden">
                        <Play className="w-6 h-6 text-primary" />
                      </div>
                      <Badge className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5">
                        {video.duration || '10 min'}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-sm leading-tight">
                        {video.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{video.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{(video as any).views || '1K views'}</span>
                        <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                          <Play className="w-3 h-3 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles" className="space-y-4 mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading articles...</p>
            </div>
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="rounded-2xl border-border hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedArticle(article)}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs rounded-full bg-green-100 text-green-700">
                      {(article as any).category || 'General'}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {(article as any).read_time || '5 min read'}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-foreground">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">{article.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">By {(article as any).author || 'Expert'}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="p-2 rounded-lg">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="rounded-lg bg-primary hover:bg-primary/90">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* PDF Guides Tab */}
        <TabsContent value="guides" className="space-y-4 mt-6">
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">PDF guides coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedVideo.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedVideo(null)}
                className="p-2"
              >
                ×
              </Button>
            </div>
            <div className="p-4">
              <iframe
                src={convertToEmbedUrl(selectedVideo.youtube_url)}
                className="w-full h-48 rounded-lg mb-4"
                frameBorder="0"
                allowFullScreen
                title={selectedVideo.title}
              />
              <p className="text-muted-foreground">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}

  {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedArticle.title}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
                className="p-2"
              >
                ×
              </Button>
            </div>
            <div className="p-4 space-y-4">
              <p className="text-muted-foreground">{selectedArticle.description}</p>
              <div className="prose prose-sm">
                <p>{selectedArticle.content || 'Article content would be displayed here...'}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open('#', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8">
        <div className="w-full border-t border-border text-sm text-muted-foreground">
          <div className="mx-auto py-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="font-semibold text-foreground mb-2">Career Disha</div>
              <p className="text-xs">Resources for parents to support their child's career journey.</p>
            </div>
            <div>
              <div className="font-semibold text-foreground mb-2">Quick Links</div>
              <ul className="space-y-1 text-xs">
                <li><a href="/admin/" target="_blank" rel="noreferrer" className="hover:text-primary">Admin Panel</a></li>
                <li><a href="#" className="hover:text-primary">Parent Resources</a></li>
                <li><a href="#" className="hover:text-primary">Support</a></li>
              </ul>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="font-semibold text-foreground mb-2">Contact & Support</div>
              <ul className="space-y-1 text-xs">
                <li>Email: parents@careerdisha.example</li>
                <li>Phone: +91-99999-99999</li>
                <li className="pt-1">
                  <a href="#" className="hover:text-primary">Parent Guide</a> • 
                  <a href="#" className="hover:text-primary ml-1">FAQ</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs py-3 border-t">
            © {new Date().getFullYear()} Career Disha. Empowering families in career decisions.
          </div>
        </div>
      </div>
    </div>
  );
}