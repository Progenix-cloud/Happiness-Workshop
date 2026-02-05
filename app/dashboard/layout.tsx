import React from "react"
import { SidebarNav } from '@/components/dashboard/SidebarNav';
import { RealtimeNotifications } from '@/components/dashboard/RealtimeNotifications';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNav />
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 right-0 p-4 bg-white shadow-sm flex justify-end">
          <RealtimeNotifications />
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

