'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smile, Frown, MessageCircle } from 'lucide-react';

const emotionData = [
  { date: 'Mon', happy: 8, calm: 7, excited: 6, stressed: 2 },
  { date: 'Tue', happy: 8, calm: 8, excited: 7, stressed: 2 },
  { date: 'Wed', happy: 7, calm: 8, excited: 5, stressed: 3 },
  { date: 'Thu', happy: 9, calm: 8, excited: 8, stressed: 1 },
  { date: 'Fri', happy: 9, calm: 7, excited: 9, stressed: 1 },
  { date: 'Sat', happy: 8, calm: 8, excited: 7, stressed: 2 },
  { date: 'Sun', happy: 9, calm: 9, excited: 6, stressed: 1 }
];

const emotionDistribution = [
  { name: 'Happy', value: 58, color: '#fbbf24' },
  { name: 'Calm', value: 54, color: '#10b981' },
  { name: 'Excited', value: 48, color: '#f97316' },
  { name: 'Stressed', value: 12, color: '#ef4444' }
];

export const EmotionTracking: React.FC = () => {
  const [emotion, setEmotion] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleEmotionSelect = (selectedEmotion: string) => {
    setEmotion(selectedEmotion);
  };

  const handleSubmitFeedback = () => {
    if (emotion && feedback) {
      console.log('[v0] Emotion submitted:', { emotion, feedback });
      setEmotion(null);
      setFeedback('');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Smile className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Emotion Tracking</h2>
        </div>
        <p className="text-orange-100">Monitor your emotional well-being journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emotion Trend */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="font-semibold mb-4 text-gray-900">Weekly Emotion Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="happy"
                  stackId="1"
                  stroke="#fbbf24"
                  fill="#fbbf24"
                  name="Happy"
                />
                <Area
                  type="monotone"
                  dataKey="calm"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Calm"
                />
                <Area
                  type="monotone"
                  dataKey="excited"
                  stackId="1"
                  stroke="#f97316"
                  fill="#f97316"
                  name="Excited"
                />
                <Area
                  type="monotone"
                  dataKey="stressed"
                  stackId="1"
                  stroke="#ef4444"
                  fill="#ef4444"
                  name="Stressed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Emotion Distribution */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 text-gray-900">Emotion Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={emotionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {emotionDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {emotionDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Log Emotion */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
        <h3 className="font-semibold mb-4 text-gray-900">Log Your Current Emotion</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {['Happy', 'Calm', 'Excited', 'Stressed'].map(em => (
            <Button
              key={em}
              variant={emotion === em ? 'default' : 'outline'}
              className={`${
                emotion === em
                  ? em === 'Happy'
                    ? 'bg-yellow-500'
                    : em === 'Calm'
                      ? 'bg-green-500'
                      : em === 'Excited'
                        ? 'bg-orange-500'
                        : 'bg-red-500'
                  : ''
              }`}
              onClick={() => handleEmotionSelect(em)}
            >
              {em === 'Happy' ? '😊' : em === 'Calm' ? '😌' : em === 'Excited' ? '🤩' : '😟'} {em}
            </Button>
          ))}
        </div>

        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          placeholder="Share what you're feeling right now..."
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          rows={3}
        />

        <Button
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
          onClick={handleSubmitFeedback}
          disabled={!emotion || !feedback}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Log Emotion
        </Button>
      </Card>
    </div>
  );
};
