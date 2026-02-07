'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { IMemberApplication } from '@/lib/mongodb/schemas';
import { 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileText, 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  User,
  Filter,
  Search,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

export function MemberApplicationsManagement() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<IMemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trainer' | 'volunteer'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedApplication, setSelectedApplication] = useState<IMemberApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  
  const [rejectionReason, setRejectionReason] = useState('');
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    link: '',
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/member-applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedApplication) return;
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/member-applications/${selectedApplication._id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user?._id }),
      });

      if (res.ok) {
        toast.success('Application approved successfully');
        setShowApproveModal(false);
        fetchApplications();
      } else {
        toast.error('Failed to approve application');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApplication || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/member-applications/${selectedApplication._id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminId: user?._id,
          reason: rejectionReason,
        }),
      });

      if (res.ok) {
        toast.success('Application rejected');
        setShowRejectModal(false);
        setRejectionReason('');
        fetchApplications();
      } else {
        toast.error('Failed to reject application');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplication || !interviewData.date || !interviewData.time) {
      toast.error('Please fill in all interview details');
      return;
    }
    
    setProcessing(true);
    try {
      const res = await fetch(`/api/member-applications/${selectedApplication._id}/schedule-interview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adminId: user?._id,
          interviewDate: interviewData.date,
          interviewTime: interviewData.time,
          interviewLink: interviewData.link,
        }),
      });

      if (res.ok) {
        toast.success('Interview scheduled successfully');
        setShowInterviewModal(false);
        setInterviewData({ date: '', time: '', link: '' });
        fetchApplications();
      } else {
        toast.error('Failed to schedule interview');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesType = filter === 'all' || app.applicationType === filter;
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = !searchTerm || 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    interview_scheduled: 'bg-purple-100 text-purple-800',
  };

  const getStatusCounts = () => {
    return {
      all: applications.length,
      submitted: applications.filter(a => a.status === 'submitted').length,
      pending: applications.filter(a => a.status === 'pending').length,
      approved: applications.filter(a => a.status === 'approved').length,
      interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    };
  };

  const counts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Member Applications</h1>
        <p className="text-gray-600">Manage trainer and volunteer applications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{counts.all}</p>
            <p className="text-xs text-gray-600">Total</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('submitted')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{counts.submitted}</p>
            <p className="text-xs text-gray-600">Submitted</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
            <p className="text-xs text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('approved')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{counts.approved}</p>
            <p className="text-xs text-gray-600">Approved</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('interview_scheduled')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{counts.interview_scheduled}</p>
            <p className="text-xs text-gray-600">Interview</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatusFilter('rejected')}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
            <p className="text-xs text-gray-600">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Tabs value={filter} onValueChange={(v: any) => setFilter(v)} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="trainer">Trainers</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteers</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map(application => (
            <Card key={application._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{application.fullName}</h3>
                      <Badge className={statusColors[application.status]}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {application.applicationType}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{application.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{application.city}, {application.state}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Applied {new Date(application.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowDetailsModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    
                    {application.status !== 'rejected' && application.status !== 'approved' && (
                      <>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowApproveModal(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowRejectModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {application.status === 'approved' && (
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowInterviewModal(true);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Interview
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              {selectedApplication?.applicationType === 'trainer' ? 'Trainer' : 'Volunteer'} Application
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Full Name</Label>
                  <p className="font-medium">{selectedApplication.fullName}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedApplication.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  <p className="font-medium">{selectedApplication.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Age</Label>
                  <p className="font-medium">{selectedApplication.age}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Location</Label>
                  <p className="font-medium">{selectedApplication.city}, {selectedApplication.state}, {selectedApplication.country}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Occupation</Label>
                  <p className="font-medium">{selectedApplication.currentOccupation}</p>
                </div>
              </div>

              {selectedApplication.applicationType === 'trainer' && (
                <div className="space-y-3">
                  {selectedApplication.expertise && selectedApplication.expertise.length > 0 && (
                    <div>
                      <Label className="text-gray-600">Expertise</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.expertise.map(area => (
                          <Badge key={area} variant="outline">{area}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApplication.experience && (
                    <div>
                      <Label className="text-gray-600">Experience</Label>
                      <p className="font-medium">{selectedApplication.experience} years</p>
                    </div>
                  )}
                </div>
              )}

              {selectedApplication.applicationType === 'volunteer' && (
                <div className="space-y-3">
                  {selectedApplication.preferredActivities && selectedApplication.preferredActivities.length > 0 && (
                    <div>
                      <Label className="text-gray-600">Preferred Activities</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedApplication.preferredActivities.map(activity => (
                          <Badge key={activity} variant="outline">{activity}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label className="text-gray-600">CV/Resume</Label>
                <a 
                  href={selectedApplication.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm flex items-center gap-2 mt-1"
                >
                  <FileText className="w-4 h-4" />
                  View Document
                </a>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Modal */}
      <Dialog open={showApproveModal} onOpenChange={setShowApproveModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={processing} className="bg-green-600 hover:bg-green-700">
              {processing ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={processing}>
              {processing ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Interview Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Set up an orientation interview with the applicant
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="interview-date">Interview Date *</Label>
              <Input
                id="interview-date"
                type="date"
                value={interviewData.date}
                onChange={(e) => setInterviewData({...interviewData, date: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="interview-time">Interview Time *</Label>
              <Input
                id="interview-time"
                type="time"
                value={interviewData.time}
                onChange={(e) => setInterviewData({...interviewData, time: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="interview-link">Meeting Link (Zoom/Google Meet)</Label>
              <Input
                id="interview-link"
                type="url"
                placeholder="https://zoom.us/j/..."
                value={interviewData.link}
                onChange={(e) => setInterviewData({...interviewData, link: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInterviewModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleScheduleInterview} disabled={processing} className="bg-purple-600 hover:bg-purple-700">
              {processing ? 'Scheduling...' : 'Schedule Interview'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
