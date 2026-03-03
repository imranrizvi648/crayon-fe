"use client";

import { Card } from "@/components/ui/card";
import { History, PlusCircle, RefreshCcw, FileEdit, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; 
import { cn } from "@/lib/utils";

const ActionIcon = ({ action }) => {
  switch (action) {
    case "CREATE": return <PlusCircle size={14} className="text-blue-600" />;
    case "STATUS_CHANGE": return <RefreshCcw size={14} className="text-emerald-600" />;
    case "UPDATE": return <FileEdit size={14} className="text-amber-600" />;
    default: return <User size={14} className="text-slate-600" />;
  }
};

const IconBg = ({ action }) => {
  switch (action) {
    case "CREATE": return "bg-blue-50";
    case "STATUS_CHANGE": return "bg-emerald-50";
    case "UPDATE": return "bg-amber-50";
    default: return "bg-slate-50";
  }
};

// ... baaki imports same rahenge

export default function TeamActivity({ activities = [], isLoading }) {
  if (isLoading) return <div className="h-[500px] w-full bg-card animate-pulse rounded-2xl border border-border/50" />;

  return (
    <Card className="p-6 border-gray-200 shadow bg-card h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <History className="text-[#FF370F]" size={22} />
        <h2 className="text-xl font-bold tracking-tight">Team Activity</h2>
      </div>

      {/* FIXED: Added max-height to show ~5 items before scrolling */}
      <div className="relative flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[380px]">
        
        {/* Timeline vertical line */}
        <div className="absolute inset-0 ml-5 -translate-x-px h-full w-0.5 bg-gradient-to-b from-transparent via-slate-200 to-transparent pointer-events-none" />
        
        <div className="relative space-y-6">
            {activities?.map((item, index) => (
            <div key={index} className="relative flex items-start gap-4 group">
                {/* Timeline Icon */}
                <div className={cn(
                "z-10 flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-background shrink-0 transition-transform group-hover:scale-110",
                IconBg({ action: item.action })
                )}>
                <ActionIcon action={item.action} />
                </div>

                {/* Activity Text */}
                <div className="flex flex-col flex-1 pt-1">
                <p className="text-sm font-medium leading-snug">
                    <span className="font-bold text-foreground">{item.userName}</span>
                    <span className="text-muted-foreground"> 
                    {item.action === "CREATE" ? " submitted a new " : 
                    item.action === "STATUS_CHANGE" ? " updated status of " : " edited "}
                    </span>
                    <span className="font-semibold text-secondary block sm:inline">
                    {item.entity_type?.replace(/_/g, " ")} #{item.entity_id}
                    </span>
                </p>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mt-1">
                    {item.created_at ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true }) : "Just now"}
                </span>
                </div>
            </div>
            ))}
        </div>

        {(!activities || activities.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-10 opacity-50">
            <History size={40} className="mb-2 grayscale" />
            <p className="text-sm">No recent team activity found.</p>
          </div>
        )}
      </div>
    </Card>
  );
}