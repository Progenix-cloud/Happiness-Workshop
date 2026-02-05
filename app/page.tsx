'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { HeroSection } from '@/components/HeroSection';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading && user._id) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-teal-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return <HeroSection />;
}
