'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface ParticipantsViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workshop: IWorkshop | null;
}

type RegistrationStatus = 'booked' | 'attended' | 'interested' | 'cancelled';

export function ParticipantsViewer({
  open,
  onOpenChange,
  workshop,
}: ParticipantsViewerProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<RegistrationStatus | 'all'>('all');

  const filteredParticipants = workshop?.registrations?.filter((reg) => {
    const matchesSearch = (reg.registrationDetails?.fullName || '')
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusDot = (status: RegistrationStatus) => {
    const colors: Record<RegistrationStatus, string> = {
      booked: 'bg-blue-500',
      attended: 'bg-green-500',
      interested: 'bg-orange-500',
      cancelled: 'bg-gray-500',
    };
    return colors[status];
  };

  const getStatusBg = (status: RegistrationStatus) => {
    const colors: Record<RegistrationStatus, string> = {
      booked: 'bg-blue-100 text-blue-800',
      attended: 'bg-green-100 text-green-800',
      interested: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return colors[status];
  };

  const stats = {
    total: workshop?.registrations?.length || 0,
    booked: workshop?.registrations?.filter((r) => r.status === 'booked').length || 0,
    attended: workshop?.registrations?.filter((r) => r.status === 'attended').length || 0,
    interested: workshop?.registrations?.filter((r) => r.status === 'interested').length || 0,
  };

  const downloadCSV = () => {
    if (!workshop?.registrations) return;

    const headers = ['Name', 'Email', 'Phone', 'Organization', 'Status', 'Registered At'];
    const rows = workshop.registrations.map((reg) => [
      reg.registrationDetails?.fullName || 'N/A',
      reg.registrationDetails?.email || 'N/A',
      reg.registrationDetails?.phone || 'N/A',
      reg.registrationDetails?.organization || 'N/A',
      reg.status,
      new Date(reg.registeredAt).toLocaleDateString(),
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workshop.title}-participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">{workshop?.title}</DialogTitle>
          <DialogDescription>Manage workshop participants</DialogDescription>
        </DialogHeader>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-xs text-gray-600">Total</p>
            <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-600">Attended</p>
            <p className="text-2xl font-bold text-green-900">{stats.attended}</p>
          </div>
          <div className="bg-orange-50 p-3 rounded">
            <p className="text-xs text-gray-600">Interested</p>
            <p className="text-2xl font-bold text-orange-900">{stats.interested}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-xs text-gray-600">Booked</p>
            <p className="text-2xl font-bold text-gray-900">{stats.booked}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2">
          <Input
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="booked">Booked</option>
            <option value="attended">Attended</option>
            <option value="interested">Interested</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
            📥 Download CSV
          </Button>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto border rounded-lg">
          <div className="divide-y">
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((reg, idx) => (
                <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusDot(reg.status)}`}
                        />
                        <div>
                          <p className="font-semibold">
                            {reg.registrationDetails?.fullName || 'No Name'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {reg.registrationDetails?.email || 'No Email'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium">
                            {reg.registrationDetails?.phone || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Organization</p>
                          <p className="font-medium">
                            {reg.registrationDetails?.organization || '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Registered</p>
                          <p className="font-medium">
                            {new Date(reg.registeredAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {reg.registrationDetails?.expectations && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Expectations:</p>
                          <p className="text-sm bg-gray-50 p-2 rounded">
                            {reg.registrationDetails.expectations}
                          </p>
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusBg(reg.status)}>{reg.status}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p>No participants found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
