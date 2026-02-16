"use client";

import { useDashboard } from "./hook/useDashboard";
import HeroSection from "./components/HeroSection";
import StatsGrid from "./components/StatsGrid";
import QuickActions from "./components/QuickActions";
import RecentSheets from "./components/RecentSheets";
import ActivityFeed from "./components/ActivityFeed";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // Destructure all necessary values from the hook
  const { data, loading, sheetsLoading, error, fetchSheets, refresh } = useDashboard();

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[120px] rounded-xl" />)}
        </div>
        <Skeleton className="h-[100px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-red-100">
          <p className="text-red-500 font-bold mb-4">❌ API Error: {error}</p>
          <Button onClick={refresh} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 px-6 space-y-8 pb-10">
      <HeroSection user={data.user} />

      <StatsGrid stats={data.stats} />

      <QuickActions role={data.user?.role} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pass pagination props and fetch function correctly */}
     
<RecentSheets 
  sheets={data.sheets} 
  pagination={data.pagination} 
  onPageChange={fetchSheets} // Ye pass karna lazmi hai
  isLoading={sheetsLoading} 
/>
        <ActivityFeed activities={data.activities} />
      </div>
    </div>
  );
}