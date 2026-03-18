"use client";
import React from "react";

export function PriceQuotationTable({ sheet }) {
  if (!sheet) return null;

  const cur      = sheet.currency_code || "AED";
  const vatRate  = Number(sheet.vat_rate || 0.05);
  const vatLabel = `${(vatRate * 100).toFixed(0)}%`;
  const isRamped = sheet.deal_type === "RAMPED";

  const fpt      = sheet.summary?.final_price_table || {};
  const totals   = fpt.totals_aed                  || {};
  const discAED  = sheet.summary?.merged?.crayon_discount?.local_amount || {};
  const afterDisc= fpt.total_after_discount         || {};
  const vatAmt   = fpt.vat_5_percent                || {};
  const grandVat = fpt.grand_total_with_vat_aed     || {};

  const tableItems = fpt.line_items?.length
    ? fpt.line_items
    : (sheet.line_items || []);

  const useFpt = !!fpt.line_items?.length;

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ── SINGLE YEAR TABLE ────────────────────────────────────────────────────
  const YearTable = ({ yearNum, yearKey }) => {
    const yrTotalKey = `yr${yearNum}_total`;
    const calcKey    = `y${yearNum}`;

    return (
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-secondary text-secondary-foreground px-4 py-1.5 rounded font-bold text-[13px]">
            Year {yearNum}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-border" style={{ minWidth: "900px" }}>
            {/* Section header */}
            <thead>
              <tr className="bg-muted text-secondary text-[11px] font-bold uppercase border-b border-border">
                <th colSpan="6" className="px-6 py-2">Products — Year {yearNum}</th>
              </tr>
              <tr className="bg-white border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                <th className="px-4 py-3 border-r border-border">Part No.</th>
                <th className="px-4 py-3 border-r border-border">Item Name</th>
                <th className="px-4 py-3 border-r border-border text-center">Qty</th>
                <th className="px-4 py-3 border-r border-border text-center">Type</th>
                <th className="px-4 py-3 border-r border-border text-center">EUP Unit</th>
                <th className="px-4 py-3 text-right bg-muted font-black">Yr.{yearNum} Total</th>
              </tr>
            </thead>

            <tbody className="text-[12px] text-foreground">
              {tableItems.map((item, idx) => {
                const partNo  = item.part_number;
                const name    = useFpt ? item.item_name   : item.product_name;
                const qty     = useFpt ? item.qty         : item[`quantity_y${yearNum}`] ?? item.quantity_y1;
                const uType   = item.unit_type;
                const eupUnit = useFpt ? item.eup_unit    : item.calculated?.[calcKey]?.eup_unit;
                const yrTotal = useFpt ? item[yrTotalKey] : item.calculated?.[calcKey]?.total_eup;

                return (
                  <tr key={item.id || idx} className="border-b border-border hover:bg-muted/30">
                    <td className="px-4 py-3 border-r border-border font-semibold text-primary">{partNo}</td>
                    <td className="px-4 py-3 border-r border-border max-w-[220px] truncate" title={name}>{name}</td>
                    <td className="px-4 py-3 border-r border-border text-center">{Number(qty || 0).toLocaleString()}</td>
                    <td className="px-4 py-3 border-r border-border text-center">{uType}</td>
                    <td className="px-4 py-3 border-r border-border text-center font-mono font-bold">{fmt(eupUnit)}</td>
                    <td className="px-4 py-3 text-right font-mono font-black bg-muted/40 border-l border-border">{cur} {fmt(yrTotal)}</td>
                  </tr>
                );
              })}

              {/* Total */}
              <tr className="bg-secondary/10 font-bold text-secondary border-t-2 border-secondary/30">
                <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] tracking-wider">Total {cur}</td>
                <td className="px-4 py-2 text-right font-mono font-black bg-secondary/20 border-l border-secondary/30">
                  {cur} {fmt(totals[yearKey])}
                </td>
              </tr>

              {/* Discount */}
              <tr className="text-primary bg-primary/5">
                <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] font-bold italic">
                  Further Discount from Crayon
                </td>
                <td className="px-4 py-2 text-right font-mono font-black bg-primary/10 border-l border-primary/20">
                  {cur} {fmt(discAED[yearKey])}
                </td>
              </tr>

              {/* After Discount */}
              <tr className="bg-muted font-bold text-foreground border-t border-border">
                <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px]">Total after Discount</td>
                <td className="px-4 py-2 text-right font-mono font-black bg-secondary/10 text-secondary border-l border-border">
                  {cur} {fmt(afterDisc[yearKey])}
                </td>
              </tr>

              {/* VAT */}
              <tr className="text-muted-foreground italic border-t border-border">
                <td colSpan="5" className="px-6 py-2 text-right text-[11px] font-bold uppercase">VAT {vatLabel}</td>
                <td className="px-4 py-2 text-right font-mono font-bold border-l border-border">
                  {cur} {fmt(vatAmt[yearKey])}
                </td>
              </tr>

              {/* Grand Total */}
              <tr className="bg-secondary text-secondary-foreground font-bold text-[13px]">
                <td colSpan="5" className="px-6 py-4 text-right uppercase tracking-widest">
                  Grand Total with VAT {cur} — Year {yearNum}
                </td>
                <td className="px-4 py-4 text-right font-mono text-[14px] border-l border-white/20">
                  {cur} {fmt(grandVat[yearKey])}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-card rounded-xl shadow-lg overflow-hidden border border-border">

      {/* ── HEADER ── */}
      <div className="bg-secondary p-6 text-secondary-foreground">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Price Quotation</h2>
            <p className="text-[14px] font-bold opacity-90 mt-1">{sheet.customer?.name}</p>
            <p className="text-[12px] opacity-75">
              {sheet.agreement_type} · {cur} · VAT {vatLabel} · {sheet.deal_type}
              {isRamped && (
                <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px]">
                  3-Year Ramped
                </span>
              )}
            </p>
          </div>
          <div className="text-right text-[12px] space-y-0.5 opacity-90">
            <p>Sheet: <span className="font-bold">{sheet.sheet_number}</span></p>
            <p>Rate: <span className="font-bold">{sheet.exchange_rate}</span></p>
            <p>AM: <span className="font-bold">{sheet.sales_user?.first_name} {sheet.sales_user?.last_name}</span></p>
            <p>Region: <span className="font-bold">{sheet.sales_region}</span></p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {isRamped ? (
          <>
            {/* ── RAMPED: 3 alag year tables ── */}
            <YearTable yearNum={1} yearKey="y1" />
            <YearTable yearNum={2} yearKey="y2" />
            <YearTable yearNum={3} yearKey="y3" />

            {/* Grand Total Summary */}
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded font-bold text-[13px]">
                  Grand Total — Year 1 + Year 2 + Year 3
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse border border-border" style={{ minWidth: "900px" }}>
                  <tbody className="text-[12px]">
                    <tr className="bg-secondary/10 font-bold text-secondary border-t-2 border-secondary/30">
                      <td className="px-6 py-3 text-right uppercase text-[11px] tracking-wider w-[75%]">
                        Grand Total {cur} (Y1 + Y2 + Y3)
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-black bg-secondary/20 border-l border-secondary/30">
                        {cur} {fmt(totals["3y"])}
                      </td>
                    </tr>
                    <tr className="text-primary bg-primary/5">
                      <td className="px-6 py-2 text-right uppercase text-[11px] font-bold italic">
                        Further Discount from Crayon
                      </td>
                      <td className="px-4 py-2 text-right font-mono font-black bg-primary/10 border-l border-primary/20">
                        {cur} {fmt(discAED["3y"])}
                      </td>
                    </tr>
                    <tr className="bg-muted font-bold text-foreground border-t border-border">
                      <td className="px-6 py-2 text-right uppercase text-[11px]">Total after Discount</td>
                      <td className="px-4 py-2 text-right font-mono font-black bg-secondary/10 text-secondary border-l border-border">
                        {cur} {fmt(afterDisc["3y"])}
                      </td>
                    </tr>
                    <tr className="text-muted-foreground italic border-t border-border">
                      <td className="px-6 py-2 text-right text-[11px] font-bold uppercase">VAT {vatLabel}</td>
                      <td className="px-4 py-2 text-right font-mono font-bold border-l border-border">
                        {cur} {fmt(vatAmt["3y"])}
                      </td>
                    </tr>
                    <tr className="bg-secondary text-secondary-foreground font-bold text-[14px]">
                      <td className="px-6 py-4 text-right uppercase tracking-widest">
                        Grand Total with VAT {cur} (3 Years)
                      </td>
                      <td className="px-4 py-4 text-right font-mono text-[15px] border-l border-white/20">
                        {cur} {fmt(grandVat["3y"])}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          // ── NORMAL: Single table with Y1/Y2/Y3 columns ──
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-border" style={{ minWidth: "1100px" }}>
              <thead>
                <tr className="bg-muted text-secondary text-[11px] font-bold uppercase border-b border-border">
                  <th colSpan="9" className="px-6 py-2">Products</th>
                </tr>
                <tr className="bg-white border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
                  <th className="px-4 py-3 border-r border-border">Part No.</th>
                  <th className="px-4 py-3 border-r border-border">Item Name</th>
                  <th className="px-4 py-3 border-r border-border text-center">Qty</th>
                  <th className="px-4 py-3 border-r border-border text-center">Type</th>
                  <th className="px-4 py-3 border-r border-border text-center">EUP Unit</th>
                  <th className="px-4 py-3 border-r border-border text-right">Yr.1 Total</th>
                  <th className="px-4 py-3 border-r border-border text-right">Yr.2 Total</th>
                  <th className="px-4 py-3 border-r border-border text-right">Yr.3 Total</th>
                  <th className="px-4 py-3 text-right bg-muted font-black">Total (3Y)</th>
                </tr>
              </thead>
              <tbody className="text-[12px] text-foreground">
                {tableItems.map((item, idx) => {
                  const partNo  = item.part_number;
                  const name    = useFpt ? item.item_name  : item.product_name;
                  const qty     = useFpt ? item.qty        : item.quantity_y1;
                  const uType   = item.unit_type;
                  const eupUnit = useFpt ? item.eup_unit   : item.calculated?.y1?.eup_unit;
                  const yr1     = useFpt ? item.yr1_total  : item.calculated?.y1?.total_eup;
                  const yr2     = useFpt ? item.yr2_total  : item.calculated?.y2?.total_eup;
                  const yr3     = useFpt ? item.yr3_total  : item.calculated?.y3?.total_eup;
                  const tot3y   = useFpt ? item.total_3y   : item.calculated?.total_eup_3y;

                  return (
                    <tr key={item.id || idx} className="border-b border-border hover:bg-muted/30">
                      <td className="px-4 py-3 border-r border-border font-semibold text-primary">{partNo}</td>
                      <td className="px-4 py-3 border-r border-border max-w-[200px] truncate" title={name}>{name}</td>
                      <td className="px-4 py-3 border-r border-border text-center">{Number(qty || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 border-r border-border text-center">{uType}</td>
                      <td className="px-4 py-3 border-r border-border text-center font-mono font-bold">{fmt(eupUnit)}</td>
                      <td className="px-4 py-3 border-r border-border text-right font-mono">{cur} {fmt(yr1)}</td>
                      <td className="px-4 py-3 border-r border-border text-right font-mono">{cur} {fmt(yr2)}</td>
                      <td className="px-4 py-3 border-r border-border text-right font-mono">{cur} {fmt(yr3)}</td>
                      <td className="px-4 py-3 text-right font-mono font-black bg-muted/40 border-l border-border">{cur} {fmt(tot3y)}</td>
                    </tr>
                  );
                })}

                {/* Total */}
                <tr className="bg-secondary/10 font-bold text-secondary border-t-2 border-secondary/30">
                  <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] tracking-wider">Total {cur}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-secondary/20">{cur} {fmt(totals.y1)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-secondary/20">{cur} {fmt(totals.y2)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-secondary/20">{cur} {fmt(totals.y3)}</td>
                  <td className="px-4 py-2 text-right font-mono font-black bg-secondary/20 border-l border-secondary/30">{cur} {fmt(totals["3y"])}</td>
                </tr>

                {/* Discount */}
                <tr className="text-primary bg-primary/5">
                  <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] font-bold italic">Further Discount from Crayon</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-primary/20">{cur} {fmt(discAED.y1)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-primary/20">{cur} {fmt(discAED.y2)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-primary/20">{cur} {fmt(discAED.y3)}</td>
                  <td className="px-4 py-2 text-right font-mono font-black bg-primary/10 border-l border-primary/20">{cur} {fmt(discAED["3y"])}</td>
                </tr>

                {/* After Discount */}
                <tr className="bg-muted font-bold text-foreground border-t border-border">
                  <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px]">Total after Discount</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(afterDisc.y1)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(afterDisc.y2)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(afterDisc.y3)}</td>
                  <td className="px-4 py-2 text-right font-mono font-black bg-secondary/10 text-secondary border-l border-border">{cur} {fmt(afterDisc["3y"])}</td>
                </tr>

                {/* VAT */}
                <tr className="text-muted-foreground italic border-t border-border">
                  <td colSpan="5" className="px-6 py-2 text-right text-[11px] font-bold uppercase">VAT {vatLabel}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(vatAmt.y1)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(vatAmt.y2)}</td>
                  <td className="px-4 py-2 text-right font-mono border-r border-border">{cur} {fmt(vatAmt.y3)}</td>
                  <td className="px-4 py-2 text-right font-mono font-bold">{cur} {fmt(vatAmt["3y"])}</td>
                </tr>

                {/* Grand Total */}
                <tr className="bg-secondary text-secondary-foreground font-bold text-[14px]">
                  <td colSpan="5" className="px-6 py-4 text-right uppercase tracking-widest">Grand Total with VAT {cur}</td>
                  <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y1)}</td>
                  <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y2)}</td>
                  <td className="px-4 py-4 text-right font-mono border-r border-white/10">{cur} {fmt(grandVat.y3)}</td>
                  <td className="px-4 py-4 text-right font-mono text-[15px] bg-secondary border-l border-white/20">{cur} {fmt(grandVat["3y"])}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      <div className="px-6 py-4 bg-muted border-t border-border flex flex-wrap justify-between gap-4">
        <div className="text-[11px] text-muted-foreground space-y-1 font-medium italic">
          <p>• All prices are in {cur} and subject to VAT</p>
          <p>• This quotation is valid for 30 days from the date of issue</p>
          <p>• Payment terms: As per agreement</p>
          {isRamped && <p>• This is a Ramped Deal with different pricing per year</p>}
        </div>
        <div className="text-right text-[11px] text-muted-foreground space-y-1">
          <p>Opportunity: <span className="font-bold text-foreground">{sheet.opportunity_id}</span></p>
          <p>Version: <span className="font-bold text-foreground">{sheet.version}</span></p>
          <p>Status: <span className="font-bold text-foreground">{sheet.status}</span></p>
        </div>
      </div>
    </div>
  );
}