// src/app/dashboard/investor/page.tsx
import { InvestorDashboard } from '@/components/InvestorDashboard';

export default function InvestorDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Investor Portfolio</h1>
        <InvestorDashboard />
      </div>
    </div>
  );
}