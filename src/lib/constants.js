const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("NEXT_PUBLIC_API_BASE_URL is missing in your .env file!");
}

export const ENDPOINTS = {
  // --- AUTHENTICATION ---
  AUTH: {
    LOGIN: `${API_BASE_URL}auth/login`,
    ME: `${API_BASE_URL}auth/me`,
    REFRESH: `${API_BASE_URL}auth/refresh`,
    LOGOUT: `${API_BASE_URL}auth/logout`,
    REGISTER: `${API_BASE_URL}auth/register-tenant`,
    VERIFY_OTP: `${API_BASE_URL}auth/verify-otp`,
    RESEND_OTP: `${API_BASE_URL}auth/resend-otp`,
    PASSWORD_CHANGE: `${API_BASE_URL}auth/password/change`,
    PASSWORD_RESET_REQUEST: `${API_BASE_URL}auth/password/reset-request`,
  },


 

  // --- DASHBOARD ---
  DASHBOARD: {
 DASHBOARD_SUMMARY: `${API_BASE_URL}dashboard/summary`,
 RECENT_SHEETS: `${API_BASE_URL}dashboard/recent-sheets`, 
 USER_ACTIVITY: (userId, days) => 
      `${API_BASE_URL}audit-logs/user/${userId}/activity?days=${days}`,

   
  }, 


  /// --- COSTING SHEETS ---
  COSTING_SHEETS: {
    CREATE: `${API_BASE_URL}costing-sheets`,
    LIST: `${API_BASE_URL}costing-sheets`,
    GET_BY_ID: (id) => `${API_BASE_URL}costing-sheets/${id}`,
    UPDATE: (id) => `${API_BASE_URL}costing-sheets/${id}`,
    DELETE: (id) => `${API_BASE_URL}costing-sheets/${id}`,
  
  },

  //CUSTOMER

  CUSTOMER: {
    LIST: `${API_BASE_URL}customers`,

   LIST_WITH_FILTER: "/customers",
  },


  //product

  PRODUCT: {
    LIST: `${API_BASE_URL}products`,
  },



// WORKFLOW
WORKFLOW: {
  BY_COSTING_SHEET: (id) => `${API_BASE_URL}costing-sheets/${id}/workflow`,
  LIST: `${API_BASE_URL}costing-sheets`,
},


}