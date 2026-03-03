"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Eye, 
  Download, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Edit3,
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// Helper Skeleton Component for Rows
const TableRowSkeleton = () => (
  <TableRow className="border-b border-border/50">
    <TableCell className="py-5 pl-6"><div className="h-10 w-32 bg-muted animate-pulse rounded-lg" /></TableCell>
    <TableCell><div className="h-8 w-40 bg-muted animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-8 w-28 bg-muted animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-8 w-20 bg-muted animate-pulse rounded-md ml-auto" /></TableCell>
    <TableCell><div className="h-6 w-16 bg-muted animate-pulse rounded mx-auto" /></TableCell>
    <TableCell><div className="h-9 w-28 bg-muted animate-pulse rounded-lg mx-auto" /></TableCell>
  </TableRow>
);

export default function TeamSheetsTable({ sheets, isLoading, pagination, onPageChange }) {
  
  // Pagination Safety Check
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.total_pages || 1;

  // Agar loading nahi hai aur data bhi nahi hai
  if (!isLoading && (!sheets || sheets.length === 0)) {
    return (
      <div className="p-20 text-center text-muted-foreground italic border rounded-xl bg-card">
        No sheets found in the system.
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-card rounded-lg overflow-hidden shadow-md border border-border">
      <Table>
        <TableHeader className="bg-[#27455C]">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] pl-6 border-r border-white/5">Sheet Info</TableHead>
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] border-r border-white/5">Customer & Region</TableHead>
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] border-r border-white/5">Sales Rep</TableHead>
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] text-right border-r border-white/5">Total Value</TableHead>
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] text-center border-r border-white/5">Status</TableHead>
            <TableHead className="h-14 text-white font-bold text-[11px] uppercase tracking-[0.15em] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            // Show 5 skeleton rows while loading
            Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
          ) : (
            sheets.map((sheet) => (
              <TableRow key={sheet.id} className="group hover:bg-muted/30 transition-colors border-b border-border last:border-0">
                <TableCell className="py-5 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#FF370F]/10 text-[#FF370F] group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground uppercase tracking-tighter">#{sheet.sheet_number}</p>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1 font-medium">
                        <Calendar size={10} />
                        {sheet.created_at ? new Date(sheet.created_at).toLocaleDateString('en-GB') : 'N/A'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-semibold text-sm text-foreground">{sheet.customer_name}</p>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-wide opacity-70 mt-0.5">{sheet.sales_region}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-[11px] font-black border border-secondary/5">
                      {sheet.sales_user_name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{sheet.sales_user_name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className="font-bold text-sm text-foreground">${new Intl.NumberFormat().format(sheet.total_eup || 0)}</p>
                  <p className="text-[9px] font-bold text-[#FF370F] uppercase tracking-widest mt-0.5">{sheet.currency_code}</p>
                </TableCell>
                <TableCell className="text-center">
                  <StatusBadge status={sheet.status} />
                </TableCell>
                <TableCell className="pr-6">
                  <div className="flex items-center justify-center gap-2">
                    <Link href={`/team-sheets/preview/${sheet.id}`}> 
                      <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground border bg-white shadow-sm"><Eye size={15} /></Button>
                    </Link>
                     
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
        <div className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center gap-2">
          {isLoading ? (
            <div className="h-4 w-32 bg-muted animate-pulse rounded" />
          ) : (
            <>
              <span className="w-2 h-2 bg-[#FF370F] rounded-full animate-pulse" />
              {pagination?.total || 0} Records Found | Page {currentPage} of {totalPages}
            </>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm" 
            className="h-9 text-[10px] font-black uppercase"
            disabled={isLoading || currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft size={14} className="mr-1" /> Prev
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="h-9 text-[10px] font-black uppercase"
            disabled={isLoading || currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// StatusBadge logic same rahegi niche...
const StatusBadge = ({ status }) => {
  const styles = {
    APPROVED: "border-emerald-500/30 text-emerald-600 bg-emerald-50/50",
    DRAFT: "border-slate-500/30 text-slate-600 bg-slate-50/50",
    PENDING: "border-amber-500/30 text-amber-600 bg-amber-50/50",
    LOCKED: "border-blue-500/30 text-blue-600 bg-blue-50/50",
  };
  return (
    <Badge variant="outline" className={cn("px-3 py-1 font-black text-[9px] rounded tracking-tight", styles[status] || styles.DRAFT)}>
      {status}
    </Badge>
  );
};