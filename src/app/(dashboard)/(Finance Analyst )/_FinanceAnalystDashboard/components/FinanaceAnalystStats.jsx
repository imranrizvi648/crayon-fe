"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileClock, AlertCircle, IndianRupee, BarChart3, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const LoadingPulse = () => (
  <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-md" />
);

export default function FinanceAnalystStats({ stats, isLoading }) {

  const items = [
    {
      title: "Pending Approvals",
      value: stats?.pending ?? 0,
      subtitle: "Awaiting Review",
      icon: <FileClock size={19} className="text-white" />,
      color: "bg-blue-600",
    },
    {
      title: "High Priority",
      value: stats?.highPriority ?? 0,
      subtitle: "Urgent Attention",
      icon: <AlertCircle size={19} className="text-white" />,
      color: "bg-red-500",
    },
    {
      title: "Pending Value",
      value: stats?.totalValue ?? 0,
      subtitle: "Pipeline Value",
      icon: <IndianRupee size={19} className="text-white" />,
      color: "bg-emerald-600",
    },
    {
      title: "Average GP",
      value: stats?.avgGP ?? 0,
      subtitle: "Per Opportunity",
      icon: <BarChart3 size={19} className="text-white" />,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-10 mt-14">
      {items.map((item, idx) => (
        <Card
          key={idx}
          className="shadow-md border-gray-200 hover:shadow-lg transition-all group min-h-[100px] p-4 rounded-xl"
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            
            <div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {item.title}
              </p>

              <CardTitle className="text-3xl font-black mt-2">
                {isLoading ? <LoadingPulse /> : item.value}
              </CardTitle>
            </div>

            <div
              className={cn(
                item.color,
                "p-3 rounded-2xl shadow-lg transition-transform group-hover:scale-110"
              )}
            >
              {item.icon}
            </div>

          </CardHeader>

          <CardContent className="pt-2">
            <div className="flex items-center text-[12px] font-medium text-muted-foreground">
              <TrendingUp size={14} className="mr-1 text-emerald-500" />
              {item.subtitle}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}