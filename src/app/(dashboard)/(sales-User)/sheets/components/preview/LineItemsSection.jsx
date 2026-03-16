"use client";
import React, { useState } from "react";
import { Info } from "lucide-react";

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmtNum = (v) =>
  Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPct = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;
const fmtAED = (v, cur = "AED") => `${cur} ${fmtNum(v)}`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export function LineItemsSection({ sheet }) {
  const [activeYear, setActiveYear] = useState("year1");

  if (!sheet) return null;

  const isRamped = sheet.deal_type === "RAMPED";
  const isAfrica = sheet.sales_region === "AFRICA";
  const currency = sheet.currency_code || "AED";
  const items    = sheet.line_items || [];

  const yearKey = activeYear === "year2" ? "y2" : activeYear === "year3" ? "y3" : "y1";
  const sfx     = activeYear === "year2" ? "_y2" : activeYear === "year3" ? "_y3" : "_y1";

  const yf = (item, base) => item[`${base}${sfx}`] ?? item[`${base}_y1`] ?? "0";
  const yc = (item, field) => item?.calculated?.[yearKey]?.[field] ?? "0";

  // ── PER-ROW DATA ──────────────────────────────────────────────────────────
  const getRow = (item) => ({
    category:   item.product_type || "—",
    part_no:    item.part_number  || "—",
    item_name:  item.product_name || "—",
    unit_net:   `$${fmtNum(yf(item,"unit_net_usd"))}`,
    unit_erp:   `$${fmtNum(yf(item,"unit_erp_usd"))}`,
    def_mu:     `${(Number(yc(item,"default_markup")) * 100).toFixed(2)}%`,
    ms_disc:    fmtPct(yf(item,"ms_discount_percentage")),
    crayon_mu:  fmtPct(yf(item,"markup_percentage")),
    unit_type:  item.unit_type ?? 12,
    disc_net:   fmtNum(yc(item,"ms_discount_net_amount")),
    disc_erp:   fmtNum(yc(item,"ms_discount_erp_amount")),
    total_net:  fmtAED(yc(item,"total_net"), currency),
    total_erp:  fmtAED(yc(item,"total_erp"), currency),
    qty:        Number(yf(item,"quantity")).toLocaleString(),
    eup_unit:   fmtNum(yc(item,"eup_unit")),
    total_eup:  fmtAED(yc(item,"total_eup"), currency),
    actual_mu:  fmtPct(yc(item,"actual_markup_applied")),
    rebate_pct: fmtPct(yf(item,"rebate_percentage")),
    rebate_amt: fmtAED(yc(item,"rebate_amount"), currency),
    gp:         fmtAED(yc(item,"gp"), currency),
    swo_pct:    fmtPct(yf(item,"swo_gp_percentage")),
    swo_gp:     fmtAED(yc(item,"swo_gp"), currency),
    partner_gp: fmtAED(yc(item,"partner_gp"), currency),
  });

  // ── ALL TOTALS — 100% BACKEND ─────────────────────────────────────────────
  const csum = sheet.summary?.costing || {};

  // Yearly totals (active year)
  const totNet    = csum.total_net?.[yearKey]     || "0";
  const totErp    = csum.total_erp?.[yearKey]     || "0";
  const totEup    = csum.total_eup_yr?.[yearKey]  || "0";
  const totRebate = csum.rebate_amount?.[yearKey] || "0";
  const totGp     = csum.gp?.[yearKey]            || "0";
  const totSwoGp  = csum.swo_gp?.[yearKey]        || "0";
  const totPartGp = csum.partner_gp?.[yearKey]    || "0";

  // 3-year totals
  const tot3Net    = csum.total_net?.["3y"]     || "0";
  const tot3Erp    = csum.total_erp?.["3y"]     || "0";
  const tot3Eup    = csum.total_eup_yr?.["3y"]  || "0";
  const tot3Rebate = csum.rebate_amount?.["3y"] || "0";
  const gp3Y       = csum.gp?.["3y"]            || "0";
  const swoGp3Y    = csum.swo_gp?.["3y"]        || "0";
  const partGp3Y   = csum.partner_gp?.["3y"]    || "0";

  // Profit summary
  const gpY1     = csum.gp?.y1                        || "0";
  const gpY2     = csum.gp?.y2                        || "0";
  const gpY3     = csum.gp?.y3                        || "0";
  const swoGpY1  = csum.swo_gp?.y1                    || "0";
  const swoGpY2  = csum.swo_gp?.y2                    || "0";
  const swoGpY3  = csum.swo_gp?.y3                    || "0";
  const partGpY1 = csum.partner_gp?.y1                || "0";
  const partGpY2 = csum.partner_gp?.y2                || "0";
  const partGpY3 = csum.partner_gp?.y3                || "0";
  const margin   = csum.bottom_summary?.overall_margin || "0";

  // ── COLUMN DEFINITIONS ────────────────────────────────────────────────────
  const cols = [
    { key:"category",   label:"Category",        th:"bg-slate-700", td:"",                                          w:"min-w-[120px]" },
    { key:"part_no",    label:"Part Number",      th:"bg-green-800", td:"text-blue-600 font-semibold",               w:"min-w-[110px]" },
    { key:"item_name",  label:"Item Name",        th:"bg-slate-700", td:"max-w-[180px] truncate",                    w:"min-w-[180px] text-left" },
    { key:"unit_net",   label:"Unit Net USD",     th:"bg-slate-700", td:"text-right",                                w:"min-w-[90px]" },
    { key:"unit_erp",   label:"Unit ERP USD",     th:"bg-slate-700", td:"text-right",                                w:"min-w-[90px]" },
    { key:"def_mu",     label:"Default Markup %", th:"bg-slate-600", td:"text-right text-slate-500",                 w:"min-w-[85px]" },
    { key:"ms_disc",    label:"MS Discount %",    th:"bg-slate-700", td:"text-right",                                w:"min-w-[80px]" },
    { key:"crayon_mu",  label:"Crayon Markup %",  th:"bg-slate-700", td:"text-right",                                w:"min-w-[90px]" },
    { key:"unit_type",  label:"Unit Type",        th:"bg-slate-700", td:"text-center",                               w:"min-w-[60px]" },
    { key:"disc_net",   label:"MS Disc Net",      th:"bg-blue-900",  td:"text-right text-blue-600",                  w:"min-w-[85px]" },
    { key:"disc_erp",   label:"MS Disc ERP",      th:"bg-blue-900",  td:"text-right text-blue-600",                  w:"min-w-[85px]" },
    { key:"total_net",  label:"Total Net",        th:"bg-blue-700",  td:"text-right font-bold bg-blue-50/60",        w:"min-w-[130px]" },
    { key:"total_erp",  label:"Total ERP",        th:"bg-blue-700",  td:"text-right font-bold bg-blue-50/60",        w:"min-w-[130px]" },
    { key:"qty",        label:"Qty",              th:"bg-amber-700", td:"text-center font-bold bg-yellow-50/50",     w:"min-w-[60px]" },
    { key:"eup_unit",   label:"EUP",              th:"bg-green-800", td:"text-right text-green-700",                 w:"min-w-[80px]" },
    { key:"total_eup",  label:"Total EUP/Yr",     th:"bg-green-700", td:"text-right font-bold text-green-900 bg-green-50/60", w:"min-w-[130px]" },
    { key:"actual_mu",  label:"Markup %",         th:"bg-slate-600", td:"text-right text-slate-500",                 w:"min-w-[70px]" },
    { key:"rebate_pct", label:"Rebate %",         th:"bg-slate-700", td:"text-right",                                w:"min-w-[70px]" },
    { key:"rebate_amt", label:"Rebate",           th:"bg-amber-700", td:"text-right text-yellow-800 bg-yellow-50/40",w:"min-w-[110px]" },
    ...(isAfrica ? [
      { key:"gp",         label:"GP",             th:"bg-purple-800", td:"text-right text-purple-800 bg-purple-50/40", w:"min-w-[110px]" },
      { key:"swo_pct",    label:"SWO GP %",       th:"bg-purple-700", td:"text-right text-purple-700",                w:"min-w-[70px]" },
      { key:"swo_gp",     label:"SWO GP",         th:"bg-purple-800", td:"text-right text-purple-800 bg-purple-50/40", w:"min-w-[110px]" },
      { key:"partner_gp", label:"Partner GP",     th:"bg-orange-700", td:"text-right text-orange-800 bg-orange-50/40", w:"min-w-[110px]" },
    ] : []),
  ];

  // ── TOTALS FOOTER MAP ─────────────────────────────────────────────────────
  const totalsMap = {
    total_net:  fmtAED(totNet,    currency),
    total_erp:  fmtAED(totErp,    currency),
    qty:        "",
    total_eup:  fmtAED(totEup,    currency),
    rebate_amt: fmtAED(totRebate, currency),
    gp:         fmtAED(totGp,     currency),
    swo_gp:     fmtAED(totSwoGp,  currency),
    partner_gp: fmtAED(totPartGp, currency),
  };

  const totalsTdCls = {
    total_net:  "bg-blue-200 text-blue-900 font-bold",
    total_erp:  "bg-blue-200 text-blue-900 font-bold",
    qty:        "bg-yellow-200 font-bold text-center",
    total_eup:  "bg-green-200 text-green-900 font-bold",
    rebate_amt: "bg-yellow-100 text-yellow-800 font-bold",
    gp:         "bg-purple-100 text-purple-900 font-bold",
    swo_gp:     "bg-purple-100 text-purple-900 font-bold",
    partner_gp: "bg-orange-100 text-orange-900 font-bold",
  };

  // ── 3-YEAR FOOTER MAP ─────────────────────────────────────────────────────
  const v3 = {
    total_net:  fmtAED(tot3Net,    currency),
    total_erp:  fmtAED(tot3Erp,    currency),
    total_eup:  fmtAED(tot3Eup,    currency),
    rebate_amt: fmtAED(tot3Rebate, currency),
    qty:        "",
    gp:         fmtAED(gp3Y,       currency),
    swo_gp:     fmtAED(swoGp3Y,    currency),
    partner_gp: fmtAED(partGp3Y,   currency),
  };

  const netIdx = cols.findIndex(c => c.key === "total_net");

  return (
    <div className="space-y-0">

      {/* ── TOOLBAR ── */}
      <div className="bg-[#EFF6FF] border-b border-[#DBEAFE] px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-[#2563EB] text-[11px] font-medium">
          <Info size={13} />
          <span>
            {isRamped ? "Ramped Deal" : "Normal Deal"}
            {isAfrica ? " · Africa" : ""}
          </span>
        </div>
        {isRamped && (
          <div className="flex gap-1">
            {["year1","year2","year3"].map((y, i) => (
              <button key={y} onClick={() => setActiveYear(y)}
                className={`px-4 py-1.5 text-[11px] font-bold rounded transition-all ${
                  activeYear === y
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}>
                Year {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN TABLE ── */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left"
          style={{ minWidth: isAfrica ? "2100px" : "1600px" }}>

          <thead>
            <tr>
              {cols.map(c => (
                <th key={c.key}
                  className={`${c.w} ${c.th} px-2 py-2.5 text-[10px] font-bold text-white
                    uppercase tracking-tight whitespace-nowrap border-r border-white/10 text-right
                    first:text-left`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {/* Data rows */}
            {items.map((item, idx) => {
              const row = getRow(item);
              return (
                <tr key={item.id || idx} className="hover:bg-blue-50/20 transition-colors text-[11px]">
                  {cols.map(c => (
                    <td key={c.key}
                      className={`${c.w} ${c.td} px-2 py-2 border-r border-slate-100 whitespace-nowrap`}
                      title={c.key === "item_name" ? item.product_name : undefined}
                    >
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Yearly Installment Row */}
            <tr className="bg-slate-100 border-t-2 border-slate-300 text-[11px] font-bold">
              <td colSpan={netIdx}
                className="px-3 py-2 text-right text-slate-500 uppercase text-[10px] tracking-widest whitespace-nowrap">
                Yearly Installment:
              </td>
              {cols.slice(netIdx).map(c => (
                <td key={c.key}
                  className={`px-2 py-2 border-r border-slate-200 whitespace-nowrap text-right
                    ${totalsTdCls[c.key] || ""}`}
                >
                  {totalsMap[c.key] || ""}
                </td>
              ))}
            </tr>

            {/* Total over 3 Years Row */}
            <tr className="bg-blue-900 text-white text-[11px] font-bold">
              <td colSpan={netIdx}
                className="px-3 py-2 text-right uppercase text-[10px] tracking-widest whitespace-nowrap">
                Total over 3 Years:
              </td>
              {cols.slice(netIdx).map(c => (
                <td key={c.key}
                  className="px-2 py-2 border-r border-blue-800 whitespace-nowrap text-right">
                  {v3[c.key] || ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PROFIT SUMMARY FOOTER ── */}
      <div className="flex justify-end p-6 bg-[#F8FAFC] border-t border-slate-200">
        <div className="w-[320px] space-y-1.5">

          {[
            { label: "Profit /Year 1", val: gpY1 },
            { label: "Profit /Year 2", val: gpY2 },
            { label: "Profit /Year 3", val: gpY3 },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{r.label}</span>
              <span className="text-[12px] font-black text-green-600">{currency} {fmtNum(r.val)}</span>
            </div>
          ))}

          <div className="flex justify-between items-center px-4 py-2 border border-green-300 rounded-md bg-green-50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profit /3Years</span>
            <span className="text-[13px] font-black text-green-700">{currency} {fmtNum(gp3Y)}</span>
          </div>

          <div className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Margin</span>
            <span className="text-[13px] font-black text-green-600">{fmtPct(margin)}</span>
          </div>

          {isAfrica && (
            <>
              <div className="h-px bg-slate-200 my-1" />
              {[
                { label: "SWO GP /Year 1", val: swoGpY1, cls: "text-purple-700" },
                { label: "SWO GP /Year 2", val: swoGpY2, cls: "text-purple-700" },
                { label: "SWO GP /Year 3", val: swoGpY3, cls: "text-purple-700" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{r.label}</span>
                  <span className={`text-[12px] font-black ${r.cls}`}>{currency} {fmtNum(r.val)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 border border-purple-200 rounded-md bg-purple-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SWO GP /3Years</span>
                <span className="text-[13px] font-black text-purple-700">{currency} {fmtNum(swoGp3Y)}</span>
              </div>

              <div className="h-px bg-slate-200 my-1" />
              {[
                { label: "Partner GP /Year 1", val: partGpY1, cls: "text-orange-700" },
                { label: "Partner GP /Year 2", val: partGpY2, cls: "text-orange-700" },
                { label: "Partner GP /Year 3", val: partGpY3, cls: "text-orange-700" },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{r.label}</span>
                  <span className={`text-[12px] font-black ${r.cls}`}>{currency} {fmtNum(r.val)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 border border-orange-200 rounded-md bg-orange-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Partner GP /3Years</span>
                <span className="text-[13px] font-black text-orange-700">{currency} {fmtNum(partGp3Y)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}