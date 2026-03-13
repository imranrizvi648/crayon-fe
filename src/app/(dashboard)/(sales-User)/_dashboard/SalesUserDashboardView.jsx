"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react'; // React import ki zarurat nahi, sirf hooks
import { useDashboard } from "./hook/useDashboard";
import HeroSection from "./components/HeroSection";
import StatsGrid from "./components/StatsGrid";
const StatusAnalytics = dynamic(
  () => import("./components/StatusAnalytics"),
  { 
    ssr: false,
    loading: () => <div className="h-75 w-full bg-slate-100 animate-pulse rounded-xl" /> 
  }
);
import RecentSheets from "./components/RecentSheets";
import ActivityFeed from "./components/ActivityFeed";
import { Button } from "@/components/ui/button";

export default function SalesUserDashboardView() {
  const { data, loading, sheetsLoading, error, refresh, fetchSheets } = useDashboard();
  const [isMounted, setIsMounted] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
        <div className="bg-card p-8 rounded-2xl shadow-sm text-center border border-border">
          <p className="text-destructive font-bold mb-4 text-lg">❌ Connection Error</p>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <Button 
            onClick={refresh} 
            className="bg-primary hover:opacity-90 text-primary-foreground px-8 font-bold transition-all"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  
  if (!isMounted) return null; 

  return (
    <div className="min-h-screen px-5 space-y-8 pb-10 text-foreground transition-colors duration-300">
      <HeroSection user={data.user} isLoading={loading} />
      <StatsGrid stats={data.stats} isLoading={loading} />
      
      {/* Analytics: data check ke sath pass karein */}
      {data.stats && (
        <StatusAnalytics breakdown={data.stats.breakdown} isLoading={loading} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentSheets 
            sheets={data.sheets} 
            pagination={data.pagination} 
            isLoading={loading || sheetsLoading} 
            onPageChange={fetchSheets} 
          />
        </div>
        <ActivityFeed activities={data.activities} isLoading={loading} />
      </div>
    </div>
  );
}