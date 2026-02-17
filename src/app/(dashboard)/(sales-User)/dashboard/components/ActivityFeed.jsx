"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, Plus, RefreshCw, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ActivityFeed({ activities }) {
  const getIcon = (action) => {
    switch (action) {
      case 'approve': 
        return { icon: <Check size={16} />, bg: 'bg-green-100 text-green-600' };
      case 'create': 
        return { icon: <Plus size={16} />, bg: 'bg-blue-100 text-blue-600' };
      case 'status_change': 
        return { icon: <RefreshCw size={16} />, bg: 'bg-purple-100 text-purple-600' };
      default: 
        return { icon: <Bell size={16} />, bg: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden h-fit">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="text-orange-500 text-xl">🔄</span> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        {/* Adjusted Vertical Line for perfect alignment */}
        <div className="absolute left-[39px] top-10 bottom-10 w-[1px] bg-gray-100 z-0" />
        
        <div className="space-y-6">
          {activities && activities.length > 0 ? (
            activities.slice(0, 5).map((item, i) => {
              const { icon, bg } = getIcon(item.type);
              return (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  {/* Fixed Circle Size and Centering */}
                  <div className={`${bg} h-8 w-8 min-w-[32px] rounded-full flex items-center justify-center ring-4 ring-white shadow-sm`}>
                    {icon}
                  </div>
                  <div className="pt-1">
                    <p className="text-[13px] font-semibold text-gray-800 leading-snug">
                      {item.text}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 font-medium">
                      {formatDistanceToNow(new Date(item.time), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-400 py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}