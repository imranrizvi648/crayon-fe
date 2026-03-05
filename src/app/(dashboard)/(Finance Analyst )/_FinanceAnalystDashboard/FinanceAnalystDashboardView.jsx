"use client";

import { useEffect, useState } from 'react';

import { useRouter } from "next/navigation";
import { useFinanceAnalystDashboard } from "./_hook/useFinanceAnalystDashboard";
import HeroSection from "./components/HeroSection";
import FinanceAnalystStats from "./components/FinanaceAnalystStats";
import QuickActions from "./components/QuickActions";
import { PrioritySheetsTable } from "./components/PrioritySheetsTable";
import { Button } from "@/components/ui/button";
export default function FinanceAnalystDashboardView() {
  const router = useRouter(); // 2. Router initialize karein
  const { data, loading, error, refresh } = useFinanceAnalystDashboard();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  // 3. Ye function banayein jo ID lekar preview page par bhejay ga
  const handleViewSheet = (id) => {
    // Ye aapko page: /_FinanceAnalystDashboard/preview/[id] par le jayega
router.push(`/preview/${id}`); 
  };

  if (error) { /* ... error UI ... */ }
  if (!isMounted) return null; 

  return (
    <div className="min-h-screen px-5 space-y-8 pb-10 text-foreground">
      <HeroSection user={data.user} isLoading={loading} />
      <FinanceAnalystStats stats={data.stats} isLoading={loading} />
      <QuickActions pendingCount={data.stats?.pendingSheets || 0} />

      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-800">High Priority Sheets</h2>
        
        <PrioritySheetsTable 
          data={data.highPrioritySheets} 
          loading={loading}
          // 4. onView mein hamara naya function pass karein
          onView={handleViewSheet} 
        />
      </div>
    </div>
  );
}