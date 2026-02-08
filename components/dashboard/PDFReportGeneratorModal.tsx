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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle, Download } from 'lucide-react';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface PDFReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: IWorkshop | null;
}

const REPORT_TYPES = {
  attendance: { name: 'Attendance Report', icon: '📋' },
  feedback: { name: 'Feedback Summary', icon: '⭐' },
  full: { name: 'Complete Summary', icon: '📊' },
  participants: { name: 'Participant List', icon: '👥' },
};

export function PDFReportGeneratorModal({
  isOpen,
  onClose,
  workshop,
}: PDFReportGeneratorModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [reportType, setReportType] = useState('full');

  if (!workshop) return null;

  const generatePDFContent = () => {
    const date = new Date().toLocaleDateString();
    const workshopDate = new Date(workshop.date || '').toLocaleDateString();
    const attendedCount = workshop.registrations?.filter((r) => r.status === 'attended').length || 0;
    const totalParticipants = workshop.registrations?.length || 0;
    const avgRating = workshop.averageRating || 0;

    let content = `
WORKSHOP REPORT
Generated: ${date}
================================================================================

WORKSHOP DETAILS
Name: ${workshop.title}
Trainer: ${workshop.trainer}
Date: ${workshopDate}
Time: ${workshop.time}
Duration: ${workshop.duration} minutes
Category: ${workshop.category}
Mode: ${workshop.mode}
Location: ${workshop.location || 'Online'}
Status: ${workshop.status}

STATISTICS
Total Registrations: ${totalParticipants}
Attended: ${attendedCount}
Not Attended: ${totalParticipants - attendedCount}
Attendance Rate: ${totalParticipants > 0 ? ((attendedCount / totalParticipants) * 100).toFixed(1) : 0}%
Average Rating: ${avgRating.toFixed(1)}/5.0
Feedback Count: ${workshop.feedbackComments?.length || 0}

`;

    // Add section based on report type
    if (['attendance', 'full', 'participants'].includes(reportType)) {
      content += `
PARTICIPANTS
================================================================================
`;
      if (workshop.registrations && workshop.registrations.length > 0) {
        workshop.registrations.forEach((reg, index) => {
          content += `${index + 1}. ${reg.registrationDetails?.fullName || 'N/A'}
   Email: ${reg.registrationDetails?.email || 'N/A'}
   Phone: ${reg.registrationDetails?.phone || 'N/A'}
   Organization: ${reg.registrationDetails?.organization || 'N/A'}
   Status: ${reg.status}
   Registered: ${new Date(reg.registeredAt || '').toLocaleDateString()}
   
`;
        });
      } else {
        content += 'No participants registered\n';
      }
    }

    if (['feedback', 'full'].includes(reportType)) {
      content += `
FEEDBACK SUMMARY
================================================================================
`;
      if (workshop.feedbackComments && workshop.feedbackComments.length > 0) {
        const ratingCounts = [0, 0, 0, 0, 0];
        workshop.feedbackComments.forEach((fb) => {
          const rating = Math.floor(fb.rating || 0);
          if (rating >= 1 && rating <= 5) {
            ratingCounts[rating - 1]++;
          }
        });

        content += `Rating Distribution:
`;
        for (let i = 5; i >= 1; i--) {
          const count = ratingCounts[i - 1];
          const bar = '█'.repeat(count);
          content += `${i} stars: ${bar} (${count})\n`;
        }

        content += `
Detailed Comments:
================================================================================
`;
        workshop.feedbackComments.forEach((fb, index) => {
          content += `${index + 1}. ${fb.userName || 'Anonymous'} - ${fb.rating}/5 stars
   Date: ${new Date(fb.createdAt || '').toLocaleDateString()}
   Comment: ${fb.comment || 'No comment'}
   
`;
        });
      } else {
        content += 'No feedback received\n';
      }
    }

    content += `

NOTES
================================================================================
- Please review all information for accuracy
- For questions, contact the workshop trainer
- Report generated on ${date}

END OF REPORT
`;

    return content;
  };

  const downloadAsText = () => {
    const content = generatePDFContent();
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    element.setAttribute('download', `workshop-report-${workshop._id}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For MVP, we'll download as text
      // In production, use libraries like pdfkit or jsPDF
      downloadAsText();

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

  const reportInfo = REPORT_TYPES[reportType as keyof typeof REPORT_TYPES];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
          <DialogDescription>
            Download a comprehensive report of your workshop
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
                ✓ Report downloaded successfully!
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

          {/* Report Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select value={reportType} onValueChange={setReportType} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(REPORT_TYPES).map(([key, info]) => (
                  <SelectItem key={key} value={key}>
                    {info.icon} {info.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Report Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
            <p className="text-sm font-medium text-blue-900">What's included:</p>
            <ul className="text-sm text-blue-800 space-y-1">
              {reportType === 'full' && (
                <>
                  <li>✓ Workshop details & statistics</li>
                  <li>✓ Complete participant list</li>
                  <li>✓ Attendance summary</li>
                  <li>✓ Feedback & ratings</li>
                </>
              )}
              {reportType === 'attendance' && (
                <>
                  <li>✓ Workshop details</li>
                  <li>✓ Attendance statistics</li>
                  <li>✓ Participant list with status</li>
                </>
              )}
              {reportType === 'feedback' && (
                <>
                  <li>✓ Rating distribution</li>
                  <li>✓ All feedback comments</li>
                  <li>✓ Average rating</li>
                </>
              )}
              {reportType === 'participants' && (
                <>
                  <li>✓ Complete participant list</li>
                  <li>✓ Contact information</li>
                  <li>✓ Registration details</li>
                </>
              )}
            </ul>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-gray-800">
                {workshop.registrations?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Participants</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-lg font-bold text-gray-800">
                {workshop.feedbackComments?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Feedback</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!loading && <Download className="mr-2 h-4 w-4" />}
            Download Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
