"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CostPriceSection({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur  = sheet.currency_code || "AED";
  // postman: summary.costing.total_net = { y1, y2, y3, "3y" }
  // postman: summary.merged.cost_price = { y1, y2, y3, "3y" }
  const totalNet  = sheet.summary?.costing?.total_net  || {};
  const costPrice = sheet.summary?.merged?.cost_price  || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const Row = ({ label, value, isTotal = false }) => (
    <div
      className={`flex justify-between items-center px-6 py-2.5 border-b border-[#E2E8F0]
        ${isTotal ? "bg-[#F0F7FF] font-bold" : "hover:bg-slate-50"}`}
    >
      <span className="text-[12px] text-slate-700">{label}</span>
      <span className="text-[12px] font-mono text-slate-900">
        {cur} {fmt(value)}
      </span>
    </div>
  );

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="cost-price" className="w-full">
        <AccordionItem value="cost-price" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Cost Price / CPS Price
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            <div className="bg-[#F8FAFC] px-6 py-2 border-b border-[#E2E8F0] flex justify-end">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
            </div>

            <div className="flex flex-col">
              {/* summary.costing.total_net.y1 / y2 / y3 / 3y */}
              <Row label="Total Net Year 1"              value={totalNet.y1} />
              <Row label="Total Net Year 2"              value={totalNet.y2} />
              <Row label="Total Net Year 3"              value={totalNet.y3} />
              <Row label="Grand Total Net Over 3 Years"  value={totalNet["3y"]} isTotal />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}