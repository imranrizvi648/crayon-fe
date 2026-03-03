"use client";
import React from 'react';
import { useReport } from "./_hook/useReport";
import { PerformanceTable } from "./components/PerformanceTable";
import { TeamOverview } from "./components/TeamOverview"; // Naya component import kiya
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function PerformanceReportPage() {
  // overviewData ko extract kiya
  const { performanceData, overviewData, loading, refresh } = useReport();

  return (
    <div className="bg-[#f8fafc] min-h-screen -mt-7">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6  p-4 ">
             <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black  text-gray-700 ">
            Report
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Manage and review your reports in one place
          </p>
        </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={loading}
            className="bg-white font-semibold text-slate-600 gap-2 border-slate-200 shadow-sm hover:bg-slate-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Report
          </Button>
        </div>

        {/* Naya Overview Section */}
        <TeamOverview data={overviewData} loading={loading} />

        {/* Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1">
          <PerformanceTable data={performanceData || []} loading={loading} />
        </div>

      </div>
    </div>
  );
}