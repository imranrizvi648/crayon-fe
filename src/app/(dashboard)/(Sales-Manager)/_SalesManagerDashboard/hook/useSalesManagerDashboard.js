"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useDashboard = () => {
  const [data, setData] = useState({
    user: { name: "", email: "", region: "", role: "" },
    stats: { totalUsers: 0, totalSheets: 0, approved: 0, rejected: 0 },
    performance: [],
    activities: [],
    selectedUserPerformance: null 
  });

  const [loading, setLoading] = useState(true);
  const [perfLoading, setPerfLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- Search Users Function ---
  const searchUsers = async (query) => {
    try {
      console.log("🔍 Searching users for:", query);
      const res = await api.get(`${ENDPOINTS.SALES_MANAGER.DASHBOARD.TEAM_PERFORMANCE}?search=${query}&limit=10`);
      console.log("✅ Search Results:", res.data.users);
      return res.data.users || [];
    } catch (err) {
      console.error("❌ Search Users Error:", err);
      return [];
    }
  };

  // --- Fetch Specific User Performance ---
  const fetchSpecificPerformance = async (userId) => {
    if (!userId) return;
    try {
      console.log("⏳ Fetching performance for User ID:", userId);
      setPerfLoading(true);
      
      const endpointFn = ENDPOINTS?.SALES_MANAGER?.DASHBOARD?.SPECIFIC_TEAM_PERFORMACE;
      let url = typeof endpointFn === 'function' 
        ? endpointFn(userId) 
        : `/dashboard/sales-manager/users/${userId}/performance`;

      console.log("🔗 Requesting URL:", url);
      const res = await api.get(url);
      
      console.log("📦 Raw Performance Response:", res.data);
      
      if (!res.data.metrics) {
        console.warn("⚠️ Warning: 'metrics' key not found in response!");
      }

      setData(prev => ({ ...prev, selectedUserPerformance: res.data }));
    } catch (err) {
      console.error("❌ User Perf Fetch Error:", err);
    } finally {
      setPerfLoading(false);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      console.log("🚀 Initializing Dashboard Data Fetch...");
      setLoading(true);
      setError(null);
      
      const [userRes, summaryRes, perfRes, activityRes] = await Promise.all([
        api.get(ENDPOINTS.AUTH.ME),
        api.get(ENDPOINTS.SALES_MANAGER.DASHBOARD.SUMMARY),
        api.get(ENDPOINTS.SALES_MANAGER.DASHBOARD.TOP_PERFORMANCE),
        api.get(ENDPOINTS.SALES_MANAGER.DASHBOARD.TEAM_ACTIVITY)
      ]);

      // console.log("📥 [Auth Me] Response:", userRes.data);
      // console.log("📥 [Summary] Response:", summaryRes.data);
      // console.log("📥 [Top Performance] Response:", perfRes.data);
      // console.log("📥 [Team Activity] Response:", activityRes.data);

      const allActivities = (activityRes.data || [])
        .flatMap(u => u.recent_activity.map(a => ({ ...a, userName: u.user_name })))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10);

      const sortedPerf = (perfRes.data.user_performance || [])
        .sort((a, b) => b.total_value - a.total_value)
        .slice(0, 5);

      const mappedData = {
        user: {
          name: userRes.data.full_name,
          email: userRes.data.email,
          region: userRes.data.region,
          role: userRes.data.roles?.[0]?.replace(/_/g, " ") || "User",
        },
        stats: {
          totalUsers: summaryRes.data.total_sales_users || summaryRes.data.user_id || 0,
          totalSheets: summaryRes.data.total_sheets || 0,
          approved: summaryRes.data.approved_sheets || 0,
          rejected: summaryRes.data.rejected_sheets || 0,
        },
        performance: sortedPerf,
        activities: allActivities
      };

      console.log("🎯 Final Mapped Data for State:", mappedData);
      setData(prev => ({ ...prev, ...mappedData }));

    } catch (err) {
      console.error("❌ Global Fetch Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, perfLoading, error, refresh: fetchData, searchUsers, fetchSpecificPerformance };
};