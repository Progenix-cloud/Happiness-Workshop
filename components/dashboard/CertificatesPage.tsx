'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ICertificate } from '@/lib/mongodb/schemas';
import { Badge } from '@/components/ui/badge';

export function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<ICertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<ICertificate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user?._id) return;

      try {
        const response = await fetch(`/api/certificates?userId=${user._id}`);
        if (response.ok) {
          const data = await response.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user?._id]);

  const generatePDF = (cert: ICertificate) => {
    // Mock PDF generation - in real app, use jsPDF
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Georgia, serif; margin: 0; padding: 40px; }
            .certificate { border: 3px solid #7c3aed; padding: 60px; text-align: center; background: linear-gradient(to right, #f0f9ff, #faf5ff); }
            .title { font-size: 48px; color: #7c3aed; margin-bottom: 30px; text-transform: uppercase; letter-spacing: 2px; }
            .subtitle { font-size: 24px; color: #333; margin-bottom: 40px; }
            .name { font-size: 36px; font-weight: bold; color: #1f2937; margin: 30px 0; }
            .text { font-size: 16px; color: #4b5563; line-height: 1.8; margin: 20px 0; }
            .details { margin-top: 40px; padding-top: 30px; border-top: 2px solid #7c3aed; }
            .signatures { display: grid; grid-template-columns: 1fr 1fr; margin-top: 60px; }
            .signature { text-align: center; }
            .line { border-top: 2px solid #333; width: 150px; margin: 20px auto 5px; }
            .date { color: #999; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="title">Certificate</div>
            <div class="subtitle">of Completion</div>
            
            <div class="text">This certifies that</div>
            <div class="name">${user?.name}</div>
            <div class="text">has successfully completed the course</div>
            <div class="title" style="font-size: 32px; color: #1f2937; margin: 30px 0;">${cert.workshopTitle}</div>
            
            <div class="details">
              <p class="text">Instructor: <strong>${cert.trainerName}</strong></p>
              <p class="text">Certificate Number: <strong>${cert.certificateNumber}</strong></p>
              <p class="text">Issued: <strong>${new Date(cert.issuedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            </div>
            
            <div class="signatures">
              <div class="signature">
                <div class="line"></div>
                <p>Trainer Signature</p>
              </div>
              <div class="signature">
                <div class="line"></div>
                <p>Administrator</p>
              </div>
            </div>
            
            <p class="date">Happiness & Well-Being Dashboard | www.happiness-dashboard.com</p>
          </div>
        </body>
      </html>
    `;

    const newWindow = window.open('', '', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
      newWindow.print();
    }
  };

  const shareOnSocial = (platform: string, cert: ICertificate) => {
    const text = `I just completed the "${cert.workshopTitle}" workshop and earned a certificate! 🎓 #HappinessDashboard #WellBeing`;
    const url = `${window.location.origin}/certificate/${cert.certificateNumber}`;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  if (loading) {
    return <div className="text-center py-10">Loading certificates...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Certificates</h1>
        <p className="text-gray-600">Download and share your achievements</p>
      </div>

      {certificates.length === 0 ? (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-2xl mb-2">🎓</p>
              <p className="text-lg font-semibold text-gray-700 mb-2">No Certificates Yet</p>
              <p className="text-gray-600 mb-4">Complete a workshop to earn your first certificate!</p>
              <Button className="bg-blue-600 hover:bg-blue-700">Browse Workshops</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <Card key={cert._id} className="hover:shadow-lg transition-shadow bg-white border-0">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cert.workshopTitle}</CardTitle>
                    <CardDescription>by {cert.trainerName}</CardDescription>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">{cert.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Certificate Number</p>
                  <p className="font-mono text-sm font-semibold">{cert.certificateNumber}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Issued Date</p>
                    <p className="font-medium">{new Date(cert.issuedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium capitalize">{cert.status}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => generatePDF(cert)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    📥 Download PDF
                  </Button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => shareOnSocial('twitter', cert)}
                      className="flex-1 px-3 py-2 border border-blue-400 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium"
                    >
                      𝕏
                    </button>
                    <button
                      onClick={() => shareOnSocial('linkedin', cert)}
                      className="flex-1 px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium"
                    >
                      in
                    </button>
                    <button
                      onClick={() => shareOnSocial('facebook', cert)}
                      className="flex-1 px-3 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 text-sm font-medium"
                    >
                      f
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
