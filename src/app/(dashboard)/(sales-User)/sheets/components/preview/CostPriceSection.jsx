import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CostPriceSection({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const fmt = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val || 0);

  const Row = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center px-6 py-2 border-b border-[#E2E8F0] last:border-0 ${isTotal ? 'bg-[#F0F7FF] font-bold' : ''}`}>
      <span className="text-[12px] text-slate-700">{label}</span>
      <span className="text-[12px] font-mono text-slate-900">{sheet.currency_code} {fmt(value)}</span>
    </div>
  );

  return (
    <div className="w-full mt-6">
      <Accordion type="single" collapsible defaultValue="cost-price" className="w-full">
        <AccordionItem value="cost-price" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          {/* Header */}
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Cost Price / CPS Price
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            {/* Table Header */}
            <div className="bg-[#F8FAFC] px-6 py-2 border-b border-[#E2E8F0] flex justify-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            {/* List Rows */}
            <div className="flex flex-col">
              <Row label="Total Net Year 1" value={sheet.summary.total_net_y1} />
              <Row label="Total Net Year 2" value={sheet.summary.total_net_y2} />
              <Row label="Total Net Year 3" value={sheet.summary.total_net_y3} />
              <Row label="Grand Total Net Over 3 Years" value={sheet.summary.total_net_3y} isTotal />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}