'use client';

import React, { useState, useRef, useEffect } from 'react';
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
import { AlertCircle, Loader2 } from 'lucide-react';

interface CreateWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  trainerId?: string;
}

export function CreateWorkshopModal({
  isOpen,
  onClose,
  onSuccess,
  trainerId,
}: CreateWorkshopModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    mode: 'Online',
    date: '',
    time: '',
    duration: '120',
    location: '',
    capacity: '20',
    status: 'Draft',
    joyCoinsReward: '50',
    zoomLink: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Workshop title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.category) return 'Category is required';
    if (!formData.date) return 'Date is required';
    if (!formData.time) return 'Time is required';
    if (!formData.capacity || parseInt(formData.capacity) < 1)
      return 'Capacity must be at least 1';
    if (formData.mode !== 'Online' && !formData.location.trim())
      return 'Location is required for offline events';
    if (formData.mode === 'Online' && !formData.zoomLink.trim())
      return 'Zoom link is required for online events';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/workshops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          duration: parseInt(formData.duration),
          joyCoinsReward: parseInt(formData.joyCoinsReward),
          trainer: trainerId,
          registrations: [],
          feedbackComments: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workshop');
      }

      const data = await response.json();
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        category: '',
        mode: 'Online',
        date: '',
        time: '',
        duration: '120',
        location: '',
        capacity: '20',
        status: 'Draft',
        joyCoinsReward: '50',
        zoomLink: '',
      });

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
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
          <DialogTitle>Create New Workshop</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new workshop. You can edit it
            later from your workshops list.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Workshop created successfully!
              </AlertDescription>
            </Alert>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Workshop Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Advanced React Patterns"
              value={formData.title}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe what participants will learn..."
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
              required
            />
          </div>

          {/* Category and Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Personal Development">
                    Personal Development
                  </SelectItem>
                  <SelectItem value="Professional Skills">
                    Professional Skills
                  </SelectItem>
                  <SelectItem value="Creative Arts">Creative Arts</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Health & Wellness">
                    Health & Wellness
                  </SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mode">Mode *</Label>
              <Select
                value={formData.mode}
                onValueChange={(value) => handleSelectChange('mode', value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Duration and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                min="30"
                max="480"
                value={formData.duration}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Location (for offline/hybrid) */}
          {formData.mode !== 'Online' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location {formData.mode !== 'Online' && '*'}</Label>
              <Input
                id="location"
                name="location"
                placeholder="Physical location or venue..."
                value={formData.location}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          )}

          {/* Zoom Link (for online/hybrid) */}
          {formData.mode !== 'Offline' && (
            <div className="space-y-2">
              <Label htmlFor="zoomLink">Zoom Link {formData.mode !== 'Offline' && '*'}</Label>
              <Input
                id="zoomLink"
                name="zoomLink"
                placeholder="https://zoom.us/j/..."
                value={formData.zoomLink}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
          )}

          {/* Joy Coins Reward */}
          <div className="space-y-2">
            <Label htmlFor="joyCoinsReward">Joy Coins Reward</Label>
            <Input
              id="joyCoinsReward"
              name="joyCoinsReward"
              type="number"
              min="0"
              value={formData.joyCoinsReward}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange('status', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Workshop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
