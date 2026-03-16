"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   primary:  summary.merged.cif_products = { m365_e5, m365_e3, azure, dynamics_365 }
//   fallback: sheet.cif_m365_e5_value / cif_m365_e3_value / cif_azure_value / cif_dynamics_365_value

export function CIFProductsMerged({ sheet }) {
  if (!sheet) return null;

  const cur  = sheet.currency_code || "AED";
  const cif  = sheet.summary?.merged?.cif_products || {};

  // primary from summary, fallback to direct sheet fields
  const e5  = cif.m365_e5    ?? sheet.cif_m365_e5_value      ?? "0";
  const e3  = cif.m365_e3    ?? sheet.cif_m365_e3_value      ?? "0";
  const az  = cif.azure      ?? sheet.cif_azure_value        ?? "0";
  const d365= cif.dynamics_365 ?? sheet.cif_dynamics_365_value ?? "0";

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const hasValue = (v) => Number(v || 0) > 0;

  const CIFRow = ({ label, value }) => (
    <div className={`grid grid-cols-[1fr_200px] items-center px-6 py-2.5 border-b border-[#E2E8F0] last:border-0
      ${hasValue(value) ? "bg-[#FEFCE8] hover:bg-[#FEF9C3]" : "hover:bg-slate-50"}`}
    >
      <span className="text-[12px] text-slate-700 font-medium">{label}</span>
      <span className={`text-[12px] font-mono text-right font-bold ${hasValue(value) ? "text-slate-900" : "text-slate-400"}`}>
        {cur} {fmt(value)}
      </span>
    </div>
  );

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="cif-products" className="w-full">
        <AccordionItem value="cif-products" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            CIF Products
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            {/* Column header */}
            <div className="bg-[#F8FAFC] grid grid-cols-[1fr_200px] px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Yearly Value</span>
            </div>

            <div className="flex flex-col">
              {/* summary.merged.cif_products.m365_e5 */}
              <CIFRow label="M365 E5"      value={e5} />
              {/* summary.merged.cif_products.m365_e3 */}
              <CIFRow label="M365 E3"      value={e3} />
              {/* summary.merged.cif_products.azure */}
              <CIFRow label="Azure"        value={az} />
              {/* summary.merged.cif_products.dynamics_365 */}
              <CIFRow label="Dynamics 365" value={d365} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}