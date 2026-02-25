'use client';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useDashboard } from "@/app/(dashboard)/(sales-User)/dashboard/hook/useDashboard";

import { Toaster } from "@/components/ui/sonner";

export default function DashboardLayout({ children }) {
  const { data, loading } = useDashboard();

  return (
    // Ensure w-full here
    <div className="flex flex-col min-h-screen w-full ">
      
      {/* 1. TOP NAVBAR - Bahar hai isliye full width hona chahiye */}
      <header className="w-full border-b bg-white dark:bg-[#1a364d] sticky top-0 z-50 shadow-sm">
        <Navbar user={data.user} isLoading={loading} />
      </header>

      {/* 2. MAIN BODY */}
      <SidebarProvider>
        {/* w-full aur flex-1 zaroori hai */}
        <div className="flex flex-1 w-full overflow-hidden bg-slate-50 dark:bg-slate-950">
          
          <aside className="relative">
            <div className="absolute -right-4 top-5 z-20 md:hidden">
                <SidebarTrigger />
            </div>
            <AppSidebar />
          </aside>
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
          
        </div>
      </SidebarProvider>
      <Toaster richColors position="top-right" closeButton />
    </div>
  );
}