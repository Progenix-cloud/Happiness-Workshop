'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { IFeedback, IWorkshop } from '@/lib/mongodb/schemas';
import { Badge } from '@/components/ui/badge';

export function FeedbackPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [feedback, setFeedback] = useState<IFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comments: '',
    likelihood: 9,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workshopsRes, feedbackRes] = await Promise.all([
          fetch('/api/workshops'),
          fetch('/api/feedback'),
        ]);

        if (workshopsRes.ok) {
          const data = await workshopsRes.json();
          setWorkshops(data);
          if (data.length > 0) {
            setSelectedWorkshop(data[0]._id);
          }
        }

        if (feedbackRes.ok) {
          const data = await feedbackRes.json();
          setFeedback(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitFeedback = async () => {
    if (!selectedWorkshop) {
      alert('Please select a workshop');
      return;
    }

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          workshopId: selectedWorkshop,
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedback([...feedback, newFeedback]);
        setFormData({ rating: 5, comments: '', likelihood: 9 });
        setShowForm(false);

        // Send email notification
        await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user?.email,
            templateType: 'feedback',
            data: {
              userName: user?.name,
              workshopTitle: workshops.find((w) => w._id === selectedWorkshop)?.title || 'Workshop',
            },
          }),
        });

        alert('Thank you for your feedback!');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback');
    }
  };

  const userFeedback = feedback.filter((f) => f.userId === user?._id);
  const avgRating = userFeedback.length > 0 ? (userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length).toFixed(1) : 0;

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback & Suggestions</h1>
        <p className="text-gray-600">Share your experience and help us improve</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Feedback</p>
            <p className="text-3xl font-bold">{userFeedback.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold">{avgRating} ⭐</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">NPS Score</p>
            <p className="text-3xl font-bold">{userFeedback.length > 0 ? (userFeedback.reduce((sum, f) => sum + f.likelihood, 0) / userFeedback.length).toFixed(0) : 'N/A'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700">
          + Add Feedback
        </Button>
      ) : (
        <Card className="bg-white border-0">
          <CardHeader>
            <CardTitle>Provide Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Workshop</label>
              <select
                value={selectedWorkshop}
                onChange={(e) => setSelectedWorkshop(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                {workshops.map((w) => (
                  <option key={w._id} value={w._id}>
                    {w.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-2xl p-2 rounded ${
                      formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="What did you think about the workshop?"
                className="w-full border border-gray-300 rounded-lg p-3 h-24"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                How likely are you to recommend this workshop? (1-10)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="text-center text-lg font-semibold mt-2">{formData.likelihood} / 10</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitFeedback} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Submit Feedback
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Feedback List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Your Feedback</h3>
        {userFeedback.length === 0 ? (
          <Card className="bg-gray-50 border-0">
            <CardContent className="py-8 text-center text-gray-600">
              No feedback submitted yet. Share your thoughts!
            </CardContent>
          </Card>
        ) : (
          userFeedback.map((fb) => (
            <Card key={fb._id} className="bg-white border-0">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {workshops.find((w) => w._id === fb.workshopId)?.title || 'Workshop'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {'⭐'.repeat(fb.rating)}
                  </Badge>
                </div>
                <p className="text-gray-700">{fb.comments}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Recommendation score: {fb.likelihood}/10
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
