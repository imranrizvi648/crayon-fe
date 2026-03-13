import { 
  LayoutDashboard, FileText, Users, Package, GitBranch, 
  TrendingUp, ShieldCheck, Settings, CreditCard, LifeBuoy, 
} from "lucide-react";

export const ALL_MENU_ITEMS = [
    
  // Sales specific (Jo aapne dikhaya)
  { title: "Dasboard", url: "/dashboard", icon: LayoutDashboard, roles: ["SALES_USER" ] },
  { title: "My Sheets", url: "/sheets", icon: FileText, roles: ["SALES_USER" ] },
  { title: "Customers", url: "/customers", icon: Users, roles: ["SALES_USER" ] },
  { title: "Products", url: "/products", icon: Package, roles: ["SALES_USER"] },
  { title: "Workflow", url: "/workflow", icon: GitBranch, roles: ["SALES_USER"]  },

  // Sales specific (Jo aapne dikhaya)
  { title: "Manager Dashboard", url: "/dashboard", icon: FileText, roles: ["SALES_MANAGER" ] },
  { title: "Team Sheets", url: "/team-sheets", icon: FileText, roles: ["SALES_MANAGER" ] },
  { title: "Team Members", url: "/team-members", icon: Users, roles: ["SALES_MANAGER" ] },
  { title: "Approvals", url: "/approvals", icon: Package, roles: ["SALES_MANAGER"] },
  { title: "Reports", url: "/reports", icon: TrendingUp, roles: ["SALES_MANAGER"]  },

  // Admin & Super Admin specific
  { title: "User Management", url: "/users", icon: Users, roles: ["ADMIN"] },
  { title: "Security", url: "/security", icon: ShieldCheck, roles: ["ADMIN"] },
  { title: "System Settings", url: "/settings", icon: Settings, roles: ["ADMIN"] },
  { title: "Financials", url: "/billing", icon: CreditCard, roles: ["ADMIN"] },
  { title: "Help Desk", url: "/support", icon: LifeBuoy, roles: ["ADMIN"] },


  // Admin & Super Admin specific
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, roles: ["FINANCE_ANALYST"] },
  { title: "Approve Que", url: "/approve-queue", icon: ShieldCheck, roles: ["FINANCE_ANALYST"] },
  { title: "Exchange Rate", url: "/exchange-rate", icon: Settings, roles: ["FINANCE_ANALYST"] },
  { title: "Audit Trail", url: "/audits", icon: LifeBuoy, roles: ["FINANCE_ANALYST"] },

];