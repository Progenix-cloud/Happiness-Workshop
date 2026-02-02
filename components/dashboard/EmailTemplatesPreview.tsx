'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { IWorkshop } from '@/lib/mongodb/schemas';

export function EmailTemplatesPreview() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('registration');
  const [emailPreview, setEmailPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
      }
    };

    fetchWorkshops();
  }, []);

  const templates: Record<string, any> = {
    registration: {
      label: 'Registration Confirmation',
      data: {
        userName: user?.name || 'John Doe',
        workshopTitle: workshops[0]?.title || 'Mindfulness & Meditation',
        workshopDate: new Date().toLocaleDateString(),
        workshopTime: '19:00',
      },
    },
    confirmation: {
      label: 'Status Confirmation',
      data: {
        userName: user?.name || 'John Doe',
        workshopTitle: workshops[0]?.title || 'Mindfulness & Meditation',
        attendanceStatus: 'attended',
      },
    },
    certificate: {
      label: 'Certificate Issued',
      data: {
        userName: user?.name || 'John Doe',
        workshopTitle: workshops[0]?.title || 'Mindfulness & Meditation',
        trainerName: 'Dr. Sarah Johnson',
        certificateNumber: 'HWBD-2024-001',
        issuedDate: new Date().toLocaleDateString(),
      },
    },
    feedback: {
      label: 'Feedback Request',
      data: {
        userName: user?.name || 'John Doe',
        workshopTitle: workshops[0]?.title || 'Mindfulness & Meditation',
      },
    },
    testimonial: {
      label: 'Testimonial Thank You',
      data: {
        userName: user?.name || 'John Doe',
        testimonialText: 'This workshop changed my life! Highly recommended.',
        rating: 5,
      },
    },
  };

  const handlePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'preview@example.com',
          templateType: selectedTemplate,
          data: templates[selectedTemplate].data,
          preview: true,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setEmailPreview(result.html || '');
      }
    } catch (error) {
      console.error('Error fetching preview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Templates</h1>
        <p className="text-gray-600">Preview email notifications sent to users</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Template List */}
        <div className="space-y-2">
          {Object.entries(templates).map(([key, template]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedTemplate(key);
                setEmailPreview('');
              }}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedTemplate === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-900 hover:border-blue-600'
              }`}
            >
              {template.label}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="lg:col-span-3">
          <Card className="bg-white border-0">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{templates[selectedTemplate].label}</CardTitle>
              <Button
                onClick={handlePreview}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Loading...' : 'Preview'}
              </Button>
            </CardHeader>
            <CardContent>
              {emailPreview ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <iframe
                    srcDoc={emailPreview}
                    className="w-full h-96 border border-gray-300 rounded"
                    title="Email Preview"
                  />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Raw HTML:</p>
                    <pre className="bg-white p-4 rounded border border-gray-300 text-xs overflow-auto max-h-64 text-gray-700">
                      {emailPreview}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Click "Preview" to see the email template</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Data Reference */}
      <Card className="bg-blue-50 border-0">
        <CardHeader>
          <CardTitle className="text-lg">Template Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-white p-4 rounded text-xs overflow-auto max-h-40 border border-blue-200">
            {JSON.stringify(templates[selectedTemplate].data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
