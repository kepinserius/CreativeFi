// src/app/dashboard/creator/page.tsx
import { CreatorDashboard } from '@/components/CreatorDashboard';

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>
        <CreatorDashboard />
      </div>
    </div>
  );
}