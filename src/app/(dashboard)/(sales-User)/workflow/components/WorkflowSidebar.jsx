"use client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Hash, User } from "lucide-react";

export default function WorkflowSidebar({ sheets, selectedId, onSelect }) {
  return (
    <div className="w-1/3 space-y-2 overflow-y-auto pr-3 custom-scrollbar h-full py-2">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="font-bold text-lg tracking-tight text-slate-900">
          Costing Sheets
        </h2>
        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">
          {sheets.length} Total
        </span>
      </div>

      <div className="space-y-1.5"> {/* Gap minimized between cards */}
        {sheets.map((sheet) => {
          const isActive = selectedId === sheet.id;
          
          return (
            <Card 
              key={sheet.id}
              onClick={() => onSelect(sheet.id)}
              className={`relative cursor-pointer transition-all duration-150 border-l-2 px-3 py-2 hover:bg-slate-50 ${
                isActive 
                  ? "border-l-blue-600 border-blue-100 bg-blue-50/40 shadow-sm" 
                  : "border-l-transparent border-slate-100 bg-white"
              }`}
            >
              <div className="flex flex-col gap-0.5">
                {/* Top Row: Number and Status */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Hash size={10} />
                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? "text-blue-600" : ""}`}>
                      {sheet.sheet_number.split('-').slice(-1)}
                    </span>
                  </div>
                  <Badge 
                    className={`text-[9px] h-4 px-1.5 font-bold border-none shadow-none leading-none ${
                      sheet.status === 'APPROVED' 
                        ? "bg-green-100 text-green-700" 
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {sheet.status}
                  </Badge>
                </div>

                {/* Middle Row: Title (Compact) */}
                <h3 className={`font-bold text-[13px] truncate ${isActive ? "text-blue-900" : "text-slate-700"}`}>
                  {sheet.opportunity_name || "Untitled Opportunity"}
                </h3>
                
                {/* Bottom Row: Customer and Price (Same line for less height) */}
                <div className="flex justify-between items-center mt-0.5 pt-1 border-t border-slate-50">
                   <div className="flex items-center gap-1 text-slate-400 max-w-[60%]">
                    <User size={10} />
                    <p className="text-[11px] truncate">{sheet.customer_name}</p>
                  </div>
                  <span className="font-bold text-blue-600 text-[12px]">
                    {sheet.currency_code} {new Intl.NumberFormat().format(sheet.total_eup)}
                  </span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}