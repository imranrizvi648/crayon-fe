import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";

export function SummaryFooter({ items, region }) {
  const isAfrica = region === "Africa";

  if (items.length === 0) return null;

  return (
    <>
      {/* --- Yearly Installment Row --- */}
      <TableRow className="bg-slate-50 border-t-2">
        <TableCell colSpan={11} className="py-2 text-right text-[11px] font-bold text-slate-700 uppercase">
          Yearly Installment:
        </TableCell>
        
        {/* Total Net & ERP (AED) */}
        <TableCell className="bg-[#dbeafe] text-center text-[10px] font-bold text-blue-800 border-x border-blue-200">
          AED 0.00
        </TableCell>
        <TableCell className="bg-[#dbeafe] text-center text-[10px] font-bold text-blue-800 border-r border-blue-200">
          AED 0.00
        </TableCell>

        {/* Placeholders for Calculated Columns */}
        <TableCell colSpan={2}></TableCell> 
        <TableCell className="bg-[#c6f6d5] text-center text-[11px] font-bold text-green-800 border-x border-green-300">
          -
        </TableCell>
        <TableCell colSpan={2}></TableCell>
        <TableCell className="bg-[#fefcbf] text-center text-[11px] font-bold text-yellow-700 border-x border-yellow-300">
          -
        </TableCell>
        
        {/* Africa Extra Cells (Zeroed out) */}
        {isAfrica && (
          <>
            <TableCell className="bg-purple-50 text-center text-[10px] font-bold text-purple-800 border-l">AED 0.00</TableCell>
            <TableCell className="bg-purple-100"></TableCell>
            <TableCell className="bg-purple-200 text-center text-[10px] font-bold text-purple-900 border-l">AED 0.00</TableCell>
            <TableCell className="bg-orange-50 text-center text-[10px] font-bold text-orange-800 border-l">AED 0.00</TableCell>
          </>
        )}
        <TableCell></TableCell>
      </TableRow>

      {/* --- Total Over 3 Years Row --- */}
      <TableRow className="bg-white border-t border-slate-200 shadow-sm">
        <TableCell colSpan={11} className="py-2 text-right text-[11px] font-black text-slate-900 uppercase italic">
          Total over 3 Years:
        </TableCell>

        <TableCell className="bg-[#bfdbfe] text-center text-[10px] font-black text-blue-900 border-x border-blue-300">
          AED 0.00
        </TableCell>
        <TableCell className="bg-[#bfdbfe] text-center text-[10px] font-black text-blue-900 border-r border-blue-300">
          AED 0.00
        </TableCell>

        <TableCell colSpan={2}></TableCell>
        <TableCell className="bg-[#9ae6b4] text-center text-[11px] font-black text-green-900 border-x border-green-400">
          -
        </TableCell>
        
        {isAfrica ? (
          <>
            <TableCell colSpan={2}></TableCell>
            <TableCell className="bg-purple-50 text-center text-[10px] font-black text-purple-900 border-l">AED 0.00</TableCell>
            <TableCell className="bg-purple-200 text-center text-[10px] font-black text-purple-900 border-l">AED 0.00</TableCell>
            <TableCell className="bg-orange-50 text-center text-[10px] font-black text-orange-900 border-l">AED 0.00</TableCell>
          </>
        ) : (
          <TableCell colSpan={4}></TableCell>
        )}
        <TableCell></TableCell>
      </TableRow>
    </>
  );
}