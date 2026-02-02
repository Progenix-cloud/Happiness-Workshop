'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Users, Clock } from 'lucide-react';

interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  contactPhone: string;
  contactEmail: string;
  facilities: string[];
  mapUrl: string;
  workshopsHeld: number;
  latitude: number;
  longitude: number;
}

const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Main Conference Hall',
    address: '123 Happiness Street',
    city: 'New York, NY',
    capacity: 200,
    contactPhone: '+1 (555) 123-4567',
    contactEmail: 'main.hall@happinessfoundation.org',
    facilities: ['Projector', 'Microphone', 'WiFi', 'Parking'],
    mapUrl: 'https://maps.google.com/?q=40.7128,-74.0060',
    workshopsHeld: 45,
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    id: '2',
    name: 'Downtown Workshop Center',
    address: '456 Joy Avenue',
    city: 'Boston, MA',
    capacity: 100,
    contactPhone: '+1 (555) 234-5678',
    contactEmail: 'downtown@happinessfoundation.org',
    facilities: ['AC', 'Catering', 'WiFi', 'Breakout Rooms'],
    mapUrl: 'https://maps.google.com/?q=42.3601,-71.0589',
    workshopsHeld: 32,
    latitude: 42.3601,
    longitude: -71.0589
  },
  {
    id: '3',
    name: 'Riverside Community Center',
    address: '789 Wellbeing Lane',
    city: 'Chicago, IL',
    capacity: 150,
    contactPhone: '+1 (555) 345-6789',
    contactEmail: 'riverside@happinessfoundation.org',
    facilities: ['Garden Space', 'Kitchen', 'WiFi', 'Outdoor Area'],
    mapUrl: 'https://maps.google.com/?q=41.8781,-87.6298',
    workshopsHeld: 28,
    latitude: 41.8781,
    longitude: -87.6298
  }
];

export const VenueLocations: React.FC = () => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor'>('all');

  const handleOpenMaps = (venue: Venue) => {
    window.open(venue.mapUrl, '_blank');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Workshop Venues</h2>
        </div>
        <p className="text-green-100">Find the perfect location for your happiness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVenues.map(venue => (
          <Card
            key={venue.id}
            className="p-6 hover:shadow-lg transition cursor-pointer border-l-4 border-green-500"
            onClick={() => setSelectedVenue(venue)}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
              <p className="text-sm text-gray-600">{venue.city}</p>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Capacity: {venue.capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{venue.workshopsHeld} workshops held</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {venue.facilities.slice(0, 2).map(facility => (
                <Badge key={facility} variant="secondary" className="text-xs">
                  {facility}
                </Badge>
              ))}
              {venue.facilities.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{venue.facilities.length - 2}
                </Badge>
              )}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-green-500 to-teal-500"
              onClick={e => {
                e.stopPropagation();
                handleOpenMaps(venue);
              }}
            >
              View on Maps
            </Button>
          </Card>
        ))}
      </div>

      {/* Venue Details Modal */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white max-h-96 overflow-y-auto">
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-2 text-gray-900">{selectedVenue.name}</h2>
              <p className="text-gray-600 mb-6">{selectedVenue.city}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold text-gray-900">{selectedVenue.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Capacity</p>
                    <p className="font-semibold text-gray-900">{selectedVenue.capacity} people</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Phone</p>
                    <p className="font-semibold text-gray-900">{selectedVenue.contactPhone}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedVenue.contactEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Workshops Held</p>
                    <p className="font-semibold text-gray-900">{selectedVenue.workshopsHeld}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Facilities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedVenue.facilities.map(facility => (
                    <Badge key={facility} className="bg-green-100 text-green-800">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500"
                  onClick={() => handleOpenMaps(selectedVenue)}
                >
                  View on Maps
                </Button>
                <Button
                  className="flex-1 bg-transparent"
                  variant="outline"
                  onClick={() => setSelectedVenue(null)}
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
