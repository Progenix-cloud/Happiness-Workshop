'use client';

import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Facebook, Twitter, Linkedin, Instagram, Mail, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ShareData {
  title: string;
  description: string;
  url: string;
  hashtags: string[];
}

export const SocialMediaShare: React.FC = () => {
  const mockCertificate = useMemo(() => ({
    title: 'I completed the Happiness Workshop!',
    description: 'Excited to share that I just completed the Happiness and Well-Being Workshop with Ellipsis of Happiness Foundation!',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    hashtags: ['HappinessJourney', 'WellBeing', 'MentalHealth', 'PersonalGrowth']
  }), []);
  const handleShare = (platform: string) => {
    const hashtags = mockCertificate.hashtags.join(' ');
    const text = `${mockCertificate.description} ${hashtags}`;
    const url = mockCertificate.url;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      instagram: 'https://www.instagram.com/',
      mail: `mailto:?subject=${encodeURIComponent(mockCertificate.title)}&body=${encodeURIComponent(text)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockCertificate.url);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Share2 className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Share Your Achievement</h2>
        </div>
        <p className="text-pink-100">Inspire others by sharing your happiness journey</p>
      </div>

      <Card className="p-8 bg-gradient-to-br from-white to-pink-50">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">{mockCertificate.title}</h3>
          <p className="text-gray-700 mb-3">{mockCertificate.description}</p>
          <div className="flex flex-wrap gap-2">
            {mockCertificate.hashtags.map(tag => (
              <span
                key={tag}
                className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-6">
          <p className="text-sm text-gray-600 mb-4">Share on:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              className="bg-blue-800 hover:bg-blue-900"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-800"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="w-4 h-4 mr-2" />
              LinkedIn
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={() => handleShare('instagram')}
            >
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => handleShare('mail')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyLink}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
