"use client";
import { useState, useEffect, useCallback } from "react";
import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/constants";
import { toast } from "sonner";

// ─── ERROR LOGGER ─────────────────────────────────────────────────────────────
// Har API error ko terminal/console mein detailed print karta hai

const logBackendError = (label, err) => {
  console.group(`❌ [${label}] BACKEND ERROR`);

  if (err.response) {
    const { status, data, headers, config } = err.response;

    console.error(`📌 Status     : ${status}`);
    console.error(`📌 URL        : ${config?.method?.toUpperCase()} ${config?.url}`);

    // Full raw response
    console.error("📦 Raw Response Data:", data);

    // Common error shapes
    const msg =
      data?.message ||
      data?.detail ||
      data?.error ||
      data?.msg ||
      null;

    if (msg) console.error("💬 Error Message:", msg);

    // Validation errors — Pydantic / FastAPI style
    if (data?.detail && Array.isArray(data.detail)) {
      console.group("🔴 Validation Errors (Pydantic):");
      data.detail.forEach((e, i) => {
        const field = Array.isArray(e.loc) ? e.loc.join(" → ") : String(e.loc ?? "unknown");
        console.error(`  [${i + 1}] Field: ${field} | Type: ${e.type} | Msg: ${e.msg}`);
      });
      console.groupEnd();
    }

    // Django REST / generic errors dict
    if (data?.errors && typeof data.errors === "object") {
      console.group("🔴 Field Errors:");
      Object.entries(data.errors).forEach(([field, msgs]) => {
        console.error(`  ${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`);
      });
      console.groupEnd();
    }

    // Request payload that was sent
    if (config?.data) {
      try {
        console.warn("📤 Sent Payload:", JSON.parse(config.data));
      } catch {
        console.warn("📤 Sent Payload (raw):", config.data);
      }
    }

    // Request headers (useful for auth debugging)
    console.warn("📎 Request Headers:", config?.headers);

  } else if (err.request) {
    console.error("🌐 No response received — CORS issue or server is down");
    console.error("Request:", err.request);
  } else {
    console.error("⚙️  Request setup error:", err.message);
  }

  // Always print full error object at the end
  console.error("🔍 Full Error Object:", err);
  console.groupEnd();
};

// ─── USER-FRIENDLY ERROR MESSAGE BUILDER ──────────────────────────────────────

const buildUserMessage = (err) => {
  if (!err.response) return "Network/CORS error — server tak request nahi pohnchi";

  const { status, data } = err.response;

  // Pydantic validation array
  if (data?.detail && Array.isArray(data.detail)) {
    return data.detail
      .slice(0, 3)
      .map((e) => {
        const field = Array.isArray(e.loc) ? e.loc.join(".") : String(e.loc ?? "field");
        return `${field}: ${e.msg}`;
      })
      .join(" | ");
  }

  // Single string detail
  if (typeof data?.detail === "string") return data.detail;

  // message / error fields
  if (data?.message) return data.message;
  if (data?.error)   return typeof data.error === "string" ? data.error : JSON.stringify(data.error);

  // errors dict
  if (data?.errors && typeof data.errors === "object") {
    return Object.entries(data.errors)
      .slice(0, 3)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
      .join(" | ");
  }

  if (status === 401) return "Unauthorized — please log in again";
  if (status === 403) return "Forbidden — access denied";
  if (status === 404) return "Resource not found (404)";
  if (status === 422) return "Validation error (422) — check console for field details";
  if (status >= 500)  return `Server error (${status}) — backend logs check karein`;

  return `Request failed with status ${status}`;
};

// ─── HOOK ─────────────────────────────────────────────────────────────────────

