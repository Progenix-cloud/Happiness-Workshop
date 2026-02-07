'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Booking {
  _id: string;
  workshopId: string;
  workshopTitle: string;
  trainer: string;
  date: string;
  time: string;
  location: string;
  status: 'booked' | 'attended' | 'interested';
  registeredAt: string;
}

export function MyBookingsPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'booked';

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialStatus);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/bookings/${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookedWorkshops = bookings.filter(b => b.status === 'booked');
  const attendedWorkshops = bookings.filter(b => b.status === 'attended');
  const interestedWorkshops = bookings.filter(b => b.status === 'interested');

  const renderWorkshops = (workshops: Booking[]) => {
    if (workshops.length === 0) {
      return (
        <Alert>
          <AlertDescription>No workshops in this category yet</AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workshops.map(booking => (
          <Card key={booking._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{booking.workshopTitle}</CardTitle>
                  <CardDescription>{booking.trainer}</CardDescription>
                </div>
                <Badge variant="outline">
                  {booking.status === 'booked' && '📅 Booked'}
                  {booking.status === 'attended' && '✅ Attended'}
                  {booking.status === 'interested' && '❤️ Interested'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">📅 Date:</span>
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">🕐 Time:</span>
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📍 Location:</span>
                  <span>{booking.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">📝 Registered:</span>
                  <span>{new Date(booking.registeredAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t space-y-2">
                {booking.status === 'booked' && (
                  <>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      Mark as Attended
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Cancel Registration
                    </Button>
                  </>
                )}

                {booking.status === 'attended' && (
                  <>
                    <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                      Download Certificate
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Share Achievement
                    </Button>
                  </>
                )}

                {booking.status === 'interested' && (
                  <>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                      Register Now
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="sm">
                      Remove from Interested
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-10">Loading your bookings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Workshops</h1>
        <p className="text-gray-600">Track your workshop journey - booked, attended, and interested workshops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{bookedWorkshops.length}</div>
            <p className="text-xs text-gray-500 mt-1">Upcoming workshops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{attendedWorkshops.length}</div>
            <p className="text-xs text-gray-500 mt-1">Completed workshops</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Interested</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{interestedWorkshops.length}</div>
            <p className="text-xs text-gray-500 mt-1">Saved for later</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="booked">
        <TabsList>
          <TabsTrigger value="booked">
            📅 Booked ({bookedWorkshops.length})
          </TabsTrigger>
          <TabsTrigger value="attended">
            ✅ Attended ({attendedWorkshops.length})
          </TabsTrigger>
          <TabsTrigger value="interested">
            ❤️ Interested ({interestedWorkshops.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="booked" className="space-y-4">
          {renderWorkshops(bookedWorkshops)}
        </TabsContent>

        <TabsContent value="attended" className="space-y-4">
          {renderWorkshops(attendedWorkshops)}
        </TabsContent>

        <TabsContent value="interested" className="space-y-4">
          {renderWorkshops(interestedWorkshops)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
