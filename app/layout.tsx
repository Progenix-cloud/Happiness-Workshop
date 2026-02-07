import React from "react";
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/lib/context/AuthContext';
import { NotificationProvider } from '@/lib/context/NotificationContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Happiness & Well-Being Dashboard',
  description: 'Track your happiness journey with workshops, certificates, and community feedback',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NotificationProvider>
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
