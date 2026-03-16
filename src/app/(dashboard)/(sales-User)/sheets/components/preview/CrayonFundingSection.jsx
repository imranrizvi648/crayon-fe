"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CrayonFundingSection({ sheet }) {
  if (!sheet) return null;

  const cur = sheet.currency_code || "AED";

  // postman: sheet.discount_year_1/2/3 → USD input values
  // postman: summary.merged.crayon_discount.usd_input = { y1, y2, y3 }
  // postman: summary.merged.crayon_discount.local_amount = { y1, y2, y3, "3y" }
  const usdInput    = sheet.summary?.merged?.crayon_discount?.usd_input    || {};
  const localAmount = sheet.summary?.merged?.crayon_discount?.local_amount || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Fallback: agar summary nahi toh sheet.discount_year_* use karo
  const d1 = localAmount.y1  ?? sheet.discount_year_1  ?? "0";
  const d2 = localAmount.y2  ?? sheet.discount_year_2  ?? "0";
  const d3 = localAmount.y3  ?? sheet.discount_year_3  ?? "0";
  const d3y = localAmount["3y"] ??
    (Number(d1) + Number(d2) + Number(d3));

  // USD input values (original entry)
  const u1 = usdInput.y1 ?? sheet.discount_year_1 ?? "0";
  const u2 = usdInput.y2 ?? sheet.discount_year_2 ?? "0";
  const u3 = usdInput.y3 ?? sheet.discount_year_3 ?? "0";

  const hasUsd = Number(u1) || Number(u2) || Number(u3);

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="funding" className="w-full">
        <AccordionItem value="funding" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Crayon Discount / Funding from Group ({cur})
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            {/* Column header */}
            <div className={`bg-[#F8FAFC] px-6 py-2 border-b border-[#E2E8F0] flex ${hasUsd ? "justify-between" : "justify-end"}`}>
              {hasUsd && (
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">USD Input</span>
              )}
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{cur} Amount</span>
            </div>

            <div className="flex flex-col">
              {/* Year 1 — usd_input.y1 + local_amount.y1 */}
              <div className={`flex items-center px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB] ${hasUsd ? "justify-between" : "justify-between"}`}>
                <span className="text-[12px] text-amber-900 font-medium">Discount Year 1</span>
                <div className="flex items-center gap-6">
                  {hasUsd && (
                    <span className="text-[11px] font-mono text-amber-700">USD {fmt(u1)}</span>
                  )}
                  <span className="text-[12px] font-mono text-amber-900 font-bold">{cur} {fmt(d1)}</span>
                </div>
              </div>

              {/* Year 2 */}
              <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB]">
                <span className="text-[12px] text-amber-900 font-medium">Discount Year 2</span>
                <div className="flex items-center gap-6">
                  {hasUsd && (
                    <span className="text-[11px] font-mono text-amber-700">USD {fmt(u2)}</span>
                  )}
                  <span className="text-[12px] font-mono text-amber-900 font-bold">{cur} {fmt(d2)}</span>
                </div>
              </div>

              {/* Year 3 */}
              <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#FEF3C7] bg-[#FFFBEB]">
                <span className="text-[12px] text-amber-900 font-medium">Discount Year 3</span>
                <div className="flex items-center gap-6">
                  {hasUsd && (
                    <span className="text-[11px] font-mono text-amber-700">USD {fmt(u3)}</span>
                  )}
                  <span className="text-[12px] font-mono text-amber-900 font-bold">{cur} {fmt(d3)}</span>
                </div>
              </div>

              {/* Total — local_amount["3y"] */}
              <div className="flex justify-between items-center px-6 py-2.5 bg-[#FFEDD5] border-y border-[#FED7AA]">
                <span className="text-[12px] text-orange-900 font-bold">Total Discount (3 Years)</span>
                <span className="text-[12px] font-mono text-orange-900 font-black">{cur} {fmt(d3y)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}