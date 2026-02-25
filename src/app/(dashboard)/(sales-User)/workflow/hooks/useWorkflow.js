"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useWorkflow = () => {
  const [sheets, setSheets] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [workflowData, setWorkflowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [workflowLoading, setWorkflowLoading] = useState(false);

  // 1. Fetch Left Sidebar List
  const fetchSheets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.WORKFLOW.LIST);
      setSheets(res.data.items || []);
      if (res.data.items?.length > 0) {
        setSelectedId(res.data.items[0].id); // Pehli sheet auto-select karein
      }
    } catch (err) {
      console.error("List Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Right Side Workflow Detail
  const fetchWorkflowDetail = useCallback(async (id) => {
    if (!id) return;
    try {
      setWorkflowLoading(true);
      const res = await api.get(ENDPOINTS.WORKFLOW.BY_COSTING_SHEET(id));
      setWorkflowData(res.data);
    } catch (err) {
      console.error("Workflow Detail Error:", err);
    } finally {
      setWorkflowLoading(false);
    }
  }, []);

  useEffect(() => { fetchSheets(); }, [fetchSheets]);
  
  useEffect(() => {
    if (selectedId) fetchWorkflowDetail(selectedId);
  }, [selectedId, fetchWorkflowDetail]);

  return { 
    sheets, 
    selectedId, 
    setSelectedId, 
    workflowData, 
    loading, 
    workflowLoading 
  };
};