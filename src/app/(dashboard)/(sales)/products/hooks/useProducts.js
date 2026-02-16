"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";

export const useProducts = () => {
  const [data, setData] = useState({
    items: [],
    pagination: { total: 0, page: 1, limit: 50 }
  });
  const [loading, setLoading] = useState(true);

  const transformProduct = (p) => ({
    id: p.id,
    sku: p.part_number,
    name: p.name,
    // Product type ko category ki jagah use kar rahe hain jaisa image mein hai
    category: p.product_type?.replace('_', ' ') || "Uncategorized",
    basePrice: p.current_price?.unit_erp || 0,
    markup: `${(p.default_markup * 100).toFixed(1)}%`,
    isActive: p.is_active
  });

  const fetchProducts = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.PRODUCT.LIST, {
        params: { page, page_size: 50, search }
      });

      setData({
        items: (res.data.items || []).map(transformProduct),
        pagination: {
          total: res.data.total,
          page: res.data.page,
          limit: res.data.page_size
        }
      });
    } catch (err) {
      console.error("❌ PRODUCT FETCH ERROR:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products: data.items, pagination: data.pagination, loading, fetchProducts };
};