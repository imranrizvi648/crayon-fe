"use client";
import React from "react";

// ─── POSTMAN KEY MAPPING ──────────────────────────────────────────────────────
//
// line_items[i]:
//   part_number, product_name, quantity_y1, unit_type
//   calculated.y1.eup_unit, .total_eup
//   calculated.y2.total_eup
//   calculated.y3.total_eup
//   calculated.total_eup_3y
//
// summary.final_price_table:
//   line_items[i]: part_number, item_name, qty, unit_type, eup_unit,
//                  yr1_total, yr2_total, yr3_total, total_3y
//   totals_aed             = { y1, y2, y3, "3y" }
//   discounts_aed          = { y1, y2, y3, "3y" }
//   total_after_discount   = { y1, y2, y3, "3y" }
//   vat_5_percent          = { y1, y2, y3, "3y" }
//   grand_total_with_vat_aed = { y1, y2, y3, "3y" }
//
// sheet.discount_year_1/2/3  (USD input — shown as label)
// summary.merged.crayon_discount.local_amount = { y1, y2, y3, "3y" } (AED)
// ─────────────────────────────────────────────────────────────────────────────

export function PriceQuotationTable({ sheet }) {
  if (!sheet) return null;

  const cur      = sheet.currency_code || "AED";
  const vatRate  = Number(sheet.vat_rate || 0.05);
  const vatLabel = `${(vatRate * 100).toFixed(0)}%`;

  // final_price_table — preferred source for the quotation table
  const fpt      = sheet.summary?.final_price_table || {};
  const totals   = fpt.totals_aed                  || {};
  const discAED  = sheet.summary?.merged?.crayon_discount?.local_amount || {};
  const afterDisc= fpt.total_after_discount         || {};
  const vatAmt   = fpt.vat_5_percent                || {};
  const grandVat = fpt.grand_total_with_vat_aed     || {};

  // Use final_price_table.line_items if available (has yr1/yr2/yr3 per item),
  // otherwise fall back to sheet.line_items
  const tableItems = fpt.line_items?.length
    ? fpt.line_items
    : (sheet.line_items || []);

  const useFpt = !!fpt.line_items?.length;

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Discount display: USD input if non-zero, else AED local
  const discDisplay = (usdVal, aedVal) => {
    if (Number(usdVal || 0) > 0)
      return `${fmt(usdVal)} USD → ${cur} ${fmt(aedVal)}`;
    return `${cur} ${fmt(aedVal)}`;
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0]">

      {/* ── HEADER ── */}
      <div className="bg-secondary p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Price Quotation</h2>
            <p className="text-[14px] font-bold opacity-90 mt-1">{sheet.customer?.name}</p>
            <p className="text-[12px] opacity-75">
              {sheet.agreement_type} · {cur} · VAT {vatLabel} · {sheet.deal_type}
            </p>
          </div>
          <div className="text-right text-[12px] space-y-0.5 opacity-90">
            <p>Sheet: <span className="font-bold">{sheet.sheet_number}</span></p>
            <p>Rate: <span className="font-bold">{sheet.exchange_rate}</span></p>
            <p>
              AM: <span className="font-bold">
                {sheet.sales_user?.first_name} {sheet.sales_user?.last_name}
              </span>
            </p>
            <p>Region: <span className="font-bold">{sheet.sales_region}</span></p>
          </div>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ minWidth: "1100px" }}>
          <thead>
            {/* Section label */}
            <tr className="bg-[#F0F7FF] text-[#2563EB] text-[11px] font-bold uppercase border-b border-[#BFDBFE]">
              <th colSpan="9" className="px-6 py-2">Products</th>
            </tr>
            {/* Column headers */}
            <tr className="bg-white border-b border-[#E2E8F0] text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <th className="px-4 py-3 border-r">Part No.</th>
              <th className="px-4 py-3 border-r">Item Name</th>
              <th className="px-4 py-3 border-r text-center">Qty</th>
              <th className="px-4 py-3 border-r text-center">Type</th>
              <th className="px-4 py-3 border-r text-center">EUP Unit</th>
              <th className="px-4 py-3 border-r text-right">Yr.1 Total</th>
              <th className="px-4 py-3 border-r text-right">Yr.2 Total</th>
              <th className="px-4 py-3 border-r text-right">Yr.3 Total</th>
              <th className="px-4 py-3 text-right bg-slate-50 font-black">Total (3Y)</th>
            </tr>
          </thead>

          <tbody className="text-[12px] text-slate-700">
            {/* ── LINE ITEM ROWS ── */}
            {tableItems.map((item, idx) => {
              // final_price_table.line_items keys
              const partNo   = item.part_number;
              const name     = useFpt ? item.item_name      : item.product_name;
              const qty      = useFpt ? item.qty            : item.quantity_y1;
              const uType    = item.unit_type;
              const eupUnit  = useFpt ? item.eup_unit       : item.calculated?.y1?.eup_unit;
              const yr1      = useFpt ? item.yr1_total      : item.calculated?.y1?.total_eup;
              const yr2      = useFpt ? item.yr2_total      : item.calculated?.y2?.total_eup;
              const yr3      = useFpt ? item.yr3_total      : item.calculated?.y3?.total_eup;
              const tot3y    = useFpt ? item.total_3y       : item.calculated?.total_eup_3y;

              return (
                <tr key={item.id || idx} className="border-b border-[#E2E8F0] hover:bg-slate-50/50">
                  <td className="px-4 py-3 border-r font-semibold text-blue-600">{partNo}</td>
                  <td className="px-4 py-3 border-r max-w-[200px] truncate" title={name}>{name}</td>
                  <td className="px-4 py-3 border-r text-center">{Number(qty).toLocaleString()}</td>
                  <td className="px-4 py-3 border-r text-center">{uType}</td>
                  <td className="px-4 py-3 border-r text-center font-mono font-bold">{fmt(eupUnit)}</td>
                  <td className="px-4 py-3 border-r text-right font-mono">{cur} {fmt(yr1)}</td>
                  <td className="px-4 py-3 border-r text-right font-mono">{cur} {fmt(yr2)}</td>
                  <td className="px-4 py-3 border-r text-right font-mono">{cur} {fmt(yr3)}</td>
                  <td className="px-4 py-3 text-right font-mono font-black bg-slate-50 border-l">{cur} {fmt(tot3y)}</td>
                </tr>
              );
            })}

            {/* ── TOTALS ROW — final_price_table.totals_aed ── */}
            <tr className="bg-[#F0FDF4] font-bold text-[#166534] border-t-2 border-[#BBF7D0]">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] tracking-wider">
                Total {cur}
              </td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{cur} {fmt(totals.y1)}</td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{cur} {fmt(totals.y2)}</td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{cur} {fmt(totals.y3)}</td>
              <td className="px-4 py-2 text-right font-mono font-black bg-[#DCFCE7] border-l border-[#BBF7D0]">
                {cur} {fmt(totals["3y"])}
              </td>
            </tr>

            {/* ── DISCOUNT ROW — merged.crayon_discount.local_amount ── */}
            <tr className="text-[#EA580C] bg-[#FFF7ED]">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] font-bold italic">
                Further Discount from Crayon
              </td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#FED7AA]/50">{cur} {fmt(discAED.y1)}</td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#FED7AA]/50">{cur} {fmt(discAED.y2)}</td>
              <td className="px-4 py-2 text-right font-mono border-r border-[#FED7AA]/50">{cur} {fmt(discAED.y3)}</td>
              <td className="px-4 py-2 text-right font-mono font-black bg-[#FFEDD5] border-l border-[#FED7AA]">
                {cur} {fmt(discAED["3y"])}
              </td>
            </tr>

            {/* ── TOTAL AFTER DISCOUNT — final_price_table.total_after_discount ── */}
            <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px]">Total after Discount</td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(afterDisc.y1)}</td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(afterDisc.y2)}</td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(afterDisc.y3)}</td>
              <td className="px-4 py-2 text-right font-mono font-black bg-[#F0F7FF] text-blue-700 border-l border-blue-100">
                {cur} {fmt(afterDisc["3y"])}
              </td>
            </tr>

            {/* ── VAT ROW — final_price_table.vat_5_percent ── */}
            <tr className="text-slate-500 italic border-t border-slate-100">
              <td colSpan="5" className="px-6 py-2 text-right text-[11px] font-bold uppercase">
                VAT {vatLabel}
              </td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(vatAmt.y1)}</td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(vatAmt.y2)}</td>
              <td className="px-4 py-2 text-right font-mono border-r">{cur} {fmt(vatAmt.y3)}</td>
              <td className="px-4 py-2 text-right font-mono font-bold">{cur} {fmt(vatAmt["3y"])}</td>
            </tr>

            {/* ── GRAND TOTAL — final_price_table.grand_total_with_vat_aed ── */}
            <tr className="bg-secondary text-white font-black text-[14px]">
              <td colSpan="5" className="px-6 py-4 text-right uppercase tracking-widest">
                Grand Total with VAT {cur}
              </td>
              <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y1)}</td>
              <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y2)}</td>
              <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y3)}</td>
              <td className="px-4 py-4 text-right font-mono text-[15px] bg-secondary border-l border-white/20">
                {cur} {fmt(grandVat["3y"])}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── FOOTER ── */}
      <div className="p-6 bg-[#F8FAFC] border-t border-slate-100 flex flex-wrap justify-between gap-4">
        <div className="text-[11px] text-slate-400 space-y-1 font-medium italic">
          <p>• All prices are in {cur} and subject to VAT</p>
          <p>• This quotation is valid for 30 days from the date of issue</p>
          <p>• Payment terms: As per agreement</p>
        </div>
        <div className="text-right text-[11px] text-slate-400 space-y-1">
          <p>Opportunity: <span className="font-bold text-slate-600">{sheet.opportunity_id}</span></p>
          <p>Version: <span className="font-bold text-slate-600">{sheet.version}</span></p>
          <p>Status: <span className="font-bold text-slate-600">{sheet.status}</span></p>
        </div>
      </div>
    </div>
  );
}