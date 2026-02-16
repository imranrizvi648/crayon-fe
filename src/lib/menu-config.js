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
  { title: "Performance", url: "/performance", icon: TrendingUp, roles: ["SALES_USER"] },

  // Admin & Super Admin specific
  { title: "User Management", url: "/users", icon: Users, roles: ["admin"] },
  { title: "Security", url: "/security", icon: ShieldCheck, roles: ["admin"] },
  { title: "System Settings", url: "/settings", icon: Settings, roles: ["admin"] },

  // Billing specific
  { title: "Financials", url: "/billing", icon: CreditCard, roles: ["admin"] },

  // Support specific
  { title: "Help Desk", url: "/support", icon: LifeBuoy, roles: ["admin"] },
];