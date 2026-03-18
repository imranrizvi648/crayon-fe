"use client";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, ChevronLeft, ChevronRight, Eye,Pencil, Calendar, Download, CircleDollarSign } from "lucide-react";
import { useRouter } from "next/navigation";


// --- SKELETON ROW COMPONENT ---
const TableRowSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell className="w-206"><Skeleton className="h-10 w-10 rounded-xl" /></TableCell>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell className="text-right pr-6"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
  </TableRow>
);

export function SheetTable({ items, loading, onExport, pagination, onPageChange }) {
  const router = useRouter();
  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  const getStatusBadge = (status) => {
    const variants = {
      approved: "border-emerald-500/30 text-emerald-700 bg-emerald-50",
      submitted: "border-slate-300 text-slate-600 bg-slate-50",
      pending: "border-orange-500/30 text-orange-700 bg-orange-50",
      draft: "border-slate-200 text-slate-400 bg-slate-50",
    };
    return (
      <Badge variant="outline" className={`${variants[status] || "border-border"} capitalize font-semibold px-3 py-0.5 rounded-full text-[10px]`}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  const renderRows = () => {
    if (loading) return Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} />);
    if (!items || items.length === 0) return (
      <TableRow><TableCell colSpan={6} className="p-20 text-center text-muted-foreground italic">No sheets found.</TableCell></TableRow>
    );

    return items.map((sheet, index) => (
      <TableRow key={sheet.uuid || index} className="group transition-all hover:bg-slate-50 border-b border-border last:border-0">
        <TableCell className="w-20 pl-6">
          <div className="bg-slate-100 text-slate-400 p-3 rounded flex justify-center transition-all group-hover:bg-secondary group-hover:text-white group-hover:scale-105">
            <FileText size={20} />
          </div>
        </TableCell>

        <TableCell>
          <div className="font-semibold text-foreground text-sm tracking-tight uppercase">
            {sheet.sheet_number}
          </div>
          <div className="text-[9px] mt-1 uppercase font-bold text-slate-400 tracking-wider">
            {sheet.tag}
          </div>
        </TableCell>

        <TableCell>
          <div className="text-sm text-foreground font-semibold opacity-100">{sheet.client}</div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <CircleDollarSign size={14} className="text-slate-300" />
            {sheet.amount}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2 text-[12px] text-foreground font-semibold opacity-100">
            <Calendar size={12} className="text-slate-300" />
            {sheet.date}
          </div>
        </TableCell>

        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-4 ">
            {getStatusBadge(sheet.status)}
            <div className="flex items-center gap-1">
              <Link href={`/sheets/edit/${sheet.id}`}>
  <Button variant="ghost" size="icon" className="h-8 w-8 text-secondary/60 hover:text-secondary hover:bg-secondary/5">
    <Pencil size={16} />
  </Button>
</Link>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-foreground hover:bg-slate-100" 
                onClick={() => onExport(sheet.id, sheet.sheet_number)}
              >
                <Download size={16} />
              </Button>
              <Link href={`/sheets/preview/${sheet.id}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-foreground hover:bg-slate-100"
                >
                  <Eye size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    /* 1. Added rounded-lg and overflow-hidden here */
    <div className="flex flex-col bg-background rounded-md shadow-2xl shadow-secondary/5 border border-border overflow-hidden">
      <Table>
        {/* 2. Header will now respect the parent's rounding because of overflow-hidden */}
        <TableHeader className="bg-secondary border-b border-border">
          <TableRow className="hover:bg-secondary border-none">
            <TableHead className="text-white font-semibold text-[15px]  h-13 tracking-wide pl-6   w-20">Ref</TableHead>
            <TableHead className="text-white font-semibold text-[15px]  h-13 tracking-wide ">ID & Tag</TableHead>
            <TableHead className="text-white font-semibold text-[15px]  h-13 tracking-wide ">Client</TableHead>
            <TableHead className="text-white font-semibold text-[15px]  h-13 tracking-wide ">Amount</TableHead>
            <TableHead className="text-white font-semibold text-[15px] h-13 tracking-wide ">Issued Date</TableHead>
            <TableHead className="text-white font-semibold text-[15px]  h-13 tracking-wide text-right pr-6">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {renderRows()}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-6 py-5 border-t border-border bg-slate-50/50">
        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          Displaying: <span className="text-foreground ml-1">{((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-secondary hover:text-white transition-all shadow-sm rounded-md" 
            disabled={pagination.page <= 1 || loading} 
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9 px-4 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-secondary hover:text-white transition-all shadow-sm rounded-md" 
            disabled={pagination.page >= totalPages || loading} 
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}