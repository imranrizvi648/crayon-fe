import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function GPWithCrayonCost({ sheet }) {
  // Check if data exists
  if (!sheet || !sheet.line_items || sheet.line_items.length === 0) return null;

  const { currency_code, summary } = sheet;
  const calc = sheet.line_items[0].calculated;

  // Year 1, 2, aur 3 ka total calculate karne ke liye
  const totalGPCostRebate = 
    Number(calc.y1.gp_plus_cost_plus_rebate) + 
    Number(calc.y2.gp_plus_cost_plus_rebate) + 
    Number(calc.y3.gp_plus_cost_plus_rebate);

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="gp-crayon-cost" className="w-full">
        <AccordionItem value="gp-crayon-cost" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Gross Profit with Rebates + Crayon Cost
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] flex justify-end px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate + Crayon Cost Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                   {currency_code} {calc.y1.gp_plus_cost_plus_rebate}
                </span>
              </div>

              {/* Year 2 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate + Crayon Cost Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                   {currency_code} {calc.y2.gp_plus_cost_plus_rebate}
                </span>
              </div>

              {/* Year 3 Row */}
              <div className="flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700 font-medium">GP + Rebate + Crayon Cost Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 font-bold">
                   {currency_code} {calc.y3.gp_plus_cost_plus_rebate}
                </span>
              </div>

              {/* Highlighted Total Row (Sum of Y1, Y2, Y3) */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#DCFCE7] border-y border-[#BBF7D0]">
                <span className="text-[12px] text-green-800 font-bold">Total GP + Rebate + Crayon Cost Over 3 Years</span>
                <span className="text-[12px] font-mono text-green-800 font-black">
                   {currency_code} {totalGPCostRebate.toFixed(2)}
                </span>
              </div>

              {/* Markup Row */}
              <div className="flex justify-between items-center px-6 py-2 bg-white">
                <span className="text-[12px] text-slate-900 font-bold">Overall Markup %</span>
                <span className="text-[12px] font-mono text-green-700 font-bold">
                  {summary.margin_percentage}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}