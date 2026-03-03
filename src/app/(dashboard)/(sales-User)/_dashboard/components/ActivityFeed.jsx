"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Plus, RefreshCw, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export default function ActivityFeed({ activities }) {
  const getIcon = (action) => {
    switch (action) {
      case 'approve': 
        // Success color (Green) usually theme se bahar hota hai for clarity
        return { icon: <Check size={14} />, bg: 'bg-emerald-500/10 text-emerald-600' };
      case 'create': 
        // Primary color (Scarlet Red) for creation actions
        return { icon: <Plus size={14} />, bg: 'bg-primary/10 text-primary' };
      case 'status_change': 
        // Secondary color (Deep Blue) for generic changes
        return { icon: <RefreshCw size={14} />, bg: 'bg-secondary/10 text-secondary' };
      default: 
        return { icon: <Bell size={14} />, bg: 'bg-muted text-muted-foreground' };
    }
  };

  return (
    <Card className="h-full  shadow-md overflow-hidden flex flex-col min-h-[500px] bg-card">
      <CardHeader className="border-b py-4 px-6 flex-shrink-0 bg-background">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
          {/* Dashboard primary red icon */}
          <RefreshCw className="text-primary animate-spin-slow" size={20} /> 
          <span className="tracking-tight">Recent Activity</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 relative flex-1 overflow-y-auto custom-scrollbar bg-background">
        {/* Adjusted Vertical Line - Global border color use kiya */}
        <div className="absolute left-[39px] top-8 bottom-8 w-[1px] bg-border z-0" />
        
        <div className="space-y-6">
          {activities && activities.length > 0 ? (
            activities.map((item, i) => {
              const { icon, bg } = getIcon(item.type);
              return (
                <div key={i} className="flex items-start gap-4 relative z-10 group">
                  {/* Icon Circle */}
                  <div className={cn(
                    bg, 
                    "h-8 w-8 min-w-[32px] rounded-full flex items-center justify-center ring-4 ring-background shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                  )}>
                    {icon}
                  </div>

                  <div className="pt-0.5">
                    {/* Activity Text - Global foreground color */}
                    <p className="text-[12px] font-bold text-foreground/90 leading-snug group-hover:text-primary transition-colors duration-200">
                      {item.text}
                    </p>
                    {/* Timestamp - Global muted color */}
                    <p className="text-[10px] text-muted-foreground mt-1 font-bold tracking-tight opacity-70">
                      {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-muted-foreground/40">
               <Bell className="mb-2" size={40} />
               <p className="text-xs italic font-medium uppercase tracking-widest">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}