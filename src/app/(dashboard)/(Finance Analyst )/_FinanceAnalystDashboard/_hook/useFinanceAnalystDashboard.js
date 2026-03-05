"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export const useFinanceAnalystDashboard = () => {
  const [data, setData] = useState({
    user: { name: "", region: "", role: "" },
    stats: { pending: 0, highPriority: 0, totalValue: 0, avgGP: 0 },
    highPrioritySheets: [],
  });

  const [sheetDetail, setSheetDetail] = useState(null); // Specific sheet storage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Dashboard Data Fetch ---
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [userRes, summaryRes, priorityRes] = await Promise.all([
        api.get(ENDPOINTS.AUTH.ME),
        api.get(ENDPOINTS.FINANCE_ANALYST.DASHBOARD.SUMMARY),
        api.get(ENDPOINTS.FINANCE_ANALYST.DASHBOARD.HIGHT_PRIORITY_SHEETS)
      ]);

      setData({
        user: {
          name: userRes.data.full_name,
          region: userRes.data.region,
          role: userRes.data.roles?.[0]?.replace(/_/g, " ") || "Finance Analyst",
        },
        stats: {
          pending: summaryRes.data.pending_approvals_count || 0,
          highPriority: summaryRes.data.high_priority_sheets_count || 0,
          totalValue: summaryRes.data.total_pending_value || 0,
          avgGP: summaryRes.data.average_gp || 0,
        },
        highPrioritySheets: priorityRes.data.items || []
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- NAYA: Single Sheet Detail Fetch ---
  const fetchSheetDetail = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.COSTING_SHEETS.GET_BY_ID(id));
      setSheetDetail(res.data); // State update
      return { success: true, data: res.data };
    } catch (err) {
      toast.error("Failed to fetch sheet details");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  return { 
    data, 
    sheetDetail, // Naya state
    loading, 
    error, 
    refresh: fetchDashboardData,
    fetchSheetDetail // Naya function
  };
};