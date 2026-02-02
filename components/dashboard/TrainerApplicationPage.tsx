'use client';

import React from "react"

import { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const expertiseAreas = [
  'Happiness',
  'Inner Joy',
  'Team Connect',
  'Conscious Sleep (Yog-Nidra)',
  'IKIGAI',
  'Stress Management',
  'Meditation',
  'Mindfulness',
  'Yoga',
  'Other',
];

export function TrainerApplicationPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    organization: '',
    designation: '',
    age: '',
    gender: '',
    email: user?.email || '',
    phoneNumber: '',
    expertise: [] as string[],
    experience: '',
    resumeUrl: '',
  });

  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleExpertiseChange = (area: string, checked: boolean) => {
    const newExpertise = checked
      ? [...selectedExpertise, area]
      : selectedExpertise.filter(a => a !== area);
    setSelectedExpertise(newExpertise);
    handleInputChange('expertise', newExpertise);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('resumeUrl', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/trainer-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expertise: selectedExpertise,
          userId: user?._id,
          status: 'pending',
        }),
      });

      if (res.ok) {
        setShowConfirmation(true);
      } else {
        alert('Failed to submit application');
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Happiness & Well-being Trainer</h1>
        <p className="text-gray-600">Join us as a volunteer trainer and spread joy in your community</p>
      </div>

      <Alert>
        <AlertDescription>
          Are you passionate about spreading joy and enhancing well-being? Join us as a Happiness and Well-being Trainer! Share your expertise and contribute to a movement that fosters happiness and mental well-being for all.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Make an Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Facilitate others to improve their physical, mental, emotional, and spiritual well-being</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Gain Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Enhance your professional portfolio and join a community of like-minded professionals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lead Nationally</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Upon approval, lead workshops and training sessions nationally as a volunteer trainer</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trainer Application Form</CardTitle>
          <CardDescription>Complete all fields to apply as a trainer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="Your age"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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

                <div>
                  <Label htmlFor="organization">Organization *</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="School / College / Company / RWA"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="Student / Professional / Other"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Expertise */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Area of Expertise *</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {expertiseAreas.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={area}
                      checked={selectedExpertise.includes(area)}
                      onChange={(e) => handleExpertiseChange(area, e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor={area} className="cursor-pointer">{area}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Experience</h3>

              <div>
                <Label htmlFor="experience">Years of Training Experience *</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">More than 10 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="resume">Upload Resume / Credentials</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer block">
                    <p className="text-sm text-gray-600">
                      {formData.resumeUrl ? '✓ File uploaded' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, or DOCX files</p>
                  </label>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to the Happiness Squad! 🌟</DialogTitle>
            <DialogDescription>
              Your application has been received
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your interest in becoming a Happiness and Well-being Volunteer-Trainer has brightened our day! Thank you for wanting to spread joy, positivity, and well-being far and wide.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>What's Next?</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Our team will review your application</li>
                <li>You'll be invited to attend an experiential orientation session</li>
                <li>Upon approval, you'll lead workshops nationally</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              A confirmation email has been sent to <strong>{formData.email}</strong>. Keep an eye on your inbox for updates!
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
