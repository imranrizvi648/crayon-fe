"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   summary.merged.gross_profit_with_rebates.gp_plus_rebate = { y1, y2, y3, "3y" }
//   summary.merged.gross_profit_with_rebates.overall_markup  (0-1 decimal)

export function GPWithRebates({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur    = sheet.currency_code || "AED";
  const gpReb  = sheet.summary?.merged?.gross_profit_with_rebates?.gp_plus_rebate || {};
  const markup = sheet.summary?.merged?.gross_profit_with_rebates?.overall_markup ?? 0;

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = (val) => `${(Number(val || 0) * 100).toFixed(2)}%`;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="gp-rebate" className="w-full">
        <AccordionItem value="gp-rebate" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Gross Profit with Rebates
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.gross_profit_with_rebates.gp_plus_rebate.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(gpReb.y1)}</span>
              </div>

              {/* summary.merged.gross_profit_with_rebates.gp_plus_rebate.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(gpReb.y2)}</span>
              </div>

              {/* summary.merged.gross_profit_with_rebates.gp_plus_rebate.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(gpReb.y3)}</span>
              </div>

              {/* summary.merged.gross_profit_with_rebates.gp_plus_rebate["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DCFCE7] border-y border-[#BBF7D0]">
                <span className="text-[12px] text-green-800 font-bold">Total GP + Rebate Over 3 Years</span>
                <span className="text-[12px] font-mono text-green-800 font-black">{cur} {fmt(gpReb["3y"])}</span>
              </div>

              {/* summary.merged.gross_profit_with_rebates.overall_markup */}
              <div className="flex justify-between items-center px-6 py-2 bg-white">
                <span className="text-[12px] text-slate-900 font-bold">Overall Markup</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">{pct(markup)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}