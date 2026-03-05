"use client";
import { useState, useCallback, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useAuditLogs = () => {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 10 });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Naye Filter States
  const [filters, setFilters] = useState({
    user_id: "",
    entity_type: "",
    action: ""
  });

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.FINANCE_ANALYST.DASHBOARD.AUDIT_LIST, {
        params: { 
          page, 
          search, 
          page_size: 10,
          // Postman ke mutabiq filters bhej rahe hain
          user_id: filters.user_id || undefined,
          entity_type: filters.entity_type || undefined,
          action: filters.action || undefined
        }
      });
      setData(response.data);
    } catch (err) {
      console.error("Audit Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, search, filters]); // filters ko dependency mein dala

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { 
    logs: data.items, 
    total: data.total, 
    currentPage: data.page, 
    loading, 
    setPage, 
    setSearch, 
    setFilters, // export setFilters
    filters,
    refresh: fetchLogs 
  };
};