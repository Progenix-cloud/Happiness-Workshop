'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, User } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  workshopTitle: string;
  date: string;
  time: string;
  location: string;
  attendeeCount: number;
  qrCode: string;
  status: 'checked-in' | 'pending' | 'absent';
}

const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: '1',
    workshopTitle: 'Mindfulness for Beginners',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Main Hall',
    attendeeCount: 42,
    qrCode: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22white%22 width=%22100%22 height=%22100%22/%3E%3Crect fill=%22black%22 x=%2220%22 y=%2220%22 width=%2260%22 height=%2260%22/%3E%3C/svg%3E',
    status: 'checked-in'
  },
  {
    id: '2',
    workshopTitle: 'Stress Management',
    date: '2024-01-20',
    time: '2:00 PM',
    location: 'Conference Room',
    attendeeCount: 38,
    qrCode: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22white%22 width=%22100%22 height=%22100%22/%3E%3Crect fill=%22black%22 x=%2215%22 y=%2215%22 width=%2270%22 height=%2270%22/%3E%3C/svg%3E',
    status: 'pending'
  }
];

export const AttendanceQR: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked-in':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-teal-500 font-bold">QR</span>
          </div>
          <h2 className="text-2xl font-bold">Workshop Attendance</h2>
        </div>
        <p className="text-teal-100">Track your attendance with QR code check-ins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {records.map(record => (
          <Card
            key={record.id}
            className="p-6 hover:shadow-lg transition cursor-pointer"
            onClick={() => setSelectedRecord(record)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{record.workshopTitle}</h3>
              </div>
              <Badge className={getStatusColor(record.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(record.status)}
                  {record.status.replace('-', ' ').toUpperCase()}
                </div>
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{record.date} at {record.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{record.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{record.attendeeCount} attendees</span>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-teal-500 to-cyan-500">
              View QR Code
            </Button>
          </Card>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">{selectedRecord.workshopTitle}</h3>
              
              <div className="bg-white p-4 rounded-lg mb-6 flex justify-center">
                <img
                  src={selectedRecord.qrCode || "/placeholder.svg"}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <p>
                  <strong>Date:</strong> {selectedRecord.date} at {selectedRecord.time}
                </p>
                <p>
                  <strong>Location:</strong> {selectedRecord.location}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <Badge className={getStatusColor(selectedRecord.status)}>
                    {selectedRecord.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </p>
              </div>

              <Button
                className="w-full bg-transparent"
                variant="outline"
                onClick={() => setSelectedRecord(null)}
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
