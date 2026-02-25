import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CrayonFundingSection({ sheet }) {
  if (!sheet) return null;

  const { currency_code } = sheet;

  // Manual sum for total discount (Inline logic)
  const totalDiscountValue = 
    (Number(sheet.discount_year_1) || 0) + 
    (Number(sheet.discount_year_2) || 0) + 
    (Number(sheet.discount_year_3) || 0);

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="funding" className="w-full">
        <AccordionItem value="funding" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Crayon Discount/Funding from Group ({currency_code})
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB]">
                <span className="text-[12px] text-amber-900 font-medium">Discount Value Year 1</span>
                <span className="text-[12px] font-mono text-amber-900 font-bold">{currency_code} {sheet.discount_year_1}</span>
              </div>
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB]">
                <span className="text-[12px] text-amber-900 font-medium">Discount Value Year 2</span>
                <span className="text-[12px] font-mono text-amber-900 font-bold">{currency_code} {sheet.discount_year_2}</span>
              </div>
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB]">
                <span className="text-[12px] text-amber-900 font-medium">Discount Value Year 3</span>
                <span className="text-[12px] font-mono text-amber-900 font-bold">{currency_code} {sheet.discount_year_3}</span>
              </div>
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#FFEDD5] border-y border-[#FED7AA]">
                <span className="text-[12px] text-orange-900 font-bold">Total Discount</span>
                <span className="text-[12px] font-mono text-orange-900 font-black">{currency_code} {totalDiscountValue.toFixed(2)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}