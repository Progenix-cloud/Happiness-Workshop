'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Trainer {
  _id: string;
  name: string;
  expertise: string[];
  experience: string;
  bio?: string;
  avatar?: string;
  workshopsLed: number;
  rating: number;
  email: string;
}

export function TrainersGalleryPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [filteredTrainers, setFilteredTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');

  const allExpertiseAreas = [
    'Happiness',
    'Inner Joy',
    'Team Connect',
    'Conscious Sleep (Yog-Nidra)',
    'IKIGAI',
    'Stress Management',
    'Meditation',
    'Mindfulness',
    'Yoga',
  ];

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const res = await fetch('/api/trainers');
      if (res.ok) {
        const data = await res.json();
        setTrainers(data);
        setFilteredTrainers(data);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = trainers;

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedExpertise) {
      filtered = filtered.filter(t =>
        t.expertise.includes(selectedExpertise)
      );
    }

    setFilteredTrainers(filtered);
  }, [searchTerm, selectedExpertise, trainers]);

  if (loading) {
    return <div className="text-center py-10">Loading trainers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Meet Our Trainers</h1>
        <p className="text-gray-600">Discover our passionate happiness and well-being trainers</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search trainer name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <Label>Expertise</Label>
            <select
              value={selectedExpertise}
              onChange={(e) => setSelectedExpertise(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Expertise</option>
              {allExpertiseAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedExpertise('');
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {filteredTrainers.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-600">
            No trainers found matching your criteria
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map(trainer => (
            <Card key={trainer._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img
                    src={trainer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${trainer.name}`}
                    alt={trainer.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-lg">{trainer.name}</CardTitle>
                    <CardDescription className="text-xs">{trainer.experience}</CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-lg">⭐</span>
                      <span className="font-semibold text-sm">{trainer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {trainer.bio && (
                  <p className="text-sm text-gray-600">{trainer.bio}</p>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.expertise.map(exp => (
                      <Badge key={exp} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t text-sm">
                  <div>
                    <p className="text-gray-600">Workshops Led</p>
                    <p className="text-2xl font-bold text-blue-600">{trainer.workshopsLed}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-orange-600">{trainer.rating}</p>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center text-gray-600">
        Showing {filteredTrainers.length} of {trainers.length} trainers
      </div>
    </div>
  );
}
