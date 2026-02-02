'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, CheckCircle, AlertCircle, Info, Calendar, Award } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'alert' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'Certificate Earned!',
    message: 'Congratulations! You earned a certificate for completing the Mindfulness Workshop.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    icon: <Award className="w-5 h-5" />
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Upcoming Workshop',
    message: 'Stress Management workshop starts in 2 hours at Main Hall.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    icon: <Calendar className="w-5 h-5" />
  },
  {
    id: '3',
    type: 'info',
    title: 'New Trainer Available',
    message: 'Sarah Johnson just joined as a happiness trainer. Check her profile!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    icon: <Info className="w-5 h-5" />
  },
  {
    id: '4',
    type: 'alert',
    title: 'Low Happiness Score',
    message: 'Your recent happiness assessment shows a decline. Take a workshop to boost your well-being!',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    icon: <AlertCircle className="w-5 h-5" />
  }
];

export const RealtimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showPanel, setShowPanel] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'alert':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'reminder':
        return 'bg-yellow-50 border-l-4 border-yellow-500';
      default:
        return 'bg-gray-50';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'alert':
        return 'bg-red-100 text-red-800';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <Badge className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs">
            {unreadCount}
          </Badge>
        )}
      </button>

      {/* Notifications Panel */}
      {showPanel && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-gray-100 border-0"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
              <button
                onClick={() => setShowPanel(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="divide-y">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition ${getTypeColor(notification.type)} ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {notification.icon || <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                        <Badge className={getTypeBadgeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
