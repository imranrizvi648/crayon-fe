"use client";

import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const RankBadge = ({ rank }) => {
  const colors = [
    "bg-yellow-500", // Gold
    "bg-slate-400",  // Silver
    "bg-orange-500", // Bronze
    "bg-slate-600",  // 4th
    "bg-slate-800",  // 5th
  ];
  return (
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0",
      colors[rank] || "bg-slate-400"
    )}>
      {rank + 1}
    </div>
  );
};

export default function TopPerformers({ performance = [], isLoading }) {
  // Skeleton height matches TeamActivity for layout stability
  if (isLoading) return <div className="h-[500px] w-full bg-card animate-pulse rounded-2xl border border-border/50" />;

  const formatValue = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  return (
    <Card className="p-6 border-gray-200 shadow bg-card h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Trophy className="text-yellow-500" size={24} />
        <h2 className="text-xl font-bold tracking-tight">Top Performers</h2>
      </div>

      {/* Scrollable container with flex-1 to fill card height */}
      <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {performance?.map((user, index) => (
          <div 
            key={user.user_id || index} 
            className="flex items-center justify-between p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <RankBadge rank={index} />
              <div>
                <p className="font-bold text-sm group-hover:text-primary transition-colors">
                    {user.user_name || "Unknown"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.deal_count || 0} sheets • Avg: {formatValue(user.average_deal)}
                </p>
              </div>
            </div>
            
            <div className="text-right shrink-0">
              <p className="font-black text-lg tracking-tight">
                {formatValue(user.total_value)}
              </p>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase",
                index === 0 ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
              )}>
                {index === 0 ? "Outstanding" : "Excellent"}
              </span>
            </div>
          </div>
        ))}

        {(!performance || performance.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10 opacity-50">
             <Trophy size={40} className="mb-2 grayscale" />
             <p className="text-sm">No performance data available</p>
          </div>
        )}
      </div>
    </Card>
  );
}