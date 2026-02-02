'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ITestimonial, IWorkshop } from '@/lib/mongodb/schemas';
import { Badge } from '@/components/ui/badge';

export function TestimonialsPage() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkshop, setSelectedWorkshop] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    text: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [testimonialsRes, workshopsRes] = await Promise.all([
          fetch('/api/testimonials'),
          fetch('/api/workshops'),
        ]);

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          setTestimonials(data);
        }

        if (workshopsRes.ok) {
          const data = await workshopsRes.json();
          setWorkshops(data);
          if (data.length > 0) {
            setSelectedWorkshop(data[0]._id);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmitTestimonial = async () => {
    if (!selectedWorkshop || !formData.text) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          userName: user?.name,
          userAvatar: user?.avatar,
          workshopId: selectedWorkshop,
          ...formData,
          isPublished: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      if (response.ok) {
        const newTestimonial = await response.json();
        setTestimonials([...testimonials, newTestimonial]);
        setFormData({ rating: 5, text: '' });
        setShowForm(false);

        // Send email notification
        await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: user?.email,
            templateType: 'testimonial',
            data: {
              userName: user?.name,
              testimonialText: formData.text,
              rating: formData.rating,
            },
          }),
        });

        alert('Thank you for your testimonial!');
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      alert('Failed to submit testimonial');
    }
  };

  const userTestimonials = testimonials.filter((t) => t.userId === user?._id);
  const avgRating = testimonials.length > 0 ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1) : 0;

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Share on Achievements</h1>
        <p className="text-gray-600">Inspire others with your well-being journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Testimonials</p>
            <p className="text-3xl font-bold">{testimonials.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Your Testimonials</p>
            <p className="text-3xl font-bold">{userTestimonials.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-0">
          <CardContent className="p-6">
            <p className="text-gray-600 text-sm mb-1">Community Rating</p>
            <p className="text-3xl font-bold">{avgRating} ⭐</p>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Form */}
      {!showForm ? (
        <Button onClick={() => setShowForm(true)} className="w-full bg-orange-500 hover:bg-orange-600">
          + Write a Testimonial
        </Button>
      ) : (
        <Card className="bg-white border-0">
          <CardHeader>
            <CardTitle>Write Your Testimonial</CardTitle>
            <CardDescription>Share your positive experience with our workshops</CardDescription>
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
                    className={`text-3xl p-2 rounded transition-transform hover:scale-110 ${
                      formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Your Testimonial</label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Share your experience and what this workshop meant to you..."
                className="w-full border border-gray-300 rounded-lg p-3 h-32"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSubmitTestimonial} className="flex-1 bg-orange-500 hover:bg-orange-600">
                Post Testimonial
              </Button>
              <Button onClick={() => setShowForm(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Testimonials List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">All Testimonials</h3>
        {testimonials.length === 0 ? (
          <Card className="bg-gray-50 border-0">
            <CardContent className="py-8 text-center text-gray-600">
              No testimonials yet. Be the first to share your experience!
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="bg-white border-0 hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={testimonial.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.userName}`}
                    alt={testimonial.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.userName}</p>
                        <p className="text-sm text-gray-600">
                          {workshops.find((w) => w._id === testimonial.workshopId)?.title || 'Workshop'}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {'⭐'.repeat(testimonial.rating)}
                      </Badge>
                    </div>
                    <p className="text-gray-700">{testimonial.text}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
