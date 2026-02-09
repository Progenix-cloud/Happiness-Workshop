'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, GraduationCap, ArrowRight, Heart } from 'lucide-react';
import { TrainerApplicationForm } from './TrainerApplicationForm';
import { VolunteerApplicationForm } from './VolunteerApplicationForm';
import { ApplicationTracker } from './ApplicationTracker';
import { IMemberApplication } from '@/lib/mongodb/schemas';

export function MemberApplicationPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'trainer' | 'volunteer' | null>(null);
  const [existingApplication, setExistingApplication] = useState<IMemberApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user already has an application
    const fetchExistingApplication = async () => {
      try {
        const res = await fetch('/api/member-applications/status');
        if (res.ok) {
          const data = await res.json();
          if (data.application) {
            setExistingApplication(data.application);
            setSelectedType(data.application.applicationType);
          }
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingApplication();
  }, []);

  const handleTypeSelect = (type: 'trainer' | 'volunteer') => {
    setSelectedType(type);
  };

  const handleApplicationSubmitted = (application: IMemberApplication) => {
    setExistingApplication(application);
    setSelectedType(application.applicationType);
  };

  const handleBack = () => {
    if (!existingApplication) {
      setSelectedType(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const BackButton = (
    <div className="flex items-center">
      <Button variant="outline" onClick={() => router.back()}>
        ← Back
      </Button>
    </div>
  );

  // Show application tracker if user has already applied
  if (existingApplication) {
    return (
      <div className="space-y-6">
        {BackButton}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Your {existingApplication.applicationType === 'trainer' ? 'Trainer' : 'Volunteer'} Application
          </h1>
          <p className="text-gray-600">Track your application progress</p>
        </div>

        <ApplicationTracker application={existingApplication} />
      </div>
    );
  }

  // Show form if type is selected
  if (selectedType === 'trainer') {
    return (
      <div className="space-y-6">
        {BackButton}
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back to Selection
        </Button>
        <TrainerApplicationForm onSubmitted={handleApplicationSubmitted} />
      </div>
    );
  }

  if (selectedType === 'volunteer') {
    return (
      <div className="space-y-6">
        {BackButton}
        <Button variant="outline" onClick={handleBack} className="mb-4">
          ← Back to Selection
        </Button>
        <VolunteerApplicationForm onSubmitted={handleApplicationSubmitted} />
      </div>
    );
  }

  // Show selection screen
  return (
    <div className="space-y-6">
      {BackButton}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Member</h1>
        <p className="text-gray-600">Join our community as a Trainer or Volunteer and make a difference</p>
      </div>

      <Alert>
        <AlertDescription>
          🌟 Ready to spread joy and enhance well-being? Choose your path below and become part of our mission to create happier communities!
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trainer Option */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500 cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Become a Trainer</CardTitle>
            <CardDescription>
              Lead workshops and share your expertise in happiness and well-being
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Facilitate workshops on happiness, mindfulness, and well-being</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Enhance your professional portfolio and gain experience</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Lead nationally recognized training sessions</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-blue-500">✓</span>
                <span>Join a community of like-minded professionals</span>
              </p>
            </div>

            <Button
              onClick={() => handleTypeSelect('trainer')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Apply as Trainer
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Volunteer Option */}
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500 cursor-pointer group">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl">Become a Volunteer</CardTitle>
            <CardDescription>
              Support our mission by helping organize and facilitate events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Support workshop organization and logistics</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Assist trainers and participants during events</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Contribute to community outreach and engagement</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Make a meaningful impact in people's lives</span>
              </p>
            </div>

            <Button
              onClick={() => handleTypeSelect('volunteer')}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              Apply as Volunteer
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Application Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Submit Application</h4>
              <p className="text-xs text-gray-600">Fill out the detailed form with your information</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-yellow-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Under Review</h4>
              <p className="text-xs text-gray-600">Our team reviews your application</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Interview</h4>
              <p className="text-xs text-gray-600">Schedule an orientation meeting</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h4 className="font-semibold text-sm mb-1">Get Started</h4>
              <p className="text-xs text-gray-600">Begin your journey with us!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
