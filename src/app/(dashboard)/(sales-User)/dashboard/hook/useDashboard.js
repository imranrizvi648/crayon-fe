"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useDashboard = () => {
  const [data, setData] = useState({
    user: { name: "Ahmed Hassan", region: "Middle East (UAE)", role: "Senior Sales Representative" },
    stats: { totalSheets: 0, pending: 0, approvalRate: 0, totalValue: "0" },
    sheets: [],
    activities: [], // Activities state
    pagination: { total: 0, page: 1, limit: 5 }
  });

  const [loading, setLoading] = useState(true);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to format activity text
  const formatActivityText = (act) => {
    const entity = act.entity_type.replace(/_/g, " ").toLowerCase();
    switch (act.action) {
      case "APPROVE":
        return `Sheet #${act.entity_id} was approved by Finance`;
      case "CREATE":
        return `New ${entity} #${act.entity_id} was created`;
      case "STATUS_CHANGE":
        return `Status of ${entity} #${act.entity_id} was updated`;
      default:
        return `${act.action} action on ${entity} #${act.entity_id}`;
    }
  };

  const fetchSheets = useCallback(async (targetPage = 1) => {
    try {
      setSheetsLoading(true);
      const res = await api.get(ENDPOINTS.DASHBOARD.RECENT_SHEETS, {
        params: { page: targetPage, limit: 5 }
      });

      const transformedSheets = (res.data.sheets || []).map(s => ({
        id: s.sheet_number,
        client: s.opportunity_name,
        amount: `${new Intl.NumberFormat().format(s.total_eup)} ${s.currency_code}`,
        date: new Date(s.updated_at).toLocaleDateString('en-GB'),
        tag: s.template_type,
        status: s.status.toLowerCase(),
      }));

      setData(prev => ({ 
        ...prev, 
        sheets: transformedSheets,
        pagination: { 
          ...prev.pagination, 
          page: targetPage, 
          total: res.data.total_count || prev.pagination.total 
        } 
      }));
    } catch (err) {
      console.error("❌ SHEETS FETCH ERROR:", err);
    } finally {
      setSheetsLoading(false);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Added Activity API to Promise.all
      const [summaryRes, sheetsRes, activityRes] = await Promise.all([
        api.get(ENDPOINTS.DASHBOARD.DASHBOARD_SUMMARY),
        api.get(ENDPOINTS.DASHBOARD.RECENT_SHEETS, { params: { page: 1, limit: 5 } }),
        api.get(ENDPOINTS.DASHBOARD.USER_ACTIVITY(1, 30)) // Fetching for User 1, 30 Days
      ]);

      const summary = summaryRes.data;

      // 1. Transform Stats
      const transformedStats = {
        totalSheets: summary.total_costing_sheets || 0,
        pending: summary.pending_approvals || 0,
        approvalRate: summary.total_costing_sheets > 0 
          ? ((summary.status_breakdown?.APPROVED / summary.total_costing_sheets) * 100).toFixed(1) 
          : 0,
        totalValue: new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(summary.total_pipeline_value || 0),
      };

      // 2. Transform Sheets
      const transformedSheets = (sheetsRes.data.sheets || []).map(s => ({
        id: s.sheet_number,
        client: s.opportunity_name,
        amount: `${new Intl.NumberFormat().format(s.total_eup)} ${s.currency_code}`,
        date: new Date(s.updated_at).toLocaleDateString('en-GB'),
        tag: s.template_type,
        status: s.status.toLowerCase(),
      }));

      // 3. Transform Activities for the UI
      const transformedActivities = (activityRes.data.recent_activity || []).map(act => ({
        type: act.action.toLowerCase(), // 'approve', 'create', 'status_change'
        text: formatActivityText(act),
        time: act.created_at, // Pass ISO string to be formatted in component
      }));

      setData(prev => ({
        ...prev,
        stats: transformedStats,
        sheets: transformedSheets,
        activities: transformedActivities,
        pagination: { 
          page: 1,
          limit: 5,
          total: sheetsRes.data.total_count || summary.total_costing_sheets || 0 
        }
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  return { data, loading, sheetsLoading, error, fetchSheets, refresh: fetchDashboardData };
};