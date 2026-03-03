"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner"; // Ya jo bhi aap notification ke liye use kar rahe hain

export const useTeamMembers = () => {
  const [data, setData] = useState({
    members: [],
    total: 0,
    skip: 0,
    limit: 10
  });

  const [filters, setFilters] = useState({
    search: "",
    is_active: true,
    skip: 0,
    limit: 10
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const url = ENDPOINTS.SALES_MANAGER.TEAM.GET_MEMBERS;
      const res = await api.get(url, { params: filters });
      
      setData({
        members: res.data.users || [],
        total: res.data.total || 0,
        skip: res.data.skip || 0,
        limit: res.data.limit || 10
      });
    } catch (err) {
      console.error("❌ Fetch Team Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, [filters]);

 const createMember = async (memberData) => {
  try {
    const url = ENDPOINTS.SALES_MANAGER.TEAM.CREATE_MEMBER;
    const res = await api.post(url, memberData);
    
    toast.success("Member created successfully!");
    fetchMembers(); 
    return { success: true, data: res.data };

  } catch (err) {
    // --- Error Detail Nikalne ka Logic ---
    let errorMessage = "Failed to create member";

    if (err.response?.status === 422) {
      // Agar backend 'details' array bhej raha hai (jaise aapne console mein dikhaya)
      const details = err.response.data.details;
      if (Array.isArray(details) && details.length > 0) {
        // Pehle error ka message uthayen (e.g., "Password must contain...")
        errorMessage = details[0].message;
      } else {
        errorMessage = err.response.data.message || "Validation failed";
      }
    } else {
      // Baki errors ke liye (403, 500, etc.)
      errorMessage = err.response?.data?.message || err.message;
    }

    // Toast mein error dikhayen
    toast.error(errorMessage);

    // Console mein debugging barkarar rakhein
    console.error("❌ API Error:", {
      status: err.response?.status,
      details: err.response?.data?.details
    });

    return { success: false, error: errorMessage };
  }
};
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const updateFilter = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return { 
    members: data.members, 
    meta: { total: data.total, skip: data.skip, limit: data.limit },
    filters,
    updateFilter,
    loading, 
    error, 
    refresh: fetchMembers,
    createMember // Hook se export kiya
  };
};