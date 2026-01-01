import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Filter, Star, ExternalLink, Users, GraduationCap, Phone, Mail, Search, ChevronRight } from 'lucide-react';

interface CollegesPageProps {
  onNavigate: (screen: string, data?: any) => void;
}

interface College {
  id: number;
  name: string;
  description: string;
  college_type: string;
  location: string;
  state: string;
  country: string;
  established_year: number;
  ranking: string;
  ranking_display: string;
  accreditation: string;
  total_students: number;
  tuition_fees: number;
  formatted_tuition_fees: string;
  acceptance_rate: number;
  popular_programs: string;
  admission_requirements: string;
  website: string;
  contact_email: string;
  contact_phone: string;
  campus_facilities: string;
  is_featured: boolean;
  view_count: number;
}

export default function CollegesPage({ onNavigate }: CollegesPageProps) {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/colleges/');
      if (!response.ok) {
        throw new Error('Failed to fetch colleges');
      }
      const data = await response.json();
      setColleges(data.results || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      college.popular_programs.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = selectedType === 'All' || college.college_type === selectedType;
    const matchesState = selectedState === 'All' || college.state === selectedState;

    return matchesSearch && matchesType && matchesState;
  });

  const collegeTypes = ['All', ...Array.from(new Set(colleges.map(c => c.college_type)))];
  const states = ['All', ...Array.from(new Set(colleges.map(c => c.state)))];

  const getCollegeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      engineering: 'bg-blue-100 text-blue-800',
      medical: 'bg-red-100 text-red-800',
      management: 'bg-green-100 text-green-800',
      law: 'bg-purple-100 text-purple-800',
      university: 'bg-indigo-100 text-indigo-800',
      arts: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getRankingColor = (ranking: string) => {
    const colors: Record<string, string> = {
      top_10: 'bg-yellow-100 text-yellow-800',
      top_50: 'bg-orange-100 text-orange-800',
      top_100: 'bg-blue-100 text-blue-800',
      top_500: 'bg-green-100 text-green-800',
      unranked: 'bg-gray-100 text-gray-800'
    };
    return colors[ranking] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <h1 className="text-xl font-semibold text-foreground">Loading Colleges...</h1>
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Colleges</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchColleges} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl font-semibold text-foreground">Top Colleges</h1>
        <p className="text-muted-foreground">Explore premium educational institutions</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-primary">{colleges.length}</h3>
            <p className="text-xs text-muted-foreground">Colleges</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-green-600">
              {colleges.filter(c => c.is_featured).length}
            </h3>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border">
          <CardContent className="p-3 text-center">
            <h3 className="text-xl font-semibold text-orange-600">
              {colleges.reduce((total, c) => total + (c.view_count || 0), 0)}
            </h3>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search colleges, locations, programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters {showFilters ? '▲' : '▼'}</span>
        </Button>

        {/* Filter Options */}
        {showFilters && (
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {collegeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredColleges.length} of {colleges.length} colleges
        </p>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="text-sm"
          >
            Clear search
          </Button>
        )}
      </div>

      {/* Colleges List */}
      <div className="space-y-4">
        {filteredColleges.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No colleges found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedType('All');
                setSelectedState('All');
              }}
              className="mt-2"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          filteredColleges.map((college) => (
            <Card key={college.id} className="hover:shadow-lg transition-shadow group cursor-pointer" onClick={() => onNavigate('college-detail', college)}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
                      {college.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Established {college.established_year}
                    </CardDescription>
                  </div>
                  {college.is_featured && (
                    <Badge variant="default" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge className={getCollegeTypeColor(college.college_type)}>
                    {college.college_type.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Badge className={getRankingColor(college.ranking)}>
                    {college.ranking_display}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {college.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">
                      {college.location}, {college.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span className="text-gray-600 line-clamp-1">
                      {college.popular_programs}
                    </span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button className="w-full bg-gray-50 text-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700" variant="ghost">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Back Button */}
      <div className="text-center pt-4">
        <Button variant="outline" onClick={() => onNavigate('home')}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}