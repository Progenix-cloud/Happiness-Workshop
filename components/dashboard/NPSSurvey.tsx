'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface NPSSurveyData {
  currentScore: number;
  averageScore: number;
  totalResponses: number;
  detractors: number;
  passives: number;
  promoters: number;
}

const mockNPSData: NPSSurveyData = {
  currentScore: 72,
  averageScore: 68,
  totalResponses: 324,
  detractors: 15,
  passives: 110,
  promoters: 199
};

export const NPSSurvey: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (score !== null && feedback.trim()) {
      console.log('[v0] NPS submitted:', { score, feedback });
      toast.success('Thank you for your feedback!');
      setScore(null);
      setFeedback('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const getScoreCategory = (s: number) => {
    if (s <= 6) return { label: 'Detractor', color: 'bg-red-100 text-red-800' };
    if (s <= 8) return { label: 'Passive', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Promoter', color: 'bg-green-100 text-green-800' };
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Customer Satisfaction</h2>
        </div>
        <p className="text-indigo-100">How likely are you to recommend us?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <p className="text-sm text-gray-600 mb-2">Current NPS Score</p>
          <p className="text-4xl font-bold text-indigo-600">{mockNPSData.currentScore}</p>
          <p className="text-xs text-gray-500 mt-2">Above average by +4 points</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-600 mb-2">Total Responses</p>
          <p className="text-4xl font-bold text-gray-900">{mockNPSData.totalResponses}</p>
          <p className="text-xs text-gray-500 mt-2">Growing +12 this week</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
          <p className="text-sm text-gray-600 mb-2">Response Distribution</p>
          <div className="flex gap-2 mt-2">
            <div className="flex-1 text-center">
              <p className="font-bold text-red-600">{mockNPSData.detractors}</p>
              <p className="text-xs text-gray-500">Detractors</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-bold text-yellow-600">{mockNPSData.passives}</p>
              <p className="text-xs text-gray-500">Passives</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-bold text-green-600">{mockNPSData.promoters}</p>
              <p className="text-xs text-gray-500">Promoters</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-br from-white to-purple-50">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Rate Your Experience</h3>

        {!submitted ? (
          <>
            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-600 mb-4">
                On a scale of 0-10, how likely are you to recommend us?
              </p>
              <div className="grid grid-cols-5 md:grid-cols-11 gap-2">
                {Array.from({ length: 11 }, (_, i) => i).map(i => (
                  <button
                    key={i}
                    onClick={() => setScore(i)}
                    className={`
                      aspect-square rounded-lg font-bold transition text-sm
                      ${
                        score === i
                          ? `${
                              i <= 6
                                ? 'bg-red-500 text-white'
                                : i <= 8
                                  ? 'bg-yellow-500 text-white'
                                  : 'bg-green-500 text-white'
                            }`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {score !== null && (
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  You selected: <Badge className={getScoreCategory(score).color}>{getScoreCategory(score).label}</Badge>
                </p>
              </div>
            )}

            <textarea
              className="w-full p-4 border-2 border-gray-300 rounded-lg mb-4 focus:border-purple-500 focus:outline-none"
              placeholder="Tell us what we can improve..."
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              rows={4}
            />

            <Button
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
              onClick={handleSubmit}
              disabled={score === null || !feedback.trim()}
            >
              Submit Feedback
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg font-semibold text-green-600">Thank you for your feedback! 🎉</p>
            <p className="text-gray-600 mt-2">Your response helps us improve our services.</p>
            <Button
              className="mt-4 w-full bg-transparent"
              variant="outline"
              onClick={() => {
                setScore(null);
                setFeedback('');
              }}
            >
              Submit Another Response
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
