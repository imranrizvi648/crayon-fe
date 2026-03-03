"use client";

import { Card } from "@/components/ui/card";
import { 
  CheckCircle2, 
  BarChart3, 
  Megaphone, 
  CalendarDays, 
  Zap 
} from "lucide-react";
import { cn } from "@/lib/utils";

const ActionItem = ({ icon: Icon, title, subtitle, borderColor, iconBg, iconColor }) => (
  <div className={cn(
    "flex items-center p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer hover:bg-accent/50 group",
    borderColor
  )}>
    <div className={cn("p-3 rounded-xl mr-4 transition-transform group-hover:scale-110", iconBg)}>
      <Icon size={22} className={iconColor} />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-sm text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </div>
  </div>
);

export default function ManagerQuickActions({ pendingCount = 12 }) {
  const actions = [
    {
      title: "Approve Sheets",
      subtitle: `${pendingCount} pending`,
      icon: CheckCircle2,
      borderColor: "border-orange-200",
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Team Report",
      subtitle: "View analytics",
      icon: BarChart3,
      borderColor: "border-blue-200",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Announcement",
      subtitle: "Send to team",
      icon: Megaphone,
      borderColor: "border-purple-200",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Schedule Meeting",
      subtitle: "With team",
      icon: CalendarDays,
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <Card className="p-6 shadow border-gray-200 bg-card">
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-orange-500 fill-orange-500" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">
          Manager Quick Actions
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <ActionItem key={index} {...action} />
        ))}
      </div>
    </Card>
  );
}