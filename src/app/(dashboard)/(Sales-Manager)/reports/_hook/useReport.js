"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export const useReport = () => {
  const [data, setData] = useState([]);
  const [overview, setOverview] = useState(null); // Naya state overview ke liye
  const [loading, setLoading] = useState(true);

  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      
      // Dono APIs ek sath fetch karein
      const [tableRes, overviewRes] = await Promise.all([
        api.get(ENDPOINTS.SALES_MANAGER.REPORTS.PERFORMANCE),
        api.get(ENDPOINTS.SALES_MANAGER.REPORTS.TEAM_PERFORMANCE_OVERVIEW) // Apni constant list me add kar lein
      ]);
      
      setData(tableRes.data.users || []);
      setOverview(overviewRes.data || null); // Overview data set kiya

    } catch (err) {
      console.error("❌ Fetch Performance Report Error:", err);
      toast.error("Failed to load performance report");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return {
    performanceData: data,
    overviewData: overview, // Ye naya return add kiya
    loading,
    refresh: fetchReport
  };
};