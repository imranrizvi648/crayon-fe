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
// 2. CREATE SHEET (Clean & Production Ready)
const createSheet = async (payload) => {
  try {
    // API Call
    const res = await api.post(ENDPOINTS.COSTING_SHEETS.CREATE, payload, {
      timeout: 15000,
    });

    // Success Handling
    if (res.status === 200 || res.status === 201) {
      await fetchSheets(1); // Refresh list
      toast.success("Costing sheet created successfully!");
      return { success: true, data: res.data };
    }

    throw new Error(`Unexpected status code: ${res.status}`);

  } catch (err) {
    let userFriendlyMessage = "Failed to create costing sheet. Please try again.";
    let devDetails = {};

    if (err.response) {
      // Server responded with an error (4xx, 5xx)
      const { status, data } = err.response;

      if (status === 422 || status === 400) {
        // Validation errors parse karna
        const errors = data?.errors || data?.error?.details || data?.validationErrors || {};

        if (Object.keys(errors).length > 0) {
          userFriendlyMessage = "Validation failed: ";
          userFriendlyMessage += Object.values(errors)
            .flat()
            .slice(0, 3)
            .join("; ") + (Object.keys(errors).length > 3 ? " + more..." : "");
        } else if (data?.message) {
          userFriendlyMessage = data.message;
        } else if (data?.detail) {
          userFriendlyMessage = data.detail;
        }
      } else if (status === 401 || status === 403) {
        userFriendlyMessage = "Authentication issue. Please login again.";
      } else if (status >= 500) {
        userFriendlyMessage = "Server error occurred. Please try again later.";
      } else {
        userFriendlyMessage = `Error ${status}: Something went wrong.`;
      }

      devDetails = {
        status,
        data: data || "No data",
        validationErrors: data?.errors || "No detailed errors",
      };

    } else if (err.request) {
      // Network issues (No response)
      userFriendlyMessage = "Cannot reach server. Check your internet connection.";
      devDetails = { type: "network_error" };
    } else {
      // Setup error
      userFriendlyMessage = "Error while preparing the request.";
      devDetails = { type: "setup_error", message: err.message };
    }

    // Final user feedback (Sirf Toast dikhayein, Console silent rakhein)
    toast.error(userFriendlyMessage, {
      duration: 6000,
    });

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

  return { 
    data, 
    loading, 
    fetchSheets, 
    createSheet, 
    updateSheet, 
    deleteSheet 
  };
};