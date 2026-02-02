'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Video, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ZoomMeeting {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  participants: number;
  meetingLink: string;
  status: 'upcoming' | 'live' | 'completed';
}

const mockZoomMeetings: ZoomMeeting[] = [
  {
    id: '1',
    title: 'Mindfulness Workshop - Live Session',
    startTime: '2024-01-15T10:00:00Z',
    duration: 60,
    participants: 35,
    meetingLink: 'https://zoom.us/j/123456789',
    status: 'live'
  },
  {
    id: '2',
    title: 'Stress Management Q&A',
    startTime: '2024-01-16T14:00:00Z',
    duration: 45,
    participants: 28,
    meetingLink: 'https://zoom.us/j/987654321',
    status: 'upcoming'
  }
];

export const ZoomIntegration: React.FC = () => {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>(mockZoomMeetings);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Meeting link copied to clipboard!');
  };

  const handleJoinMeeting = (link: string) => {
    window.open(link, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Video className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Zoom Meetings</h2>
        </div>
        <p className="text-blue-100">Join virtual workshops and sessions with one click</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {meetings.map(meeting => (
          <Card
            key={meeting.id}
            className="p-6 border-l-4 border-blue-500 hover:shadow-lg transition bg-white"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
              <Badge className={getStatusColor(meeting.status)}>
                {meeting.status.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3 mb-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(meeting.startTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="ml-auto text-gray-500">{meeting.duration} mins</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{meeting.participants} participants</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white"
                onClick={() => handleJoinMeeting(meeting.meetingLink)}
              >
                Join Zoom Meeting
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => handleCopyLink(meeting.meetingLink)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Meeting Link
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
