'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeaturesWelcome } from '@/components/dashboard/FeaturesWelcome';
import { EmotionWheel } from '@/components/dashboard/EmotionWheel';
import { WorkshopCalendar } from '@/components/dashboard/WorkshopCalendar';
import { ZoomIntegration } from '@/components/dashboard/ZoomIntegration';
import { SocialMediaShare } from '@/components/dashboard/SocialMediaShare';
import { AttendanceQR } from '@/components/dashboard/AttendanceQR';
import { EmotionTracking } from '@/components/dashboard/EmotionTracking';
import { VenueLocations } from '@/components/dashboard/VenueLocations';
import { NPSSurvey } from '@/components/dashboard/NPSSurvey';
import { TrainerMatching } from '@/components/dashboard/TrainerMatching';
import { AnalyticsExport } from '@/components/dashboard/AnalyticsExport';
import { TeamCollaboration } from '@/components/dashboard/TeamCollaboration';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto py-6">
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-7 gap-2 mb-6 bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="emotion-wheel">Emotion Wheel</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="zoom">Zoom</TabsTrigger>
            <TabsTrigger value="social">Share</TabsTrigger>
            <TabsTrigger value="attendance">QR</TabsTrigger>
            <TabsTrigger value="emotion-tracking">Tracking</TabsTrigger>
          </TabsList>

          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 mb-6 bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="venues">Venues</TabsTrigger>
            <TabsTrigger value="nps">NPS</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="collaboration">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome">
            <FeaturesWelcome />
          </TabsContent>

          <TabsContent value="emotion-wheel" className="bg-white rounded-lg shadow p-6">
            <EmotionWheel />
          </TabsContent>

          <TabsContent value="calendar" className="bg-white rounded-lg shadow p-6">
            <WorkshopCalendar />
          </TabsContent>

          <TabsContent value="zoom" className="bg-white rounded-lg shadow">
            <ZoomIntegration />
          </TabsContent>

          <TabsContent value="social" className="bg-white rounded-lg shadow">
            <SocialMediaShare />
          </TabsContent>

          <TabsContent value="attendance" className="bg-white rounded-lg shadow">
            <AttendanceQR />
          </TabsContent>

          <TabsContent value="emotion-tracking" className="bg-white rounded-lg shadow">
            <EmotionTracking />
          </TabsContent>

          <TabsContent value="venues" className="bg-white rounded-lg shadow">
            <VenueLocations />
          </TabsContent>

          <TabsContent value="nps" className="bg-white rounded-lg shadow">
            <NPSSurvey />
          </TabsContent>

          <TabsContent value="trainers" className="bg-white rounded-lg shadow">
            <TrainerMatching />
          </TabsContent>

          <TabsContent value="analytics" className="bg-white rounded-lg shadow">
            <AnalyticsExport />
          </TabsContent>

          <TabsContent value="collaboration" className="bg-white rounded-lg shadow">
            <TeamCollaboration />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
