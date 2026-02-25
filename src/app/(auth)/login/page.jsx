'use client';
import Image from "next/image";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { useSelector } from 'react-redux'; 
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox"; 
import { EyeIcon, EyeOffIcon } from "lucide-react"; 
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const router = useRouter();
  
  const { token } = useSelector((state) => state.auth);

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
    // Background: Top secondary (Deep Blue), bottom background (Light/White)
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-secondary from-50% to-background to-50% font-sans p-4">
      
     


<div className="mb-5 group">
  <div className="    flex items-center space-x-1">
    {/* Next.js Image Component */}
    <Image
      src="/logo.png"          // apna logo path yahan lagao
      alt="CRAYON Logo"
      width={70}               // logo width
      height={70}              // logo height
      className="rounded-full" // optional: agar circular chahiye
    />

    {/* Brand Name */}
    <span className="text-primary-foreground text-4xl font-bold ">
      Crayon
    </span>
  </div>
</div>


      {/* Main Card */}
      <Card className="w-full max-w-[420px] border-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-card  overflow-hidden">
        <CardHeader className="space-y-1 pt-10 px-8 text-center">
          <CardTitle className="text-3xl font-bold text-muted-foreground ">Welcome Back</CardTitle>
          <p className="text-sm text-muted-foreground font-medium">Sign in to the Crayon Costing Platform</p>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 px-8 pb-10">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[12px] text-foreground/70 font-bold  tracking-wider">Email Address</Label>
              <Input 
                id="email"
                type="email" 
                placeholder="user@crayon.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 border-border bg-muted/30  focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" title="password" className="text-[12px] text-foreground/70 font-bold  tracking-wider">Password</Label>
              <div className="relative">
                <Input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 border-border bg-muted/30  focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                <label htmlFor="remember" className="text-xs text-muted-foreground font-semibold cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-xs font-bold text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline">
                Forgot Password?
              </button>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold py-2 px-3 rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            {/* Sign In Button - Secondary (Deep Blue) with Primary (Red) hover effect */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold  shadow-lg hover:shadow-primary/20 transition-all mt-4 text-sm  tracking-widest"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded animate-spin" />
                  Signing...
                </span>
              ) : 'Sign in'}
            </Button>
          </CardContent>
        </form>
      </Card>
      
      {/* Footer */}
      {/* <footer className="mt-12 text-muted-foreground/60 text-[10px] font-bold uppercase tracking-[0.2em] text-center">
        © 2026 Crayon <br/> 
        <span className="font-medium opacity-50"></span>
      </footer> */}
    </div>
  );
}