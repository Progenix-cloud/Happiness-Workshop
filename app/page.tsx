'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading && user._id) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Demo credentials
  const demoUsers = [
    { email: 'admin@happiness.com', name: 'Admin User', role: 'admin' },
    { email: 'trainer@happiness.com', name: 'Dr. Sarah Johnson', role: 'trainer' },
    { email: 'volunteer@happiness.com', name: 'John Smith', role: 'volunteer' },
    { email: 'participant@happiness.com', name: 'Emma Wilson', role: 'participant' },
  ];

  const handleDemoLogin = async (demoEmail: string, demoRole: string) => {
    setIsSubmitting(true);
    setError('');
    try {
      await login(demoEmail, 'password123');
      setSelectedRole(demoRole);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-orange-500">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-purple-500 to-orange-500 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">😊</h1>
          <h2 className="text-3xl font-bold text-white">Happiness Dashboard</h2>
          <p className="text-blue-100 mt-2">Track your well-being journey</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Select a demo account to explore the system</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid gap-3 mb-6">
              {demoUsers.map((demoUser) => (
                <button
                  key={demoUser.email}
                  onClick={() => handleDemoLogin(demoUser.email, demoUser.role)}
                  disabled={isSubmitting}
                  className="p-3 text-left border rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="font-medium text-gray-900">{demoUser.name}</div>
                  <div className="text-sm text-gray-500">Role: {demoUser.role}</div>
                  <div className="text-xs text-gray-400">{demoUser.email}</div>
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or login manually</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="admin@happiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                <Input
                  type="password"
                  placeholder="password123"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <Button
                onClick={() => handleDemoLogin(email, 'participant')}
                disabled={isSubmitting || !email}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Demo credentials: Use any email above with password: <strong>password123</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
