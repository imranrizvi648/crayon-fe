import { 
  LayoutDashboard, FileText, Users, Package, GitBranch, 
  TrendingUp, ShieldCheck, Settings, CreditCard, LifeBuoy 
} from "lucide-react";

export const ALL_MENU_ITEMS = [
    
  // Sales specific (Jo aapne dikhaya)
  { title: "Dasboard", url: "/dashboard", icon: FileText, roles: ["SALES_USER" ] },
  { title: "My Sheets", url: "/sheets", icon: FileText, roles: ["SALES_USER" ] },
  { title: "Customers", url: "/customers", icon: Users, roles: ["SALES_USER" ] },
  { title: "Products", url: "/products", icon: Package, roles: ["SALES_USER"] },
  { title: "Workflow", url: "/workflow", icon: GitBranch, roles: ["SALES_USER"]  },


  // Admin & Super Admin specific
  { title: "User Management", url: "/users", icon: Users, roles: ["ADMIN"] },
  { title: "Security", url: "/security", icon: ShieldCheck, roles: ["ADMIN"] },
  { title: "System Settings", url: "/settings", icon: Settings, roles: ["ADMIN"] },
  { title: "Financials", url: "/billing", icon: CreditCard, roles: ["ADMIN"] },
  { title: "Help Desk", url: "/support", icon: LifeBuoy, roles: ["ADMIN"] },


  // Admin & Super Admin specific
  { title: "User Management", url: "/users", icon: Users, roles: ["FINANCE_ANALYST"] },
  { title: "Security", url: "/security", icon: ShieldCheck, roles: ["FINANCE_ANALYST"] },
  { title: "System Settings", url: "/settings", icon: Settings, roles: ["FINANCE_ANALYST"] },
  { title: "Financials", url: "/billing", icon: CreditCard, roles: ["FINANCE_ANALYST"] },
  { title: "Help Desk", url: "/support", icon: LifeBuoy, roles: ["FINANCE_ANALYST"] },

];