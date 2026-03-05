"use client";
import React from 'react';
import { useRouter } from "next/navigation";
import { useApprovalQueue } from "./_hooks/useApprovalQueue";
import { ApprovalQueueTable } from "./components/ApprovalQueueTable";

export default function ApprovalQueuePage() {
  const router = useRouter();
  const queueHook = useApprovalQueue();

  const handleView = (id) => {
    router.push(`/approve-queue/preview/${id}`);
  };

  return (
    <div className="min-h-screen   space-y-6 -mt-3">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Approvals Queue</h1>
          <p className="text-slate-500 text-sm font-medium">Review and process high-priority financial costing sheets.</p>
        </div>
        {/* <div className="bg-white  px-4  rounded-lg shadow-sm flex flex-row items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Pending Tasks</span>
          <span className="text-xl font-bold text-secondary">{queueHook.totalCount}</span>
        </div> */}
      </div>

      <ApprovalQueueTable 
        queueHook={queueHook}
        onView={handleView}
      />
    </div>
  );
}