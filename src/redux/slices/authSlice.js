import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const authSlice = createSlice({
  name: 'auth',
  initialState: { 
    user: null, 
    token: null, // 1. Initial state mein token add karein
    isAuthenticated: false, 
    loading: false 
  },
  reducers: {
    setUserFromToken: (state, action) => {
      const token = action.payload;
      if (token) {
        try {
          const decoded = jwtDecode(token); 
          state.token = token; // 2. Token ko state mein save karein
          state.user = decoded; 
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Invalid Token", error);
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null; // 3. Logout pe token clear karein
      state.isAuthenticated = false;
      // Note: localStorage aur Cookies useAuth hook handle kar raha hai, 
      // yahan sirf state reset kafi hai.
    },
  },
});

export const { setUserFromToken, logout } = authSlice.actions;
export default authSlice.reducer;