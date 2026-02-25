import React from 'react';

export function MergedFinancialCards({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const fmt = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val || 0);

  const Card = ({ title, value, subtitle, currency, variant = "default" }) => {
    const styles = {
      default: "bg-[#F8FAFC] border-[#E2E8F0] text-slate-800",
      blue: "bg-[#F0F7FF] border-[#BFDBFE] text-blue-700",
      green: "bg-[#F0FDF4] border-[#BBF7D0] text-green-700",
    };

    return (
      <div className={`p-5 rounded-xl border flex flex-col gap-1 flex-1 shadow-sm ${styles[variant]}`}>
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{title}</span>
        <span className="text-[18px] font-black leading-none">
          {currency} {fmt(value)}
        </span>
        <span className="text-[10px] font-medium opacity-60 mt-1">{subtitle}</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {/* Total Net Card */}
      <Card 
        title="TOTAL NET (3 YEARS)" 
        value={sheet.summary.total_net_3y} 
        subtitle="Cost" 
        currency={sheet.currency_code} 
      />

      {/* Total ERP Card */}
      <Card 
        title="TOTAL ERP (3 YEARS)" 
        value={sheet.summary.total_erp_3y} 
        subtitle="Retail" 
        currency={sheet.currency_code}
        variant="blue"
      />

      {/* Total EUP Card */}
      <Card 
        title="TOTAL EUP (3 YEARS)" 
        value={sheet.summary.total_eup_3y} 
        subtitle="Without Discount" 
        currency={sheet.currency_code}
        variant="blue"
      />

      {/* GP Card */}
      <Card 
        title="GP WITHOUT REBATES" 
        value={sheet.summary.gross_profit_3y} 
        subtitle={`Markup: ${sheet.summary.margin_percentage}%`} 
        currency={sheet.currency_code}
        variant="green"
      />
    </div>
  );
}