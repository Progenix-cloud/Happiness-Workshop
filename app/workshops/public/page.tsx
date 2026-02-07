'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  registrations: any[];
}

export default function PublicWorkshopsPage() {
  const router = useRouter();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const res = await fetch('/api/workshops');
      if (res.ok) {
        const data = await res.json();
        // Filter for public/open workshops
        const publicWorkshops = data.filter((w: Workshop) => 
          w.mode === 'online' || w.mode === 'offline' || w.mode === 'hybrid'
        );
        setWorkshops(publicWorkshops);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinNow = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading workshops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-teal-500 to-orange-500 bg-clip-text text-transparent">
                Open Workshops
              </h1>
              <p className="text-gray-600 mt-1">Free and open to everyone in the community</p>
            </div>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-teal-500 text-teal-600 hover:bg-teal-50"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Workshops Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {workshops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center">
                <Calendar className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No workshops available</h2>
            <p className="text-gray-600 mb-6">Check back soon for upcoming workshops</p>
            <Button onClick={handleJoinNow} className="bg-gradient-to-r from-teal-500 to-teal-600">
              Join to Get Notified
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop, index) => {
              const spotsLeft = workshop.maxCapacity - workshop.registrations.length;
              const isFull = spotsLeft <= 0;

              return (
                <motion.div
                  key={workshop._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-teal-200 bg-white">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge 
                          variant={workshop.mode === 'online' ? 'default' : 'outline'}
                          className={
                            workshop.mode === 'online' 
                              ? 'bg-blue-100 text-blue-700' 
                              : workshop.mode === 'offline'
                                ? 'bg-green-100 text-green-700 border-green-300'
                                : 'bg-purple-100 text-purple-700 border-purple-300'
                          }
                        >
                          {workshop.mode}
                        </Badge>
                        <Badge variant={isFull ? 'destructive' : 'secondary'}>
                          {isFull ? 'Full' : `${spotsLeft} spots left`}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{workshop.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {workshop.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {workshop.description}
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4 text-teal-500" />
                          <span>{new Date(workshop.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock className="w-4 h-4 text-teal-500" />
                          <span>{workshop.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-teal-500" />
                          <span className="line-clamp-1">{workshop.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="w-4 h-4 text-teal-500" />
                          <span>{workshop.registrations.length} / {workshop.maxCapacity} registered</span>
                        </div>
                      </div>

                      <Button
                        onClick={handleJoinNow}
                        disabled={isFull}
                        className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-50"
                      >
                        {isFull ? 'Workshop Full' : 'Join to Register'}
                        {!isFull && <ArrowRight className="w-4 h-4 ml-2" />}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        {workshops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center bg-white rounded-2xl p-8 shadow-lg border-2 border-teal-100"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Ready to Join the Happiness Journey?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Create an account to register for workshops, earn certificates, and become part of our community
            </p>
            <Button
              onClick={handleJoinNow}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 via-teal-500 to-orange-500 hover:opacity-90 text-white px-8 py-6 text-lg shadow-xl"
            >
              Get Started Now
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
