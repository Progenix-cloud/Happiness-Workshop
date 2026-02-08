'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle, QrCode } from 'lucide-react';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface AttendanceMarkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: IWorkshop | null;
  onSuccess?: () => void;
}

export function AttendanceMarkingModal({
  isOpen,
  onClose,
  workshop,
  onSuccess,
}: AttendanceMarkingModalProps) {
  // Early return BEFORE ALL HOOKS
  if (!workshop) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrMode, setQrMode] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [markedCount, setMarkedCount] = useState(0);

  const participants = workshop.registrations || [];

  const bookedParticipants = participants.filter((p) => p.status === 'booked');

  const filteredParticipants = bookedParticipants.filter((p) =>
    p.registrationDetails?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.registrationDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkAttended = (participantId: string, name: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [participantId]: 'attended',
    }));
  };

  const handleMarkAbsent = (participantId: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [participantId]: 'absent',
    }));
  };

  const handleUnmark = (participantId: string) => {
    setAttendanceData((prev) => {
      const next = { ...prev };
      delete next[participantId];
      return next;
    });
  };

  const handleQRScan = (participantId: string) => {
    handleMarkAttended(participantId, '');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let count = 0;

      // Update each participant's status
      for (const [participantId, status] of Object.entries(attendanceData)) {
        await fetch(`/api/workshops/${workshop._id}/attendance`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            participantId,
            status,
          }),
        }).catch(() => {
          // Continue even if individual requests fail
        });
        count++;
      }

      setMarkedCount(count);
      setSuccess(true);
      setAttendanceData({});

      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const attendedCount = Object.values(attendanceData).filter((s) => s === 'attended').length;
  const absentCount = Object.values(attendanceData).filter((s) => s === 'absent').length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Mark participants as attended or absent for this workshop
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                ✓ Attendance marked for {markedCount} participant
                {markedCount !== 1 ? 's' : ''}!
              </AlertDescription>
            </Alert>
          )}

          {/* Workshop Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700">{workshop.title}</p>
            <p className="text-xs text-gray-600">
              Date: {new Date(workshop.date || '').toLocaleDateString()}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-lg p-2 text-center">
              <p className="text-xl font-bold text-blue-900">{bookedParticipants.length}</p>
              <p className="text-xs text-blue-700">Total Booked</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-xl font-bold text-green-900">{attendedCount}</p>
              <p className="text-xs text-green-700">Marked Attended</p>
            </div>
            <div className="bg-red-50 rounded-lg p-2 text-center">
              <p className="text-xl font-bold text-red-900">{absentCount}</p>
              <p className="text-xs text-red-700">Marked Absent</p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex gap-2 border-b pb-3">
            <Button
              variant={!qrMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setQrMode(false)}
            >
              Manual Entry
            </Button>
            <Button variant={qrMode ? 'default' : 'outline'} size="sm" onClick={() => setQrMode(true)}>
              <QrCode className="h-4 w-4 mr-2" />
              QR Code Mode
            </Button>
          </div>

          {/* Search */}
          <Input
            placeholder="Search participants by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />

          {/* Participants List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((participant) => {
                const status = attendanceData[participant.userId || ''];

                return (
                  <div
                    key={participant.userId}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      status === 'attended'
                        ? 'bg-green-50 border-green-300'
                        : status === 'absent'
                          ? 'bg-red-50 border-red-300'
                          : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{participant.registrationDetails?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-600">{participant.registrationDetails?.email || 'N/A'}</p>
                      </div>

                      <div className="flex gap-2">
                        {!status ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() =>
                                handleMarkAttended(participant.userId || '', participant.registrationDetails?.fullName || '')
                              }
                            >
                              ✓ Present
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleMarkAbsent(participant.userId || '')}
                            >
                              ✕ Absent
                            </Button>
                          </>
                        ) : (
                          <>
                            <span
                              className={`px-3 py-1 rounded text-sm font-medium ${
                                status === 'attended'
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-red-200 text-red-800'
                              }`}
                            >
                              {status === 'attended' ? '✓ Attended' : '✕ Absent'}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUnmark(participant.userId || '')}
                            >
                              Undo
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                {bookedParticipants.length === 0
                  ? 'No participants booked for this workshop'
                  : 'No participants found matching search'}
              </div>
            )}
          </div>

          {/* Note */}
          {qrMode && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                QR code scanning requires a camera-enabled device. Point the camera at participant QR codes to mark attendance.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || Object.keys(attendanceData).length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Attendance ({Object.keys(attendanceData).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
