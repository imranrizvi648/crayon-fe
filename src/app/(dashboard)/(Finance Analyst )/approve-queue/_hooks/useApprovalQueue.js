"use client";
import { useState, useCallback, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export const useApprovalQueue = () => {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Default Filters State
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    priority: "CRITICAL", // Default as per your postman screenshot
    region: "UAE"        // Default as per your postman screenshot
  });

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      
      // Query Params Build karna
      const params = new URLSearchParams({
        page: filters.page,
        page_size: filters.pageSize,
        ...(filters.search && { search: filters.search }),
        ...(filters.priority && filters.priority !== "ALL" && { priority: filters.priority }),
        ...(filters.region && { region: filters.region }),
      });

      const response = await api.get(`${ENDPOINTS.FINANCE_ANALYST.DASHBOARD.APPROVALS_QUEUE_LIST}?${params.toString()}`);
      
      setData(response.data.items || []);
      setTotalCount(response.data.total_count || 0);
    } catch (err) {
      console.error("Queue Fetch Error:", err);
      toast.error("Failed to load approval queue");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Jab bhi filters change hon, data auto-fetch ho
  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: newFilters.page || 1 }));
  };

  // --- NAYA: Single Sheet Detail Fetch ---
  // --- FIX: Single Sheet Detail Fetch ---
const fetchSheetDetail = useCallback(async (id) => {
  // Check karein ke ID valid hai ya nahi
  if (!id || typeof id === 'object') return { success: false };

  try {
    setLoading(true);
    const res = await api.get(ENDPOINTS.COSTING_SHEETS.GET_BY_ID(id));
    
    // NOTE: Yahan fetchSheetDetail(res.data) nahi likhna! 
    // Agar aapko state update karni hai to setData use karein ya sirf return karein.
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error("Detail Fetch Error:", err);
    toast.error("Failed to fetch sheet details");
    return { success: false };
  } finally {
    setLoading(false);
  }
}, []);

  return {
    data,
    totalCount,
    loading,
    filters,
    updateFilters,
    refresh: fetchQueue,
    fetchSheetDetail,
  };
};