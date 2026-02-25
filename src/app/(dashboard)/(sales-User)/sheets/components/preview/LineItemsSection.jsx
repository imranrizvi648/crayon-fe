import { Info } from "lucide-react";

export function LineItemsSection({ sheet }) {
  return (
    <div className="space-y-0">
      <div className="bg-[#EFF6FF] border-b border-[#DBEAFE] px-6 py-2.5 flex items-center gap-2 text-[#2563EB] text-[11px] font-medium">
        <Info size={14} />
        <span>Tip: Copy rows from Excel and paste into the Part Number field to auto-populate.</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[1400px]">
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr className="text-[10px] font-bold text-[#64748B] uppercase tracking-tight">
              <th className="px-4 py-3 border-r">Category</th>
              <th className="px-4 py-3 border-r bg-[#F0FDF4]">Part Number</th>
              <th className="px-4 py-3 border-r">Item Name</th>
              <th className="px-4 py-3 text-right border-r">Unit Net USD</th>
              <th className="px-4 py-3 text-right border-r">Unit ERP USD</th>
              <th className="px-4 py-3 text-right border-r">Default Markup %</th>
              <th className="px-4 py-3 text-right border-r">MS Disc %</th>
              <th className="px-4 py-3 text-right border-r">Crayon Markup %</th>
              <th className="px-4 py-3 text-center border-r">Unit Type</th>
              <th className="px-4 py-3 text-right border-r font-semibold text-blue-600">MS Disc Net</th>
              <th className="px-4 py-3 text-right border-r font-semibold text-blue-600">Total Net</th>
              <th className="px-4 py-3 text-center border-r">Qty</th>
              <th className="px-4 py-3 text-right bg-[#F0FDF4] font-black text-green-700">Total EUP/Yr</th>
              <th className="px-4 py-3 text-right">Markup %</th>
            </tr>
          </thead>
          <tbody className="text-[11px] text-[#1E293B]">
            {sheet.line_items?.map((item, idx) => (
              <tr key={item.id || idx} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                <td className="px-4 py-2 border-r">{item.product_type}</td>
                <td className="px-4 py-2 border-r text-blue-600 font-semibold">{item.part_number}</td>
                <td className="px-4 py-2 border-r max-w-[200px] truncate">{item.product_name}</td>
                <td className="px-4 py-2 text-right border-r">{item.unit_net_usd_y1}</td>
                <td className="px-4 py-2 text-right border-r">{item.unit_erp_usd_y1}</td>
                <td className="px-4 py-2 text-right border-r">{item.calculated?.y1?.default_markup}%</td>
                <td className="px-4 py-2 text-right border-r">{item.ms_discount_percentage_y1}%</td>
                <td className="px-4 py-2 text-right border-r">{item.markup_percentage_y1}%</td>
                <td className="px-4 py-2 text-center border-r">{item.unit_type}</td>
                <td className="px-4 py-2 text-right border-r font-bold text-blue-500">2.94</td>
                <td className="px-4 py-2 text-right border-r font-bold">AED 0.00</td>
                <td className="px-4 py-2 text-center border-r font-bold">{item.quantity_y1}</td>
                <td className="px-4 py-2 text-right bg-[#F0FDF4] font-black text-green-700">AED {item.calculated?.y1?.total_eup || '0.00'}</td>
                <td className="px-4 py-2 text-right font-semibold">20.07%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end p-6 bg-[#F8FAFC]/50">
        <div className="w-[320px] space-y-2">
          <div className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profit /Year</span>
            <span className="text-[12px] font-black text-green-600">AED {sheet.summary?.gross_profit_y1 || '0.00'}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-white">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profit /3Years</span>
            <span className="text-[12px] font-black text-green-600">AED {sheet.summary?.gross_profit_3y || '0.00'}</span>
          </div>
          <div className="flex justify-between items-center px-4 py-2 border border-[#E2E8F0] rounded-md bg-green-50/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Margin</span>
            <span className="text-[12px] font-black text-green-600">{sheet.summary?.margin_percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}