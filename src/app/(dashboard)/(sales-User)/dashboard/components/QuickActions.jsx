"use client";

import { Plus, FileSpreadsheet, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/* Fallback Actions */
const fallbackActions = [
  {
    id: 1,
    title: "New FEWA Sheet",
    desc: "Middle East costing",
    type: "fewa",
    icon: "plus",
    color: "red",
    route: "/dashboard/sheets/new?type=fewa",
  },
  {
    id: 2,
    title: "New MCC Sheet",
    desc: "Africa costing",
    type: "mcc",
    icon: "sheet",
    color: "green",
    route: "/dashboard/sheets/new?type=mcc",
  },
  {
    id: 3,
    title: "Import Excel",
    desc: "Upload existing sheet",
    type: "import",
    icon: "upload",
    color: "blue",
    route: "/dashboard/import",
  },
];

export default function QuickActions({ actions, role }) {
  const router = useRouter();
  const data = actions?.length ? actions : fallbackActions;

  /* Icon Mapper with Shadcn compatible styling */
  const getIcon = (name, color) => {
    const styles = {
      red: "text-red-500",
      green: "text-green-500",
      blue: "text-blue-500",
    };
    const className = styles[color] || "text-gray-500";

    switch (name) {
      case "plus": return <Plus className={className} size={20} />;
      case "sheet": return <FileSpreadsheet className={className} size={20} />;
      case "upload": return <Upload className={className} size={20} />;
      default: return <Plus className={className} size={20} />;
    }
  };

  /* Role Filter */
  const filtered = role
    ? data.filter((a) => !a.roles || a.roles.includes(role))
    : data;

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
        <span className="text-red-500">⚡</span> Quick Actions
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((action) => (
          <motion.div
            key={action.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <ActionCard 
              action={action} 
              getIcon={getIcon} 
              onClick={() => router.push(action.route)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Sub Component using Shadcn UI Card */
/* ---------------------------------- */

function ActionCard({ action, getIcon, onClick }) {
  const colors = {
    red: "border-red-100 bg-red-50/50 hover:border-red-200",
    green: "border-green-100 bg-green-50/50 hover:border-green-200",
    blue: "border-blue-100 bg-blue-50/50 hover:border-blue-200",
  };

  const style = colors[action.color] || "border-gray-100 bg-gray-50/50";

  return (
    <Card
      onClick={onClick}
      className={`group border-2 border-dashed ${style} p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-white hover:shadow-md`}
    >
      <div className="p-3 rounded-xl bg-white shadow-sm group-hover:shadow-inner transition-all">
        {getIcon(action.icon, action.color)}
      </div>

      <div className="space-y-0.5">
        <h4 className="font-bold text-gray-800 text-sm tracking-tight">
          {action.title}
        </h4>
        <p className="text-[11px] text-muted-foreground leading-none">
          {action.desc}
        </p>
      </div>
    </Card>
  );
}