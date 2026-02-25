"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useDashboard = () => {
  const [data, setData] = useState({
    user: { name: "", region: "", role: "" },
    stats: { totalSheets: 0, pending: 0, approvalRate: 0, totalValue: "0", breakdown: [] },
    sheets: [],
    activities: [],
    pagination: { total: 0, page: 1, limit: 5 }
  });

  const [loading, setLoading] = useState(true);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async (page = 1) => {
    try {
      // console.log(`🚀 Fetching Page: ${page}`); // DEBUG
      
      if (page === 1) setLoading(true);
      else setSheetsLoading(true);

      const [userRes, summaryRes, sheetsRes, activityRes] = await Promise.all([
        api.get(ENDPOINTS.AUTH.ME),
        api.get(ENDPOINTS.DASHBOARD.DASHBOARD_SUMMARY),
        api.get(ENDPOINTS.DASHBOARD.RECENT_SHEETS, { params: { page, limit: 5 } }),
        api.get(ENDPOINTS.DASHBOARD.USER_ACTIVITY(1, 10))
      ]);

      console.log("📦 API Response (Sheets):", activityRes.data); // DEBUG: Check if total_count exists

      const profile = userRes.data;
      const summary = summaryRes.data;

      // Ensure total count is a number
      const apiTotal = sheetsRes.data.total_count || summary.total_costing_sheets || 0;
      // console.log(`🔢 Total Records Found: ${apiTotal}`); // DEBUG

      setData(prev => ({
        ...prev,
        user: {
          name: profile.full_name,
          email: profile.email,
          region: profile.region,
          role: profile.roles?.[0]?.replace(/_/g, " ") || "User",
        },
        stats: {
          totalSheets: summary.total_costing_sheets || 0,
          pending: summary.pending_approvals || 0,
          approvalRate: summary.total_costing_sheets > 0 
            ? ((summary.status_breakdown?.APPROVED / summary.total_costing_sheets) * 100).toFixed(1) 
            : 0,
          totalValue: new Intl.NumberFormat('en-US', { 
            style: 'currency', currency: summary.currency || 'USD', notation: "compact" 
          }).format(summary.total_pipeline_value || 0),
          breakdown: Object.entries(summary.status_breakdown || {}).map(([key, value]) => ({
            status: key.replace(/_/g, " "),
            count: value,
            fill: key === "APPROVED" ? "#10b981" : key === "DRAFT" ? "#94a3b8" : "#3b82f6"
          }))
        },
        sheets: (sheetsRes.data.sheets || []).map(s => ({
          id: s.sheet_number,
          client: s.opportunity_name,
          amount: `${new Intl.NumberFormat().format(s.total_eup)} ${s.currency_code}`,
          date: new Date(s.updated_at).toLocaleDateString('en-GB'),
          tag: s.template_type,
          status: s.status.toLowerCase(),
        })),
        activities: (activityRes.data.recent_activity || []).map(act => ({
          type: act.action.toLowerCase(),
          text: `${act.action} on ${act.entity_type}`,
          time: act.created_at,
        })),
        pagination: { 
          page: page,
          limit: 5,
          total: apiTotal 
        }
      }));

    } catch (err) {
      // console.error("❌ API Error:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setSheetsLoading(false);
      // console.log("✅ Fetch Complete"); // DEBUG
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(1);
  }, [fetchDashboardData]);

  return { 
    data, 
    loading, 
    sheetsLoading, 
    error, 
    refresh: () => fetchDashboardData(1), 
    fetchSheets: (page) => {
        console.log(`🖱️ Pagination Clicked! Going to page: ${page}`); // DEBUG
        fetchDashboardData(page);
    }
  };
};