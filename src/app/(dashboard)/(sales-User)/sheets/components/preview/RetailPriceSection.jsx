"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function RetailPriceSection({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur    = sheet.currency_code || "AED";
  // postman: summary.costing.total_erp = { y1, y2, y3, "3y" }
  // postman: summary.merged.estimated_retail_price = { y1, y2, y3, "3y" }
  // postman: summary.merged.default_gp_net_vs_erp = { y1, y2, y3, "3y" }
  // postman: summary.merged.default_markup_net_vs_erp = { y1, y2, y3, "3y" }
  const totalErp   = sheet.summary?.costing?.total_erp                   || {};
  const totalGp    = sheet.summary?.costing?.gp                          || {};
  const defGp      = sheet.summary?.merged?.default_gp_net_vs_erp        || {};
  const defMu      = sheet.summary?.merged?.default_markup_net_vs_erp    || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = (val) =>
    `${(Number(val || 0) * 100).toFixed(2)}%`;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="retail-price" className="w-full">
        <AccordionItem value="retail-price" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Estimated Retail Price
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            {/* Column headers */}
            <div className="bg-[#F8FAFC] grid grid-cols-[1fr_180px_160px_180px] px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Metric</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Total ERP</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Default MU%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">Default GP</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 — summary.costing.total_erp.y1, merged.default_markup_net_vs_erp.y1, merged.default_gp_net_vs_erp.y1 */}
              <div className="grid grid-cols-[1fr_180px_160px_180px] items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700">Total ERP Year 1</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(totalErp.y1)}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{pct(defMu.y1)}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(defGp.y1)}</span>
              </div>

              {/* Year 2 */}
              <div className="grid grid-cols-[1fr_180px_160px_180px] items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700">Total ERP Year 2</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(totalErp.y2)}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{pct(defMu.y2)}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(defGp.y2)}</span>
              </div>

              {/* Year 3 */}
              <div className="grid grid-cols-[1fr_180px_160px_180px] items-center px-6 py-2.5 border-b border-[#E2E8F0] hover:bg-slate-50">
                <span className="text-[12px] text-slate-700">Total ERP Year 3</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(totalErp.y3)}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{pct(defMu.y3)}</span>
                <span className="text-[12px] font-mono text-slate-900 text-right pr-4">{cur} {fmt(defGp.y3)}</span>
              </div>

              {/* Grand Total — summary.costing.total_erp["3y"], merged.default_gp_net_vs_erp["3y"] */}
              <div className="grid grid-cols-[1fr_180px_160px_180px] items-center px-6 py-2.5 bg-[#F0F7FF] font-bold">
                <span className="text-[12px] text-slate-800">Grand Total ERP Over 3 Years</span>
                <span className="text-[12px] font-mono text-blue-900 text-right pr-4">{cur} {fmt(totalErp["3y"])}</span>
                <span className="text-[12px] font-mono text-slate-600 text-right pr-4">{pct(defMu["3y"])}</span>
                <span className="text-[12px] font-mono text-blue-900 text-right pr-4">{cur} {fmt(defGp["3y"])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}