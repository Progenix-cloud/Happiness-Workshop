'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const focusAreas = [
  'Happiness',
  'Inner Joy',
  'Team Connect',
  'Conscious Sleep (Yog-Nidra)',
  'IKIGAI',
  'Stress Management',
  'Other',
];

const venueTypes = [
  'Auditorium',
  'Seminar Hall',
  'Classroom',
  'Boardroom',
  'Other',
];

export function CustomWorkshopRequestPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    organizationName: '',
    contactPerson: '',
    designation: '',
    email: '',
    phoneNumber: '',
    preferredDate: '',
    preferredFormat: 'hybrid',
    numberOfParticipants: '',
    focusAreas: [] as string[],
    venueType: '',
    communityOpen: false,
    additionalNotes: '',
  });

  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFocusAreaChange = (area: string, checked: boolean) => {
    setSelectedFocusAreas(prev =>
      checked
        ? [...prev, area]
        : prev.filter(a => a !== area)
    );
    handleInputChange('focusAreas', selectedFocusAreas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/workshop-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          focusAreas: selectedFocusAreas,
          userId: user?._id,
        }),
      });

      if (res.ok) {
        setShowConfirmation(true);
        setFormData({
          organizationName: '',
          contactPerson: '',
          designation: '',
          email: '',
          phoneNumber: '',
          preferredDate: '',
          preferredFormat: 'hybrid',
          numberOfParticipants: '',
          focusAreas: [],
          venueType: '',
          communityOpen: false,
          additionalNotes: '',
        });
        setSelectedFocusAreas([]);
      } else {
        alert('Failed to submit request');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Request a Custom Workshop</h1>
        <p className="text-gray-600">Request us to organize happiness and well-being workshops for your organization</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workshop Request Form</CardTitle>
          <CardDescription>Fill out the form to request a custom workshop</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Organization Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organizationName">School / Institute / Organization / RWA Name *</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => handleInputChange('organizationName', e.target.value)}
                    placeholder="Your organization name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="e.g., Principal, HR Manager"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Workshop Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Workshop Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="preferredDate">Preferred Date *</Label>
                  <Input
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="preferredFormat">Preferred Format *</Label>
                  <Select value={formData.preferredFormat} onValueChange={(value) => handleInputChange('preferredFormat', value)}>
                    <SelectTrigger id="preferredFormat">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numberOfParticipants">Number of Participants Expected *</Label>
                  <Input
                    id="numberOfParticipants"
                    type="number"
                    value={formData.numberOfParticipants}
                    onChange={(e) => handleInputChange('numberOfParticipants', e.target.value)}
                    placeholder="e.g., 100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Focus Areas */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Workshop Focus Areas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {focusAreas.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={selectedFocusAreas.includes(area)}
                      onCheckedChange={(checked) => handleFocusAreaChange(area, checked as boolean)}
                    />
                    <Label htmlFor={area} className="cursor-pointer">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Venue Information</h3>

              <div>
                <Label htmlFor="venueType">Do you have a venue? *</Label>
                <Select value={formData.venueType} onValueChange={(value) => handleInputChange('venueType', value)}>
                  <SelectTrigger id="venueType">
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                  <SelectContent>
                    {venueTypes.map(venue => (
                      <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="communityOpen"
                  checked={formData.communityOpen}
                  onCheckedChange={(checked) => handleInputChange('communityOpen', checked)}
                />
                <Label htmlFor="communityOpen" className="cursor-pointer">
                  Do you wish to keep this requested session open for local community?
                </Label>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
              <div>
                <Label htmlFor="additionalNotes">Additional Notes / Comments</Label>
                <Textarea
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Any specific requests or additional details..."
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Submitted Successfully! 🎉</DialogTitle>
            <DialogDescription>
              Thank you for your request
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We've received your custom workshop request. Our team will review the details and contact you soon to finalize the arrangements.
            </p>
            <p className="text-sm font-medium">
              A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
            <Button onClick={() => setShowConfirmation(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
