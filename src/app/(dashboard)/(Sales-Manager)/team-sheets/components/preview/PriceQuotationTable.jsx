import React from 'react';

export function PriceQuotationTable({ sheet }) {
  if (!sheet) return null;

  const currency = sheet.currency_code || "AED";
  // Direct value from backend
  const vatRateLabel = sheet.vat_rate || "0.05";

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-500">
      
      {/* 1. Header Section */}
      <div className="bg-secondary p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight uppercase">Price Quotation</h2>
            <p className="text-[14px] font-bold opacity-90 mt-1">{sheet.customer?.name}</p>
            <p className="text-[12px] opacity-75">{sheet.agreement_type} | {currency} | VAT {vatRateLabel}</p>
          </div>
          <div className="text-right text-[12px] space-y-0.5 opacity-90">
            <p>Sheet ID: <span className="font-bold">{sheet.sheet_number}</span></p>
            <p>Exchange Rate: <span className="font-bold">{sheet.exchange_rate}</span></p>
            <p>Account Manager: <span className="font-bold">{sheet.sales_user?.first_name} {sheet.sales_user?.last_name}</span></p>
          </div>
        </div>
      </div>

      {/* 2. Table Section */}
      <div className="p-0 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-[#F0F7FF] text-[#2563EB] text-[11px] font-bold uppercase border-b border-[#BFDBFE]">
              <th colSpan="9" className="px-6 py-2">Enterprise Online Products</th>
            </tr>
            <tr className="bg-white border-b border-[#E2E8F0] text-[11px] font-bold text-slate-500 uppercase tracking-tight">
              <th className="px-6 py-3 border-r">Part Number</th>
              <th className="px-6 py-3 border-r">Item Name</th>
              <th className="px-6 py-3 border-r text-center">Qty</th>
              <th className="px-6 py-3 border-r text-center">Unit Type</th>
              <th className="px-6 py-3 border-r text-center">EUP</th>
              <th className="px-6 py-3 border-r text-right">Yr.1 Total</th>
              <th className="px-6 py-3 border-r text-right">Yr.2 Total</th>
              <th className="px-6 py-3 border-r text-right">Yr.3 Total</th>
              <th className="px-6 py-3 text-right bg-slate-50 font-black">Total Over 3 Years</th>
            </tr>
          </thead>
          <tbody className="text-[12px] text-slate-700">
            {sheet.line_items?.map((item, idx) => (
              <tr key={idx} className="border-b border-[#E2E8F0] hover:bg-slate-50/50">
                <td className="px-6 py-3 border-r font-medium">{item.part_number}</td>
                <td className="px-6 py-3 border-r max-w-[200px] truncate">{item.product_name}</td>
                <td className="px-6 py-3 border-r text-center">{item.quantity_y1}</td>
                <td className="px-6 py-3 border-r text-center">{item.unit_type}</td>
                <td className="px-6 py-3 border-r text-center font-mono font-bold">{item.calculated?.y1?.eup_unit}</td>
                <td className="px-6 py-3 border-r text-right font-mono">{currency} {item.calculated?.y1?.total_eup}</td>
                <td className="px-6 py-3 border-r text-right font-mono">{currency} {item.calculated?.y2?.total_eup}</td>
                <td className="px-6 py-3 border-r text-right font-mono">{currency} {item.calculated?.y3?.total_eup}</td>
                <td className="px-6 py-3 text-right font-mono font-black bg-slate-50 border-l">{currency} {item.calculated?.total_eup_3y}</td>
              </tr>
            ))}

            {/* Total Row (Green) */}
            <tr className="bg-[#F0FDF4] font-bold text-[#166534] border-t-2 border-[#BBF7D0]">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] tracking-wider">Total {currency}</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{currency} {sheet.summary?.total_eup_y1}</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{currency} {sheet.summary?.total_eup_y2}</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#BBF7D0]/50">{currency} {sheet.summary?.total_eup_y3}</td>
              <td className="px-6 py-2 text-right font-mono font-black bg-[#DCFCE7] border-l border-[#BBF7D0]">{currency} {sheet.summary?.total_eup_3y}</td>
            </tr>

            {/* Further Discount Row (Orange) */}
            <tr className="text-[#EA580C] bg-[#FFF7ED]">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px] font-bold italic">Further Discount from Crayon</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#FED7AA]/50">{currency} {sheet.discount_year_1}</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#FED7AA]/50">{currency} {sheet.discount_year_2}</td>
              <td className="px-6 py-2 text-right font-mono border-r border-[#FED7AA]/50">{currency} {sheet.discount_year_3}</td> 
              <td className="px-6 py-2 text-right font-mono font-black bg-[#FFEDD5] border-l border-[#FED7AA]">{currency} {sheet.summary?.total_rebate_3y}</td>
            </tr>

            {/* Total After Discount (Soft Blue) */}
            <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200">
              <td colSpan="5" className="px-6 py-2 text-right uppercase text-[11px]">Total after discount</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_y1}</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_y2}</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_y3}</td>
              <td className="px-6 py-2 text-right font-mono font-black bg-[#F0F7FF] text-blue-700 border-l border-blue-100">{currency} {sheet.summary?.total_eup_after_discount_3y}</td>
            </tr>

            {/* VAT Row */}
            <tr className="text-slate-500 italic">
              <td colSpan="5" className="px-6 py-2 text-right text-[11px] font-bold uppercase">VAT {vatRateLabel}</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_vat_y1 || "0.00"}</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_vat_y2 || "0.00"}</td>
              <td className="px-6 py-2 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_vat_y3 || "0.00"}</td>
              <td className="px-6 py-2 text-right font-mono font-black">{currency} {sheet.summary?.total_eup_after_discount_with_vat_3y}</td>
            </tr>

            {/* Grand Total Row (Secondary Color) */}
            <tr className="bg-secondary text-white font-black text-[14px]">
              <td colSpan="5" className="px-6 py-4 text-right uppercase tracking-widest">Grand Total with VAT {currency}</td>
              <td className="px-6 py-4 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_without_vat_y1}</td>
              <td className="px-6 py-4 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_without_vat_y2}</td>
              <td className="px-6 py-4 text-right font-mono">{currency} {sheet.summary?.total_eup_after_discount_with_without_vat_y3}</td>
              <td className="px-6 py-4 text-right font-mono text-[16px] bg-secondary border-l border-[#14B8A6]">{currency} {sheet.summary?.total_eup_after_discount_with_without_vat_3y}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 3. Footer Section */}
      <div className="p-6 bg-white border-t border-slate-100">
        <div className="text-[11px] text-slate-400 space-y-1 font-medium italic">
          <p>• All prices are in {currency} and subject to VAT</p>
          <p>• This quotation is valid for 30 days from the date of issue</p>
          <p>• Payment terms: As per agreement</p>
        </div>
      </div>
    </div>
  );
}