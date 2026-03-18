"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios"; // useDashboard wala axios instance
import { ENDPOINTS } from "@/lib/constants";

export const useCustomers = () => {
  const [data, setData] = useState({
    items: [],
    stats: { total: 0, active: 0, partners: 0 },
    pagination: { total: 0, page: 1, limit: 10 }
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transformation Logic (Data ko clean karne ke liye)
  const transformCustomer = (c) => ({
    id: c.id,
    uuid: c.uuid,
    name: c.name,
    customer_code: c.customer_code,
    region: c.region || "N/A",
    country: c.country || "N/A",
    currency: c.currency_code,
    is_partner: c.is_partner,
    status: c.is_active ? "active" : "inactive",
    company_size: c.company_size || "N/A",
    payment_terms: `${c.payment_terms} Days`,
    created_at: new Date(c.created_at).toLocaleDateString('en-GB')
  });

  const fetchCustomers = useCallback(async (targetPage = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.CUSTOMER.LIST, {
        params: { page: targetPage, page_size: pageSize }
      });

      const customerItems = res.data.items || [];
      
      // Update State with transformed data
      setData(prev => ({
        ...prev,
        items: customerItems.map(transformCustomer),
        pagination: {
          total: res.data.total || 0,
          page: res.data.page || targetPage,
          limit: res.data.page_size || pageSize
        },
        // Agar backend stats nahi bhej raha to hum frontend pe calculate kar sakte hain
        stats: {
          total: res.data.total || 0,
          active: customerItems.filter(i => i.is_active).length,
          partners: customerItems.filter(i => i.is_partner).length
        }
      }));
    } catch (err) {
      console.error("❌ CUSTOMER FETCH ERROR:", err);
      setError(err.response?.data?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return { 
    customers: data.items, 
    stats: data.stats,
    pagination: data.pagination, 
    loading, 
    error, 
    fetchCustomers,
    refresh: () => fetchCustomers(data.pagination.page) 
  };
};