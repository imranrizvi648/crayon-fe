"use client";
import React, { useState } from "react";
import { Info } from "lucide-react";

const fmtNum = (v) =>
  Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtPct = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;
const fmtAED = (v, cur = "AED") => `${cur} ${fmtNum(v)}`;

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

  const csum = sheet.summary?.costing || {};

  const totNet    = csum.total_net?.[yearKey]     || "0";
  const totErp    = csum.total_erp?.[yearKey]     || "0";
  const totEup    = csum.total_eup_yr?.[yearKey]  || "0";
  const totRebate = csum.rebate_amount?.[yearKey] || "0";
  const totGp     = csum.gp?.[yearKey]            || "0";
  const totSwoGp  = csum.swo_gp?.[yearKey]        || "0";
  const totPartGp = csum.partner_gp?.[yearKey]    || "0";

  const tot3Net    = csum.total_net?.["3y"]     || "0";
  const tot3Erp    = csum.total_erp?.["3y"]     || "0";
  const tot3Eup    = csum.total_eup_yr?.["3y"]  || "0";
  const tot3Rebate = csum.rebate_amount?.["3y"] || "0";
  const gp3Y       = csum.gp?.["3y"]            || "0";
  const swoGp3Y    = csum.swo_gp?.["3y"]        || "0";
  const partGp3Y   = csum.partner_gp?.["3y"]    || "0";

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

  const cols = [
    { key:"category",   label:"Category",        th:"bg-secondary", td:"",                                                    w:"min-w-[120px] sticky left-0 z-10",        tdExtra:"sticky left-0 z-10 bg-white" },
    { key:"part_no",    label:"Part Number",      th:"bg-secondary sticky left-[120px] z-20", td:"text-primary font-semibold", w:"min-w-[110px]",                           tdExtra:"sticky left-[120px] z-10 bg-white" },
    { key:"item_name",  label:"Item Name",        th:"bg-secondary sticky left-[230px] z-20", td:"max-w-[180px] truncate",    w:"min-w-[180px] text-left",                 tdExtra:"sticky left-[230px] z-10 bg-white" },
    { key:"unit_net",   label:"Unit Net USD",     th:"bg-secondary", td:"text-right",                                          w:"min-w-[90px]",                            tdExtra:"" },
    { key:"unit_erp",   label:"Unit ERP USD",     th:"bg-secondary", td:"text-right",                                          w:"min-w-[90px]",                            tdExtra:"" },
    { key:"def_mu",     label:"Default Markup %", th:"bg-secondary", td:"text-right text-muted-foreground",                 w:"min-w-[85px]",                            tdExtra:"" },
    { key:"ms_disc",    label:"MS Discount %",    th:"bg-secondary", td:"text-right",                                          w:"min-w-[80px]",                            tdExtra:"" },
    { key:"crayon_mu",  label:"Crayon Markup %",  th:"bg-secondary", td:"text-right",                                          w:"min-w-[90px]",                            tdExtra:"" },
    { key:"unit_type",  label:"Unit Type",        th:"bg-secondary", td:"text-center",                                         w:"min-w-[60px]",                            tdExtra:"" },
    { key:"disc_net",   label:"MS Disc Net",      th:"bg-secondary", td:"text-right text-secondary",                           w:"min-w-[85px]",                            tdExtra:"" },
    { key:"disc_erp",   label:"MS Disc ERP",      th:"bg-secondary", td:"text-right text-secondary",                           w:"min-w-[85px]",                            tdExtra:"" },
    { key:"total_net",  label:"Total Net",        th:"bg-secondary", td:"text-right font-bold bg-secondary/10",                w:"min-w-[130px]",                           tdExtra:"" },
    { key:"total_erp",  label:"Total ERP",        th:"bg-secondary", td:"text-right font-bold bg-secondary/10",                w:"min-w-[130px]",                           tdExtra:"" },
    { key:"qty",        label:"Qty",              th:"bg-secondary", td:"text-center font-bold bg-muted",                      w:"min-w-[60px]",                            tdExtra:"" },
    { key:"eup_unit",   label:"EUP",              th:"bg-secondary", td:"text-right text-secondary",                             w:"min-w-[80px]",                            tdExtra:"" },
    { key:"total_eup",  label:"Total EUP/Yr",     th:"bg-secondary", td:"text-right font-bold text-muted-foreground",     w:"min-w-[130px]",                           tdExtra:"" },
    { key:"actual_mu",  label:"Markup %",         th:"bg-secondary", td:"text-right text-muted-foreground",                 w:"min-w-[70px]",                            tdExtra:"" },
    { key:"rebate_pct", label:"Rebate %",         th:"bg-secondary", td:"text-right",                                          w:"min-w-[70px]",                            tdExtra:"" },
    { key:"rebate_amt", label:"Rebate",           th:"bg-secondary", td:"text-right text-foreground bg-muted",                 w:"min-w-[110px]",                           tdExtra:"" },
    ...(isAfrica ? [
      { key:"gp",         label:"GP",             th:"bg-secondary", td:"text-right text-foreground bg-muted/60",              w:"min-w-[110px]", tdExtra:"" },
      { key:"swo_pct",    label:"SWO GP %",       th:"bg-secondary", td:"text-right text-foreground",                         w:"min-w-[70px]",  tdExtra:"" },
      { key:"swo_gp",     label:"SWO GP",         th:"bg-secondary", td:"text-right text-foreground bg-muted/60",              w:"min-w-[110px]", tdExtra:"" },
      { key:"partner_gp", label:"Partner GP",     th:"bg-secondary", td:"text-right text-secondary",               w:"min-w-[110px]", tdExtra:"" },
    ] : []),
  ];

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
    total_net:  "bg-secondary/20 text-secondary font-bold",
    total_erp:  "bg-secondary/20 text-secondary font-bold",
    qty:        "bg-muted font-bold text-center",
    total_eup:  "bg-primary/10 text-primary font-bold",
    rebate_amt: "bg-muted text-foreground font-bold",
    gp:         "bg-muted text-foreground font-bold",
    swo_gp:     "bg-muted text-foreground font-bold",
    partner_gp: "bg-primary/10 text-primary font-bold",
  };

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
      <div className="bg-muted border-b border-border px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-secondary text-[11px] font-medium">
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
                    ? "bg-secondary text-secondary-foreground shadow"
                    : "bg-white text-muted-foreground border border-border hover:bg-muted"
                }`}>
                Year {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── MAIN TABLE ── */}
      <div className="overflow-x-auto relative">
        <table className="w-full border-collapse text-left"
          style={{ minWidth: isAfrica ? "2100px" : "1600px" }}>

          <thead className="sticky top-0 z-30">
            <tr>
              {cols.map(c => (
                <th key={c.key}
                  className={`${c.w} ${c.th} px-2 py-4 text-[11px] font-bold text-secondary-foreground
                    whitespace-nowrap border-r border-white/10 text-right first:text-left`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {items.map((item, idx) => {
              const row = getRow(item);
              return (
                <tr key={item.id || idx} className="hover:bg-muted/30 transition-colors text-[11px]">
                  {cols.map(c => (
                    <td key={c.key}
                      className={`${c.w} ${c.td} ${c.tdExtra || ""} px-2 py-2 border-r border-border whitespace-nowrap`}
                      title={c.key === "item_name" ? item.product_name : undefined}
                    >
                      {row[c.key]}
                    </td>
                  ))}
                </tr>
              );
            })}

            {/* Yearly Installment Row */}
            <tr className="bg-muted border-t-2 border-border text-[11px] font-bold">
              <td colSpan={netIdx}
                className="px-3 py-2 text-right text-muted-foreground uppercase text-[10px] tracking-widest whitespace-nowrap">
                Yearly Installment:
              </td>
              {cols.slice(netIdx).map(c => (
                <td key={c.key}
                  className={`px-2 py-2 border-r border-border whitespace-nowrap text-right ${totalsTdCls[c.key] || ""}`}
                >
                  {totalsMap[c.key] || ""}
                </td>
              ))}
            </tr>

            {/* Total over 3 Years Row */}
            <tr className="bg-secondary text-secondary-foreground text-[11px] font-bold">
              <td colSpan={netIdx}
                className="px-3 py-2 text-right uppercase text-[10px] tracking-widest whitespace-nowrap">
                Total over 3 Years:
              </td>
              {cols.slice(netIdx).map(c => (
                <td key={c.key}
                  className="px-2 py-2 border-r border-white/10 whitespace-nowrap text-right">
                  {v3[c.key] || ""}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── PROFIT SUMMARY FOOTER ── */}
      <div className="flex justify-end p-6 bg-muted border-t border-border">
        <div className="w-[320px] space-y-1.5">

          {[
            { label: "Profit /Year 1", val: gpY1 },
            { label: "Profit /Year 2", val: gpY2 },
            { label: "Profit /Year 3", val: gpY3 },
          ].map(r => (
            <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-border rounded-md bg-card">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{r.label}</span>
              <span className="text-[12px] font-black text-foreground">{currency} {fmtNum(r.val)}</span>
            </div>
          ))}

          <div className="flex justify-between items-center px-4 py-2 border border-primary/30 rounded-md bg-primary/5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Profit /3Years</span>
            <span className="text-[13px] font-black text-primary">{currency} {fmtNum(gp3Y)}</span>
          </div>

          <div className="flex justify-between items-center px-4 py-2 border border-border rounded-md bg-card">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Margin</span>
            <span className="text-[13px] font-bold text-secondary">{fmtPct(margin)}</span>
          </div>

          {isAfrica && (
            <>
              <div className="h-px bg-border my-1" />
              {[
                { label: "SWO GP /Year 1", val: swoGpY1 },
                { label: "SWO GP /Year 2", val: swoGpY2 },
                { label: "SWO GP /Year 3", val: swoGpY3 },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-border rounded-md bg-card">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{r.label}</span>
                  <span className="text-[12px] font-black text-foreground">{currency} {fmtNum(r.val)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 border border-secondary/30 rounded-md bg-secondary/10">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">SWO GP /3Years</span>
                <span className="text-[13px] font-black text-primary">{currency} {fmtNum(swoGp3Y)}</span>
              </div>

              <div className="h-px bg-border my-1" />
              {[
                { label: "Partner GP /Year 1", val: partGpY1 },
                { label: "Partner GP /Year 2", val: partGpY2 },
                { label: "Partner GP /Year 3", val: partGpY3 },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center px-4 py-2 border border-border rounded-md bg-card">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{r.label}</span>
                  <span className="text-[12px] font-black text-foreground">{currency} {fmtNum(r.val)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-2 border border-primary/30 rounded-md bg-primary/5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Partner GP /3Years</span>
                <span className="text-[13px] font-black text-primary">{currency} {fmtNum(partGp3Y)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}