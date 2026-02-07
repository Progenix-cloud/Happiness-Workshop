'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useNotification } from '@/lib/context/NotificationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

const preferredActivities = [
  'Event Setup & Logistics',
  'Participant Registration',
  'Social Media Management',
  'Photography & Videography',
  'Content Creation',
  'Community Outreach',
  'Administrative Support',
  'Technical Support',
];

interface VolunteerApplicationFormProps {
  onSubmitted?: (application: any) => void;
}

export function VolunteerApplicationForm({ onSubmitted }: VolunteerApplicationFormProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { addNotification } = useNotification();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: 'Sarah Martinez',
    email: 'sarah.volunteer@test.com',
    phone: '+1 (555) 987-6543',
    age: '28',
    gender: 'Female',
    address: '456 Community Drive',
    city: 'Austin',
    state: 'Texas',
    country: 'USA',
    
    // Professional Information
    currentOccupation: 'Community Organizer',
    organization: 'Austin Social Impact Hub',
    designation: 'Program Coordinator',
    
    // Volunteer Specific
    availability: 'Weekends',
    preferredActivities: ['Event Organization', 'Community Outreach', 'Content Creation', 'Participant Support'],
    volunteringExperience: 'I have volunteered with local food banks for 3 years and organized community wellness events. I love bringing people together and creating positive experiences.',
    skills: ['Organizational Skills', 'Communication', 'Event Planning'],
    motivation: "I'm passionate about mental health and well-being. I want to help make happiness workshops accessible to underserved communities.",
    
    // Common Fields
    cvUrl: '',
    reasonForApplying: "I believe in the power of collective well-being. This organization's mission aligns perfectly with my personal values of spreading joy and building resilient communities.",
    expectedContribution: "I can contribute 10-15 hours per month helping with event coordination, social media engagement, and participant onboarding. I have strong organizational skills and experience with community building.",
    references: [
      { name: 'Maria Rodriguez', contact: 'maria.r@example.com', relationship: 'Former Supervisor' },
      { name: 'James Chen', contact: 'james.chen@example.com', relationship: 'Community Partner' },
    ],
  });

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReferenceChange = (index: number, field: string, value: string) => {
    const newReferences = [...formData.references];
    newReferences[index] = { ...newReferences[index], [field]: value };
    setFormData(prev => ({ ...prev, references: newReferences }));
  };

  const handleActivityToggle = (activity: string) => {
    const newActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter(a => a !== activity)
      : [...selectedActivities, activity];
    setSelectedActivities(newActivities);
    handleInputChange('preferredActivities', newActivities);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.includes('pdf')) {
        toast.error('Only PDF files are allowed');
        return;
      }
      setCvFile(file);
      
      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        handleInputChange('cvUrl', event.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.cvUrl) {
      toast.error('Please upload your CV');
      return;
    }
    
    if (selectedActivities.length === 0) {
      toast.error('Please select at least one preferred activity');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/member-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?._id,
          applicationType: 'volunteer',
          preferredActivities: selectedActivities,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setShowConfirmation(true);
        toast.success('Application submitted successfully!');
        if (result?.application) {
          onSubmitted?.(result.application);
        }
        addNotification({
          type: 'success',
          title: 'Application Submitted',
          message: 'Your volunteer application has been received and is under review.',
        });
        
      } else {
        const error = await res.json();
        toast.error(error.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while submitting your application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Volunteer Application Form</h1>
        <p className="text-gray-600">Help us spread joy and make a difference in the community</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Application Form
          </CardTitle>
          <CardDescription>Please fill out all required fields carefully</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              
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
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 1234567890"
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
                    min="18"
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
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Street address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentOccupation">Current Occupation *</Label>
                  <Input
                    id="currentOccupation"
                    value={formData.currentOccupation}
                    onChange={(e) => handleInputChange('currentOccupation', e.target.value)}
                    placeholder="Student / Professional / Business"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="organization">Organization (if applicable)</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                    placeholder="School / College / Company"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="designation">Current Designation/Role</Label>
                  <Input
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    placeholder="Your current role or position"
                  />
                </div>
              </div>
            </div>

            {/* Volunteer Specific Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Volunteer Details</h3>
              
              <div>
                <Label htmlFor="availability">Availability *</Label>
                <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Weekdays</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="both">Both Weekdays and Weekends</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Preferred Activities * (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {preferredActivities.map(activity => (
                    <div key={activity} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={activity}
                        checked={selectedActivities.includes(activity)}
                        onChange={() => handleActivityToggle(activity)}
                        className="w-4 h-4 rounded"
                      />
                      <Label htmlFor={activity} className="cursor-pointer font-normal">{activity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="volunteringExperience">Previous Volunteering Experience *</Label>
                <Textarea
                  id="volunteringExperience"
                  value={formData.volunteringExperience}
                  onChange={(e) => handleInputChange('volunteringExperience', e.target.value)}
                  placeholder="Describe any previous volunteering experience, roles, and responsibilities..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="motivation">Why do you want to volunteer with us? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange('motivation', e.target.value)}
                  placeholder="Share your motivation and what you hope to achieve through volunteering..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="reasonForApplying">Why are you interested in happiness and well-being initiatives? *</Label>
                <Textarea
                  id="reasonForApplying"
                  value={formData.reasonForApplying}
                  onChange={(e) => handleInputChange('reasonForApplying', e.target.value)}
                  placeholder="Tell us about your interest in our mission..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expectedContribution">How do you plan to contribute to our community? *</Label>
                <Textarea
                  id="expectedContribution"
                  value={formData.expectedContribution}
                  onChange={(e) => handleInputChange('expectedContribution', e.target.value)}
                  placeholder="Describe how you can make a positive impact..."
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* CV Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Documents</h3>
              
              <div>
                <Label htmlFor="cv">Upload CV/Resume * (PDF only, max 5MB)</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="cv"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    required
                  />
                  <label htmlFor="cv" className="cursor-pointer block">
                    {cvFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-medium">{cvFile.name}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF files only (max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">References (Optional)</h3>
              
              {formData.references.map((ref, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-sm">Reference {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`ref-name-${index}`}>Name</Label>
                      <Input
                        id={`ref-name-${index}`}
                        value={ref.name}
                        onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                        placeholder="Reference name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-contact-${index}`}>Contact</Label>
                      <Input
                        id={`ref-contact-${index}`}
                        value={ref.contact}
                        onChange={(e) => handleReferenceChange(index, 'contact', e.target.value)}
                        placeholder="Email or phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`ref-relationship-${index}`}>Relationship</Label>
                      <Input
                        id={`ref-relationship-${index}`}
                        value={ref.relationship}
                        onChange={(e) => handleReferenceChange(index, 'relationship', e.target.value)}
                        placeholder="Manager, Professor, etc."
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-lg py-6"
            >
              {submitting ? 'Submitting...' : 'Submit Volunteer Application'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
              Application Submitted Successfully! 🎉
            </DialogTitle>
            <DialogDescription>
              Thank you for applying to become a volunteer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your volunteer application has been received and is now under review. We're excited to have you join our mission of spreading happiness and well-being!
            </p>

            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>What's Next?</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Our team will review your application within 3-5 business days</li>
                <li>You'll receive a notification once your application is approved</li>
                <li>An interview will be scheduled for orientation</li>
                <li>You can track your application status anytime</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>

            <Button
              onClick={() => {
                setShowConfirmation(false);
                router.push('/dashboard/member-application');
                router.refresh();
              }}
              className="w-full"
            >
              Track My Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
