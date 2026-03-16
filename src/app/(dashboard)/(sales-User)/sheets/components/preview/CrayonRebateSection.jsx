"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   primary:  summary.merged.crayon_rebate  = { y1, y2, y3, "3y" }
//   fallback: summary.costing.rebate_amount = { y1, y2, y3, "3y" }

export function CrayonRebateSection({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur    = sheet.currency_code || "AED";
  const rebate = sheet.summary?.merged?.crayon_rebate ||
                 sheet.summary?.costing?.rebate_amount ||
                 {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="crayon-rebate" className="w-full">
        <AccordionItem value="crayon-rebate" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Crayon Rebate
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.crayon_rebate.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(rebate.y1)}</span>
              </div>

              {/* summary.merged.crayon_rebate.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(rebate.y2)}</span>
              </div>

              {/* summary.merged.crayon_rebate.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(rebate.y3)}</span>
              </div>

              {/* summary.merged.crayon_rebate["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#FEFCE8] border-y border-[#FEF08A]">
                <span className="text-[12px] text-yellow-800 font-bold">Total Rebate Over 3 Years</span>
                <span className="text-[12px] font-mono text-yellow-800 font-black">{cur} {fmt(rebate["3y"])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}