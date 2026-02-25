import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function RetailPriceSection({ sheet }) {
  // Line items check aur direct access
  if (!sheet || !sheet.line_items || sheet.line_items.length === 0) return null;

  const { currency_code, summary } = sheet;
  const calc = sheet.line_items[0].calculated;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="retail-price" className="w-full">
        <AccordionItem value="retail-price" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Estimated Retail Price
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] grid grid-cols-[1fr_200px_200px_200px] px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metric</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Values</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Default Markup %</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Default GP</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 Row */}
              <div className="grid grid-cols-[1fr_200px_200px_200px] items-center px-6 py-2 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700">Total ERP Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y1.total_erp}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{summary.default_markup_y1}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y1.gp}</span>
              </div>

              {/* Year 2 Row */}
              <div className="grid grid-cols-[1fr_200px_200px_200px] items-center px-6 py-2 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700">Total ERP Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y2.total_erp}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{summary.default_markup_y2}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y2.gp}</span>
              </div>

              {/* Year 3 Row */}
              <div className="grid grid-cols-[1fr_200px_200px_200px] items-center px-6 py-2 border-b border-[#E2E8F0]">
                <span className="text-[12px] text-slate-700">Total ERP Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y3.total_erp}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{summary.default_markup_y3}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.y3.gp}</span>
              </div>

              {/* Total Row */}
              <div className="grid grid-cols-[1fr_200px_200px_200px] items-center px-6 py-2 bg-[#F0F7FF] font-bold">
                <span className="text-[12px] text-slate-700">Grand Total ERP Over 3 Years</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.total_erp_3y}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{summary.default_markup_3y}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{currency_code} {calc.total_gp_3y}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}