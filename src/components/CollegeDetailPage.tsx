import React, { useState } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    MapPin,
    Star,
    Users,
    GraduationCap,
    Phone,
    Mail,
    Globe,
    CheckCircle,
    ArrowLeft,
    Share2,
    Calendar,
    DollarSign,
    Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
    image?: string; // Optional image for realism
}

interface CollegeDetailPageProps {
    college: College;
    onBack: () => void;
}

export default function CollegeDetailPage({ college, onBack }: CollegeDetailPageProps) {
    const [isApplying, setIsApplying] = useState(false);
    const [applicationStep, setApplicationStep] = useState(1);
    const [showConfetti, setShowConfetti] = useState(false);

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault();
        setIsApplying(true);

        // Simulate API delay
        setTimeout(() => {
            setIsApplying(false);
            setApplicationStep(2); // Show success
            setShowConfetti(true);
            toast.success(`Application sent to ${college.name}!`);
        }, 1500);
    };

    const facilities = college.campus_facilities.split(',').map(f => f.trim());
    const programs = college.popular_programs.split(',').map(p => p.trim());

    return (
        <div className="bg-gray-50 min-h-screen pb-20 relative">
            {/* Header Image Area */}
            <div className="relative h-48 bg-gray-900">
                <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    alt={college.name}
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute top-4 left-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onBack}
                        className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border-none"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pt-12">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-start justify-between">
                            <div>
                                <Badge className="bg-yellow-500/90 text-yellow-950 hover:bg-yellow-500 mb-2 border-none">
                                    {college.ranking_display}
                                </Badge>
                                <h1 className="text-2xl font-bold text-white leading-tight mb-1">{college.name}</h1>
                                <div className="flex items-center text-gray-300 text-xs">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {college.location}, {college.state}
                                </div>
                            </div>
                            <div className="bg-white p-2 rounded-xl shadow-lg">
                                <img src={`https://ui-avatars.com/api/?name=${college.name}&background=random&size=128`} className="w-10 h-10 rounded-lg" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 -mt-4 relative z-10 space-y-4">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-2">
                    <Card className="rounded-xl border-none shadow-sm bg-white">
                        <CardContent className="p-3 text-center">
                            <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">Fees</div>
                            <div className="font-bold text-sm text-gray-900">{college.formatted_tuition_fees}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border-none shadow-sm bg-white">
                        <CardContent className="p-3 text-center">
                            <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">Students</div>
                            <div className="font-bold text-sm text-gray-900">{college.total_students.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-xl border-none shadow-sm bg-white">
                        <CardContent className="p-3 text-center">
                            <Trophy className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                            <div className="text-xs text-muted-foreground">Acceptance</div>
                            <div className="font-bold text-sm text-gray-900">{college.acceptance_rate}%</div>
                        </CardContent>
                    </Card>
                </div>

                {/* About */}
                <Card className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-5">
                        <h2 className="font-semibold text-gray-900 mb-3">About Institute</h2>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                            {college.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs border-blue-200 bg-blue-50 text-blue-700">
                                Est. {college.established_year}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-purple-200 bg-purple-50 text-purple-700">
                                {college.accreditation}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-green-200 bg-green-50 text-green-700">
                                {college.college_type.toUpperCase()}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Programs */}
                <Card className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900">Popular Programs</h2>
                            <span className="text-xs text-primary font-medium">View All</span>
                        </div>
                        <div className="space-y-2">
                            {programs.map((program, i) => (
                                <div key={i} className="flex items-center p-3 bg-gray-50 rounded-xl">
                                    <GraduationCap className="w-5 h-5 text-indigo-500 mr-3" />
                                    <span className="text-sm font-medium text-gray-700">{program}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Facilities */}
                <Card className="rounded-2xl border-none shadow-sm">
                    <CardContent className="p-5">
                        <h2 className="font-semibold text-gray-900 mb-3">Campus Facilities</h2>
                        <div className="flex flex-wrap gap-2">
                            {facilities.map((facility, i) => (
                                <span key={i} className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg">
                                    {facility}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="rounded-2xl border-none shadow-sm mb-8">
                    <CardContent className="p-5 space-y-3">
                        <h2 className="font-semibold text-gray-900 mb-2">Admissions & Contact</h2>
                        <div className="flex items-center text-sm">
                            <Globe className="w-4 h-4 text-gray-400 mr-3" />
                            <a href={college.website} target="_blank" className="text-blue-600 underline truncate">{college.website}</a>
                        </div>
                        <div className="flex items-center text-sm">
                            <Phone className="w-4 h-4 text-gray-400 mr-3" />
                            <a href={`tel:${college.contact_phone}`} className="text-gray-700">{college.contact_phone}</a>
                        </div>
                        <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 text-gray-400 mr-3" />
                            <a href={`mailto:${college.contact_email}`} className="text-gray-700">{college.contact_email}</a>
                        </div>
                        <div className="mt-2 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                            <div className="text-xs font-semibold text-orange-800 mb-1">Requirements</div>
                            <p className="text-xs text-orange-700 leading-snug">{college.admission_requirements}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 max-w-md mx-auto z-50">
                <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 rounded-xl h-12 border-gray-200 text-gray-600">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="flex-[2] rounded-xl h-12 bg-primary hover:bg-primary/90 text-white font-bold text-base shadow-lg shadow-primary/20">
                                Apply Now
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs sm:max-w-md rounded-3xl">
                            {applicationStep === 1 ? (
                                <form onSubmit={handleApply} className="space-y-4 pt-4">
                                    <DialogHeader>
                                        <DialogTitle>Apply to {college.name}</DialogTitle>
                                        <p className="text-sm text-gray-500">Fast-track your application request.</p>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                        <div className="space-y-1">
                                            <Label>Full Name</Label>
                                            <Input placeholder="Enter your name" required className="rounded-xl" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Phone Number</Label>
                                            <Input placeholder="+91" type="tel" required className="rounded-xl" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Course of Interest</Label>
                                            <Input placeholder="e.g. Computer Science" required className="rounded-xl" />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full rounded-xl h-12 mt-2" disabled={isApplying}>
                                        {isApplying ? 'Sending Request...' : 'Submit Application Simulation'}
                                    </Button>
                                    <p className="text-xs text-center text-gray-400">
                                        * This is a demo. No real application is sent.
                                    </p>
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
                                        <h3 className="text-xl font-bold text-gray-900">Request Sent!</h3>
                                        <p className="text-gray-500 mt-2">
                                            The college counselors will contact you shortly.
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setApplicationStep(1)}
                                        variant="outline"
                                        className="rounded-xl"
                                    >
                                        Close
                                    </Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
