"use client";

import { Card } from "@/components/ui/card";
import { FileText, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-component for individual Stat Card with Loading support
const StatCard = ({ title, value, icon: Icon, iconBg, iconColor, isLoading }) => (
  <Card className="p-4 flex items-center gap-4 border-none shadow-sm bg-card">
    <div className={cn("p-3 rounded-xl shrink-0", iconBg)}>
      <Icon size={20} className={iconColor} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
        {title}
      </p>
      {isLoading ? (
        // Loading Shimmer for the value
        <div className="h-7 w-20 bg-muted animate-pulse rounded-lg mt-1" />
      ) : (
        <h3 className="text-2xl font-black tracking-tight truncate">{value}</h3>
      )}
    </div>
  </Card>
);

export default function TeamSheetsStats({ summary, totalItems, isLoading }) {
  // Currency Formatter for Millions (M)
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(val || 0);
  };

  const stats = [
    {
      title: "Total Sheets",
      value: totalItems || 0,
      icon: FileText,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Approved",
      value: summary?.approved || 0,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Pending",
      value: summary?.pending || 0,
      icon: Clock,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Total Value",
      value: formatCurrency(summary?.total_revenue),
      icon: DollarSign,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <StatCard 
          key={idx} 
          {...stat} 
          isLoading={isLoading} 
        />
      ))}
    </div>
  );
}