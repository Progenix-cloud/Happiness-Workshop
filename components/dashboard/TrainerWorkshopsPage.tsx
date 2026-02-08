'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WorkshopManagementModal } from './WorkshopManagementModal';
import { ParticipantsViewer } from './ParticipantsViewer';
import { FeedbackViewer } from './FeedbackViewer';
import { CreateWorkshopModal } from './CreateWorkshopModal';
import { RecurringWorkshopConfigModal } from './RecurringWorkshopConfigModal';
import { CertificateGeneratorModal } from './CertificateGeneratorModal';
import { EmailNotificationModal } from './EmailNotificationModal';
import { AttendanceMarkingModal } from './AttendanceMarkingModal';
import { PDFReportGeneratorModal } from './PDFReportGeneratorModal';
import { AutoPublishSchedulerModal } from './AutoPublishSchedulerModal';
import type { IWorkshop } from '@/lib/mongodb/schemas';

interface WorkshopWithStats extends IWorkshop {
  // Computed stats based on actual data
}

export function TrainerWorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<WorkshopWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMode, setFilterMode] = useState('all');

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [autoPublishModalOpen, setAutoPublishModalOpen] = useState(false);

  // Bulk selection states
  const [selectedWorkshops, setSelectedWorkshops] = useState<Set<string>>(new Set());
  const [bulkDeleteConfirming, setBulkDeleteConfirming] = useState(false);

  const [selectedWorkshop, setSelectedWorkshop] = useState<IWorkshop | null>(null);

  // Handler functions
  const handleViewWorkshop = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop);
    setViewModalOpen(true);
  };

  const handleEditWorkshop = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop);
    setEditModalOpen(true);
  };

  const handleDeleteWorkshop = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop);
    setDeleteModalOpen(true);
  };

  const handleViewParticipants = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop);
    setParticipantsModalOpen(true);
  };

  const handleViewFeedback = (workshop: IWorkshop) => {
    setSelectedWorkshop(workshop);
    setFeedbackModalOpen(true);
  };

  const handleSaveWorkshop = async (updatedData: Partial<IWorkshop>) => {
    try {
      if (!selectedWorkshop?._id) throw new Error('Workshop ID missing');

      const response = await fetch(`/api/workshops/${selectedWorkshop._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update workshop');

      const updated = await response.json();
      setWorkshops(workshops.map((w) => (w._id === selectedWorkshop._id ? updated : w)));
      setEditModalOpen(false);
    } catch (err) {
      console.error('Save error:', err);
      throw err;
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!selectedWorkshop?._id) throw new Error('Workshop ID missing');

      const response = await fetch(`/api/workshops/${selectedWorkshop._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete workshop');

      setWorkshops(workshops.filter((w) => w._id !== selectedWorkshop._id));
      setDeleteModalOpen(false);
    } catch (err) {
      console.error('Delete error:', err);
      throw err;
    }
  };

  const handleWorkshopCreated = () => {
    // Refresh workshops list
    if (user?._id) {
      fetch(`/api/workshops?trainer=${user._id}`)
        .then((res) => res.json())
        .then((data) => setWorkshops(data || []))
        .catch((err) => console.error('Error refreshing workshops:', err));
    }
  };

  const toggleWorkshopSelection = (workshopId: string) => {
    setSelectedWorkshops((prev) => {
      const next = new Set(prev);
      if (next.has(workshopId)) {
        next.delete(workshopId);
      } else {
        next.add(workshopId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedWorkshops(new Set(workshops.map((w) => w._id || '')));
  };

  const deselectAll = () => {
    setSelectedWorkshops(new Set());
  };

  const handleBulkDelete = async () => {
    try {
      const workshopIds = Array.from(selectedWorkshops);
      
      // Delete all selected workshops
      for (const id of workshopIds) {
        await fetch(`/api/workshops/${id}`, { method: 'DELETE' });
      }

      // Refresh list
      setWorkshops(workshops.filter((w) => !selectedWorkshops.has(w._id || '')));
      setSelectedWorkshops(new Set());
      setBulkDeleteConfirming(false);
    } catch (err) {
      console.error('Bulk delete error:', err);
      alert('Error deleting workshops');
    }
  };

  const handleDuplicateWorkshop = async (workshop: IWorkshop) => {
    try {
      // Create a copy with reset fields
      const duplicated = {
        ...workshop,
        _id: undefined,
        title: `${workshop.title} (Copy)`,
        status: 'Draft',
        registrations: [],
        feedbackComments: [],
        createdAt: undefined,
        updatedAt: undefined,
        // Keep other fields for reference
      };

      const response = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated),
      });

      if (!response.ok) throw new Error('Failed to duplicate workshop');

      const newWorkshop = await response.json();
      setWorkshops([...workshops, newWorkshop]);
      alert('✓ Workshop duplicated successfully!');
    } catch (err) {
      console.error('Duplicate error:', err);
      alert('Error duplicating workshop');
    }
  };

  useEffect(() => {
    const fetchTrainerWorkshops = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user?._id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/workshops?trainer=${user._id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch workshops: ${response.statusText}`);
        }

        const data = await response.json();
        setWorkshops(data || []);
      } catch (err) {
        console.error('Error fetching trainer workshops:', err);
        setError(err instanceof Error ? err.message : 'Failed to load workshops');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerWorkshops();
  }, [user?._id]);

  const filteredWorkshops = workshops.filter((w) => {
    // Status filter
    if (filterStatus !== 'all' && w.status !== filterStatus) return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !w.title?.toLowerCase().includes(query) &&
        !w.description?.toLowerCase().includes(query) &&
        !w.location?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Category filter
    if (filterCategory !== 'all' && w.category !== filterCategory) return false;

    // Mode filter
    if (filterMode !== 'all' && w.mode !== filterMode) return false;

    // Date range filter
    if (w.date) {
      const workshopDate = new Date(w.date);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        if (workshopDate < fromDate) return false;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        if (workshopDate > toDate) return false;
      }
    }

    return true;
  });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your workshops...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Workshops</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Workshops</h1>
          <p className="text-gray-600 mt-1">Manage and track your workshops</p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          ✨ Create New Workshop
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 items-center">
        <Input
          placeholder="Search by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          variant={showAdvancedFilters ? 'default' : 'outline'}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="whitespace-nowrap"
        >
          🔍 Filters {showAdvancedFilters && '✕'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
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

            {/* Mode Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Mode</label>
              <Select value={filterMode} onValueChange={setFilterMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modes</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                  <SelectItem value="Offline">Offline</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
                setFilterMode('all');
                setFilterDateFrom('');
                setFilterDateTo('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-900">{workshops.length}</div>
            <p className="text-blue-700 text-sm mt-1">Total Workshops</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-900">
              {workshops.reduce((sum, w) => sum + (w.registrations?.length || 0), 0)}
            </div>
            <p className="text-green-700 text-sm mt-1">Total Participants</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-900">
              {workshops.filter((w) => w.status === 'published').length}
            </div>
            <p className="text-purple-700 text-sm mt-1">Published</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-900">
              {(
                workshops.reduce((sum, w) => sum + (w.averageRating || 0), 0) /
                (workshops.length || 1)
              ).toFixed(1)}
            </div>
            <p className="text-orange-700 text-sm mt-1">Avg Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'draft', 'published', 'archived'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition-colors font-medium ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-600'
            }`}
          >
            {status === 'all' ? 'All Workshops' : status}
          </button>
        ))}
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedWorkshops.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="text-sm font-medium text-blue-900">
            {selectedWorkshops.size} workshop{selectedWorkshops.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={deselectAll}
              className="text-gray-700"
            >
              Deselect All
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteConfirming(true)}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Delete Confirmation */}
      {bulkDeleteConfirming && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-semibold mb-3">
            Are you sure you want to delete {selectedWorkshops.size} workshop{selectedWorkshops.size !== 1 ? 's' : ''}? This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkDeleteConfirming(false)}
              className="text-gray-700"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
            >
              Yes, Delete {selectedWorkshops.size} Workshop{selectedWorkshops.size !== 1 ? 's' : ''}
            </Button>
          </div>
        </div>
      )}

      {/* Workshops Grid */}
      <div className="space-y-4">
        {filteredWorkshops.length > 0 && (
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredWorkshops.length} workshop{filteredWorkshops.length !== 1 ? 's' : ''}
            </p>
            {filteredWorkshops.length > 0 && selectedWorkshops.size === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="text-blue-600"
              >
                Select All
              </Button>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkshops.length > 0 ? (
          filteredWorkshops.map((workshop) => (
            <Card
              key={workshop._id}
              className="hover:shadow-lg transition-shadow bg-white border-gray-200 overflow-hidden relative"
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedWorkshops.has(workshop._id || '')}
                  onChange={() => toggleWorkshopSelection(workshop._id || '')}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className={getStatusBadgeColor(workshop.status || 'draft')}>
                  {workshop.status || 'Draft'}
                </Badge>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteWorkshop(workshop)}
                className="absolute top-14 left-4 z-10 text-red-500 hover:text-red-700"
              >
                ✕
              </button>

              {/* Poster Image */}
              {workshop.image && (
                <div className="w-full h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={workshop.image}
                    alt={workshop.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 pr-16">{workshop.title}</CardTitle>
                <CardDescription className="text-xs">{workshop.location}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Workshop Details */}
                <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600 text-xs">📅 Date</p>
                    <p className="font-medium text-sm">
                      {new Date(workshop.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600 text-xs">⏱️ Time</p>
                    <p className="font-medium text-sm">{workshop.time}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <div className="flex gap-3">
                    <div>
                      <p className="text-gray-600">👥</p>
                      <p className="font-medium">{workshop.registrations?.length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">⭐</p>
                      <p className="font-medium">{(workshop.averageRating || 0).toFixed(1)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">💬</p>
                      <p className="font-medium">{workshop.feedbackComments?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-blue-50"
                    onClick={() => handleEditWorkshop(workshop)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 hover:bg-green-50"
                    onClick={() => handleViewParticipants(workshop)}
                  >
                    👥 View
                  </Button>
                </div>

                {/* Action Buttons Part 2 */}
                <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-purple-50"
                  onClick={() => handleViewFeedback(workshop)}
                >
                  ⭐ Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-blue-50"
                  onClick={() => handleDuplicateWorkshop(workshop)}
                  title="Duplicate this workshop"
                >
                  📋 Copy
                </Button>
                </div>

                {/* Action Buttons Part 3 */}
                <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-orange-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setRecurringModalOpen(true);
                  }}
                  title="Set up recurring instances"
                >
                  🔄 Recurring
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-emerald-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setCertificateModalOpen(true);
                  }}
                  title="Generate certificates"
                >
                  🎖️ Certs
                </Button>
                </div>

                {/* Action Buttons Part 4 - New Features */}
                <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-pink-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setEmailModalOpen(true);
                  }}
                  title="Send email notifications"
                >
                  📧 Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-cyan-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setAttendanceModalOpen(true);
                  }}
                  title="Mark participant attendance"
                >
                  ✅ Attendance
                </Button>
                </div>

                {/* Action Buttons Part 5 - Reports & Publishing */}
                <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-violet-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setPdfModalOpen(true);
                  }}
                  title="Generate PDF reports"
                >
                  📄 Report
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 hover:bg-indigo-50"
                  onClick={() => {
                    setSelectedWorkshop(workshop);
                    setAutoPublishModalOpen(true);
                  }}
                  title="Schedule auto-publish"
                >
                  ⏰ Publish
                </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Workshops Found</h3>
            <p className="text-gray-600 mb-6">
              {filterStatus !== 'all'
                ? `You don't have any ${filterStatus} workshops yet.`
                : 'Start creating workshops to see them here!'}
            </p>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              ✨ Create Your First Workshop
            </Button>
          </div>
        )}
        </div>
      </div>

      {/* Modals */}
      <WorkshopManagementModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        workshop={selectedWorkshop}
        mode="view"
      />

      <WorkshopManagementModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        workshop={selectedWorkshop}
        mode="edit"
        onSave={handleSaveWorkshop}
      />

      <WorkshopManagementModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        workshop={selectedWorkshop}
        mode="delete"
        onDelete={handleDeleteConfirm}
      />

      <ParticipantsViewer
        open={participantsModalOpen}
        onOpenChange={setParticipantsModalOpen}
        workshop={selectedWorkshop}
      />

      <FeedbackViewer
        open={feedbackModalOpen}
        onOpenChange={setFeedbackModalOpen}
        workshop={selectedWorkshop}
      />

      <CreateWorkshopModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleWorkshopCreated}
        trainerId={user?._id}
      />

      <RecurringWorkshopConfigModal
        isOpen={recurringModalOpen}
        onClose={() => setRecurringModalOpen(false)}
        workshopId={selectedWorkshop?._id}
        workshopTitle={selectedWorkshop?.title}
        onSuccess={() => {
          setRecurringModalOpen(false);
          // Refresh workshops
          if (user?._id) {
            fetch(`/api/workshops?trainer=${user._id}`)
              .then((res) => res.json())
              .then((data) => setWorkshops(data || []))
              .catch((err) => console.error('Error refreshing workshops:', err));
          }
        }}
      />

      <CertificateGeneratorModal
        isOpen={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        workshop={selectedWorkshop}
      />

      <EmailNotificationModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        workshop={selectedWorkshop}
      />

      <AttendanceMarkingModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        workshop={selectedWorkshop}
        onSuccess={() => {
          setAttendanceModalOpen(false);
          // Refresh to get updated participants
          if (user?._id) {
            fetch(`/api/workshops?trainer=${user._id}`)
              .then((res) => res.json())
              .then((data) => setWorkshops(data || []))
              .catch((err) => console.error('Error refreshing workshops:', err));
          }
        }}
      />

      <PDFReportGeneratorModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
        workshop={selectedWorkshop}
      />

      <AutoPublishSchedulerModal
        isOpen={autoPublishModalOpen}
        onClose={() => setAutoPublishModalOpen(false)}
        workshopId={selectedWorkshop?._id}
        workshopTitle={selectedWorkshop?.title}
        currentStatus={selectedWorkshop?.status}
        onSuccess={() => {
          setAutoPublishModalOpen(false);
          // Refresh to get updated workshop
          if (user?._id) {
            fetch(`/api/workshops?trainer=${user._id}`)
              .then((res) => res.json())
              .then((data) => setWorkshops(data || []))
              .catch((err) => console.error('Error refreshing workshops:', err));
          }
        }}
      />
    </div>
  );
}
