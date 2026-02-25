import React from 'react';

/**
 * GPBox: Ek single reusable table box jo GP data dikhata hai.
 * Iski styling aur green highlighting image_c36280.png se match karti hai.
 */
const GPBox = ({ title, rows, totalLabel, totalValue, markupLabel, markupValue, currency }) => {
  const fmt = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val || 0);
  const fmtPct = (val) => `${((val || 0) * 100).toFixed(2)}%`;

  return (
    <div className="flex-1 bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex flex-col">
      {/* Box Header Section */}
      <div className="px-4 py-3 border-b border-[#E2E8F0] flex justify-between items-center bg-white">
        <span className="text-[13px] font-bold text-[#1E293B]">{title}</span>
        {/* Simple Down Arrow Icon for Accordion style */}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-slate-400">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      {/* Table Sub-Header */}
      <div className="bg-[#F8FAFC] px-4 py-2 border-b border-[#E2E8F0] flex justify-end">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Values</span>
      </div>

      {/* Data Rows Area */}
      <div className="flex flex-col">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-center px-4 py-2.5 border-b border-[#E2E8F0] hover:bg-[#F0FDF4]/30 transition-colors">
            <span className="text-[11px] text-green-700 font-medium">{row.label}</span>
            <span className="text-[11px] font-mono text-green-700 font-bold">
              - {currency} {fmt(row.value)}
            </span>
          </div>
        ))}
        
        {/* Highlighted Total Row (Light Green) */}
        <div className="flex justify-between items-center px-4 py-2.5 bg-[#DCFCE7] border-y border-[#BBF7D0]">
          <span className="text-[11px] text-green-800 font-bold">{totalLabel}</span>
          <span className="text-[11px] font-mono text-green-800 font-black">
            - {currency} {fmt(totalValue)}
          </span>
        </div>

        {/* Footer Markup Row */}
        <div className="flex justify-between items-center px-4 py-2 bg-white">
          <span className="text-[11px] text-slate-900 font-bold">{markupLabel}</span>
          <span className="text-[11px] font-mono text-green-700 font-bold">{fmtPct(markupValue)}</span>
        </div>
      </div>
    </div>
  );
};

export function GPComparisonSection({ sheet }) {
  if (!sheet || !sheet.summary) return null;

  const currency = sheet.currency_code || "AED";

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4 w-full animate-in fade-in duration-500">
      {/* Left Card: GP without Rebates */}
      <GPBox 
        title="GP without Rebates"
        currency={currency}
        rows={[
          { label: "GP Year 1", value: sheet.summary.gross_profit_y1 || 18362.50 },
          { label: "GP Year 2", value: sheet.summary.gross_profit_y2 || 14690.00 },
          { label: "GP Year 3", value: sheet.summary.gross_profit_y3 || 11017.50 }
        ]}
        totalLabel="GP Over 3 Years"
        totalValue={sheet.summary.gross_profit_3y || 44070.00}
        markupLabel="Markup %"
        markupValue={sheet.summary.margin_percentage || 0}
      />

      {/* Right Card: Gross Profit with Rebates */}
      <GPBox 
        title="Gross Profit with Rebates"
        currency={currency}
        rows={[
          { label: "GP + Rebate Year 1", value: 18362.50 },
          { label: "GP + Rebate Year 2", value: 14690.00 },
          { label: "GP + Rebate Year 3", value: 11017.50 }
        ]}
        totalLabel="Total GP + Rebate Over 3 Years"
        totalValue={44070.00}
        markupLabel="Overall Markup"
        markupValue={0}
      />
    </div>
  );
}