"use client";
import React from "react";

export function MergedFinancialCards({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const cur  = sheet.currency_code || "AED";
  const csum = sheet.summary?.costing || {};
  const msum = sheet.summary?.merged  || {};

  const fmt = (val) =>
    Number(val || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const pct = (val) =>
    `${(Number(val || 0) * 100).toFixed(2)}%`;

  const Card = ({ title, value, subtitle, variant = "default" }) => {
    const styles = {
      default: "bg-[#F8FAFC] border-[#E2E8F0] text-slate-800",
      blue:    "bg-[#F0F7FF] border-[#BFDBFE] text-blue-700",
      green:   "bg-[#F0FDF4] border-[#BBF7D0] text-green-700",
    };
    return (
      <div className={`p-5 rounded-xl border flex flex-col gap-1 flex-1 shadow-sm ${styles[variant]}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{title}</span>
        <span className="text-[18px] font-black leading-none">
          {cur} {fmt(value)}
        </span>
        <span className="text-[10px] font-medium opacity-60 mt-1">{subtitle}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {/* summary.costing.total_net["3y"] */}
      <Card
        title="TOTAL NET (3 YEARS)"
        value={csum.total_net?.["3y"]}
        subtitle="Cost Price"
      />

      {/* summary.costing.total_erp["3y"] */}
      <Card
        title="TOTAL ERP (3 YEARS)"
        value={csum.total_erp?.["3y"]}
        subtitle="Retail Price"
        variant="blue"
      />

      {/* summary.costing.total_eup_yr["3y"] */}
      <Card
        title="TOTAL EUP (3 YEARS)"
        value={csum.total_eup_yr?.["3y"]}
        subtitle="Without Discount"
        variant="blue"
      />

      {/* summary.merged.gp_without_rebates_crayon_gp.crayon_gp["3y"] */}
      <Card
        title="GP WITHOUT REBATES"
        value={msum.gp_without_rebates_crayon_gp?.crayon_gp?.["3y"]}
        subtitle={`Markup: ${pct(msum.gp_without_rebates_crayon_gp?.markup_crayon_gp)}`}
        variant="green"
      />
    </div>
  );
}