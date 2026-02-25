"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from '@/lib/constants';
import { toast } from "sonner"; 

export const useCostingSheets = () => {
  const [data, setData] = useState({ 
    items: [], 
    pagination: { total: 0, page: 1, limit: 10 } 
  });
  const [loading, setLoading] = useState(true);

  // 1. FETCH LIST (Target Page aur Postman structure ke mutabiq)
  const fetchSheets = useCallback(async (targetPage = 1, filters = {}) => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.COSTING_SHEETS.LIST, {
        params: { 
          page: targetPage, 
          page_size: 10, 
          ...filters 
        }
      });
      
      const transformed = (res.data.items || []).map(item => ({
        id: item.id,
        sheet_number: item.sheet_number,
        uuid: item.uuid,
        client: item.customer_name,
        opportunity: item.opportunity_name,
        amount: `${new Intl.NumberFormat().format(item.total_eup || 0)} ${item.currency_code || 'AED'}`,
        date: new Date(item.updated_at).toLocaleDateString('en-GB'),
        tag: item.template_type,
        status: item.status?.toLowerCase(),
        region: item.sales_region,
        notes: item.internal_notes || ""
      }));

      // Postman ke mutabiq res.data.total aur res.data.page use kiya hai
      setData(prev => ({ 
        items: transformed, 
        pagination: { 
          ...prev.pagination,
          total: res.data.total || 0, 
          page: res.data.page || targetPage,
          limit: res.data.page_size || 10
        } 
      }));
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      toast.error("Failed to load costing sheets");
    } finally {
      setLoading(false);
    }
  }, []);
// 2. CREATE SHEET (Enhanced Error Handling for Backend Debugging)
const createSheet = async (payload) => {
  try {
    // Console mein payload check karne ke liye (Optional debug line)
    console.log("🚀 Sending Payload to Backend:", payload);

    const res = await api.post(ENDPOINTS.COSTING_SHEETS.CREATE, payload, {
      timeout: 15000,
    });

    if (res.status === 200 || res.status === 201) {
      await fetchSheets(1);
      toast.success("Costing sheet created successfully!");
      return { success: true, data: res.data };
    }

    throw new Error(`Unexpected status code: ${res.status}`);

  } catch (err) {
    let userFriendlyMessage = "Failed to create costing sheet.";
    let devDetails = {};

    // --- BACKEND ERROR CONSOLE LOGGING ---
    console.group("❌ BACKEND ERROR DETAILS"); // Grouping logs for clean view

    if (err.response) {
      // Server responded with 4xx or 5xx
      const { status, data } = err.response;
      
      console.error(`Status Code: ${status}`);
      console.error("Raw Backend Data:", data);
      
      // Agar backend Request ID bhej raha hai (debugging ke liye best hai)
      if (data?.request_id) console.warn(`Request ID: ${data.request_id}`);

      // Validation Errors Parsing
      const errors = data?.errors || data?.error?.details || data?.validationErrors || data?.details || {};
      
      if (status === 422 || status === 400) {
        console.table(errors); // Table format mein errors dikhayega
        userFriendlyMessage = "Validation failed: Check console for field details.";
        
        // Detailed message construction
        if (Array.isArray(errors)) {
           userFriendlyMessage = errors.map(e => `${e.field}: ${e.message}`).join("; ");
        } else if (Object.keys(errors).length > 0) {
           userFriendlyMessage = Object.values(errors).flat().slice(0, 3).join("; ");
        }
      } else if (status >= 500) {
        userFriendlyMessage = "Server-side crash (500). Backend logs check karein.";
      }

      devDetails = { status, data, errors };

    } else if (err.request) {
      // Network issues / CORS
      console.error("No response received. Possible CORS issue or Server is down.");
      console.error("Request Object:", err.request);
      userFriendlyMessage = "Network/CORS error. Server tak request nahi pohnchi.";
      devDetails = { type: "network_error" };
    } else {
      console.error("Request Setup Error:", err.message);
      userFriendlyMessage = "Request prepare karne mein masla hua.";
      devDetails = { type: "setup_error", message: err.message };
    }

    console.groupEnd(); // End grouping
    // -------------------------------------

    toast.error(userFriendlyMessage, { duration: 6000 });

    return {
      success: false,
      error: userFriendlyMessage,
      details: devDetails
    };
  }
};
  // 3. UPDATE SHEET
  const updateSheet = async (id, updateData) => {
    try {
      await api.put(ENDPOINTS.COSTING_SHEETS.UPDATE(id), updateData);
      // Current page refresh karein taake user wahin rahe
      await fetchSheets(data.pagination.page); 
      toast.success("Sheet updated successfully!"); 
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || "Update failed";
      toast.error(errMsg); 
      return { success: false, error: errMsg };
    }
  };

  // 4. DELETE SHEET
  const deleteSheet = async (id) => {
    try {
      await api.delete(ENDPOINTS.COSTING_SHEETS.DELETE(id));
      setData(prev => ({ 
        ...prev, 
        items: prev.items.filter(i => i.id !== id),
        pagination: { ...prev.pagination, total: prev.pagination.total - 1 }
      }));
      toast.success("Sheet deleted successfully"); 
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || "Could not delete sheet";
      toast.error(errMsg); 
      return { success: false };
    }
  };

  useEffect(() => { fetchSheets(1); }, [fetchSheets]);

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

  // useCostingSheets hook ke andar ye function add karein
// useCostingSheets.js
const searchCustomers = async (searchQuery) => {
  try {
    // Debugging ke liye log karein
    console.log("🔍 API URL:", ENDPOINTS.CUSTOMER.LIST_WITH_FILTER);

    // Hamesha ensure karein ke URL string hai
    const res = await api.get(String(ENDPOINTS.CUSTOMER.LIST_WITH_FILTER), {
      params: { search: searchQuery } 
    });
    
    return res.data.items || []; 
  } catch (err) {
    console.error("❌ SEARCH ERROR DETAILS:", err);
    return [];
  }
};

// useCostingSheets.js mein return se pehle add karein
const searchProducts = async (searchQuery) => {
  try {
    const res = await api.get(ENDPOINTS.PRODUCT.LIST, {
      params: { search: searchQuery } 
    });
    // Backend structure ke mutabiq res.data.items ya direct array
    return res.data.items || res.data || []; 
  } catch (err) {
    console.error("❌ PRODUCT SEARCH ERROR:", err);
    return [];
  }
};

  return { 
    data, 
    loading, 
    fetchSheets, 
    createSheet, 
    updateSheet, 
    deleteSheet,
    fetchSheetDetail,
    searchCustomers,
    searchProducts
  };
};