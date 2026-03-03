"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export const useApprovals = () => {
  const [data, setData] = useState({
    queue: [],
    summary: { total_pending_sheets: 0 }
  });
  const [loading, setLoading] = useState(true);

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.SALES_MANAGER.APPROVALS.LIST);
      setData({
        queue: res.data.queue || [],
        summary: res.data.summary || { total_pending_sheets: 0 }
      });
    } catch (err) {
      console.error("❌ Fetch Approvals Error:", err);
      toast.error("Failed to load approval queue");
    } finally {
      setLoading(false);
    }
  }, []);

  // Approve Sheet Logic
  const approveSheet = async (id, comments) => {
    try {
      // Yahan hardcoded path ki bajaye ENDPOINTS use kiya hai
      await api.post(ENDPOINTS.SALES_MANAGER.APPROVALS.APPROVE_SHEET(id), { comments });
      
      toast.success(`Sheet CS-2026-00${id} approved successfully!`);
      await fetchApprovals(); 
      return true; 
    } catch (err) {
      console.error("❌ Approve Error:", err);
      toast.error("Failed to approve sheet");
      return false; 
    }
  };

  // Reject Sheet Logic
  const rejectSheet = async (id, reason, rejectionCode) => {
    try {
      // Yahan bhi hardcoded path ki bajaye ENDPOINTS use kiya hai
      await api.post(ENDPOINTS.SALES_MANAGER.APPROVALS.REJECT_SHEET(id), { 
        reason: reason, 
        rejection_code: rejectionCode 
      });
      
      toast.success(`Sheet CS-2026-00${id} has been rejected.`);
      await fetchApprovals(); // Table ko dobara refresh karein
      return true;
    } catch (err) {
      console.error("❌ Reject Error:", err);
      toast.error("Failed to reject sheet");
      return false;
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  return {
    approvals: data.queue,
    totalPending: data.summary.total_pending_sheets,
    loading,
    refresh: fetchApprovals,
    approveSheet,
    rejectSheet
  };
};