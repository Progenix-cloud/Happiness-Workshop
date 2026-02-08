'use client';

import React, { useState, useMemo } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop?: IWorkshop | null;
}

const EMAIL_TEMPLATES = {
  reminder: {
    name: 'Workshop Reminder',
    subject: 'Reminder: {{workshopTitle}} is coming up!',
    body: 'Hi {{name}},\n\nThis is a friendly reminder that {{workshopTitle}} is scheduled for {{workshopDate}} at {{workshopTime}}.\n\nWe look forward to seeing you there!\n\nBest regards,\n{{trainerName}}',
  },
  post_workshop: {
    name: 'Post-Workshop Follow-up',
    subject: 'Thank you for attending {{workshopTitle}}!',
    body: 'Hi {{name}},\n\nThank you for attending {{workshopTitle}}! We hope you enjoyed the session.\n\nYour certificate of completion has been generated and is available in your dashboard.\n\nBest regards,\n{{trainerName}}',
  },
  cancellation: {
    name: 'Workshop Cancellation Notice',
    subject: '{{workshopTitle}} has been cancelled',
    body: 'Hi {{name}},\n\nUnfortunately, {{workshopTitle}} scheduled for {{workshopDate}} has been cancelled.\n\nWe apologize for any inconvenience. Please check your dashboard for more information.\n\nBest regards,\n{{trainerName}}',
  },
  custom: {
    name: 'Custom Message',
    subject: '',
    body: '',
  },
};

export function EmailNotificationModal({
  isOpen,
  onClose,
  workshop,
}: EmailNotificationModalProps) {
  // Early return BEFORE ALL HOOKS
  if (!workshop) return null;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  const [template, setTemplate] = useState('reminder');
  const [recipientFilter, setRecipientFilter] = useState('all'); // all, attended, booked
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const recipients = useMemo(() => {
    if (!workshop.registrations) return [];

    switch (recipientFilter) {
      case 'attended':
        return workshop.registrations.filter((r) => r.status === 'attended');
      case 'booked':
        return workshop.registrations.filter((r) => r.status === 'booked');
      default:
        return workshop.registrations;
    }
  }, [workshop.registrations, recipientFilter]);

  const currentTemplate = EMAIL_TEMPLATES[template as keyof typeof EMAIL_TEMPLATES];

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    if (value !== 'custom') {
      const tmpl = EMAIL_TEMPLATES[value as keyof typeof EMAIL_TEMPLATES];
      setSubject(tmpl.subject);
      setBody(tmpl.body);
    }
  };

  const replacePlaceholders = (text: string, recipient: any) => {
    return text
      .replace(/\{\{workshopTitle\}\}/g, workshop.title || '')
      .replace(/\{\{workshopDate\}\}/g, new Date(workshop.date || '').toLocaleDateString())
      .replace(/\{\{workshopTime\}\}/g, workshop.time || '')
      .replace(/\{\{trainerName\}\}/g, workshop.trainer || 'Trainer')
      .replace(/\{\{name\}\}/g, recipient.name || 'Participant');
  };

  const handleSendEmails = async () => {
    if (!subject.trim() || !body.trim()) {
      setError('Subject and body are required');
      return;
    }

    if (recipients.length === 0) {
      setError('No recipients selected');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulate sending emails
      // In production, this would call an API endpoint
      let sent = 0;

      for (const recipient of recipients) {
        // Personalize each email
        const personalizedSubject = replacePlaceholders(subject, recipient);
        const personalizedBody = replacePlaceholders(body, recipient);

        // API call would go here
        // await fetch('/api/email/send', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     to: recipient.email,
        //     subject: personalizedSubject,
        //     body: personalizedBody,
        //     workshopId: workshop._id,
        //   }),
        // });

        sent++;
        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setSentCount(sent);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Email Notifications</DialogTitle>
          <DialogDescription>
            Send personalized emails to workshop participants
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
                ✓ {sentCount} email{sentCount !== 1 ? 's' : ''} sent successfully!
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

          {/* Recipient Filter */}
          <div className="space-y-2">
            <Label>Recipients</Label>
            <Select value={recipientFilter} onValueChange={setRecipientFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All ({workshop.registrations?.length || 0})
                </SelectItem>
                <SelectItem value="booked">
                  Booked (
                  {workshop.registrations?.filter((r) => r.status === 'booked').length || 0})
                </SelectItem>
                <SelectItem value="attended">
                  Attended (
                  {workshop.registrations?.filter((r) => r.status === 'attended').length || 0})
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600">
              Total: {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Template Selection */}
          <div className="space-y-2">
            <Label>Email Template</Label>
            <Select value={template} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EMAIL_TEMPLATES).map(([key, tmpl]) => (
                  <SelectItem key={key} value={key}>
                    {tmpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              disabled={loading}
            />
            <p className="text-xs text-gray-500">
              Use {'{'}name{'}'}, {'{'}workshopTitle{'}'}, etc. for personalization
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Message *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email message..."
              rows={6}
              disabled={loading}
            />
          </div>

          {/* Preview */}
          {recipients.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
              <p className="text-sm font-medium text-blue-900">Preview (first recipient):</p>
              <div className="bg-white rounded p-2 text-xs">
                <p className="font-bold text-gray-800">
                  Subject:{' '}
                  {replacePlaceholders(subject, recipients[0])}
                </p>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {replacePlaceholders(body, recipients[0])}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSendEmails} disabled={loading || recipients.length === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send {recipients.length} Email{recipients.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
