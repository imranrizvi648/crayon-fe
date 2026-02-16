'use client';
import { useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ALL_MENU_ITEMS } from '@/lib/menu-config';
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarMenu, 
  SidebarMenuItem, SidebarMenuButton 
} from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  
  // 1. Redux se user data
  const { user } = useSelector((state) => state.auth);

  // 2. Roles logic
  const userRole = (user?.roles && user.roles.length > 0) 
    ? user.roles[0].toLowerCase() 
    : 'sales';

  const filteredMenu = ALL_MENU_ITEMS.filter(item => {
    return item.roles.map(r => r.toLowerCase()).includes(userRole);
  });

  return (
    <Sidebar className="!bg-[#1A364D] !text-white border-none">
      <SidebarContent className="p-4 pt-10 !bg-[#1A364D]">
        <div className="mb-8 px-4">
          <p className="text-[10px] font-bold text-blue-300/60 uppercase tracking-[0.2em]">
            {userRole} Portal
          </p>
        </div>

        <SidebarMenu className="gap-2">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  // Yahan active state styling image k hisab se fix ki hai
                  className={`h-12 px-4 transition-all !bg-transparent rounded-r-lg rounded-l-[4px] ${
                    isActive 
                      ? "bg-white/10 !text-white border-l-[6px] border-[#dc1e25] shadow-sm" 
                      : "!text-blue-100/70 hover:!text-white hover:bg-white/5"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? "text-white" : "text-blue-100/50"} />
                    <span className="text-[15px] font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10 !bg-[#1A364D]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="h-12 px-4 hover:bg-white/5 transition-all rounded-lg group !text-blue-100/70 hover:!text-white"
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut size={20} className="text-blue-100/50 group-hover:text-[#dc1e25] transition-colors" />
                <span className="text-[15px] font-medium">Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}