export const useCostingSheets = () => {
  const [data, setData] = useState({
    items: [],
    pagination: { total: 0, page: 1, limit: 10 },
  });
  const [loading, setLoading] = useState(true);

  // 1. FETCH LIST
  const fetchSheets = useCallback(async (targetPage = 1, filters = {}) => {
    try {
      setLoading(true);
      const res = await api.get(ENDPOINTS.COSTING_SHEETS.LIST, {
        params: { page: targetPage, page_size: 10, ...filters },
      });

      const transformed = (res.data.items || []).map((item) => ({
        id:           item.id,
        sheet_number: item.sheet_number,
        uuid:         item.uuid,
        client:       item.customer_name,
        opportunity:  item.opportunity_name,
        amount:       `${new Intl.NumberFormat().format(item.total_eup || 0)} ${item.currency_code || "AED"}`,
        date:         new Date(item.updated_at).toLocaleDateString("en-GB"),
        tag:          item.template_type,
        status:       item.status?.toLowerCase(),
        region:       item.sales_region,
        notes:        item.internal_notes || "",
      }));

      setData((prev) => ({
        items: transformed,
        pagination: {
          ...prev.pagination,
          total: res.data.total    || 0,
          page:  res.data.page     || targetPage,
          limit: res.data.page_size|| 10,
        },
      }));
    } catch (err) {
      logBackendError("fetchSheets", err);
      toast.error("Failed to load costing sheets");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. CREATE SHEET
  const createSheet = async (payload) => {
    try {
      console.group("🚀 [createSheet] SENDING PAYLOAD");
      console.log("Full Payload:", payload);
      console.log("Line Items Count:", payload.line_items?.length);
      console.log("sales_region:", payload.sales_region);
      console.log("exchange_rate:", payload.exchange_rate);
      console.groupEnd();

      const res = await api.post(ENDPOINTS.COSTING_SHEETS.CREATE, payload, {
        timeout: 15000,
      });

      if (res.status === 200 || res.status === 201) {
        console.log("✅ [createSheet] SUCCESS:", res.data);
        await fetchSheets(1);
        toast.success("Costing sheet created successfully!");
        return { success: true, data: res.data };
      }

      throw new Error(`Unexpected status: ${res.status}`);

    } catch (err) {
      logBackendError("createSheet", err);
      const msg = buildUserMessage(err);
      toast.error(msg, { duration: 8000 });
      return { success: false, error: msg, details: err.response?.data };
    }
  };

  // 3. UPDATE SHEET
  const updateSheet = async (id, updateData) => {
    try {
      console.log(`🔄 [updateSheet] id=${id}`, updateData);
      await api.put(ENDPOINTS.COSTING_SHEETS.UPDATE(id), updateData);
      await fetchSheets(data.pagination.page);
      toast.success("Sheet updated successfully!");
      return { success: true };
    } catch (err) {
      logBackendError("updateSheet", err);
      const msg = buildUserMessage(err);
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // 4. DELETE SHEET
  const deleteSheet = async (id) => {
    try {
      console.log(`🗑️ [deleteSheet] id=${id}`);
      await api.delete(ENDPOINTS.COSTING_SHEETS.DELETE(id));
      setData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i.id !== id),
        pagination: { ...prev.pagination, total: prev.pagination.total - 1 },
      }));
      toast.success("Sheet deleted successfully");
      return { success: true };
    } catch (err) {
      logBackendError("deleteSheet", err);
      const msg = buildUserMessage(err);
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  // 5. FETCH SINGLE SHEET
  const fetchSheetDetail = useCallback(async (id) => {
    try {
      setLoading(true);
      console.log(`📄 [fetchSheetDetail] id=${id}`);
      const res = await api.get(ENDPOINTS.COSTING_SHEETS.GET_BY_ID(id));
      return { success: true, data: res.data };
    } catch (err) {
      logBackendError("fetchSheetDetail", err);
      toast.error("Failed to fetch sheet details");
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // 6. SEARCH CUSTOMERS
  const searchCustomers = async (searchQuery) => {
    try {
      console.log(`🔍 [searchCustomers] query="${searchQuery}"`);
      const res = await api.get(String(ENDPOINTS.CUSTOMER.LIST_WITH_FILTER), {
        params: { search: searchQuery },
      });
      return res.data.items || [];
    } catch (err) {
      logBackendError("searchCustomers", err);
      return [];
    }
  };

  // 7. SEARCH PRODUCTS
  const searchProducts = async (searchQuery) => {
    try {
      console.log(`🔍 [searchProducts] query="${searchQuery}"`);
      const res = await api.get(ENDPOINTS.PRODUCT.LIST, {
        params: { search: searchQuery },
      });
      return res.data.items || res.data || [];
    } catch (err) {
      logBackendError("searchProducts", err);
      return [];
    }
  };

  // 8. FETCH EXCHANGE RATES
  const fetchExchangeRates = async () => {
    try {
      // ENDPOINTS mein GET_EXCHANGE_RATE define hona chahiye — fallback bhi hai
      const url = ENDPOINTS.COSTING_SHEETS.GET_EXCHANGE_RATE ?? "/exchange-rates";
      console.log(`💱 [fetchExchangeRates] url=${url}`);
      const res = await api.get(url);
      return res.data.rates || res.data.items || res.data || [];
    } catch (err) {
      logBackendError("fetchExchangeRates", err);
      return [];
    }
  };


  useEffect(() => {
    fetchSheets(1);
  }, [fetchSheets]);

  const exportSheet = async (id, sheetNumber = "sheet") => {
  try {
    toast.info("Preparing your export...");
    
    // Response type 'blob' hona chahiye taake file data handle ho sake
    const res = await api.get(ENDPOINTS.COSTING_SHEETS.EXPORT_SHEET(id), {
      responseType: 'blob',
    });

    // File download logic
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // File ka naam (Aap extension backend ke mutabiq .pdf ya .xlsx rakh sakte hain)
    link.setAttribute('download', `Costing_${sheetNumber}_${id}.xlsx`); 
    
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Export successful!");
  } catch (err) {
    logBackendError("exportSheet", err);
    toast.error("Failed to export sheet");
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
    searchProducts,
    fetchExchangeRates,
    exportSheet,
  };
};