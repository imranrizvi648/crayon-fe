import React from 'react';

export function MergedSummarySection({ sheet }) {
  if (!sheet) return null;

  const SummaryItem = ({ label, value }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-slate-500 font-medium">{label}</span>
      <span className="text-[12px] font-bold text-slate-800">{value || "---"}</span>
    </div>
  );

  return (
    <div className="w-full bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden mt-2">
      {/* Header Bar - Dark Teal Background */}
      <div className="bg-secondary px-6 py-2">
        <h3 className="text-white text-[13px] font-bold">Customer & Agreement Summary</h3>
      </div>

      {/* Content Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-y-6 gap-x-12">
        {/* Column 1 */}
        <div className="space-y-6">
          <SummaryItem label="Customer Name:" value={sheet.customer?.name} />
          <SummaryItem label="New/Renewal:" value={sheet.new_or_renewal} />
          <div className="flex flex-col gap-1">
            <span className="text-[11px] text-slate-500 font-medium">Agreement Levels:</span>
            <span className="text-[12px] font-bold text-slate-800">
              Sys: {sheet.agreement_level_system} | Srv: {sheet.agreement_level_server} | App: {sheet.agreement_level_application}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-6">
          <SummaryItem label="Sales Location:" value={sheet.sales_location} />
          <SummaryItem label="Deal Type:" value={sheet.deal_type} />
        </div>

        {/* Column 3 */}
        <div className="space-y-6">
          <SummaryItem label="Account Manager:" value={`${sheet.sales_user?.first_name} ${sheet.sales_user?.last_name}`} />
          <SummaryItem label="Currency:" value={sheet.currency_code} />
        </div>

        {/* Column 4 */}
        <div className="space-y-6">
          <SummaryItem label="Agreement:" value={sheet.agreement_type} />
          <SummaryItem label="Exchange Rate:" value={sheet.exchange_rate} />
        </div>
      </div>
    </div>
  );
}