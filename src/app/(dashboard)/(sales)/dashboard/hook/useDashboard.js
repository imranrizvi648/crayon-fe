"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useDashboard = () => {
  const [data, setData] = useState({
    user: { name: "Ahmed Hassan", region: "Middle East (UAE)", role: "Senior Sales Representative" },
    stats: { totalSheets: 0, pending: 0, approvalRate: 0, totalValue: "0" },
    sheets: [],
    activities: [],
    pagination: { total: 0, page: 1, limit: 5 }
  });
  
  const [loading, setLoading] = useState(true);
  const [sheetsLoading, setSheetsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSheets = useCallback(async (targetPage = 1) => {
    try {
      setSheetsLoading(true);
      const res = await api.get(ENDPOINTS.DASHBOARD.RECENT_SHEETS, {
        params: { page: targetPage, limit: 5 }
      });

      const sheetsData = res.data.sheets || [];
      const transformedSheets = sheetsData.map(s => ({
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
          // Check for total_count, otherwise keep previous total
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
      const [summaryRes, sheetsRes] = await Promise.all([
        api.get(ENDPOINTS.DASHBOARD.DASHBOARD_SUMMARY),
        api.get(ENDPOINTS.DASHBOARD.RECENT_SHEETS, { params: { page: 1, limit: 5 } })
      ]);

      const summary = summaryRes.data;
      
      const transformedStats = {
        totalSheets: summary.total_costing_sheets || 0,
        pending: summary.pending_approvals || 0,
        approvalRate: summary.total_costing_sheets > 0 
          ? ((summary.status_breakdown?.APPROVED / summary.total_costing_sheets) * 100).toFixed(1) 
          : 0,
        totalValue: new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(summary.total_pipeline_value || 0),
      };

      const transformedSheets = (sheetsRes.data.sheets || []).map(s => ({
        id: s.sheet_number,
        client: s.opportunity_name,
        amount: `${new Intl.NumberFormat().format(s.total_eup)} ${s.currency_code}`,
        date: new Date(s.updated_at).toLocaleDateString('en-GB'),
        tag: s.template_type,
        status: s.status.toLowerCase(),
      }));

      setData(prev => ({
        ...prev,
        stats: transformedStats,
        sheets: transformedSheets,
        pagination: { 
          page: 1,
          limit: 5,
          // CRITICAL FIX: Use summary total if API total is missing
          total: sheetsRes.data.total_count || summary.total_costing_sheets || 0 
        }
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  return { data, loading, sheetsLoading, error, fetchSheets, refresh: fetchDashboardData };
};