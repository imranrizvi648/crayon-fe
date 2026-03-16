"use client";
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// postman key mapping:
//   sheet.bid_bond_percentage, sheet.bank_charges_percentage
//   sheet.performance_bond_percentage, sheet.performance_bank_charges_percentage
//   sheet.tender_cost
//
//   summary.merged.bid_bond_and_bank_charges:
//     bid_bond_pct, bid_bond_value, bank_charges_pct, total_bb_cost
//
//   summary.merged.performance_bond_and_bank_charges:
//     perf_bond_pct, perf_bond_value, bank_charges_pct
//     crayon_costing = { y1, y2, y3 }
//     total_pb_cost_3y
//
//   summary.merged.total_crayon_costing:
//     tender_cost, total
//
//   summary.costing.total_net = { y1, y2, y3, "3y" }
//   summary.merged.eup_with_discount.grand_total_w_dscnt_vat_3y
//   summary.final_price_table.grand_total_with_vat_aed["3y"]

export function MergedBidBondSection({ sheet }) {
  if (!sheet) return null;

  const cur     = sheet.currency_code || "AED";
  const bb      = sheet.summary?.merged?.bid_bond_and_bank_charges               || {};
  const pb      = sheet.summary?.merged?.performance_bond_and_bank_charges        || {};
  const crayon  = sheet.summary?.merged?.total_crayon_costing                     || {};
  const totalNet= sheet.summary?.costing?.total_net                               || {};
  const grandVat= sheet.summary?.merged?.eup_with_discount?.grand_total_w_dscnt_vat_3y
               ?? sheet.summary?.final_price_table?.grand_total_with_vat_aed?.["3y"]
               ?? "0";

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pctFmt = (val) => `${Number(val || 0).toFixed(2)}%`;

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="merged-bonds" className="w-full">
        <AccordionItem value="merged-bonds" className="border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            Bid Bond & Bank Charges
          </AccordionTrigger>

          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* ── LEFT: Bid Bond ── */}
              <div className="space-y-0 border border-[#E2E8F0] rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_140px] bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                  <span>Bid Bond</span>
                  <span className="text-center">%</span>
                  <span className="text-right">Value</span>
                </div>

                {/* sheet.bid_bond_percentage → summary.merged.bid_bond_and_bank_charges.bid_bond_pct */}
                <div className="grid grid-cols-[1fr_100px_140px] px-4 py-3 border-b border-[#E2E8F0] text-[12px] hover:bg-slate-50">
                  <span className="text-slate-700">Bid Bond Percentage</span>
                  <span className="text-center font-mono">{pctFmt(bb.bid_bond_pct ?? sheet.bid_bond_percentage)}</span>
                  <span className="text-right font-mono font-bold text-slate-900">
                    {cur} {fmt(bb.bid_bond_value)}
                  </span>
                </div>

                {/* sheet.bank_charges_percentage */}
                <div className="grid grid-cols-[1fr_100px_140px] px-4 py-3 border-b border-[#E2E8F0] text-[12px] hover:bg-slate-50">
                  <span className="text-slate-700">Bank Charges</span>
                  <span className="text-center font-mono">{pctFmt(bb.bank_charges_pct ?? sheet.bank_charges_percentage)}</span>
                  <span className="text-right font-mono font-bold text-slate-500">—</span>
                </div>

                {/* summary.merged.bid_bond_and_bank_charges.total_bb_cost */}
                <div className="grid grid-cols-[1fr_140px] px-4 py-3 bg-[#FEF9C3] font-bold text-[12px]">
                  <span className="text-amber-900">Total BB Cost</span>
                  <span className="text-right font-mono font-black text-amber-900">
                    {cur} {fmt(bb.total_bb_cost)}
                  </span>
                </div>
              </div>

              {/* ── RIGHT: Performance Bond ── */}
              <div className="space-y-0 border border-[#E2E8F0] rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_140px] bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] text-[10px] font-bold text-slate-500 uppercase">
                  <span>Performance Bond</span>
                  <span className="text-center">%</span>
                  <span className="text-right">Value</span>
                </div>

                {/* sheet.performance_bond_percentage → summary.merged.performance_bond_and_bank_charges.perf_bond_pct */}
                <div className="grid grid-cols-[1fr_100px_140px] px-4 py-3 border-b border-[#E2E8F0] text-[12px] hover:bg-slate-50">
                  <span className="text-slate-700">PB Percentage</span>
                  <span className="text-center font-mono">{pctFmt(pb.perf_bond_pct ?? sheet.performance_bond_percentage)}</span>
                  <span className="text-right font-mono font-bold text-slate-900">
                    {cur} {fmt(pb.perf_bond_value)}
                  </span>
                </div>

                {/* sheet.performance_bank_charges_percentage */}
                <div className="grid grid-cols-[1fr_100px_140px] px-4 py-3 border-b border-[#E2E8F0] text-[12px] hover:bg-slate-50">
                  <span className="text-slate-700">Bank Charges</span>
                  <span className="text-center font-mono">{pctFmt(pb.bank_charges_pct ?? sheet.performance_bank_charges_percentage)}</span>
                  <span className="text-right font-mono font-bold text-slate-500">—</span>
                </div>

                {/* summary.merged.performance_bond_and_bank_charges.crayon_costing.y1/y2/y3 */}
                {[
                  { label: "Crayon Costing Year 1", val: pb.crayon_costing?.y1 },
                  { label: "Crayon Costing Year 2", val: pb.crayon_costing?.y2 },
                  { label: "Crayon Costing Year 3", val: pb.crayon_costing?.y3 },
                ].map((r) => (
                  <div key={r.label} className="grid grid-cols-[1fr_140px] px-4 py-2 border-b border-[#E2E8F0] bg-[#EFF6FF] text-[11px] italic">
                    <span className="text-blue-800">{r.label}</span>
                    <span className="text-right font-mono font-bold text-blue-900">{cur} {fmt(r.val)}</span>
                  </div>
                ))}

                {/* summary.merged.performance_bond_and_bank_charges.total_pb_cost_3y */}
                <div className="grid grid-cols-[1fr_140px] px-4 py-3 bg-[#FEF9C3] font-bold text-[12px]">
                  <span className="text-amber-900">Total PB Cost (3 Years)</span>
                  <span className="text-right font-mono font-black text-amber-900">
                    {cur} {fmt(pb.total_pb_cost_3y)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── BOTTOM SUMMARY ── */}
            <div className="mt-6 border border-[#E2E8F0] rounded-lg overflow-hidden">
              {/* Net totals — summary.costing.total_net */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-[#E2E8F0]">
                {[
                  { label: "Total Net Year 1", val: totalNet.y1 },
                  { label: "Total Net Year 2", val: totalNet.y2 },
                  { label: "Total Net Year 3", val: totalNet.y3 },
                ].map((r) => (
                  <div key={r.label} className="px-4 py-3 bg-[#EFF6FF] text-[11px]">
                    <p className="text-slate-500 font-medium mb-1">{r.label}</p>
                    <p className="font-mono font-bold text-blue-900">{cur} {fmt(r.val)}</p>
                  </div>
                ))}
              </div>

              {/* Grand Net 3Y — summary.costing.total_net["3y"] */}
              <div className="grid grid-cols-[1fr_200px] px-4 py-3 bg-[#DBEAFE] border-t border-[#BFDBFE] font-bold text-[12px]">
                <span className="text-blue-900">Total Grand Net (3 Years)</span>
                <span className="text-right font-mono font-black text-blue-900">{cur} {fmt(totalNet["3y"])}</span>
              </div>
            </div>

            {/* ── TENDER COST + GRAND TOTAL ── */}
            <div className="mt-4 flex flex-col items-end gap-2">
              {/* summary.merged.total_crayon_costing.tender_cost */}
              <div className="w-[300px] flex justify-between px-4 py-2 bg-[#FEF9C3] border border-[#FEF08A] rounded text-[12px] font-bold">
                <span className="uppercase text-amber-900">Tender Cost</span>
                <span className="font-mono text-amber-900">{cur} {fmt(crayon.tender_cost ?? sheet.tender_cost)}</span>
              </div>

              {/* summary.merged.total_crayon_costing.total */}
              <div className="w-[300px] flex justify-between px-4 py-2 bg-[#FEF3C7] border border-[#FDE68A] rounded text-[12px] font-bold">
                <span className="uppercase text-amber-900">Total Crayon Costing</span>
                <span className="font-mono text-amber-900">{cur} {fmt(crayon.total)}</span>
              </div>

              {/* grand_total_with_vat */}
              <div className="w-[300px] flex justify-between px-4 py-3 bg-[#FEE2E2] border border-[#FECACA] rounded text-[13px] font-black text-[#991B1B]">
                <span className="uppercase">Grand Total (Inc. VAT)</span>
                <span className="font-mono">{cur} {fmt(grandVat)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}