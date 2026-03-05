import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function OtherLSPRebate({ sheet }) {
  // Layer 1: Check if sheet exists
  if (!sheet) return null;

  // Layer 2: Safe access to properties
  const r1 = sheet?.rebate_year_1 || "0";
  const r2 = sheet?.rebate_year_2 || "0";
  const r3 = sheet?.rebate_year_3 || "0";
  const currency = sheet?.currency_code || "AED";

  // Total calculation
  const totalLSPRebate = Number(r1) + Number(r2) + Number(r3);

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="other-rebate" className="w-full">
        <AccordionItem value="other-rebate" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Other LSP Rebate
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                  {currency} {r1}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                  {currency} {r2}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700 font-medium">Rebate Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                  {currency} {r3}
                </span>
              </div>

              <div className="flex justify-between items-center px-6 py-2.5 bg-[#F1F5F9] border-y border-[#E2E8F0]">
                <span className="text-[12px] text-slate-900 font-bold">Total Rebate Over 3 Years</span>
                <span className="text-[12px] font-mono text-slate-900 font-black">
                  {currency} {totalLSPRebate.toFixed(2)}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}