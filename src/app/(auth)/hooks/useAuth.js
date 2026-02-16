'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/constants';
import { setUserFromToken, logout as logoutAction } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();

  const login = async (email, password) => {
    console.log("1. Login process started for:", email);
    setLoading(true);
    setError(null);
    try {
      console.log("2. Calling API:", ENDPOINTS.AUTH.LOGIN);
      const res = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
      
      console.log("3. API Response received:", res.status);
      const { access_token, refresh_token } = res.data;

      if (!access_token) {
        throw new Error("Access token missing in API response");
      }

      // Cookies & Storage
      Cookies.set('access_token', access_token, { expires: 1, path: '/' });
      localStorage.setItem('access_token', access_token);
      console.log("4. Cookies and LocalStorage updated");

      // Redux Update
      console.log("5. Dispatching setUserFromToken...");
      dispatch(setUserFromToken(access_token));
      
      console.log("6. Login function returning true");
      return true; 
    } catch (err) {
      console.error("!!! LOGIN ERROR !!!", err);
      const errorMsg = err.response?.data?.message || err.message || "Invalid credentials";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out...");
    dispatch(logoutAction());
    localStorage.clear();
    Cookies.remove('access_token', { path: '/' });
    router.replace('/login');
    setTimeout(() => window.location.reload(), 100);
  };

  return { login, logout, loading, error };
};