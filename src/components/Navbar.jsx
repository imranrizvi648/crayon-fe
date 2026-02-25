"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { User, LogOut, Mail, Globe, Settings, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ user, isLoading }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = user?.name 
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) 
    : "UN";

  if (!mounted) {
    return (
      <nav className="flex w-full items-center justify-between px-8 py-4 bg-background border-b border-border min-h-[73px]">
         <div className="flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 bg-muted rounded-lg" />
            <div className="h-4 w-24 bg-muted rounded" />
         </div>
      </nav>
    );
  }

  return (
    <nav className="flex w-full items-center justify-between px-8 pr-10 py-3 bg-card border-b border-border shadow-sm sticky top-0 z-[100]">
      
      {/* Left Section - Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden relative group transition-transform hover:scale-105">
          <Image 
            src="/logo.png" 
            alt="Crayon Logo" 
            fill
            className="object-contain"
            priority 
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-secondary font-black text-xl tracking-tighter leading-none uppercase">
            Crayon <span className="text-primary">Costing</span>
          </h1>
          <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mt-0.5">
            Enterprise Solutions
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-5">
          
          <div className="h-8 w-[1px] bg-border hidden sm:block"></div>

          {/* User Profile with Dropdown */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-secondary leading-none  tracking-tight">
                {isLoading ? "Loading..." : (user?.name || "User")}
              </p>
              <p className="text-[9px] text-secondary font-black  mt-1 tracking-wider">
                {isLoading ? "Please wait" : (user?.role || "Member")}
              </p>
            </div>

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-black text-xs shadow-lg  uppercase cursor-pointer  transition-all outline-none active:scale-95 group"
                >
                  <span className="group-hover:scale-110 transition-transform">{initials}</span>
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-64 mt-2 z-[100] border-border bg-card shadow-2xl rounded-2xl" align="end">
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black text-secondary uppercase tracking-tight">
                      {user?.name || "Profile"}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground truncate">
                      {user?.email || "No email available"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-border" />
                
                <DropdownMenuGroup className="p-2">
                   <div className="px-2 py-2 flex flex-col gap-2 bg-muted/30 rounded-xl mb-2">
                      <div className="flex items-center text-[11px] text-secondary font-bold gap-2">
                        <Globe size={14} className="text-primary" />
                        <span>Region: <span className="text-foreground">{user?.region || "UAE"}</span></span>
                      </div>
                      <div className="flex items-center text-[11px] text-secondary font-bold gap-2">
                        <Mail size={14} className="text-primary" />
                        <span className="truncate">{user?.email || "N/A"}</span>
                      </div>
                   </div>
                </DropdownMenuGroup>
                
                <DropdownMenuSeparator className="bg-border" />
                
                <DropdownMenuGroup className="p-2">
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/5 focus:text-primary transition-colors py-2.5">
                    <User className="mr-3 h-4 w-4" />
                    <span className="font-bold text-xs uppercase tracking-tight">My Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-primary/5 focus:text-primary transition-colors py-2.5 text-red-500 focus:text-red-500">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-black text-xs uppercase tracking-tight">Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;