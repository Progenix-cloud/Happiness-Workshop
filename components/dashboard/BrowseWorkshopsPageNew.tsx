'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotification } from '@/lib/context/NotificationContext';
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
import { Suspense } from 'react';

interface Registration {
  userId: string;
  status: 'booked' | 'attended' | 'interested' | 'cancelled';
  registeredAt: Date;
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
  likes: string[];
  shares: number;
  registrations: Registration[];
  zoomJoinUrl?: string;
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
  const { addNotification } = useNotification();
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
      const res = await fetch('/api/workshops');
      if (res.ok) {
        const data = await res.json();
        setWorkshops(data);
        setFilteredWorkshops(data);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = workshops;

    // Filter by tab status
    if (activeTab === 'booked') {
      filtered = filtered.filter(w => 
        w.registrations.some(r => r.userId === user?._id && r.status === 'booked')
      );
    } else if (activeTab === 'attended') {
      filtered = filtered.filter(w => 
        w.registrations.some(r => r.userId === user?._id && r.status === 'attended')
      );
    } else if (activeTab === 'interested') {
      filtered = filtered.filter(w => 
        w.registrations.some(r => r.userId === user?._id && r.status === 'interested')
      );
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
        console.log('[UI] Registration successful:', data);
        
        // ✅ IMMEDIATELY UPDATE UI WITH NEW REGISTRATION
        const updatedWorkshops = workshops.map(w => {
          if (w._id === workshopId) {
            return {
              ...w,
              registrations: [
                ...w.registrations,
                {
                  userId: user?._id,
                  status,
                  registeredAt: new Date(),
                  registrationDetails: status === 'booked' ? regForm : undefined,
                },
              ],
            };
          }
          return w;
        });
        setWorkshops(updatedWorkshops);
        setFilteredWorkshops(updatedWorkshops);

        // ✅ ADD NOTIFICATION
        addNotification({
          type: 'success',
          title: 'Successfully Registered! ✅',
          message: `You've been ${status === 'booked' ? 'registered for' : 'marked as interested in'} "${workshop?.title || 'Workshop'}"`,
          icon: undefined,
        });
        
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
        
        setTimeout(() => {
          fetchWorkshops();
        }, 1500);
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('[UI] Registration failed:', errorData);
        setRegistrationError({
          show: true,
          message: errorData.error || 'Failed to register for the workshop',
        });
      }
    } catch (error) {
      console.error('[UI] Error registering:', error);
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
    return workshop.registrations.find(r => r.userId === user?._id);
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
                <Card key={workshop._id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                  {/* Workshop Image */}
                  {workshop.poster && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <img
                        src={workshop.poster}
                        alt={workshop.title}
                        className="w-full h-full object-cover"
                      />
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
                              onClick={() => setSelectedWorkshop(workshop)}
                              disabled={workshop.currentEnrollment >= workshop.maxCapacity}
                            >
                              {workshop.currentEnrollment >= workshop.maxCapacity ? 'Full' : 'Register Now'}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                          onClick={() => handleLike(workshop._id)}
                        >
                          <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-red-500' : ''}`} />
                          {workshop.likes?.length || 0}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleShare(workshop)}
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {workshop.shares || 0}
                        </Button>

                        {!userReg && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleRegister(workshop._id, 'interested')}
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
