import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Ab "state.auth" har jagah accessible hoga
  },
  // DevTools enable rakhein taake debugging asaan ho
  devTools: process.env.NODE_ENV !== 'production',
});