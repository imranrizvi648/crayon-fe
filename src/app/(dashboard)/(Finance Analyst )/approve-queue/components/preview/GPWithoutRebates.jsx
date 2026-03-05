import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function GPWithoutRebates({ sheet }) {
  // Check if data exists
  if (!sheet || !sheet.line_items || sheet.line_items.length === 0) return null;

  const { currency_code } = sheet;
  // Pehle line item ka calculated data variable mein rakh liya
  const calc = sheet.line_items[0].calculated;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="gp-no-rebate" className="w-full">
        <AccordionItem value="gp-no-rebate" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            GP without Rebates
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 Row - Using exact 'gp' key */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-green-700 font-medium">GP Year 1</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">
                  {currency_code} {calc.y1.gp}
                </span>
              </div>

              {/* Year 2 Row - Using exact 'gp' key */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-green-700 font-medium">GP Year 2</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">
                  {currency_code} {calc.y2.gp}
                </span>
              </div>

              {/* Year 3 Row - Using exact 'gp' key */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-green-700 font-medium">GP Year 3</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">
                  {currency_code} {calc.y3.gp}
                </span>
              </div>

              {/* Highlighted Total Row - Using total_gp_3y from calculated object */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DCFCE7] border-y border-[#BBF7D0]">
                <span className="text-[12px] text-green-800 font-bold">GP Over 3 Years</span>
                <span className="text-[12px] font-mono text-green-800 font-black">
                  {currency_code} {calc.total_gp_3y}
                </span>
              </div>

              {/* Markup Row - Direct from summary as provided in JSON */}
              <div className="flex justify-between items-center px-6 py-2 bg-white">
                <span className="text-[12px] text-slate-900 font-bold">Markup %</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">
                  {sheet.summary.margin_percentage}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}