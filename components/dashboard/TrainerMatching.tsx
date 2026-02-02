'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, Zap } from 'lucide-react';

interface Trainer {
  id: string;
  name: string;
  expertise: string[];
  experience: number;
  rating: number;
  reviews: number;
  bio: string;
  avatar: string;
  matchScore: number;
  availability: string;
  hourlyRate: number;
}

const mockTrainers: Trainer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    expertise: ['Mindfulness', 'Stress Management', 'Meditation'],
    experience: 8,
    rating: 4.9,
    reviews: 127,
    bio: 'Certified mindfulness coach with 8 years of experience',
    avatar: 'SJ',
    matchScore: 98,
    availability: 'Available',
    hourlyRate: 75
  },
  {
    id: '2',
    name: 'Michael Chen',
    expertise: ['Team Building', 'Happiness', 'Corporate Wellness'],
    experience: 10,
    rating: 4.8,
    reviews: 203,
    bio: 'Corporate wellness expert helping teams thrive',
    avatar: 'MC',
    matchScore: 95,
    availability: 'Available',
    hourlyRate: 85
  },
  {
    id: '3',
    name: 'Emma Wilson',
    expertise: ['Emotional Intelligence', 'Wellbeing', 'Leadership'],
    experience: 6,
    rating: 4.7,
    reviews: 89,
    bio: 'Empowering leaders to build happier workplaces',
    avatar: 'EW',
    matchScore: 92,
    availability: 'Limited',
    hourlyRate: 65
  }
];

export const TrainerMatching: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const [sortBy, setSortBy] = useState<'match' | 'rating' | 'experience'>('match');

  const sortedTrainers = [...mockTrainers].sort((a, b) => {
    if (sortBy === 'match') return b.matchScore - a.matchScore;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.experience - a.experience;
  });

  const handleBookTrainer = (trainer: Trainer) => {
    console.log('[v0] Booking trainer:', trainer);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Zap className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Find Your Perfect Trainer</h2>
        </div>
        <p className="text-blue-100">AI-matched trainers based on your needs and preferences</p>
      </div>

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50">
        <div className="flex gap-2">
          {(['match', 'rating', 'experience'] as const).map(option => (
            <Button
              key={option}
              variant={sortBy === option ? 'default' : 'outline'}
              onClick={() => setSortBy(option)}
              className="capitalize"
            >
              Sort by {option}
            </Button>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTrainers.map(trainer => (
          <Card
            key={trainer.id}
            className="p-6 hover:shadow-lg transition cursor-pointer overflow-hidden relative"
            onClick={() => setSelectedTrainer(trainer)}
          >
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white">
                {trainer.matchScore}% Match
              </Badge>
            </div>

            {/* Profile Header */}
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16 text-lg font-bold">
                <AvatarFallback>{trainer.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                <p className="text-sm text-gray-600">{trainer.experience} years experience</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-700 mb-4">{trainer.bio}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(trainer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {trainer.rating} ({trainer.reviews} reviews)
              </span>
            </div>

            {/* Expertise Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.expertise.map(exp => (
                <Badge key={exp} variant="secondary" className="text-xs">
                  {exp}
                </Badge>
              ))}
            </div>

            {/* Availability & Rate */}
            <div className="flex justify-between items-center mb-4 text-sm">
              <Badge
                className={trainer.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
              >
                {trainer.availability}
              </Badge>
              <span className="font-semibold text-gray-900">${trainer.hourlyRate}/hr</span>
            </div>

            {/* Action Button */}
            <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
              Book Session
            </Button>
          </Card>
        ))}
      </div>

      {/* Trainer Details Modal */}
      {selectedTrainer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white">
            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <Avatar className="w-24 h-24 text-2xl font-bold">
                  <AvatarFallback>{selectedTrainer.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTrainer.name}</h2>
                  <p className="text-gray-600">{selectedTrainer.experience} years of experience</p>
                  <div className="flex items-center gap-2 mt-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(selectedTrainer.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm">{selectedTrainer.rating} ({selectedTrainer.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedTrainer.bio}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Expertise</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTrainer.expertise.map(exp => (
                      <Badge key={exp}>{exp}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Details</p>
                  <div className="space-y-1 mt-2">
                    <p className="font-semibold">${selectedTrainer.hourlyRate}/hour</p>
                    <p className={selectedTrainer.availability === 'Available' ? 'text-green-600' : 'text-yellow-600'}>
                      {selectedTrainer.availability}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                  onClick={() => {
                    handleBookTrainer(selectedTrainer);
                    setSelectedTrainer(null);
                  }}
                >
                  Book Session
                </Button>
                <Button
                  className="flex-1 bg-transparent"
                  variant="outline"
                  onClick={() => setSelectedTrainer(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
