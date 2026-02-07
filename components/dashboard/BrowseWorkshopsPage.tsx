'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  maxCapacity: number;
  currentEnrollment: number;
  poster?: string;
}

export function BrowseWorkshopsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);

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

    if (filterMode !== 'all') {
      filtered = filtered.filter(w => w.mode === filterMode);
    }

    if (filterLocation) {
      filtered = filtered.filter(w =>
        w.location.toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWorkshops(filtered);
  }, [filterMode, filterLocation, searchTerm, workshops]);

  const handleRegister = async (workshopId: string) => {
    try {
      const res = await fetch('/api/workshops/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          workshopId,
          status: 'booked',
        }),
      });

      if (res.ok) {
        alert('Successfully registered for the workshop!');
        setRegistrationOpen(false);
        fetchWorkshops();
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Failed to register');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading workshops...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Happiness Workshops</h1>
        <p className="text-gray-600">Explore our engaging workshops designed to spread happiness and well-being</p>
      </div>

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
            <Label>Location</Label>
            <Input
              placeholder="Filter by location..."
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setFilterMode('all');
                setFilterLocation('');
                setSearchTerm('');
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="table">Table View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkshops.map((workshop) => (
              <Card key={workshop._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{workshop.mode}</Badge>
                    <Badge variant={workshop.currentEnrollment < workshop.maxCapacity ? 'default' : 'destructive'}>
                      {workshop.currentEnrollment}/{workshop.maxCapacity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{workshop.title}</CardTitle>
                  <CardDescription className="text-sm">{workshop.trainer}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-600">{workshop.description}</p>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📅</span>
                      <span>{new Date(workshop.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">🕐</span>
                      <span>{workshop.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">📍</span>
                      <span>{workshop.location}</span>
                    </div>
                  </div>

                  <Dialog open={registrationOpen && selectedWorkshop?._id === workshop._id} onOpenChange={setRegistrationOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => setSelectedWorkshop(workshop)}
                        disabled={workshop.currentEnrollment >= workshop.maxCapacity}
                      >
                        {workshop.currentEnrollment >= workshop.maxCapacity ? 'Full' : 'Register Now'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Register for {workshop.title}</DialogTitle>
                        <DialogDescription>
                          Confirm your registration for this workshop
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                          <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                          <p><strong>Time:</strong> {workshop.time}</p>
                          <p><strong>Location:</strong> {workshop.location}</p>
                          <p><strong>Mode:</strong> {workshop.mode}</p>
                        </div>
                        <Button
                          onClick={() => handleRegister(workshop._id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Confirm Registration
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="table">
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="bg-gray-50">
                    <th className="text-left p-4">Workshop</th>
                    <th className="text-left p-4">Trainer</th>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Location</th>
                    <th className="text-left p-4">Mode</th>
                    <th className="text-left p-4">Seats</th>
                    <th className="text-left p-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkshops.map((workshop) => (
                    <tr key={workshop._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{workshop.title}</td>
                      <td className="p-4">{workshop.trainer}</td>
                      <td className="p-4">{new Date(workshop.date).toLocaleDateString()}</td>
                      <td className="p-4">{workshop.location}</td>
                      <td className="p-4">
                        <Badge variant="outline">{workshop.mode}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={workshop.currentEnrollment < workshop.maxCapacity ? 'default' : 'destructive'}>
                          {workshop.currentEnrollment}/{workshop.maxCapacity}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedWorkshop(workshop)}
                              disabled={workshop.currentEnrollment >= workshop.maxCapacity}
                            >
                              Register
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Register for {workshop.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                                <p><strong>Date:</strong> {new Date(workshop.date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {workshop.time}</p>
                                <p><strong>Location:</strong> {workshop.location}</p>
                                <p><strong>Mode:</strong> {workshop.mode}</p>
                              </div>
                              <Button
                                onClick={() => handleRegister(workshop._id)}
                                className="w-full bg-green-600 hover:bg-green-700"
                              >
                                Confirm
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-center text-gray-600">
        Showing {filteredWorkshops.length} of {workshops.length} workshops
      </div>
    </div>
  );
}
