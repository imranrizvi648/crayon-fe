'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/redux/slices/authSlice';
import Cookies from 'js-cookie';



export default function AuthWrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. LocalStorage se token uthayein
    const token = localStorage.getItem('access_token');

    if (token) {
      // 2. Redux state ko update karein (Decode logic slice mein hai)
      dispatch(setUserFromToken(token));

      // 3. Security ke liye check karein ke cookie bhi set hai (middleware ke liye)
      if (!Cookies.get('access_token')) {
        Cookies.set('access_token', token, { expires: 7 }); // 7 din ke liye set karein
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}