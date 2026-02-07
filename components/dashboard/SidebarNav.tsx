'use client';

import React from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navigationItems = {
  admin: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Browse Workshops', href: '/dashboard/browse-workshops', icon: '🎓' },
    { label: 'Workshop Requests', href: '/dashboard/workshop-requests', icon: '📝' },
    { label: 'Member Applications', href: '/dashboard/member-applications-management', icon: '📋' },
    { label: 'Trainers', href: '/dashboard/trainers', icon: '👨‍🏫' },
    { label: 'Users', href: '/dashboard/users', icon: '👥' },
    { label: 'Features', href: '/dashboard/features', icon: '✨' },
    { label: 'My Certificates', href: '/dashboard/certificates', icon: '🎖️' },
    { label: 'Testimonials', href: '/dashboard/testimonials', icon: '⭐' },
    { label: 'Feedback', href: '/dashboard/feedback', icon: '💬' },
    { label: 'Email Templates', href: '/dashboard/email-templates', icon: '📧' },
  ],
  trainer: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Browse Workshops', href: '/dashboard/browse-workshops', icon: '🎓' },
    { label: 'My Workshops', href: '/dashboard/my-workshops', icon: '📚' },
    { label: 'Students', href: '/dashboard/students', icon: '👥' },
    { label: 'Features', href: '/dashboard/features', icon: '✨' },
    { label: 'My Certificates', href: '/dashboard/certificates', icon: '🎖️' },
    { label: 'Feedback', href: '/dashboard/feedback', icon: '💬' },
    { label: 'My Quote', href: '/dashboard/my-quote', icon: '💭' },
    { label: 'Email Templates', href: '/dashboard/email-templates', icon: '📧' },
  ],
  volunteer: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Browse Workshops', href: '/dashboard/browse-workshops', icon: '🎓' },
    { label: 'Features', href: '/dashboard/features', icon: '✨' },
    { label: 'My Certificates', href: '/dashboard/certificates', icon: '🎖️' },
    { label: 'Testimonials', href: '/dashboard/testimonials', icon: '⭐' },
    { label: 'My Quote', href: '/dashboard/my-quote', icon: '💭' },
  ],
  participant: [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Browse Workshops', href: '/dashboard/browse-workshops', icon: '🎓' },
    { label: 'Features', href: '/dashboard/features', icon: '✨' },
    { label: 'My Certificates', href: '/dashboard/certificates', icon: '🎖️' },
    { label: 'Feedback', href: '/dashboard/feedback', icon: '💬' },
    { label: 'My Quote', href: '/dashboard/my-quote', icon: '💭' },
    { label: 'Become Member', href: '/dashboard/member-application', icon: '🌟' },
  ],
};

export function SidebarNav() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  const items = navigationItems[user.role as keyof typeof navigationItems] || [];

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 min-h-screen p-4 flex flex-col">
      {/* User Profile */}
      <div className="mb-8 pb-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
            alt={user.name}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{user.name}</p>
            <p className="text-slate-400 text-xs capitalize">{user.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-xl font-bold text-yellow-400">{user.happinessScore}</p>
            <p className="text-xs text-slate-300">Score</p>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-xl font-bold text-purple-400">{user.certificatesCount}</p>
            <p className="text-xs text-slate-300">Certs</p>
          </div>
          <div className="bg-slate-700/50 rounded p-2">
            <p className="text-xl font-bold text-orange-400">{user.workshopsAttended}</p>
            <p className="text-xs text-slate-300">Joined</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center gap-3 ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <Button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white mt-auto"
      >
        Logout
      </Button>
    </div>
  );
}
