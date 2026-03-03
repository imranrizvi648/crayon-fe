"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useTeamSheets = (initialPage = 1) => {
  const [data, setData] = useState({
    items: [],
    pagination: { total: 0, page: 1, total_pages: 1 },
  });
  
  // 🔥 Separate state for Summary taake ye filter se kabhi na badle
  const [globalSummary, setGlobalSummary] = useState({ 
    total_revenue: 0, 
    approved: 0, 
    pending: 0,
    total_count: 0 
  });

  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "all", page: initialPage });

  // --- Summary Fetcher (Sirf Page Load par chalega) ---
  const fetchInitialData = useCallback(async () => {
    try {
      setSummaryLoading(true);
      // Pehli request bina kisi filter ke taake "Total" stats milein
      const response = await api.get(ENDPOINTS.SALES_MANAGER.TEAM.SHEETS);
      
      setGlobalSummary({
        total_revenue: response.data.summary.total_revenue,
        approved: response.data.summary.approved,
        pending: response.data.summary.pending,
        total_count: response.data.total // Original total records
      });
    } catch (err) {
      console.error("Error fetching initial summary:", err);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // --- Sheets Fetcher (Filters ke saath chalega) ---
  const fetchSheets = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.status !== "all") params.append("status", filters.status);
      params.append("page", filters.page);
      params.append("page_size", 20);

      const response = await api.get(`${ENDPOINTS.SALES_MANAGER.TEAM.SHEETS}?${params.toString()}`);
      
      setData({
        items: response.data.items || [],
        pagination: {
          total: response.data.total,
          page: response.data.page,
          total_pages: response.data.total_pages
        }
      });
      // NOTE: Hum yahan summary update NAHI kar rahe, isliye cards fix rahenge
    } catch (err) {
      console.error("Error fetching filtered sheets:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Page Load par Summary layein
  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // Filters badalne par sirf Table update karein
  useEffect(() => {
    fetchSheets();
  }, [fetchSheets]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page) => setFilters(prev => ({ ...prev, page }));


   // 5. FETCH SINGLE SHEET DETAIL
    const fetchSheetDetail = useCallback(async (id) => {
      try {
        setLoading(true);
        const res = await api.get(ENDPOINTS.COSTING_SHEETS.GET_BY_ID(id));
        return { success: true, data: res.data };
      } catch (err) {
        toast.error("Failed to fetch sheet details");
        return { success: false };
      } finally {
        setLoading(false);
      }
    }, []);


  return { 
    data, 
    globalSummary, // Ab hum ye use karenge cards ke liye
    loading, 
    summaryLoading,
    updateFilters,
    fetchSheetDetail, // Ye function ab kisi bhi sheet ke details fetch karne ke liye available hai
    setPage, 
    refresh: fetchSheets 
  };
};