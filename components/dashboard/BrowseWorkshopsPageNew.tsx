'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Share2, MapPin, Star, MessageCircle, Mail, Phone, Calendar, Clock, Users, ExternalLink } from 'lucide-react';

interface Registration {
  userId: string;
  status: 'booked' | 'attended' | 'interested' | 'cancelled';
  registeredAt: Date | string; // Can be Date object or ISO string
  registrationDetails?: {
    fullName?: string;
    email?: string;
    phone?: string;
    organization?: string;
    expectations?: string;
  };
}

interface Workshop {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: 'online' | 'offline' | 'hybrid';
  category: string;
  trainer: string;
  trainerName?: string;
  trainerBio?: string;
  trainerPhoto?: string;
  trainerIntroVideo?: string;
  trainerContact?: {
    email?: string;
    phone?: string;
  };
  maxCapacity: number;
  currentEnrollment: number;
  poster?: string;
  locationDetails?: {
    address?: string;
    city?: string;
    state?: string;
    mapUrl?: string;
  };
  averageRating: number;
  totalRatings: number;
  feedbackComments?: {
    userId: string;
    userName: string;
    userAvatar?: string;
    comment: string;
    rating: number;
    createdAt: string;
  }[];
  workshopFeatures?: string[];
  learningObjectives?: string[];
  workshopMetrics?: {
    attendeeSatisfaction?: string;
    skillsGained?: string[];
    careerImpact?: string;
  };
  likes: string[];
  shares: number;
  registrations: Registration[];
  zoomJoinUrl?: string;
  recordingUrl?: string;
}

interface Certificate {
  _id: string;
  workshopTitle: string;
  downloadUrl?: string;
  issuedDate: string;
}

interface Testimonial {
  _id: string;
  text: string;
  rating: number;
  userName: string;
}

export function BrowseWorkshopsPageNewContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams?.get('status') || 'all';
  
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(statusParam);
  const [registrationSuccess, setRegistrationSuccess] = useState<{ show: boolean; message: string; workshopTitle: string }>({ show: false, message: '', workshopTitle: '' });
  const [registrationError, setRegistrationError] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [expandedWorkshop, setExpandedWorkshop] = useState<Workshop | null>(null);
  const [expandedModalOpen, setExpandedModalOpen] = useState(false);

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    organization: 'Happiness Inc.',
    expectations: 'Learn more about happiness and well-being.',
  });

  useEffect(() => {
    if (user) {
      setRegForm(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.company || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      console.log('[FETCH] Fetching workshops...');
      const res = await fetch('/api/workshops');
      if (res.ok) {
        const data = await res.json();
        console.log('[FETCH] Workshops received:', data.length, 'workshops');
        console.log('[FETCH] Sample workshop registrations:', data[0]?.registrations);
        setWorkshops(data);
        setFilteredWorkshops(data);
      }
    } catch (error) {
      console.error('[FETCH] Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = workshops;

    console.log('[FILTER] Active tab:', activeTab);
    console.log('[FILTER] User ID:', user?._id);
    console.log('[FILTER] Total workshops:', workshops.length);

    // Filter by tab status
    if (activeTab === 'booked') {
      filtered = filtered.filter(w => {
        const hasBooking = w.registrations.some(r => {
          console.log('[FILTER] Checking registration:', r.userId, '===', user?._id, '&& status:', r.status);
          return r.userId === user?._id && r.status === 'booked';
        });
        return hasBooking;
      });
      console.log('[FILTER] Booked workshops:', filtered.length);
    } else if (activeTab === 'attended') {
      filtered = filtered.filter(w => 
        w.registrations.some(r => r.userId === user?._id && r.status === 'attended')
      );
      console.log('[FILTER] Attended workshops:', filtered.length);
    } else if (activeTab === 'interested') {
      filtered = filtered.filter(w => {
        const hasInterest = w.registrations.some(r => {
          console.log('[FILTER] Checking interested:', r.userId, '===', user?._id, '&& status:', r.status);
          return r.userId === user?._id && r.status === 'interested';
        });
        return hasInterest;
      });
      console.log('[FILTER] Interested workshops:', filtered.length);
    }

    // Filter by mode
    if (filterMode !== 'all') {
      filtered = filtered.filter(w => w.mode === filterMode);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(w => w.category === filterCategory);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWorkshops(filtered);
  }, [filterMode, filterCategory, searchTerm, workshops, activeTab, user]);

  const handleRegister = async (workshopId: string, status: 'booked' | 'interested' = 'booked') => {
    try {
      console.log('[REGISTER] Starting registration:', { workshopId, status, userId: user?._id });
      const workshop = workshops.find(w => w._id === workshopId);
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          workshopId,
          status,
          registrationDetails: status === 'booked' ? regForm : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('[REGISTER] Registration successful:', data);
        console.log('[REGISTER] Booking details:', data.booking);
        
        setRegistrationSuccess({
          show: true,
          message: data.message || `You've been ${status === 'booked' ? 'registered for' : 'marked as interested in'} this workshop!`,
          workshopTitle: workshop?.title || 'Workshop',
        });
        
        setRegistrationOpen(false);
        setRegForm({
          fullName: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
          organization: user?.company || '',
          expectations: '',
        });
        
        // Immediately fetch workshops to update the UI
        console.log('[REGISTER] Fetching updated workshops...');
        await fetchWorkshops();
        console.log('[REGISTER] Workshops refreshed');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('[REGISTER] Registration failed:', errorData);
        setRegistrationError({
          show: true,
          message: errorData.error || 'Failed to register for the workshop',
        });
      }
    } catch (error) {
      console.error('[REGISTER] Error registering:', error);
      setRegistrationError({
        show: true,
        message: 'An error occurred while registering. Please try again.',
      });
    }
  };

  const handleLike = async (workshopId: string) => {
    try {
      const res = await fetch(`/api/workshops/${workshopId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id }),
      });

      if (res.ok) {
        fetchWorkshops();
      }
    } catch (error) {
      console.error('Error liking workshop:', error);
    }
  };

  const handleShare = async (workshop: Workshop) => {
    const shareData = {
      title: workshop.title,
      text: workshop.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        
        // Track share
        await fetch(`/api/workshops/${workshop._id}/share`, {
          method: 'POST',
        });
        fetchWorkshops();
      } else {
        // Fallback: Copy to clipboard
        try {
          await navigator.clipboard.writeText(`${workshop.title} - ${window.location.href}`);
          alert('Link copied to clipboard!');
        } catch (clipboardError) {
          // Clipboard API blocked - use textarea fallback
          const textArea = document.createElement('textarea');
          textArea.value = `${workshop.title} - ${window.location.href}`;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
          } catch (err) {
            alert('Please copy manually: ' + window.location.href);
          }
          document.body.removeChild(textArea);
        }
      }
      
      // Track share attempt
      try {
        await fetch(`/api/workshops/${workshop._id}/share`, {
          method: 'POST',
        });
        fetchWorkshops();
      } catch (shareError) {
        console.error('Error tracking share:', shareError);
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getUserRegistration = (workshop: Workshop) => {
    const registration = workshop.registrations.find(r => r.userId === user?._id);
    console.log('[GET_REG] Workshop:', workshop.title, 'Registration:', registration);
    return registration;
  };

  const isLiked = (workshop: Workshop) => {
    return workshop.likes?.includes(user?._id || '');
  };

  const getWorkshopCertificate = async (workshopId: string): Promise<Certificate | null> => {
    try {
      const res = await fetch(`/api/certificates?workshopId=${workshopId}&userId=${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        return data[0] || null;
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
    }
    return null;
  };

  const getWorkshopTestimonial = async (workshopId: string): Promise<Testimonial | null> => {
    try {
      const res = await fetch(`/api/testimonials?workshopId=${workshopId}&userId=${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        return data[0] || null;
      }
    } catch (error) {
      console.error('Error fetching testimonial:', error);
    }
    return null;
  };

  if (loading) {
    return <div className="text-center py-10">Loading workshops...</div>;
  }

  const categories = ['all', ...Array.from(new Set(workshops.map(w => w.category)))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Browse Happiness Workshops
        </h1>
        <p className="text-gray-600">Explore, register, and track your happiness journey</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search workshops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label>Mode</Label>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterMode('all');
                setFilterCategory('all');
                setSearchTerm('');
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for All/Booked/Attended/Interested */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Workshops</TabsTrigger>
          <TabsTrigger value="booked">Booked ({workshops.filter(w => w.registrations.some(r => r.userId === user?._id && r.status === 'booked')).length})</TabsTrigger>
          <TabsTrigger value="attended">Attended ({workshops.filter(w => w.registrations.some(r => r.userId === user?._id && r.status === 'attended')).length})</TabsTrigger>
          <TabsTrigger value="interested">Interested ({workshops.filter(w => w.registrations.some(r => r.userId === user?._id && r.status === 'interested')).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => {
              const userReg = getUserRegistration(workshop);
              const liked = isLiked(workshop);

              return (
                <Card 
                  key={workshop._id} 
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02] cursor-pointer relative group"
                  onClick={(e) => {
                    // Don't open expanded view if clicking on buttons, links, or dialogs
                    const target = e.target as HTMLElement;
                    if (!target.closest('button, a, input, textarea, [role="dialog"]')) {
                      setExpandedWorkshop(workshop);
                      setExpandedModalOpen(true);
                    }
                  }}
                >
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none z-10"></div>
                  
                  {/* Workshop Image */}
                  {workshop.poster && (
                    <div className="h-48 overflow-hidden rounded-t-lg relative">
                      <img
                        src={workshop.poster}
                        alt={workshop.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold">
                        Click to expand
                      </div>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex gap-2">
                        <Badge variant="outline">{workshop.mode}</Badge>
                        <Badge className="bg-purple-100 text-purple-700">{workshop.category}</Badge>
                      </div>
                      <Badge variant={workshop.currentEnrollment < workshop.maxCapacity ? 'default' : 'destructive'}>
                        <Users className="w-3 h-3 mr-1" />
                        {workshop.currentEnrollment}/{workshop.maxCapacity}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-xl">{workshop.title}</CardTitle>
                    <CardDescription className="text-sm">{workshop.description}</CardDescription>

                    {/* Rating */}
                    {workshop.averageRating > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.round(workshop.averageRating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {workshop.averageRating.toFixed(1)} ({workshop.totalRatings} reviews)
                        </span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Trainer Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg">
                      <p className="font-semibold text-sm text-gray-900">👨‍🏫 {workshop.trainerName || 'TBA'}</p>
                      {workshop.trainerBio && (
                        <p className="text-xs text-gray-600 mt-1">{workshop.trainerBio}</p>
                      )}
                      {workshop.trainerContact && (
                        <div className="flex gap-3 mt-2">
                          {workshop.trainerContact.email && (
                            <a href={`mailto:${workshop.trainerContact.email}`} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                              <Mail className="w-3 h-3" />
                              Email
                            </a>
                          )}
                          {workshop.trainerContact.phone && (
                            <a href={`tel:${workshop.trainerContact.phone}`} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                              <Phone className="w-3 h-3" />
                              Call
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Workshop Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{workshop.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{workshop.location}</span>
                      </div>
                    </div>

                    {/* Map Link */}
                    {workshop.locationDetails?.mapUrl && (
                      <a
                        href={workshop.locationDetails.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on Map
                      </a>
                    )}

                    {/* Feedback Comments Preview */}
                    {workshop.feedbackComments && workshop.feedbackComments.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Recent Feedback
                        </p>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-xs text-gray-700 italic">
                            "{workshop.feedbackComments[0].comment.substring(0, 80)}..."
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            - {workshop.feedbackComments[0].userName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {/* Registration Status */}
                      {userReg ? (
                        <div className="space-y-2">
                          <Badge className="w-full justify-center py-2" variant={
                            userReg.status === 'booked' ? 'default' :
                            userReg.status === 'attended' ? 'secondary' :
                            'outline'
                          }>
                            {userReg.status === 'booked' && '✅ Registered'}
                            {userReg.status === 'attended' && '🎓 Attended'}
                            {userReg.status === 'interested' && '❤️ Interested'}
                          </Badge>

                          {/* Show Certificate & Testimonial for Attended */}
                          {userReg.status === 'attended' && activeTab === 'attended' && (
                            <div className="space-y-2 p-3 bg-green-50 rounded-lg">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={async () => {
                                  const cert = await getWorkshopCertificate(workshop._id);
                                  if (cert?.downloadUrl) {
                                    window.open(cert.downloadUrl, '_blank');
                                  } else {
                                    alert('Certificate not yet available');
                                  }
                                }}
                              >
                                🎓 Download Certificate
                              </Button>
                              
                              {/* Download Recording Button */}
                              {workshop.recordingUrl && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full bg-blue-50 hover:bg-blue-100"
                                  onClick={() => {
                                    window.open(workshop.recordingUrl, '_blank');
                                  }}
                                >
                                  🎥 Download Recording
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full"
                                onClick={async () => {
                                  router.push(`/dashboard/testimonials?workshopId=${workshop._id}`);
                                }}
                              >
                                ⭐ View/Add Testimonial
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Dialog open={registrationOpen && selectedWorkshop?._id === workshop._id} onOpenChange={setRegistrationOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWorkshop(workshop);
                              }}
                              disabled={workshop.currentEnrollment >= workshop.maxCapacity}
                            >
                              {workshop.currentEnrollment >= workshop.maxCapacity ? 'Full' : 'Register Now'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                            <DialogHeader>
                              <DialogTitle>Register for {workshop.title}</DialogTitle>
                              <DialogDescription>
                                Please fill in your details to complete registration
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              {/* Workshop Summary */}
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg space-y-2">
                                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {workshop.time}</p>
                                <p><strong>Location:</strong> {workshop.location}</p>
                                <p><strong>Mode:</strong> {workshop.mode}</p>
                              </div>

                              {/* Registration Form */}
                              <div className="space-y-4">
                                <div>
                                  <Label>Full Name *</Label>
                                  <Input
                                    value={regForm.fullName}
                                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                                    placeholder="Your full name"
                                  />
                                </div>

                                <div>
                                  <Label>Email *</Label>
                                  <Input
                                    type="email"
                                    value={regForm.email}
                                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                                    placeholder="your.email@example.com"
                                  />
                                </div>

                                <div>
                                  <Label>Phone *</Label>
                                  <Input
                                    type="tel"
                                    value={regForm.phone}
                                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                                    placeholder="+1234567890"
                                  />
                                </div>

                                <div>
                                  <Label>Organization (Optional)</Label>
                                  <Input
                                    value={regForm.organization}
                                    onChange={(e) => setRegForm({ ...regForm, organization: e.target.value })}
                                    placeholder="Your company or organization"
                                  />
                                </div>

                                <div>
                                  <Label>What are your expectations from this workshop?</Label>
                                  <Textarea
                                    value={regForm.expectations}
                                    onChange={(e) => setRegForm({ ...regForm, expectations: e.target.value })}
                                    placeholder="Tell us what you hope to gain..."
                                    rows={3}
                                  />
                                </div>
                              </div>

                              <Button
                                onClick={() => handleRegister(workshop._id, 'booked')}
                                className="w-full bg-green-600 hover:bg-green-700"
                                disabled={!regForm.fullName || !regForm.email || !regForm.phone}
                              >
                                Confirm Registration
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}

                      {/* Like, Share, Interested */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={liked ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(workshop._id);
                          }}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-red-500' : ''}`} />
                          {workshop.likes?.length || 0}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(workshop);
                          }}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {workshop.shares || 0}
                        </Button>

                        {!userReg && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegister(workshop._id, 'interested');
                            }}
                          >
                            ❤️ Interested
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredWorkshops.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No workshops found</p>
              <p className="text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-center text-gray-600">
        Showing {filteredWorkshops.length} of {workshops.length} workshops
      </div>

      {/* Expanded Workshop Modal */}
      <Dialog open={expandedModalOpen} onOpenChange={setExpandedModalOpen}>
        <DialogContent className="!fixed !inset-0 !w-[95vw] !h-[90vh] !max-w-none !max-h-none !top-1/2 !left-1/2 !-translate-x-1/2 !-translate-y-1/2 !rounded-lg !p-0 !overflow-hidden !grid !border">
          <DialogHeader className="sr-only">
            <DialogTitle>{expandedWorkshop?.title || 'Workshop Details'}</DialogTitle>
            <DialogDescription>View detailed information about this workshop</DialogDescription>
          </DialogHeader>
          <div className="w-full h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {expandedWorkshop && (
              <div className="relative">
              {/* Header Image */}
              {expandedWorkshop.poster && (
                <div className="h-72 overflow-hidden relative">
                  <img
                    src={expandedWorkshop.poster}
                    alt={expandedWorkshop.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex gap-2 mb-3">
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">{expandedWorkshop.mode}</Badge>
                      <Badge variant="secondary" className="bg-purple-600/80 backdrop-blur-sm">{expandedWorkshop.category}</Badge>
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm">
                        <Users className="w-3 h-3 mr-1" />
                        {expandedWorkshop.currentEnrollment}/{expandedWorkshop.maxCapacity}
                      </Badge>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">{expandedWorkshop.title}</h1>
                    <p className="text-lg text-white/90">{expandedWorkshop.description}</p>
                  </div>
                </div>
              )}

              <div className="p-8 space-y-8">
                {/* Trainer Section with Photo and Video */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-3xl">👨‍🏫</span>
                    Meet Your Trainer
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Trainer Info & Photo */}
                    <div className="space-y-4">
                      {expandedWorkshop.trainerPhoto && (
                        <img
                          src={expandedWorkshop.trainerPhoto}
                          alt={expandedWorkshop.trainerName || 'Trainer'}
                          className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{expandedWorkshop.trainerName || 'TBA'}</h3>
                        {expandedWorkshop.trainerBio && (
                          <p className="text-gray-700 mt-3 leading-relaxed text-lg">{expandedWorkshop.trainerBio}</p>
                        )}
                        {expandedWorkshop.trainerContact && (
                          <div className="flex gap-4 mt-4">
                            {expandedWorkshop.trainerContact.email && (
                              <a href={`mailto:${expandedWorkshop.trainerContact.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                                <Mail className="w-5 h-5" />
                                <span>Email Trainer</span>
                              </a>
                            )}
                            {expandedWorkshop.trainerContact.phone && (
                              <a href={`tel:${expandedWorkshop.trainerContact.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                                <Phone className="w-5 h-5" />
                                <span>Call Trainer</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trainer Intro Video */}
                    {expandedWorkshop.trainerIntroVideo && (
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-gray-900">🎥 Why Attend This Workshop?</h4>
                        <p className="text-sm text-gray-600 mb-3">Watch a short introduction from your trainer</p>
                        <video
                          controls
                          className="w-full rounded-lg shadow-lg"
                          poster={expandedWorkshop.poster}
                        >
                          <source src={expandedWorkshop.trainerIntroVideo} type="video/mp4" />
                          Your browser does not support video playback.
                        </video>
                      </div>
                    )}
                  </div>
                </div>

                {/* Workshop Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column - Details */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Workshop Details
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">Date</p>
                            <p className="text-gray-700">{new Date(expandedWorkshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">Time</p>
                            <p className="text-gray-700">{expandedWorkshop.time}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <p className="font-semibold text-gray-900">Location</p>
                            <p className="text-gray-700">{expandedWorkshop.location}</p>
                            {expandedWorkshop.locationDetails?.mapUrl && (
                              <a
                                href={expandedWorkshop.locationDetails.mapUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm flex items-center gap-1 mt-1"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View on Map
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating */}
                    {expandedWorkshop.averageRating > 0 && (
                      <div className="bg-yellow-50 rounded-xl p-6 shadow-md border border-yellow-100">
                        <h3 className="text-xl font-bold mb-3">⭐ Ratings & Reviews</h3>
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-7 h-7 ${
                                  i < Math.round(expandedWorkshop.averageRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-2xl font-bold text-gray-900">
                            {expandedWorkshop.averageRating.toFixed(1)}
                          </span>
                        </div>
                        <p className="text-gray-600">Based on {expandedWorkshop.totalRatings} reviews</p>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Features & Metrics */}
                  <div className="space-y-6">
                    {/* Workshop Features */}
                    {expandedWorkshop.workshopFeatures && expandedWorkshop.workshopFeatures.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          ✨ Workshop Features
                        </h3>
                        <ul className="space-y-3">
                          {expandedWorkshop.workshopFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-green-600 text-xl mt-0.5">✓</span>
                              <span className="text-gray-700 text-base">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Learning Objectives */}
                    {expandedWorkshop.learningObjectives && expandedWorkshop.learningObjectives.length > 0 && (
                      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          🎯 Learning Objectives
                        </h3>
                        <ul className="space-y-3">
                          {expandedWorkshop.learningObjectives.map((objective, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="text-blue-600 text-xl mt-0.5">→</span>
                              <span className="text-gray-700 text-base">{objective}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Workshop Metrics */}
                    {expandedWorkshop.workshopMetrics && (
                      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 shadow-md border border-green-100">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          📊 Impact Metrics
                        </h3>
                        <div className="space-y-4">
                          {expandedWorkshop.workshopMetrics.attendeeSatisfaction && (
                            <div>
                              <p className="font-semibold text-gray-900">Attendee Satisfaction</p>
                              <p className="text-2xl font-bold text-green-600">{expandedWorkshop.workshopMetrics.attendeeSatisfaction}</p>
                            </div>
                          )}
                          {expandedWorkshop.workshopMetrics.skillsGained && expandedWorkshop.workshopMetrics.skillsGained.length > 0 && (
                            <div>
                              <p className="font-semibold text-gray-900 mb-2">Skills Gained</p>
                              <div className="flex flex-wrap gap-2">
                                {expandedWorkshop.workshopMetrics.skillsGained.map((skill, idx) => (
                                  <Badge key={idx} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {expandedWorkshop.workshopMetrics.careerImpact && (
                            <div>
                              <p className="font-semibold text-gray-900">Career Impact</p>
                              <p className="text-gray-700">{expandedWorkshop.workshopMetrics.careerImpact}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feedback Comments */}
                {expandedWorkshop.feedbackComments && expandedWorkshop.feedbackComments.length > 0 && (
                  <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MessageCircle className="w-6 h-6 text-blue-600" />
                      Recent Feedback
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {expandedWorkshop.feedbackComments.slice(0, 4).map((comment, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < comment.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 italic mb-2">"{comment.comment}"</p>
                          <p className="text-sm text-gray-500">- {comment.userName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setExpandedModalOpen(false)}
                  >
                    Close
                  </Button>
                  {!getUserRegistration(expandedWorkshop) && (
                    <>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={async () => {
                          setExpandedModalOpen(false);
                          await handleRegister(expandedWorkshop._id, 'interested');
                        }}
                      >
                        <Heart className="w-4 h-4" />
                        Mark as Interested
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2"
                        onClick={() => {
                          setSelectedWorkshop(expandedWorkshop);
                          setExpandedModalOpen(false);
                          setRegistrationOpen(true);
                        }}
                        disabled={expandedWorkshop.currentEnrollment >= expandedWorkshop.maxCapacity}
                      >
                        <Calendar className="w-4 h-4" />
                        {expandedWorkshop.currentEnrollment >= expandedWorkshop.maxCapacity ? 'Workshop Full' : 'Register Now'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Success Dialog */}
      <Dialog open={registrationSuccess.show} onOpenChange={(open) => setRegistrationSuccess({ ...registrationSuccess, show: open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <span className="text-2xl">✅</span>
              Success!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold mb-2">{registrationSuccess.workshopTitle}</p>
              <p className="text-green-700">{registrationSuccess.message}</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                📧 A confirmation email has been sent to your registered email address.
              </p>
              <p className="text-sm text-gray-600">
                You can now view this workshop in your dashboard or receive notifications about updates.
              </p>
            </div>
            <Button 
              onClick={() => setRegistrationSuccess({ show: false, message: '', workshopTitle: '' })}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Error Dialog */}
      <Dialog open={registrationError.show} onOpenChange={(open) => setRegistrationError({ ...registrationError, show: open })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span>
              Registration Failed
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{registrationError.message}</p>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Please check that all required fields are filled in correctly and try again.
              </p>
              <p className="text-sm text-gray-600">
                If the problem persists, please contact support.
              </p>
            </div>
            <Button 
              onClick={() => setRegistrationError({ show: false, message: '' })}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Rename the wrapper function to avoid name conflict
export function BrowseWorkshopsPageNewWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowseWorkshopsPageNewContent />
    </Suspense>
  );
}

// Rename the default export to match the wrapper
export default BrowseWorkshopsPageNewWrapper;
