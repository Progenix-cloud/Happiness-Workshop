'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApplicationTimeline, TimelineStep } from '@/components/ui/application-timeline';
import { IMemberApplication } from '@/lib/mongodb/schemas';
import { Calendar, Mail, Phone, MapPin, FileText, Edit, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ApplicationTrackerProps {
  application: IMemberApplication;
}

export function ApplicationTracker({ application }: ApplicationTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(application);
  const [saving, setSaving] = useState(false);

  const getTimelineSteps = (): TimelineStep[] => {
    const steps: TimelineStep[] = [];

    // Submitted
    steps.push({
      id: 'submitted',
      label: 'Submitted',
      status: 'completed',
      date: application.timeline.submitted.date 
        ? new Date(application.timeline.submitted.date).toLocaleDateString()
        : undefined,
      description: 'Application received',
    });

    // Under Review
    if (application.status === 'rejected') {
      steps.push({
        id: 'review',
        label: 'Under Review',
        status: 'rejected',
        date: application.timeline.underReview.date 
          ? new Date(application.timeline.underReview.date).toLocaleDateString()
          : undefined,
        description: 'Application rejected',
      });
    } else {
      steps.push({
        id: 'review',
        label: 'Under Review',
        status: application.timeline.underReview.completed ? 'completed' : 'current',
        date: application.timeline.underReview.date 
          ? new Date(application.timeline.underReview.date).toLocaleDateString()
          : undefined,
        description: application.status === 'pending' ? 'In progress...' : 'Review complete',
      });
    }

    // Approved (only if not rejected)
    if (application.status !== 'rejected') {
      steps.push({
        id: 'approved',
        label: 'Approved',
        status: application.timeline.approved.completed 
          ? 'completed' 
          : application.status === 'approved' || application.status === 'interview_scheduled'
          ? 'current'
          : 'pending',
        date: application.timeline.approved.date 
          ? new Date(application.timeline.approved.date).toLocaleDateString()
          : undefined,
        description: application.timeline.approved.completed ? 'Application approved!' : 'Awaiting approval',
      });

      // Interview Scheduled
      steps.push({
        id: 'interview',
        label: 'Interview',
        status: application.timeline.interviewScheduled.completed 
          ? 'completed' 
          : application.status === 'interview_scheduled'
          ? 'current'
          : 'pending',
        date: application.timeline.interviewScheduled.interviewDate 
          ? new Date(application.timeline.interviewScheduled.interviewDate).toLocaleDateString()
          : undefined,
        description: application.timeline.interviewScheduled.interviewDate
          ? `Scheduled for ${new Date(application.timeline.interviewScheduled.interviewDate).toLocaleDateString()}`
          : 'Not yet scheduled',
      });
    }

    return steps;
  };

  const handleEdit = () => {
    if (!application.isEditable) {
      toast.error('Application cannot be edited after approval');
      return;
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/member-applications/${application._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedData),
      });

      if (res.ok) {
        toast.success('Application updated successfully');
        setIsEditing(false);
        window.location.reload();
      } else {
        toast.error('Failed to update application');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(application);
    setIsEditing(false);
  };

  const statusColors = {
    submitted: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    interview_scheduled: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="space-y-6">
      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Application Status</h2>
          <p className="text-gray-600">
            Applied on {new Date(application.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge className={statusColors[application.status]}>
          {application.status === 'interview_scheduled' ? 'Interview Scheduled' : application.status.toUpperCase()}
        </Badge>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
          <CardDescription>Track your application through each stage</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ApplicationTimeline steps={getTimelineSteps()} />
        </CardContent>
      </Card>

      {/* Interview Details (if scheduled) */}
      {application.status === 'interview_scheduled' && application.timeline.interviewScheduled.interviewDate && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Calendar className="w-5 h-5" />
              Interview Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Date:</span>
              <span>{new Date(application.timeline.interviewScheduled.interviewDate).toLocaleDateString()}</span>
            </div>
            {application.timeline.interviewScheduled.interviewTime && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Time:</span>
                <span>{application.timeline.interviewScheduled.interviewTime}</span>
              </div>
            )}
            {application.timeline.interviewScheduled.interviewLink && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-purple-600" />
                <span className="font-medium">Link:</span>
                <a 
                  href={application.timeline.interviewScheduled.interviewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline"
                >
                  Join Interview
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Rejection Reason (if rejected) */}
      {application.status === 'rejected' && application.rejectionReason && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              Application Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-700">{application.rejectionReason}</p>
          </CardContent>
        </Card>
      )}

      {/* Application Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Application Details</CardTitle>
              <CardDescription>Your submitted information</CardDescription>
            </div>
            {application.isEditable && !isEditing && (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {isEditing && (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm" disabled={saving}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedData.fullName}
                    onChange={(e) => setEditedData({...editedData, fullName: e.target.value})}
                  />
                ) : (
                  <p className="font-medium">{application.fullName}</p>
                )}
              </div>
              <div>
                <Label className="text-gray-600">Email</Label>
                <p className="font-medium">{application.email}</p>
              </div>
              <div>
                <Label className="text-gray-600">Phone</Label>
                {isEditing ? (
                  <Input
                    value={editedData.phone}
                    onChange={(e) => setEditedData({...editedData, phone: e.target.value})}
                  />
                ) : (
                  <p className="font-medium">{application.phone}</p>
                )}
              </div>
              <div>
                <Label className="text-gray-600">Age</Label>
                <p className="font-medium">{application.age}</p>
              </div>
              <div>
                <Label className="text-gray-600">Gender</Label>
                <p className="font-medium capitalize">{application.gender}</p>
              </div>
              <div>
                <Label className="text-gray-600">City, State</Label>
                <p className="font-medium">{application.city}, {application.state}</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Professional Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-600">Current Occupation</Label>
                <p className="font-medium">{application.currentOccupation}</p>
              </div>
              {application.organization && (
                <div>
                  <Label className="text-gray-600">Organization</Label>
                  <p className="font-medium">{application.organization}</p>
                </div>
              )}
              {application.designation && (
                <div>
                  <Label className="text-gray-600">Designation</Label>
                  <p className="font-medium">{application.designation}</p>
                </div>
              )}
            </div>
          </div>

          {/* Type Specific Fields */}
          {application.applicationType === 'trainer' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Training Expertise</h4>
              <div className="space-y-3 text-sm">
                {application.expertise && application.expertise.length > 0 && (
                  <div>
                    <Label className="text-gray-600">Areas of Expertise</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {application.expertise.map(area => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {application.experience && (
                  <div>
                    <Label className="text-gray-600">Experience</Label>
                    <p className="font-medium">{application.experience}</p>
                  </div>
                )}
                {application.certifications && (
                  <div>
                    <Label className="text-gray-600">Certifications</Label>
                    <p className="font-medium whitespace-pre-wrap">{application.certifications}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {application.applicationType === 'volunteer' && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Volunteer Details</h4>
              <div className="space-y-3 text-sm">
                {application.availability && (
                  <div>
                    <Label className="text-gray-600">Availability</Label>
                    <p className="font-medium capitalize">{application.availability}</p>
                  </div>
                )}
                {application.preferredActivities && application.preferredActivities.length > 0 && (
                  <div>
                    <Label className="text-gray-600">Preferred Activities</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {application.preferredActivities.map(activity => (
                        <Badge key={activity} variant="outline">{activity}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Motivation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-gray-600">Reason for Applying</Label>
                {isEditing ? (
                  <Textarea
                    value={editedData.reasonForApplying}
                    onChange={(e) => setEditedData({...editedData, reasonForApplying: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="font-medium whitespace-pre-wrap">{application.reasonForApplying}</p>
                )}
              </div>
              <div>
                <Label className="text-gray-600">Expected Contribution</Label>
                {isEditing ? (
                  <Textarea
                    value={editedData.expectedContribution}
                    onChange={(e) => setEditedData({...editedData, expectedContribution: e.target.value})}
                    rows={3}
                  />
                ) : (
                  <p className="font-medium whitespace-pre-wrap">{application.expectedContribution}</p>
                )}
              </div>
            </div>
          </div>

          {/* CV */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents
            </h4>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              <a 
                href={application.cvUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View CV/Resume (PDF)
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
