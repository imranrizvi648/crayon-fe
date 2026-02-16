"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function StatsGrid({ stats }) {
  // Debugging: Check if hook transformation is correct
  console.log("📊 StatsGrid received stats object:", stats);

  const items = [
    { 
      title: "Total Sheets", 
      value: stats.totalSheets ?? 0, 
      subtitle: "All time", 
      change: "+12%", 
      isUp: true, 
      icon: <FileText className="text-white" />, 
      color: "bg-red-500" 
    },
    { 
      title: "Pending Approval", 
      value: stats.pending ?? 0, 
      subtitle: "Awaiting review", 
      change: "-3%", 
      isUp: false, 
      icon: <Clock className="text-white" />, 
      color: "bg-orange-500" 
    },
    { 
      title: "Approval Rate", 
      value: `${stats.approvalRate ?? 0}%`, 
      subtitle: "This month", 
      change: "+5.2%", 
      isUp: true, 
      icon: <CheckCircle className="text-white" />, 
      color: "bg-green-500" 
    },
    { 
      title: "Total Value", 
      value: stats.totalValue ? `$${stats.totalValue}` : "—", 
      subtitle: "Active deals", 
      change: "+18.7%", 
      isUp: true, 
      icon: <DollarSign className="text-white" />, 
      color: "bg-[#1e2d3d]" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <Card key={idx} className="border-none shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{item.title}</p>
              <CardTitle className="text-3xl font-bold mt-1 tracking-tight">
                {item.value}
              </CardTitle>
            </div>
            <div className={`${item.color} p-2.5 rounded-xl shadow-lg ring-4 ring-white/50`}>
              {item.icon}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] text-muted-foreground mb-3">{item.subtitle}</p>
            <div className={`flex items-center text-xs font-bold ${item.isUp ? "text-green-500" : "text-red-500"}`}>
              {item.isUp ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {item.change} <span className="text-gray-400 font-normal ml-1 text-[10px]">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}