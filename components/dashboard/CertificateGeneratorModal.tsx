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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface CertificateGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: IWorkshop | null;
}

export function CertificateGeneratorModal({
  isOpen,
  onClose,
  workshop,
}: CertificateGeneratorModalProps) {
  // Early return BEFORE ALL HOOKS
  if (!workshop) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const attendedParticipants = workshop.registrations?.filter(
    (r) => r.status === 'attended'
  ) || [];

  const handleGenerateCertificates = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // For each attended participant, create a certificate record
      const certificateData = {
        workshopId: workshop._id,
        workshopTitle: workshop.title,
        trainerName: workshop.trainer,
        recipientCount: attendedParticipants.length,
        generatedAt: new Date(),
        participants: attendedParticipants.map((p) => ({
          participantId: p.userId,
          name: p.registrationDetails?.fullName || 'Participant',
          email: p.registrationDetails?.email || 'N/A',
        })),
      };

      // This would typically call an API to generate certificates
      // For now, we'll just show success
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setGeneratedCount(attendedParticipants.length);
      setSuccess(true);

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Certificates</DialogTitle>
          <DialogDescription>
            Automatically create certificates for participants who attended
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
                ✓ {generatedCount} certificate{generatedCount !== 1 ? 's' : ''} generated successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Workshop Info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-gray-700">{workshop.title}</p>
            <p className="text-xs text-gray-600">
              Date: {new Date(workshop.date || '').toLocaleDateString()}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-blue-900">
                {attendedParticipants.length}
              </p>
              <p className="text-xs text-blue-700 mt-1">Attended</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-900">
                {(workshop.registrations?.length || 0) - attendedParticipants.length}
              </p>
              <p className="text-xs text-orange-700 mt-1">Not Attended</p>
            </div>
          </div>

          {/* Participant List */}
          {attendedParticipants.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Eligible Participants:</p>
              <div className="max-h-40 overflow-auto bg-gray-50 rounded-lg p-3 space-y-1">
                {attendedParticipants.map((p, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    ✓ {p.registrationDetails?.fullName || 'Participant'} ({p.registrationDetails?.email || 'N/A'})
                  </p>
                ))}
              </div>
            </div>
          )}

          {attendedParticipants.length === 0 && (
            <Alert variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No attended participants to generate certificates for
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
          <Button
            onClick={handleGenerateCertificates}
            disabled={loading || attendedParticipants.length === 0}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate {attendedParticipants.length} Certificate
            {attendedParticipants.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
