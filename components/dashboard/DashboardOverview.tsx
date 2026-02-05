'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { IAnalytics, IWorkshop } from '@/lib/mongodb/schemas';

export function DashboardOverview() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, workshopsRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/workshops'),
        ]);

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }

        if (workshopsRes.ok) {
          const data = await workshopsRes.json();
          setWorkshops(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !analytics) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  const COLORS = ['#00d084', '#00d4ff', '#7c3aed', '#f59e0b', '#ec4899'];
  const emotionData = analytics.emotionBreakdown || [];

  // Get user's registrations
  const userRegistrations = workshops.reduce((acc: any, workshop) => {
    const registration = workshop.registrations.find((r) => r.userId === user?._id);
    if (registration) {
      acc.push({ ...workshop, userStatus: registration.status });
    }
    return acc;
  }, []);

  const bookedCount = userRegistrations.filter((w: any) => w.userStatus === 'booked').length;
  const attendedCount = userRegistrations.filter((w: any) => w.userStatus === 'attended').length;
  const interestedCount = userRegistrations.filter((w: any) => w.userStatus === 'interested').length;

  return (
    <div className="space-y-6">
      {/* Header with Time */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Happiness and Well-being</h1>
          <p className="text-gray-600">happiness levear</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Time in selected days</div>
        </div>
      </div>

      {/* Time and Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Qnos</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">19:00</p>
                  <p className="text-xs text-gray-500">Tour Residualsm</p>
                </div>
                <svg width="80" height="60" viewBox="0 0 80 60" className="text-orange-400">
                  <path
                    d="M 10 40 Q 20 20 30 35 T 50 30 T 70 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="30" cy="35" r="4" fill="currentColor" />
                  <circle cx="50" cy="30" r="4" fill="currentColor" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm mb-4">Contribution</p>
            <p className="text-3xl font-bold text-gray-900">{user?.joyCoins ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-md">
          <CardContent className="p-6">
            <p className="text-gray-500 text-sm mb-4">Least Interest</p>
            <p className="text-3xl font-bold text-gray-900">{analytics.averageHappiness.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Mental Health */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border-0 text-white shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Mental Health</CardTitle>
              <div className="flex gap-2">
                <button className="text-orange-400 text-xs px-2 py-1">🔄</button>
                <button className="text-gray-400 text-xs">⋮</button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Score</p>
                <p className="text-4xl font-bold text-white">4</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Participants</p>
                <p className="text-2xl font-bold text-white">1157</p>
              </div>
            </div>

            {/* Area Chart - Happiness Trend */}
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={analytics.happinessTrend || []}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" tick={{ fill: '#999', fontSize: 12 }} />
                <YAxis tick={{ fill: '#999', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#00d4ff" fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>

            {/* Bar Chart */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-4">Mental Happiness</p>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart
                  data={[
                    { name: 'Mon', value: 65 },
                    { name: 'Tue', value: 72 },
                    { name: 'Wed', value: 68 },
                    { name: 'Thu', value: 75 },
                    { name: 'Fri', value: 80 },
                    { name: 'Sat', value: 85 },
                    { name: 'Sun', value: 82 },
                  ]}
                >
                  <XAxis dataKey="name" tick={{ fill: '#999', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#999', fontSize: 12 }} />
                  <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Side Cards */}
        <div className="space-y-4">
          {/* Timely Health Card */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Timely Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">⬆</p>
                  <p className="text-2xl font-bold">0.45%</p>
                </div>
                <ResponsiveContainer width="100%" height={80}>
                  <PieChart>
                    <Pie data={[{ value: 45 }, { value: 55 }]} innerRadius={25} outerRadius={40} startAngle={180} endAngle={0} fill="#8884d8" dataKey="value">
                      <Cell fill="#00d084" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-600">126</p>
              </div>
            </CardContent>
          </Card>

          {/* Top Features */}
          <Card className="bg-white border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Top Features</CardTitle>
              <CardDescription>For Ecottage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emotionData.slice(0, 2).map((emotion: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="text-xl">{emotion.emoji}</span>
                    <span className="text-gray-600">{emotion.count} OS</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section - Emotions and Stats */}
      <Card className="bg-white border-0 shadow-md">
        <CardHeader>
          <CardTitle>Emotion Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {emotionData.map((emotion: any, idx: number) => (
              <div key={idx} className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                <p className="text-4xl mb-2">{emotion.emoji}</p>
                <p className="font-bold text-gray-900">{emotion.count}</p>
                <p className="text-xs text-gray-500">{emotion.percentage}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* My Workshops Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardHeader>
            <CardTitle className="text-2xl">{bookedCount}</CardTitle>
            <CardDescription>Booked</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardHeader>
            <CardTitle className="text-2xl">{attendedCount}</CardTitle>
            <CardDescription>Attended</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
          <CardHeader>
            <CardTitle className="text-2xl">{interestedCount}</CardTitle>
            <CardDescription>Interested</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
