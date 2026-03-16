"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   primary:  summary.merged.other_lsp_rebate = { y1, y2, y3, "3y" }
//   fallback: sheet.rebate_year_1/2/3 (direct sheet fields)

export function OtherLSPRebate({ sheet }) {
  if (!sheet) return null;

  const cur    = sheet.currency_code || "AED";
  const rebate = sheet.summary?.merged?.other_lsp_rebate || {};

  // fallback to direct sheet fields if summary not available
  const r1 = rebate.y1  ?? sheet.rebate_year_1  ?? "0";
  const r2 = rebate.y2  ?? sheet.rebate_year_2  ?? "0";
  const r3 = rebate.y3  ?? sheet.rebate_year_3  ?? "0";
  const r3y = rebate["3y"] ?? (Number(r1) + Number(r2) + Number(r3));

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="other-rebate" className="w-full">
        <AccordionItem value="other-rebate" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Other LSP Rebate
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.other_lsp_rebate.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(r1)}</span>
              </div>

              {/* summary.merged.other_lsp_rebate.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(r2)}</span>
              </div>

              {/* summary.merged.other_lsp_rebate.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(r3)}</span>
              </div>

              {/* summary.merged.other_lsp_rebate["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#F1F5F9] border-y border-[#E2E8F0]">
                <span className="text-[12px] text-slate-900 font-bold">Total Rebate Over 3 Years</span>
                <span className="text-[12px] font-mono text-slate-900 font-black">{cur} {fmt(r3y)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}