'use client';

import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WorkshopEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  capacity: number;
  registered: number;
  trainer: string;
  zoomLink?: string;
}

const mockEvents: WorkshopEvent[] = [
  {
    id: '1',
    title: 'Mindfulness for Beginners',
    date: new Date(2024, 0, 15),
    time: '10:00 AM',
    location: 'Main Hall',
    mode: 'Offline',
    capacity: 50,
    registered: 35,
    trainer: 'Sarah Johnson',
    zoomLink: 'https://zoom.us/j/123456789'
  },
  {
    id: '2',
    title: 'Stress Management Workshop',
    date: new Date(2024, 0, 20),
    time: '2:00 PM',
    location: 'Online',
    mode: 'Online',
    capacity: 100,
    registered: 85,
    trainer: 'Michael Chen',
    zoomLink: 'https://zoom.us/j/987654321'
  },
  {
    id: '3',
    title: 'Happiness & Joy Session',
    date: new Date(2024, 0, 25),
    time: '6:00 PM',
    location: 'Conference Room',
    mode: 'Hybrid',
    capacity: 75,
    registered: 60,
    trainer: 'Emma Wilson'
  }
];

export const WorkshopCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<WorkshopEvent | null>(null);

  const eventsOnDate = mockEvents.filter(
    event =>
      event.date.getDate() === selectedDate?.getDate() &&
      event.date.getMonth() === selectedDate?.getMonth()
  );

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Online':
        return 'bg-blue-100 text-blue-800';
      case 'Offline':
        return 'bg-green-100 text-green-800';
      case 'Hybrid':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Calendar */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Select Date</h3>
        <Calendar selected={selectedDate} onSelect={setSelectedDate} />
      </Card>

      {/* Events List */}
      <div className="md:col-span-2">
        <Card className="p-6 bg-white border-0 shadow-lg">
          <h3 className="text-lg font-bold mb-4 text-gray-900">
            {selectedDate?.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>

          {eventsOnDate.length > 0 ? (
            <div className="space-y-4">
              {eventsOnDate.map(event => (
                <div
                  key={event.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{event.title}</h4>
                    <Badge className={getModeColor(event.mode)}>{event.mode}</Badge>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>🕐 {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👨‍🏫 {event.trainer}</p>
                    <p>📊 {event.registered}/{event.capacity} registered</p>
                  </div>
                  <Button className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-500">
                    Register Now
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No workshops on this date. Select another date.
            </div>
          )}
        </Card>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">{selectedEvent.title}</h3>
              <div className="space-y-3 mb-4">
                <p>
                  <strong>Date:</strong> {selectedEvent.date.toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedEvent.time}
                </p>
                <p>
                  <strong>Location:</strong> {selectedEvent.location}
                </p>
                <p>
                  <strong>Mode:</strong> <Badge className={getModeColor(selectedEvent.mode)}>{selectedEvent.mode}</Badge>
                </p>
                <p>
                  <strong>Trainer:</strong> {selectedEvent.trainer}
                </p>
                <p>
                  <strong>Capacity:</strong> {selectedEvent.registered}/{selectedEvent.capacity}
                </p>
              </div>
              {selectedEvent.zoomLink && (
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-2"
                  onClick={() => window.open(selectedEvent.zoomLink, '_blank')}
                >
                  Join Zoom Meeting
                </Button>
              )}
              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => setSelectedEvent(null)}
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
