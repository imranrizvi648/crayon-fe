"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function EUPWithoutCrayonDiscount({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur  = sheet.currency_code || "AED";
  // postman: summary.costing.total_eup_yr = { y1, y2, y3, "3y" }
  const eup  = sheet.summary?.costing?.total_eup_yr || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="eup-no-discount" className="w-full">
        <AccordionItem value="eup-no-discount" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            End User Price without Crayon Discount
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.costing.total_eup_yr.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eup.y1)}</span>
              </div>

              {/* summary.costing.total_eup_yr.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eup.y2)}</span>
              </div>

              {/* summary.costing.total_eup_yr.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eup.y3)}</span>
              </div>

              {/* summary.costing.total_eup_yr["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#F0F7FF] border-y border-[#BFDBFE]">
                <span className="text-[12px] text-blue-800 font-bold">Grand Total EUP (3 Years) w/o Discount</span>
                <span className="text-[12px] font-mono text-blue-900 font-black">{cur} {fmt(eup["3y"])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}