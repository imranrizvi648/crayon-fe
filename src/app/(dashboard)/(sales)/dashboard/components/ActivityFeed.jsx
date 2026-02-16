"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Check, UserPlus, Send, Bell } from "lucide-react";

export default function ActivityFeed({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'approval': return { icon: <Check size={14} />, bg: 'bg-green-100 text-green-600' };
      case 'customer': return { icon: <UserPlus size={14} />, bg: 'bg-blue-100 text-blue-600' };
      case 'submission': return { icon: <Send size={14} />, bg: 'bg-purple-100 text-purple-600' };
      default: return { icon: <Bell size={14} />, bg: 'bg-gray-100 text-gray-600' };
    }
  };

  return (
    <Card className="border-none shadow-sm overflow-hidden h-fit">
      <CardHeader className="border-b py-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="text-orange-500">🔄</span> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="absolute left-[33px] top-8 bottom-8 w-[1px] bg-gray-100" />
        <div className="space-y-8">
          {activities?.map((item, i) => {
            const { icon, bg } = getIcon(item.type);
            return (
              <div key={i} className="flex gap-4 relative z-10">
                <div className={`${bg} p-2 rounded-full ring-4 ring-white`}>
                  {icon}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-gray-800 leading-tight">{item.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase font-semibold">{item.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}