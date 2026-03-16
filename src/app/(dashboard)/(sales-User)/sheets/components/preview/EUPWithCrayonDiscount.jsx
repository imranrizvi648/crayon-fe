"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   summary.merged.eup_with_discount.y1/y2/y3/"3y"
//   summary.merged.eup_with_discount.grand_total_w_dscnt_vat_3y
//   fallback VAT: summary.final_price_table.grand_total_with_vat_aed["3y"]

export function EUPWithCrayonDiscount({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur     = sheet.currency_code || "AED";
  const eupDisc = sheet.summary?.merged?.eup_with_discount || {};
  const grandVat = sheet.summary?.final_price_table?.grand_total_with_vat_aed || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="eup-with-discount" className="w-full">
        <AccordionItem value="eup-with-discount" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            End User Price with Crayon Discount
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.eup_with_discount.y1 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 1 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eupDisc.y1)}</span>
              </div>

              {/* summary.merged.eup_with_discount.y2 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 2 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eupDisc.y2)}</span>
              </div>

              {/* summary.merged.eup_with_discount.y3 */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 3 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{cur} {fmt(eupDisc.y3)}</span>
              </div>

              {/* summary.merged.eup_with_discount["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#F0F7FF] border-y border-[#BFDBFE]">
                <span className="text-[12px] text-blue-800 font-bold">Grand Total EUP (3 Years) w/ Discount</span>
                <span className="text-[12px] font-mono text-blue-900 font-black">{cur} {fmt(eupDisc["3y"])}</span>
              </div>

              {/* summary.merged.eup_with_discount.grand_total_w_dscnt_vat_3y */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DBEAFE] border-y border-[#BFDBFE]">
                <span className="text-[12px] text-blue-900 font-black uppercase">Grand Total EUP (3 Years) w/ Discount + VAT</span>
                <span className="text-[12px] font-mono text-blue-900 font-black">
                  {cur} {fmt(eupDisc.grand_total_w_dscnt_vat_3y ?? grandVat["3y"])}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}