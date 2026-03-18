"use client";

import { useCustomers } from "./_hooks/useCustomers";
import { CustomerTable } from "./_components/CustomerTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, DollarSign, FileText, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const { customers, loading, pagination, fetchCustomers } = useCustomers();
 
  return (
    <div className="px-5 space-y-8  min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black  text-gray-700 ">
        
            Customer Portfolio 
          </h1>
          <p className="text-muted-foreground text-sm font-medium mt-1">
            Track and optimize your strategic client relationships
          </p>
        </div>
        
        {/* <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20 px-8 py-5 rounded-sm font-bold  tracking-wider transition-all hover:scale-105 active:scale-95 gap-2">
          <UserPlus size={20} /> Add Customer
        </Button> */}
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Customers" 
          value={pagination.total} 
          label="Managed accounts" 
          icon={<Users size={20} />} 
          variant="primary" 
        />
        <StatCard 
          title="Portfolio Value" 
          value="AED 5.8M" 
          label="Projected revenue" 
          icon={<DollarSign size={20} />} 
          variant="success" 
        />
        <StatCard 
          title="Active Sheets" 
          value="14" 
          label="Proposals in progress" 
          icon={<FileText size={20} />} 
          variant="secondary" 
        />
      </div>

      {/* Table Section */}
      <div className="">
        <CustomerTable 
          items={customers} 
          loading={loading} 
          pagination={pagination} 
          onPageChange={fetchCustomers} 
        />
      </div>
    </div>
  );
}

// Refined Stat Card Component
function StatCard({ title, value, label, icon, variant }) {
  const variants = {
    primary: "bg-primary shadow-primary/20 text-white",
    secondary: "bg-secondary shadow-secondary/20 text-white",
    success: "bg-green-500 shadow-green-500/20 text-white",
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm border border-border flex justify-between items-center group hover:border-primary/20 transition-all duration-300">
      <div className="space-y-1">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-extrabold text-foreground ">{value}</h3>
          <TrendingUp size={14} className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-[10px] text-secondary font-bold uppercase tracking-tighter opacity-70">
          {label}
        </p>
      </div>
      
      <div className={cn(
        "p-4 rounded-2xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3",
        variants[variant]
      )}>
        {icon}
      </div>
    </div>
  );
}