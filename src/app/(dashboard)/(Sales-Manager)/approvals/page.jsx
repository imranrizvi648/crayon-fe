"use client";
import React from 'react';
import { useApprovals } from "./_hook/useApprovals";
import { ApprovalTable } from "./components/ApprovalTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function ApprovalPage() {
  // Hook se approveSheet aur rejectSheet dono nikal liye
  const { approvals, totalPending, loading, refresh, approveSheet, rejectSheet } = useApprovals();

  return (
    <div className="bg-[#f8fafc] min-h-screen ">
      <div className=" mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="space-y-1">
              <h1 className="text-2xl font-black  text-gray-700 ">
              Submission Requiring Approval 
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-400 ">
                Pending Queue
              </p>
              <Badge className="bg-indigo-100 text-secondary border-none hover:bg-indigo-100 font-bold px-2 py-0">
                {totalPending || 0} SHEETS
              </Badge>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={refresh}
            disabled={loading}
            className="bg-white font-bold text-slate-600 gap-2 border-slate-200 shadow-sm"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </Button>
        </div>

        {/* Table Section - Dono actions pass kar diye */}
        <ApprovalTable 
          data={approvals || []} 
          loading={loading} 
          approveAction={approveSheet} 
          rejectAction={rejectSheet} 
        />

      </div>
    </div>
  );
}