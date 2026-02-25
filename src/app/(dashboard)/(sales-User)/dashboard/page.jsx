"use client";

import { useDashboard } from "./hook/useDashboard";
import HeroSection from "./components/HeroSection";
import StatsGrid from "./components/StatsGrid";
import StatusAnalytics from "./components/StatusAnalytics";
import RecentSheets from "./components/RecentSheets";
import ActivityFeed from "./components/ActivityFeed";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data, loading, sheetsLoading, error, refresh, fetchSheets } = useDashboard();

  // Error State: Ab ye theme variables use karega
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

  return (
    // bg-background aur text-foreground use karne se Light/Dark toggle automatically kaam karega
    <div className="min-h-screen  px-5 space-y-8 pb-10 text-foreground transition-colors duration-300">
      
      {/* HeroSection: Isme data.user pass ho raha hai */}
      <HeroSection user={data.user} isLoading={loading} />

      {/* StatsGrid: Dashboard stats */}
      <StatsGrid stats={data.stats} isLoading={loading} />

      {/* Analytics Section */}
      <StatusAnalytics breakdown={data.stats.breakdown} isLoading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Recent Sheets: Tables/Cards automatically border-border use karenge */}
          <RecentSheets 
            sheets={data.sheets} 
            pagination={data.pagination} 
            isLoading={loading || sheetsLoading} 
            onPageChange={fetchSheets} 
          />
        </div>
        
        {/* Activity Feed: Isko sidebar color ya card color mil sakta hai logic ke mutabiq */}
        <ActivityFeed activities={data.activities} isLoading={loading} />
      </div>
    </div>
  );
}