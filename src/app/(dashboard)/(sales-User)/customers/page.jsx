"use client";

import { useCustomers } from "./hooks/useCustomers";
import { CustomerTable } from "./components/CustomerTable";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, DollarSign, FileText } from "lucide-react";

export default function CustomersPage() {
  const { customers, loading, pagination, fetchCustomers } = useCustomers();

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3556]">Customers</h1>
          <p className="text-sm text-slate-500">Manage and track your customer portfolio</p>
        </div>
        <Button className="bg-[#dc1e25] hover:bg-[#b5191f] text-white gap-2 px-6 shadow-md">
          <UserPlus size={18} /> Add Customer
        </Button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Customers" value={pagination.total} label="Active accounts" icon={<Users className="text-white" />} color="bg-[#dc1e25]" />
        <StatCard title="Portfolio Value" value="$5.8M" label="All customers" icon={<DollarSign className="text-white" />} color="bg-green-500" />
        <StatCard title="Active Sheets" value="14" label="In progress" icon={<FileText className="text-white" />} color="bg-[#1a3556]" />
      </div>

      {/* Table Section */}
      <CustomerTable 
        items={customers} 
        loading={loading} 
        pagination={pagination} 
        onPageChange={fetchCustomers} 
      />
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, label, icon, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black text-[#1a3556] mt-1">{value}</h3>
        <p className="text-[10px] text-slate-400 mt-1 font-medium">{label}</p>
      </div>
      <div className={`${color} p-4 rounded-2xl shadow-lg`}>
        {icon}
      </div>
    </div>
  );
}