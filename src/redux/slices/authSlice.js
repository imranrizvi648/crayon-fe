import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import api from "@/lib/axios"; 
import { ENDPOINTS } from '@/lib/constants';

// --- LOGOUT THUNK ---
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        // Backend notification
        await api.post(ENDPOINTS.AUTH.LOGOUT, { token: refreshToken });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // Cleanup
      localStorage.clear();
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // ✅ Use the logout action
      dispatch(logout());

      window.location.href = '/login';
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: null, 
    isAuthenticated: false, 
    loading: false 
  },
  reducers: {
    setUserFromToken: (state, action) => {
      const token = action.payload;
      if (token) {
        try {
          const decoded = jwtDecode(token); 
          state.token = token;
          state.user = decoded; 
          state.isAuthenticated = true;
        } catch (error) {
          state.isAuthenticated = false;
        }
      }
    },
    // ✅ Naam wapis 'logout' rakh diya taaki useAuth crash na ho
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

// ✅ Exporting 'logout' properly
export const { setUserFromToken, logout } = authSlice.actions;
export default authSlice.reducer;