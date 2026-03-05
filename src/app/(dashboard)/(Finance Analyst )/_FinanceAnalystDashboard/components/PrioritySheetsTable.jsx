"use client";
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const RowSkeleton = () => (
  <TableRow className="border-b">
    <TableCell className="py-3"><div className="h-8 w-32 bg-slate-100 animate-pulse rounded" /></TableCell>
    <TableCell><div className="h-4 w-24 bg-slate-100 animate-pulse rounded" /></TableCell>
    <TableCell><div className="h-6 w-32 bg-slate-100 animate-pulse rounded" /></TableCell>
    <TableCell><div className="h-8 w-20 bg-slate-100 animate-pulse rounded ml-auto" /></TableCell>
    <TableCell><div className="h-5 w-16 bg-slate-100 animate-pulse rounded mx-auto" /></TableCell>
    <TableCell><div className="h-8 w-8 bg-slate-100 animate-pulse rounded-full mx-auto" /></TableCell>
  </TableRow>
);

export function PrioritySheetsTable({ data = [], loading, onView }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
      <Table className="text-xs">
        <TableHeader className="bg-slate-50 border-b">
          <TableRow className="h-10">
            <TableHead className="font-bold text-slate-700 uppercase px-4">Sheet Info</TableHead>
            <TableHead className="font-bold text-slate-700 uppercase">Customer</TableHead>
            <TableHead className="font-bold text-slate-700 uppercase">Next Step</TableHead>
            <TableHead className="font-bold text-slate-700 uppercase text-right">Value (USD)</TableHead>
            <TableHead className="font-bold text-slate-700 uppercase text-cente px-4">Status</TableHead>
            {/* <TableHead className="font-bold text-slate-700 uppercase text-center px-4 w-[60px]">Action</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-20 text-center text-slate-400 font-medium italic">
                No high priority sheets found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={item.sheet_id} className="hover:bg-slate-50/80 transition-colors group h-14">
                {/* Sheet Info */}
                <TableCell className="px-4">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-slate-800 text-[13px]">{item.sheet_number}</span>
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px] uppercase">
                      {item.sheet_name}
                    </span>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell className="max-w-[180px] truncate">
                  <span className="font-semibold text-slate-700 tracking-tight">{item.customer_name}</span>
                </TableCell>

                {/* Next Step/Approver */}
                <TableCell>
                  <div className="flex items-center gap-1.5 text-[10px] text-secondary font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded shadow-sm w-fit uppercase">
                    <ShieldCheck className="h-3 w-3" />
                    {item.next_approval}
                  </div>
                </TableCell>

                {/* Value */}
                <TableCell className="text-right">
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-slate-800 text-sm">
                      ${item.usd_value?.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                      {item.currency_code} {item.sheet_value?.toLocaleString()}
                    </span>
                  </div>
                </TableCell>

                {/* Status Badge */}
                <TableCell className="text-center">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider",
                    item.status === "UNDER_REVIEW" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                  )}>
                    {item.status?.replace(/_/g, " ")}
                  </span>
                </TableCell>

                {/* Action
                <TableCell className="text-center px-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => onView(item.sheet_id)}
                    className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all group-hover:scale-110"
                  >
                    <Eye className="h-4.5 w-4.5" />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default PrioritySheetsTable; // Default export added to fix build error