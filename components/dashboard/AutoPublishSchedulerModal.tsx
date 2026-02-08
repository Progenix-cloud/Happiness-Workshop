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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle, Clock } from 'lucide-react';

interface AutoPublishSchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId?: string;
  workshopTitle?: string;
  currentStatus?: string;
  onSuccess?: () => void;
}

const TIMEZONES = [
  { label: 'UTC', value: 'UTC' },
  { label: 'EST (UTC-5)', value: 'America/New_York' },
  { label: 'CST (UTC-6)', value: 'America/Chicago' },
  { label: 'MST (UTC-7)', value: 'America/Denver' },
  { label: 'PST (UTC-8)', value: 'America/Los_Angeles' },
  { label: 'GMT (UTC+0)', value: 'Europe/London' },
  { label: 'CET (UTC+1)', value: 'Europe/Paris' },
  { label: 'IST (UTC+5:30)', value: 'Asia/Kolkata' },
  { label: 'SGT (UTC+8)', value: 'Asia/Singapore' },
  { label: 'JST (UTC+9)', value: 'Asia/Tokyo' },
  { label: 'AEST (UTC+10)', value: 'Australia/Sydney' },
];

export function AutoPublishSchedulerModal({
  isOpen,
  onClose,
  workshopId,
  workshopTitle,
  currentStatus,
  onSuccess,
}: AutoPublishSchedulerModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [enableAutoPublish, setEnableAutoPublish] = useState(false);
  const [publishDate, setPublishDate] = useState('');
  const [publishTime, setPublishTime] = useState('09:00');
  const [timezone, setTimezone] = useState('UTC');
  const [notifyBefore, setNotifyBefore] = useState('24h'); // 1h, 6h, 24h

  const handleSubmit = async () => {
    if (!workshopId) {
      setError('Workshop ID is required');
      return;
    }

    if (enableAutoPublish && !publishDate) {
      setError('Please select a publication date');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/workshops/${workshopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autoPublish: enableAutoPublish
            ? {
                enabled: true,
                publishAt: new Date(`${publishDate}T${publishTime}:00`),
                timezone,
                notifyBefore,
              }
            : {
                enabled: false,
              },
        }),
      });

      if (!response.ok) throw new Error('Failed to schedule publication');

      setSuccess(true);
      onSuccess?.();

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

  const selectedTZ = TIMEZONES.find((tz) => tz.value === timezone);
  const now = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Auto-Publish</DialogTitle>
          <DialogDescription>
            Automatically publish your workshop at a scheduled time
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
                ✓ Publication scheduled successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Workshop Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-700">{workshopTitle}</p>
            <p className="text-xs text-gray-600">
              Current Status: <span className="font-semibold capitalize">{currentStatus}</span>
            </p>
          </div>

          {/* Enable Auto-Publish Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="enableAutoPublish"
              checked={enableAutoPublish}
              onChange={(e) => setEnableAutoPublish(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 cursor-pointer"
            />
            <Label htmlFor="enableAutoPublish" className="font-medium cursor-pointer">
              Enable auto-publish
            </Label>
          </div>

          {enableAutoPublish && (
            <>
              {/* Publication Date */}
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publication Date *</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  min={now}
                  disabled={loading}
                  required
                />
              </div>

              {/* Publication Time */}
              <div className="space-y-2">
                <Label htmlFor="publishTime">Publication Time *</Label>
                <Input
                  id="publishTime"
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {/* Timezone */}
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notify Before */}
              <div className="space-y-2">
                <Label htmlFor="notifyBefore">Remind me before publication</Label>
                <Select value={notifyBefore} onValueChange={setNotifyBefore} disabled={loading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour before</SelectItem>
                    <SelectItem value="6h">6 hours before</SelectItem>
                    <SelectItem value="24h">24 hours before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview */}
              {publishDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-blue-900">
                    <Clock className="h-4 w-4" />
                    <p className="text-sm font-medium">Scheduled Publication</p>
                  </div>
                  <p className="text-sm text-blue-800">
                    <strong>Date & Time:</strong>{' '}
                    {new Date(`${publishDate}T${publishTime}`).toLocaleString()}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Timezone:</strong> {selectedTZ?.label}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Reminder:</strong>{' '}
                    {notifyBefore === '1h'
                      ? '1 hour before'
                      : notifyBefore === '6h'
                        ? '6 hours before'
                        : '24 hours before'}
                  </p>
                  <p className="text-xs text-blue-700 mt-2">
                    ✓ Your workshop will automatically change from Draft to Published on the
                    scheduled date and time
                  </p>
                </div>
              )}
            </>
          )}

          {!enableAutoPublish && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-amber-800">
                Manual publishing is currently enabled. Enable auto-publish to schedule a
                publication date.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {enableAutoPublish ? 'Schedule' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
