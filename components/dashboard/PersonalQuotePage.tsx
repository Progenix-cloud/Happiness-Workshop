'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PersonalQuotePage() {
  const { user } = useAuth();
  const [quote, setQuote] = useState('');
  const [personalStory, setPersonalStory] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await fetch(`/api/quotes/${user?._id}`);
      if (res.ok) {
        const data = await res.json();
        setQuote(data.quote || '');
        setPersonalStory(data.personalStory || '');
      }
    } catch (error) {
      console.error('Error fetching quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!quote.trim()) {
      alert('Please enter an inspiring quote');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?._id,
          quote,
          personalStory,
        }),
      });

      if (res.ok) {
        setShowSuccess(true);
      } else {
        alert('Failed to save quote');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Inspiration & Quote</h1>
        <p className="text-gray-600">Share an inspiring quote or personal message that drives your happiness journey</p>
      </div>

      <Alert>
        <AlertDescription>
          💭 Your personal quote will be displayed on your profile and can inspire others on their happiness journey
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Write Your Quote</CardTitle>
              <CardDescription>Share what brings you happiness and inspires you daily</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="quote" className="text-base font-semibold mb-2 block">
                  Your Inspiring Quote *
                </Label>
                <Textarea
                  id="quote"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Write an inspiring quote or personal message..."
                  rows={4}
                  className="text-lg"
                />
                <p className="text-xs text-gray-500 mt-1">{quote.length}/500 characters</p>
              </div>

              <div>
                <Label htmlFor="personalStory" className="text-base font-semibold mb-2 block">
                  Your Story (Optional)
                </Label>
                <Textarea
                  id="personalStory"
                  value={personalStory}
                  onChange={(e) => setPersonalStory(e.target.value)}
                  placeholder="Share the story behind your quote. What inspired you? How does it relate to your happiness journey?"
                  rows={5}
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">{personalStory.length}/1000 characters</p>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving || !quote.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
              >
                {saving ? 'Saving...' : 'Save Quote'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                <div className="text-center space-y-3">
                  <div className="text-4xl">💭</div>
                  {quote ? (
                    <blockquote className="text-gray-900 font-semibold italic">
                      "{quote}"
                    </blockquote>
                  ) : (
                    <p className="text-gray-400 italic">Your quote will appear here...</p>
                  )}
                  <p className="text-sm text-gray-600">— {user?.name}</p>
                </div>
              </div>

              {personalStory && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600">{personalStory}</p>
                </div>
              )}

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  This will be displayed on your profile and shared with the community
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Inspiration Examples</CardTitle>
          <CardDescription>Need inspiration? Here are some examples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-semibold text-gray-900">"Happiness is not something ready made..."</p>
              <p className="text-sm text-gray-600 mt-1">Dalai Lama</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold text-gray-900">"The purpose of our lives is to be happy"</p>
              <p className="text-sm text-gray-600 mt-1">Dalai Lama</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-semibold text-gray-900">"Happiness is an inside job"</p>
              <p className="text-sm text-gray-600 mt-1">Ralph Marston</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-semibold text-gray-900">"Be happy for this moment, this moment is your life"</p>
              <p className="text-sm text-gray-600 mt-1">Omar Khayyam</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quote Saved Successfully! ✨</DialogTitle>
            <DialogDescription>
              Your inspiring quote has been saved
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your quote is now displayed on your profile and will inspire others in the community.
            </p>
            <Button onClick={() => setShowSuccess(false)} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
