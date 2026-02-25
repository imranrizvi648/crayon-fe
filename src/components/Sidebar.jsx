'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ALL_MENU_ITEMS } from '@/lib/menu-config';
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton
} from "@/components/ui/sidebar";
import { LogOut, Loader2 } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { logoutUser } from '@/redux/slices/authSlice';

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  const [userRole, setUserRole] = useState('sales_user');

  useEffect(() => {
    if (user?.role) {
      setUserRole(user.role.toLowerCase());
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser()); 
  };

  const filteredMenu = ALL_MENU_ITEMS.filter(item => 
    item.roles.map(r => r.toLowerCase()).includes(userRole)
  );

  return (
    <Sidebar className="border-none h-full bg-[#ffffff]">
      <SidebarContent className="bg-sidebar p-4 pt-27">
        <div className="mb-8 px-4">
          {loading ? (
            <Loader2 className="animate-spin text-white/30" size={16} />
          ) : (
            <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
              {userRole.replace('_', ' ')} Portal
            </p>
          )}
        </div>

        <SidebarMenu className="gap-2">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  className={cn(
                    "h-12 px-4 transition-all !bg-transparent rounded-r-lg border-l-[6px]",
                    isActive 
                      ? "bg-white/10 text-white border-l-[#dc1e25] shadow-sm" 
                      : "text-white/70 hover:text-white hover:bg-white/5 border-transparent"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? "text-white" : "opacity-40"} />
                    <span className="text-[15px] font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleLogout} 
              className="h-12 px-4 hover:bg-white/5 transition-all rounded-lg group text-white/70 hover:text-white"
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut size={20} className="opacity-40 group-hover:text-[#dc1e25] transition-colors" />
                <span className="text-[15px] font-medium">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}