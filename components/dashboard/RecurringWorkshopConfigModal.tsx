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
import { AlertCircle, Loader2 } from 'lucide-react';

interface RecurringWorkshopConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshopId?: string;
  workshopTitle?: string;
  onSuccess?: () => void;
}

export function RecurringWorkshopConfigModal({
  isOpen,
  onClose,
  workshopId,
  workshopTitle,
  onSuccess,
}: RecurringWorkshopConfigModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    isRecurring: false,
    recurrencePattern: 'weekly', // weekly, biweekly, monthly
    endDate: '',
    occurrences: '5',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!workshopId) {
      setError('Workshop ID is required');
      return;
    }

    if (config.isRecurring) {
      if (!config.endDate && !config.occurrences) {
        setError('Please specify either an end date or number of occurrences');
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/workshops/${workshopId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recurring: config.isRecurring
            ? {
                pattern: config.recurrencePattern,
                endDate: config.endDate || null,
                occurrences: config.occurrences ? parseInt(config.occurrences) : null,
              }
            : null,
        }),
      });

      if (!response.ok) throw new Error('Failed to update recurring configuration');

      onSuccess?.();
      onClose();
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
          <DialogTitle>Configure Recurring Workshop</DialogTitle>
          <DialogDescription>
            {workshopTitle ? `Set up recurrence for: ${workshopTitle}` : 'Configure recurrence settings for this workshop'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Is Recurring Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isRecurring"
              name="isRecurring"
              checked={config.isRecurring}
              onChange={handleInputChange}
              disabled={loading}
              className="w-5 h-5 cursor-pointer"
            />
            <Label htmlFor="isRecurring" className="font-medium cursor-pointer">
              Make this a recurring workshop
            </Label>
          </div>

          {config.isRecurring && (
            <>
              {/* Recurrence Pattern */}
              <div className="space-y-2">
                <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                <Select
                  value={config.recurrencePattern}
                  onValueChange={(value) => handleSelectChange('recurrencePattern', value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date (optional)</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={config.endDate}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500">Or specify number of occurrences below</p>
              </div>

              {/* Occurrences */}
              <div className="space-y-2">
                <Label htmlFor="occurrences">Number of Occurrences (optional)</Label>
                <Input
                  id="occurrences"
                  name="occurrences"
                  type="number"
                  min="1"
                  max="52"
                  value={config.occurrences}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="e.g., 5"
                />
                <p className="text-xs text-gray-500">
                  Leave empty if you specified an end date
                </p>
              </div>

              {/* Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-2">Preview:</p>
                <p className="text-sm text-blue-800">
                  {config.recurrencePattern === 'weekly' && 'Repeats every week'}
                  {config.recurrencePattern === 'biweekly' && 'Repeats every two weeks'}
                  {config.recurrencePattern === 'monthly' && 'Repeats every month'}
                </p>
                {config.occurrences && (
                  <p className="text-sm text-blue-800 mt-1">
                    Total: {config.occurrences} occurrences
                  </p>
                )}
                {config.endDate && (
                  <p className="text-sm text-blue-800 mt-1">
                    Until: {new Date(config.endDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
