"use client";
import { useState, useCallback, useEffect } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

export const useExchangeRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.FINANCE_ANALYST.DASHBOARD.EXCHANGE_RATE);
      setRates(res.data.rates || []);
    } catch (err) {
      toast.error("Failed to fetch exchange rates");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRate = async (id, newRate) => {
    try {
      setLoading(true);
      await api.put(ENDPOINTS.FINANCE_ANALYST.DASHBOARD.UPDATE_EXCHANGE_RATE(id), { rate: newRate });
      toast.success("Exchange rate updated successfully");
      await fetchRates(); // Table refresh karein
      return { success: true };
    } catch (err) {
      toast.error(err.response?.status === 403 ? "You don't have permission to edit rates" : "Update failed");
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRates(); }, [fetchRates]);

  return { rates, loading, updateRate, refresh: fetchRates };
};