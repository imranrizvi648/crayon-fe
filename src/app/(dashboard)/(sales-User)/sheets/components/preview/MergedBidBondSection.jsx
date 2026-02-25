import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function MergedBidBondSection({ sheet }) {
  if (!sheet) return null;

  const currency = sheet.currency_code || "AED";

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="merged-bonds" className="w-full">
        <AccordionItem value="merged-bonds" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Bid Bond & Bank Charges
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Bid Bond Section */}
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_100px_120px] bg-[#F8FAFC] border-b px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">
                  <span>Bid Bond</span>
                  <span className="text-center">%</span>
                  <span className="text-right">Value</span>
                </div>
                <div className="grid grid-cols-[1fr_100px_120px] px-4 py-3 border-b text-[12px]">
                  <span>Bid Bond Percentage</span>
                  <span className="text-center">{sheet.bid_bond_percentage}%</span>
                  <span className="text-right font-mono font-bold">-</span>
                </div>
                <div className="grid grid-cols-[1fr_100px_120px] px-4 py-3 border-b text-[12px]">
                  <span>Bank Charges</span>
                  <span className="text-center">{sheet.bank_charges_percentage}%</span>
                  <span className="text-right font-mono font-bold">-</span>
                </div>
                <div className="grid grid-cols-[1fr_120px] px-4 py-3 bg-[#FEF9C3] font-bold text-[12px]">
                  <span>Total BB Cost</span>
                  <span className="text-right font-mono font-black">{currency} 0.00</span>
                </div>
              </div>

              {/* Right Column: Performance Bond Section */}
              <div className="space-y-0">
                <div className="grid grid-cols-[1fr_100px_120px] bg-[#F8FAFC] border-b px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">
                  <span>Performance Bond</span>
                  <span className="text-center">%</span>
                  <span className="text-right">Value</span>
                </div>
                <div className="grid grid-cols-[1fr_100px_120px] px-4 py-3 border-b text-[12px]">
                  <span>PB Percentage</span>
                  <span className="text-center">{sheet.performance_bond_percentage}%</span>
                  <span className="text-right font-mono font-bold">-</span>
                </div>
                <div className="grid grid-cols-[1fr_100px_120px] px-4 py-3 border-b text-[12px]">
                  <span>Bank Charges</span>
                  <span className="text-center">{sheet.performance_bank_charges_percentage}%</span>
                  <span className="text-right font-mono font-bold">-</span>
                </div>
                
                {/* Summary Net Values */}
                <div className="grid grid-cols-[1fr_120px] px-4 py-2 border-b bg-[#EFF6FF] text-[11px] italic">
                  <span>Net Cost Year 1</span>
                  <span className="text-right font-mono font-bold">{currency} {sheet.summary?.total_net_y1}</span>
                </div>
                <div className="grid grid-cols-[1fr_120px] px-4 py-2 border-b bg-[#EFF6FF] text-[11px] italic">
                  <span>Net Cost Year 2</span>
                  <span className="text-right font-mono font-bold">{currency} {sheet.summary?.total_net_y2}</span>
                </div>
                <div className="grid grid-cols-[1fr_120px] px-4 py-2 border-b bg-[#EFF6FF] text-[11px] italic">
                  <span>Net Cost Year 3</span>
                  <span className="text-right font-mono font-bold">{currency} {sheet.summary?.total_net_y3}</span>
                </div>
                <div className="grid grid-cols-[1fr_120px] px-4 py-3 bg-[#FEF9C3] font-bold text-[12px]">
                  <span>Total Grand Net (3 Years)</span>
                  <span className="text-right font-mono font-black">{currency} {sheet.summary?.total_net_3y}</span>
                </div>
              </div>
            </div>

            {/* Bottom Summary Section */}
            <div className="mt-6 flex flex-col items-end gap-2">
              <div className="w-[280px] flex justify-between px-4 py-2 bg-[#FEF9C3] text-[12px] font-bold">
                <span className="uppercase">Tender Cost</span>
                <span className="font-mono">{currency} {sheet.tender_cost}</span>
              </div>
              <div className="w-[280px] flex justify-between px-4 py-3 bg-[#FEE2E2] text-[13px] font-black text-[#991B1B]">
                <span className="uppercase">Grand Total (Inc. VAT)</span>
                <span className="font-mono">{currency} {sheet.summary?.grand_total_with_vat}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}