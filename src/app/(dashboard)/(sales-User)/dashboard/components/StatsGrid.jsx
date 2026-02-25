"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatsGrid({ stats }) {
 // ✅ Draft count nikaal rahe hain array se
  const draftCount =
    stats?.breakdown?.find((item) => item.status === "DRAFT")?.count || 0;
    console.log("👉 FULL stats:", stats);
  console.log("👉 status_breakdown:", stats?.status_breakdown);
  console.log("👉 DRAFT value:", stats?.status_breakdown?.DRAFT);
  const items = [
    { 
      title: "Total Sheets", 
      value: stats.totalSheets ?? 0, 
      subtitle: "All time", 
      change: "+12%", 
      isUp: true, 
      icon: <FileText size={20} className="text-primary-foreground" />, 
      color: "bg-primary" // Scarlet Red (#FF370F)
    },
  {
      title: "Drafts",
      value: draftCount, // ✅ FIXED
      subtitle: "Awaiting review",
      change: "-3%",
      isUp: false,
      icon: <Clock size={20} className="text-white" />,
      color: "bg-amber-500",
    },
    { 
      title: "Approval Rate", 
      value: `${stats.approvalRate ?? 0}%`, 
      subtitle: "This month", 
      change: "+5.2%", 
      isUp: true, 
      icon: <CheckCircle size={20} className="text-white" />, 
      color: "bg-emerald-500" // Success color
    },
    { 
      title: "Total Value", 
      value: stats.totalValue ? `${stats.totalValue}` : "—", 
      subtitle: "Active deals", 
      change: "+18.7%", 
      isUp: true, 
      icon: <DollarSign size={20} className="text-secondary-foreground" />, 
      color: "bg-secondary" // Deep Blue (#27455C)
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className=" shadow-lg overflow-hidden hover:shadow-md transition-all duration-300 bg-card group">
          <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{item.title}</p>
              <CardTitle className="text-3xl font-black mt-1 tracking-tight text-foreground">
                {item.value}
              </CardTitle>
            </div>
            {/* Icon box ab theme variables use kar raha hai */}
            <div className={cn(
              item.color,
              "p-2.5 rounded-2xl shadow-lg ring-4 ring-background transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            )}>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground mb-3 font-medium">{item.subtitle}</p>
            <div className={cn(
              "flex items-center text-xs font-black px-2 py-1 rounded-lg w-fit",
              item.isUp ? "text-emerald-600 bg-emerald-50" : "text-primary bg-primary/10"
            )}>
              {item.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {item.change} 
              <span className="text-muted-foreground/60 font-medium ml-1 text-[9px] uppercase tracking-tighter">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}