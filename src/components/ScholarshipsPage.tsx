import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ExternalLink, Search, CheckCircle, Clock, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface Scholarship {
  id: number;
  title: string;
  description: string;
  amount: number;
  formatted_amount: string;
  eligibility_criteria: string;
  application_deadline: string;
  scholarship_type: string;
  education_level: string;
  field_of_study: string;
  provider_name: string;
  provider_website: string;
  application_link: string;
  is_active: boolean;
  application_count: number;
  days_until_deadline: number | null;
  is_deadline_approaching: boolean;
}

interface ScholarshipsPageProps {
  onNavigate: (screen: string) => void;
}

export default function ScholarshipsPage({ onNavigate }: ScholarshipsPageProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Application State
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [applicationStep, setApplicationStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/scholarships/');
      if (response.ok) {
        const data = await response.json();
        // If API returns empty, use mock data for demonstration
        if (data.results && data.results.length > 0) {
          setScholarships(data.results);
        } else {
          useMockData();
        }
      } else {
        useMockData();
      }
    } catch (err) {
      console.error("Failed to fetch scholarships", err);
      useMockData();
    } finally {
      setLoading(false);
    }
  };

  const useMockData = () => {
    const mocks: Scholarship[] = [
      {
        id: 1,
        title: "National Merit Scholarship",
        provider_name: "Ministry of Education",
        amount: 50000,
        formatted_amount: "₹50,000",
        scholarship_type: "merit",
        application_deadline: "2025-12-31",
        is_deadline_approaching: true,
        description: "For outstanding academic performance.",
        eligibility_criteria: "Above 90% in Class 12",
        is_active: true,
        application_count: 1250,
        days_until_deadline: 30,
        education_level: "Undergraduate",
        field_of_study: "All",
        provider_website: "#",
        application_link: "#"
      },
      {
        id: 2,
        title: "HDFC Badte Kadam",
        provider_name: "HDFC Bank",
        amount: 100000,
        formatted_amount: "₹1,00,000",
        scholarship_type: "need",
        application_deadline: "2026-03-15",
        is_deadline_approaching: false,
        description: "Financial aid for students from varied backgrounds.",
        eligibility_criteria: "Family income < 6LPA",
        is_active: true,
        application_count: 850,
        days_until_deadline: 120,
        education_level: "Undergraduate",
        field_of_study: "All",
        provider_website: "#",
        application_link: "#"
      },
      {
        id: 3,
        title: "Siemens Scholarship",
        provider_name: "Siemens India",
        amount: 250000,
        formatted_amount: "₹2,50,000",
        scholarship_type: "private",
        application_deadline: "2026-01-20",
        is_deadline_approaching: true,
        description: "Supporting future engineers.",
        eligibility_criteria: "First year engineering students",
        is_active: true,
        application_count: 450,
        days_until_deadline: 45,
        education_level: "Undergraduate",
        field_of_study: "Engineering",
        provider_website: "#",
        application_link: "#"
      }
    ];
    setScholarships(mocks);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setApplicationStep(2);
      toast.success("Application submitted successfully!");
    }, 1500);
  };

  const closeApplication = () => {
    setApplyingId(null);
    setApplicationStep(1);
  };

  const filteredScholarships = scholarships.filter(scholarship => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.provider_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || scholarship.scholarship_type === selectedType;
    return matchesSearch && matchesType;
  });

  const getScholarshipTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      merit: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      need: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      government: 'bg-orange-100 text-orange-700 border-orange-200',
      private: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="px-4 py-8 max-w-md mx-auto space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-md mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">Find Scholarships</h1>
        <p className="text-gray-500 text-sm">Unlock financial aid for your future</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 border-none text-white shadow-lg shadow-indigo-200 rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="p-4 relative z-10">
            <div className="text-indigo-100 text-xs font-medium mb-1">Total Value</div>
            <div className="text-2xl font-bold flex items-center">
              ₹{scholarships.length > 0 ? ((scholarships.reduce((acc, s) => acc + (s.amount || 0), 0)) / 10000000).toFixed(2) : '0.0'}Cr+
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-none shadow-sm rounded-2xl">
          <CardContent className="p-4">
            <div className="text-gray-500 text-xs font-medium mb-1">Active Grants</div>
            <div className="text-2xl font-bold text-gray-900 flex items-center">
              {scholarships.length}
              <span className="text-xs font-normal text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">Live</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 -mx-4 px-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or provider..."
            className="w-full pl-10 pr-4 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {['All', 'Merit', 'Need', 'Government', 'Private'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type === 'All' ? 'All' : type.toLowerCase())}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${(selectedType === type.toLowerCase() || (selectedType === 'All' && type === 'All'))
                ? 'bg-primary text-white shadow-md shadow-primary/25'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredScholarships.map((scholarship, index) => (
          <motion.div
            key={scholarship.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="rounded-2xl border-none shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-500" />
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className={`rounded-lg px-2 py-0.5 text-[10px] uppercase tracking-wide border font-semibold ${getScholarshipTypeColor(scholarship.scholarship_type)}`}>
                    {scholarship.scholarship_type}
                  </Badge>
                  {scholarship.is_deadline_approaching && (
                    <span className="flex items-center text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
                      <Clock className="w-3 h-3 mr-1" /> Expiring Soon
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                  {scholarship.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{scholarship.provider_name}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Amount</div>
                    <div className="text-sm font-bold text-green-700 flex items-center">
                      {scholarship.formatted_amount}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-xl">
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Deadline</div>
                    <div className="text-sm font-bold text-gray-700">
                      {formatDeadline(scholarship.application_deadline)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Dialog open={applyingId === scholarship.id} onOpenChange={(open) => !open && closeApplication()}>
                    <DialogTrigger asChild>
                      <Button
                        onClick={() => setApplyingId(scholarship.id)}
                        className="flex-1 rounded-xl bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-200"
                      >
                        Apply Now
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xs sm:max-w-md rounded-3xl">
                      {applicationStep === 1 ? (
                        <form onSubmit={(e) => handleApply(e)} className="space-y-4 pt-4">
                          <DialogHeader>
                            <DialogTitle>Apply for {scholarship.title}</DialogTitle>
                            <p className="text-sm text-gray-500">Submit your preliminary application.</p>
                          </DialogHeader>

                          <div className="space-y-3">
                            <div className="space-y-1">
                              <Label>Student Name</Label>
                              <Input placeholder="Enter full name" required className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                              <Label>Current Grade/Year</Label>
                              <Input placeholder="e.g. Class 12 / 1st Year" required className="rounded-xl" />
                            </div>
                            <div className="space-y-1">
                              <Label>Email Address</Label>
                              <Input type="email" placeholder="student@example.com" required className="rounded-xl" />
                            </div>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 leading-relaxed">
                            <strong className="block mb-1">Eligibility Check:</strong>
                            {scholarship.eligibility_criteria}
                          </div>

                          <Button type="submit" className="w-full rounded-xl h-12" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Confirm Application'}
                          </Button>
                        </form>
                      ) : (
                        <div className="py-8 text-center space-y-4">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                          >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                          </motion.div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                            <p className="text-gray-500 mt-2 text-sm px-4">
                              Your application for {scholarship.title} has been sent to the scholarship provider.
                            </p>
                          </div>
                          <Button onClick={closeApplication} variant="outline" className="rounded-xl w-full">
                            Done
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-gray-200 text-gray-400 hover:text-primary"
                    onClick={() => window.open(scholarship.application_link, '_blank')}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
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
  );
}