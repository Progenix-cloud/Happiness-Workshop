'use client';

import React, { ReactNode } from 'react';
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
import type { IWorkshop } from '@/lib/mongodb/schemas';
import { Badge } from '@/components/ui/badge';

interface WorkshopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: IWorkshop | null;
  onSave?: (workshop: Partial<IWorkshop>) => Promise<void>;
  onDelete?: () => Promise<void>;
  mode: 'view' | 'edit' | 'delete';
}

export function WorkshopManagementModal({
  open,
  onOpenChange,
  workshop,
  onSave,
  onDelete,
  mode,
}: WorkshopModalProps) {
  const [formData, setFormData] = React.useState<Partial<IWorkshop>>({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (workshop && mode === 'edit') {
      setFormData(workshop);
    }
  }, [workshop, mode]);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      if (onSave) {
        await onSave(formData);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);
      if (onDelete) {
        await onDelete();
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'view') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{workshop?.title}</DialogTitle>
            <DialogDescription>{workshop?.location}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <Badge
                className={`capitalize ${
                  workshop?.status === 'published'
                    ? 'bg-green-100 text-green-800'
                    : workshop?.status === 'draft'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                {workshop?.status}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-gray-700">{workshop?.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">
                  {workshop?.date
                    ? new Date(workshop.date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{workshop?.time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{workshop?.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mode</p>
                <p className="font-semibold capitalize">{workshop?.mode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold capitalize">{workshop?.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-semibold">
                  {workshop?.currentEnrollment || 0} / {workshop?.maxCapacity}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <p className="font-semibold">
                  ⭐ {(workshop?.averageRating || 0).toFixed(1)} (
                  {workshop?.totalRatings || 0} ratings)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joy Coins Reward</p>
                <p className="font-semibold">💰 {workshop?.joyCoinsReward}</p>
              </div>
            </div>

            {/* Participants */}
            <div>
              <h4 className="font-semibold mb-2">Participants</h4>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-lg font-bold text-blue-900">
                  {workshop?.registrations?.length || 0}
                </p>
                <p className="text-sm text-blue-700">Total registrations</p>
              </div>
            </div>

            {/* Zoom Details */}
            {workshop?.zoomMeetingId && (
              <div>
                <h4 className="font-semibold mb-2">🎥 Zoom Meeting</h4>
                <div className="bg-purple-50 p-3 rounded space-y-1">
                  <p className="text-sm">
                    <strong>Meeting ID:</strong> {workshop.zoomMeetingId}
                  </p>
                  <p className="text-sm">
                    <strong>Password:</strong> {workshop.zoomPassword}
                  </p>
                  {workshop.zoomJoinUrl && (
                    <a
                      href={workshop.zoomJoinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Join Zoom Meeting
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (mode === 'delete') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Workshop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{workshop?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Workshop'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // Edit mode
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workshop</DialogTitle>
          <DialogDescription>
            Update the workshop details below
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <Input
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Workshop title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description *
            </label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Workshop description"
              rows={3}
            />
          </div>

          {/* Category & Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Category *
              </label>
              <Input
                value={formData.category || ''}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                placeholder="e.g., Happiness, Meditation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mode *</label>
              <Select
                value={formData.mode || 'online'}
                onValueChange={(value: any) =>
                  setFormData({
                    ...formData,
                    mode: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date *</label>
              <Input
                type="date"
                value={
                  formData.date
                    ? new Date(formData.date).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    date: new Date(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Time *</label>
              <Input
                type="time"
                value={formData.time || ''}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          {/* Duration & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (minutes) *
              </label>
              <Input
                type="number"
                value={formData.duration || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                placeholder="60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Location *
              </label>
              <Input
                value={formData.location || ''}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., New Delhi, India"
              />
            </div>
          </div>

          {/* Capacity & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Max Capacity *
              </label>
              <Input
                type="number"
                value={formData.maxCapacity || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxCapacity: parseInt(e.target.value),
                  })
                }
                placeholder="30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status *</label>
              <Select
                value={formData.status || 'draft'}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Joy Coins Reward */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Joy Coins Reward 💰
            </label>
            <Input
              type="number"
              value={formData.joyCoinsReward || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  joyCoinsReward: parseInt(e.target.value),
                })
              }
              placeholder="0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
