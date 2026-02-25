import axios from 'axios';
import { ENDPOINTS } from './constants';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      // Login/Register ke ilawa baki requests mein token lagao
      // FIXED: config.url && check lagaya hai taake runtime error na aaye
      if (token && config.url && !config.url.includes('/auth/login')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      
      // SAFETY CHECK: Pehle confirm karein ke url majood hai aur string hai
      const urlPath = config.url ? String(config.url) : ""; 
      const isAuthRequest = urlPath.includes('/auth/login') || urlPath.includes('/auth/refresh');

      if (token && urlPath && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;