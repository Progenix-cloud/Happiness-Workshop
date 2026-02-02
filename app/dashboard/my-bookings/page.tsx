import { Suspense } from 'react';
import { MyBookingsPage } from '@/components/dashboard/MyBookingsPage';

function MyBookingsLoading() {
  return <div className="p-6">Loading bookings...</div>;
}

export default function MyBookingsRoute() {
  return (
    <Suspense fallback={<MyBookingsLoading />}>
      <MyBookingsPage />
    </Suspense>
  );
}
