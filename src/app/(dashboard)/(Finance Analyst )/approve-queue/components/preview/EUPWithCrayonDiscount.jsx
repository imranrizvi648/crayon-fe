import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function EUPWithCrayonDiscount({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const { summary, currency_code } = sheet;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="eup-with-discount" className="w-full">
        <AccordionItem value="eup-with-discount" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            End User Price with Crayon Discount
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 1 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{currency_code} {summary.total_eup_after_discount_y1}</span>
              </div>

              {/* Year 2 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 2 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{currency_code} {summary.total_eup_after_discount_y2}</span>
              </div>

              {/* Year 3 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Total EUP Year 3 with Discount</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">{currency_code} {summary.total_eup_after_discount_y3}</span>
              </div>

              {/* Grand Total w/ Discount Row */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#F0F7FF] border-y border-[#E2E8F0]">
                <span className="text-[12px] text-blue-800 font-bold">Grand Total EUP (3 Years) w/ Discount</span>
                <span className="text-[12px] font-mono text-blue-900 font-black">{currency_code} {summary.total_eup_after_discount_3y}</span>
              </div>

              {/* Grand Total with VAT Row */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DBEAFE] border-y border-[#BFDBFE]">
                <span className="text-[12px] text-blue-900 font-black uppercase">Grand Total EUP (3 Years) w/ Discount + VAT</span>
                <span className="text-[12px] font-mono text-blue-900 font-black">{currency_code} {summary.grand_total_with_vat}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}