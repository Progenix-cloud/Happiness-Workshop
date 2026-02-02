'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const analyticsData = [
  { month: 'Jan', workshops: 12, participants: 145, satisfaction: 85 },
  { month: 'Feb', workshops: 15, participants: 198, satisfaction: 88 },
  { month: 'Mar', workshops: 18, participants: 245, satisfaction: 90 },
  { month: 'Apr', workshops: 22, participants: 312, satisfaction: 92 },
  { month: 'May', workshops: 20, participants: 287, satisfaction: 91 },
  { month: 'Jun', workshops: 25, participants: 356, satisfaction: 93 }
];

export const AnalyticsExport: React.FC = () => {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'xlsx'>('pdf');

  const handleExport = (format: string) => {
    console.log('[v0] Exporting analytics as', format);
    toast.success(`Analytics exported as ${format.toUpperCase()}!`);
  };

  const totalWorkshops = analyticsData.reduce((sum, d) => sum + d.workshops, 0);
  const totalParticipants = analyticsData.reduce((sum, d) => sum + d.participants, 0);
  const avgSatisfaction = (analyticsData.reduce((sum, d) => sum + d.satisfaction, 0) / analyticsData.length).toFixed(1);

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Analytics & Reports</h2>
        </div>
        <p className="text-orange-100">Track growth and export detailed reports</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50">
          <p className="text-sm text-gray-600 mb-2">Total Workshops</p>
          <p className="text-4xl font-bold text-orange-600">{totalWorkshops}</p>
          <p className="text-xs text-gray-500 mt-2">Last 6 months</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50">
          <p className="text-sm text-gray-600 mb-2">Total Participants</p>
          <p className="text-4xl font-bold text-red-600">{totalParticipants}</p>
          <p className="text-xs text-gray-500 mt-2">+34% from last quarter</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50">
          <p className="text-sm text-gray-600 mb-2">Avg Satisfaction</p>
          <p className="text-4xl font-bold text-yellow-600">{avgSatisfaction}%</p>
          <p className="text-xs text-gray-500 mt-2">Consistently high</p>
        </Card>
      </div>

      {/* Charts */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-gray-900">Workshop Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="workshops" fill="#f97316" name="Workshops" />
            <Bar dataKey="participants" fill="#ef4444" name="Participants" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-gray-900">Satisfaction Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analyticsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" />
            <YAxis domain={[80, 95]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="#f59e0b"
              name="Satisfaction %"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Export Options */}
      <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
        <h3 className="font-semibold mb-4 text-gray-900 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Report
        </h3>

        <div className="space-y-3">
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            onClick={() => handleExport('pdf')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export as CSV
          </Button>
          <Button
            className="w-full justify-start bg-transparent"
            variant="outline"
            onClick={() => handleExport('xlsx')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Export as Excel
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            📊 <strong>Tip:</strong> Export reports regularly to track your organization's growth and impact on happiness and well-being.
          </p>
        </div>
      </Card>
    </div>
  );
};
