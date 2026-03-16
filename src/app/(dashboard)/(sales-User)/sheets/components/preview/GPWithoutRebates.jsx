"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   summary.costing.gp               = { y1, y2, y3, "3y" }
//   summary.merged.gp_without_rebates_crayon_gp.crayon_gp = { y1, y2, y3, "3y" }
//   summary.merged.gp_without_rebates_crayon_gp.markup_crayon_gp  (0-1 decimal)
//   summary.costing.bottom_summary.overall_margin  (0-1 decimal)

export function GPWithoutRebates({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur    = sheet.currency_code || "AED";
  // summary.merged.gp_without_rebates_crayon_gp.crayon_gp = { y1, y2, y3, "3y" }
  const gp     = sheet.summary?.merged?.gp_without_rebates_crayon_gp?.crayon_gp || {};
  // summary.merged.gp_without_rebates_crayon_gp.markup_crayon_gp (0-1 decimal)
  const markup = sheet.summary?.merged?.gp_without_rebates_crayon_gp?.markup_crayon_gp ?? 0;

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = (val) => `${(Number(val || 0) * 100).toFixed(2)}%`;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="gp-no-rebate" className="w-full">
        <AccordionItem value="gp-no-rebate" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            GP without Rebates
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.gp_without_rebates_crayon_gp.crayon_gp.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-green-700 font-medium">Crayon GP Year 1</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">{cur} {fmt(gp.y1)}</span>
              </div>

              {/* summary.merged.gp_without_rebates_crayon_gp.crayon_gp.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-green-700 font-medium">Crayon GP Year 2</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">{cur} {fmt(gp.y2)}</span>
              </div>

              {/* summary.merged.gp_without_rebates_crayon_gp.crayon_gp.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-green-700 font-medium">Crayon GP Year 3</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">{cur} {fmt(gp.y3)}</span>
              </div>

              {/* summary.merged.gp_without_rebates_crayon_gp.crayon_gp["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DCFCE7] border-y border-[#BBF7D0]">
                <span className="text-[12px] text-green-800 font-bold">Crayon GP Over 3 Years</span>
                <span className="text-[12px] font-mono text-green-800 font-black">{cur} {fmt(gp["3y"])}</span>
              </div>

              {/* summary.merged.gp_without_rebates_crayon_gp.markup_crayon_gp */}
              <div className="flex justify-between items-center px-6 py-2 bg-white">
                <span className="text-[12px] text-slate-900 font-bold">Crayon GP Markup %</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">{pct(markup)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}