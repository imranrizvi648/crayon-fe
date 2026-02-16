'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux'; 
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; 
import { EyeIcon } from "lucide-react"; // Password eye icon ke liye

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const router = useRouter();
  
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      router.replace('/'); 
    }
  }, [token, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    // Background Image ki tarah split gradient: Top dark blue, bottom light grey
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#3b5469] from-50% to-[#eef2f5] to-50% font-sans">
      
      {/* Logo Section - Image ke mutabiq Orange Badge */}
      <div className="mb-6">
        <div className="bg-[#FF4500] px-6 py-2 rounded-lg shadow-lg">
          <span className="text-white text-3xl font-black tracking-wider">CRAYON</span>
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-[420px] border-t-4 border-t-[#FF4500] border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-white rounded-none p-4 py-10">
        <CardHeader className="space-y-1 pt-6">
          <CardTitle className="text-2xl font-bold text-[#1a364d]">Welcome Back</CardTitle>
          <p className="text-sm text-slate-400">Sign in to the Crayon Costing Platform.</p>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[13px] text-slate-600 font-bold">Email address</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="user@crayon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-slate-300 rounded-sm focus-visible:ring-0 focus-visible:border-slate-500 italic placeholder:text-slate-300"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-[13px] text-slate-600 font-bold">Password</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-slate-300 rounded-sm focus-visible:ring-0 focus-visible:border-slate-500 italic placeholder:text-slate-300 pr-10"
                />
                <EyeIcon className="absolute right-3 top-3 h-5 w-5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded-none border-slate-300" />
                <label htmlFor="remember" className="text-xs text-slate-500 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-xs font-bold text-[#2d4a63] hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-xs text-center">{error}</div>
            )}

            {/* Sign In Button - Dark Blue */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 bg-[#2d4a63] hover:bg-[#1a364d] text-white font-bold rounded-sm shadow-md mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>

            {/* Divider */}
           

            
          </CardContent>
        </form>
      </Card>
      
      {/* Footer */}
      <footer className="mt-8 text-slate-400 text-[11px]">
        © 2026 Crayon Software Experts. All rights reserved.
      </footer>
    </div>
  );
}