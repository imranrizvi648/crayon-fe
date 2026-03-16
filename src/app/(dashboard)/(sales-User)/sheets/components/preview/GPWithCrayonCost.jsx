"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   summary.merged.gross_profit_with_rebates_and_crayon_cost.net_gp = { y1, y2, y3, "3y" }
//   summary.merged.gross_profit_with_rebates_and_crayon_cost.overall_markup (0-1 decimal)

export function GPWithCrayonCost({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur    = sheet.currency_code || "AED";
  const netGp  = sheet.summary?.merged?.gross_profit_with_rebates_and_crayon_cost?.net_gp || {};
  const markup = sheet.summary?.merged?.gross_profit_with_rebates_and_crayon_cost?.overall_markup ?? 0;

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = (val) => `${(Number(val || 0) * 100).toFixed(2)}%`;

  // net_gp values can be negative — color accordingly
  const valColor = (val) =>
    Number(val || 0) < 0 ? "text-red-600" : "text-slate-900";

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="gp-crayon-cost" className="w-full">
        <AccordionItem value="gp-crayon-cost" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Gross Profit with Rebates + Crayon Cost
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.gross_profit_with_rebates_and_crayon_cost.net_gp.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Net GP Year 1</span>
                <span className={`text-[12px] font-mono font-bold ${valColor(netGp.y1)}`}>
                  {cur} {fmt(netGp.y1)}
                </span>
              </div>

              {/* summary.merged.gross_profit_with_rebates_and_crayon_cost.net_gp.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Net GP Year 2</span>
                <span className={`text-[12px] font-mono font-bold ${valColor(netGp.y2)}`}>
                  {cur} {fmt(netGp.y2)}
                </span>
              </div>

              {/* summary.merged.gross_profit_with_rebates_and_crayon_cost.net_gp.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Net GP Year 3</span>
                <span className={`text-[12px] font-mono font-bold ${valColor(netGp.y3)}`}>
                  {cur} {fmt(netGp.y3)}
                </span>
              </div>

              {/* summary.merged.gross_profit_with_rebates_and_crayon_cost.net_gp["3y"] */}
              <div className={`flex justify-between items-center px-6 py-2.5 border-y
                ${Number(netGp["3y"] || 0) < 0
                  ? "bg-[#FEF2F2] border-[#FECACA]"
                  : "bg-[#DCFCE7] border-[#BBF7D0]"}`}
              >
                <span className={`text-[12px] font-bold ${Number(netGp["3y"] || 0) < 0 ? "text-red-800" : "text-green-800"}`}>
                  Total Net GP Over 3 Years
                </span>
                <span className={`text-[12px] font-mono font-black ${Number(netGp["3y"] || 0) < 0 ? "text-red-800" : "text-green-800"}`}>
                  {cur} {fmt(netGp["3y"])}
                </span>
              </div>

              {/* summary.merged.gross_profit_with_rebates_and_crayon_cost.overall_markup */}
              <div className="flex justify-between items-center px-6 py-2 bg-white">
                <span className="text-[12px] text-slate-900 font-bold">Overall Markup %</span>
                <span className={`text-[12px] font-mono font-bold ${Number(markup || 0) < 0 ? "text-red-600" : "text-green-700"}`}>
                  {pct(markup)}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}