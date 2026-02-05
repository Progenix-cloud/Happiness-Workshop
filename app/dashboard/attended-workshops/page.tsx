/**
 * Attended Workshops Dashboard Page
 * Shows user's completed workshops with attendance stats
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Download, TrendingUp } from 'lucide-react';

interface AttendedWorkshop {
  workshopId: string;
  workshopTitle: string;
  date: string;
  totalDurationMinutes: number;
  attendancePercentage: number;
  status: string;
  certificateUnlocked: boolean;
  joyCoinsAwarded: boolean;
}

export default function AttendedWorkshopsPage() {
  const [workshops, setWorkshops] = useState<AttendedWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendedWorkshops();
  }, []);

  async function fetchAttendedWorkshops() {
    try {
      const res = await fetch('/api/workshops/attended');
      const data = await res.json();
      setWorkshops(data.workshops || []);
    } catch (error) {
      console.error('Failed to fetch workshops:', error);
    } finally {
      setLoading(false);
    }
  }

  function getAttendanceColor(percentage: number): string {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  }

  function getAttendanceBadge(percentage: number): string {
    if (percentage >= 90) return 'bg-green-100 text-green-800 hover:bg-green-100';
    if (percentage >= 75) return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
    if (percentage >= 50) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
    return 'bg-red-100 text-red-800 hover:bg-red-100';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attended Workshops</h1>
        <p className="text-gray-600 mt-2">
          View your workshop attendance history and download certificates
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workshops.length}</div>
            <p className="text-xs text-gray-600">workshops completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Download className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workshops.filter((w) => w.certificateUnlocked).length}
            </div>
            <p className="text-xs text-gray-600">available to download</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {workshops.length > 0
                ? Math.round(
                    workshops.reduce((sum, w) => sum + w.attendancePercentage, 0) /
                      workshops.length
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-gray-600">across all workshops</p>
          </CardContent>
        </Card>
      </div>

      {/* Workshops List */}
      <div className="grid gap-4">
        {workshops.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No workshops yet</h3>
              <p className="text-gray-600 text-center max-w-md">
                Join workshops and attend sessions to see your attendance history here.
              </p>
            </CardContent>
          </Card>
        ) : (
          workshops.map((workshop) => (
            <Card key={workshop.workshopId} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{workshop.workshopTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      Attended on {new Date(workshop.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardDescription>
                  </div>
                  <Badge className={getAttendanceBadge(workshop.attendancePercentage)}>
                    {workshop.attendancePercentage}% Attendance
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{workshop.totalDurationMinutes} minutes</span>
                    </div>
                    {workshop.certificateUnlocked && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span>Certificate Earned</span>
                      </div>
                    )}
                    {workshop.joyCoinsAwarded && (
                      <div className="flex items-center gap-2 text-yellow-600">
                        <span>💰 JoyCoins Awarded</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {workshop.certificateUnlocked ? (
                      <Button
                        onClick={() =>
                          window.open(`/api/certificates/download/${workshop.workshopId}`, '_blank')
                        }
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                    ) : (
                      <div className="text-sm text-gray-600">
                        📋 Certificate unavailable (75% attendance required)
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
