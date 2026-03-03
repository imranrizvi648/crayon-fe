"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, XCircle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Helper for loading placeholder
const LoadingPulse = () => <div className="h-8 w-16 bg-slate-200 animate-pulse rounded-md" />;

export default function SalesManagerStats({ stats, isLoading }) {
  
  const items = [
    { 
      title: "Team Members", 
      value: stats?.totalUsers, 
      subtitle: "Active Users", 
      change: "+2", 
      isUp: true, 
      icon: <Users size={20} className="text-white" />, 
      color: "bg-[#1e3a8a]" 
    },
    { 
      title: "Team Sheets", 
      value: stats?.totalSheets, 
      subtitle: "All time", 
      change: "+15%", 
      isUp: true, 
      icon: <FileText size={20} className="text-white" />, 
      color: "bg-[#ef4444]" 
    },
    { 
      title: "Approved Sheets", 
      value: stats?.approved, 
      subtitle: "Requires your review", 
      change: "+5.2%", 
      isUp: true, 
      icon: <CheckCircle size={20} className="text-white" />, 
      color: "bg-[#10b981]" 
    },
    { 
      title: "Rejected Sheets", 
      value: stats?.rejected, 
      subtitle: "Need attention", 
      change: "-2%", 
      isUp: false, 
      icon: <XCircle size={20} className="text-white" />, 
      color: "bg-[#f97316]" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className="shadow overflow-hidden hover:shadow-md transition-all duration-300 bg-card group border-gray-200">
          <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{item.title}</p>
              <CardTitle className="text-3xl font-black mt-1 tracking-tight text-foreground">
                {/* Agar loading ho rahi hai toh pulse dikhayein, warna value */}
                {isLoading ? <LoadingPulse /> : (item.value ?? 0)}
              </CardTitle>
            </div>
            <div className={cn(
              item.color,
              "p-2.5 rounded-2xl shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            )}>
              {item.icon}
            </div>
          </CardHeader>
          
          <CardContent>
            <p className="text-[10px] text-muted-foreground mb-3 font-medium">{item.subtitle}</p>
            
            {/* Loading state for the trend badge */}
            {isLoading ? (
                <div className="h-5 w-24 bg-slate-100 animate-pulse rounded-lg" />
            ) : (
                <div className={cn(
                  "flex items-center text-xs font-black px-2 py-1 rounded-lg w-fit",
                  item.isUp ? "text-emerald-600 bg-emerald-50" : "text-orange-600 bg-orange-50"
                )}>
                  {item.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                  {item.change} 
                  <span className="text-muted-foreground/60 font-medium ml-1 text-[9px] uppercase tracking-tighter text-nowrap">vs last month</span>
                </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}