'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { IWorkshop } from '@/lib/mongodb/schemas';
import { Badge } from '@/components/ui/badge';

export function WorkshopsPage() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const response = await fetch('/api/workshops');
        if (response.ok) {
          const data = await response.json();
          setWorkshops(data);
        }
      } catch (error) {
        console.error('Error fetching workshops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  const categories = ['all', ...new Set(workshops.map((w) => w.category))];
  const filteredWorkshops =
    selectedCategory === 'all' ? workshops : workshops.filter((w) => w.category === selectedCategory);

  const handleRegister = async (workshopId: string) => {
    // This would be implemented in a full version
    alert(`Registered for workshop: ${workshopId}`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading workshops...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Workshops</h1>
        <p className="text-gray-600">Discover and join workshops to enhance your well-being</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap capitalize transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Workshops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkshops.map((workshop) => {
          const userRegistration = workshop.registrations.find((r) => r.userId === user?._id);
          const spotsLeft = workshop.maxCapacity - workshop.registrations.length;

          return (
            <Card key={workshop._id} className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="capitalize">
                    {workshop.category}
                  </Badge>
                  <Badge
                    className={`${
                      userRegistration
                        ? userRegistration.status === 'attended'
                          ? 'bg-green-100 text-green-800'
                          : userRegistration.status === 'booked'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {userRegistration ? userRegistration.status : 'available'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{workshop.title}</CardTitle>
                <CardDescription className="text-xs">{workshop.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{workshop.description}</p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">📅</p>
                    <p className="font-medium">{new Date(workshop.date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-600">⏱️</p>
                    <p className="font-medium">{workshop.time}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{spotsLeft} spots left</span>
                  <span className="text-gray-600">{workshop.registrations.length} attendees</span>
                </div>

                <Button
                  onClick={() => handleRegister(workshop._id || '')}
                  disabled={spotsLeft === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {userRegistration ? `View Details` : spotsLeft === 0 ? 'Full' : 'Register'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No workshops found in this category</p>
        </div>
      )}
    </div>
  );
}
