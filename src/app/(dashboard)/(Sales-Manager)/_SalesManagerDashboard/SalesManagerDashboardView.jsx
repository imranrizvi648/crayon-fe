"use client";

import { useEffect, useState } from 'react';
import { useDashboard } from "./hook/useSalesManagerDashboard";
import { Button } from "@/components/ui/button";

//dashboard
import HeroSection from "./components/HeroSection";
import SalesManagerStats from "./components/SalesManagerStats";
import ManagerQuickActions from "./components/ManagerQuickActions";
import TopPerformers from "./components/TopPerformers";
import TeamActivity from "./components/TeamActivity";
import TeamPerformanceTrend from "./components/TeamPerformanceTrend";


export default function SalesManagerDashboardView() {
  // fetchSheets ko hata diya kyunki hook mein ab ye nahi hai
  const { data, loading, perfLoading, error, searchUsers, fetchSpecificPerformance, refresh } = useDashboard();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Connection Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="bg-card p-8 rounded-2xl shadow-sm text-center border border-border">
          <p className="text-destructive font-bold mb-2 text-lg">❌ Connection Error</p>
          <p className="text-muted-foreground mb-6 text-sm">{error}</p>
          <Button 
            onClick={refresh} 
            className="font-bold"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  // Hydration error se bachne ke liye (Next.js standard)
  if (!isMounted) return null; 

  return (
    <div className="min-h-screen px-5 space-y-8 pb-10 text-foreground">
      {/* Sirf HeroSection display hoga */}
      <HeroSection 
        user={data.user}
        isLoading={loading}
      />

      <SalesManagerStats 
        stats={data.stats} 
        isLoading={loading} 
      />

      <ManagerQuickActions 
        pendingCount={data.stats?.approved || 0} 
      />

{/* Parent div mein 'items-stretch' use karein taake dono column barabar height lein */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
  <div className="flex flex-col h-full">
    <TopPerformers 
      performance={data.performance || []} 
      isLoading={loading} 
    />
  </div>

  <div className="flex flex-col h-full">
    <TeamActivity 
      activities={data.activities || []} 
      isLoading={loading} 
    />
  </div>
</div>

        {/* Team Performance Section */}
      <TeamPerformanceTrend 
      
        searchUsers={searchUsers}
        onUserSelect={fetchSpecificPerformance}
        perfData={data.selectedUserPerformance}
        isLoading={perfLoading}
      />
      
      
    </div>
  );
}