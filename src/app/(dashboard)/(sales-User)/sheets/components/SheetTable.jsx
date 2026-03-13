"use client";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ChevronLeft, ChevronRight, Eye, Calendar, Download } from "lucide-react";
import { useRouter } from "next/navigation";

// --- SKELETON ROW COMPONENT ---
const TableRowSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell className="w-[70px] pl-6">
      <div className="bg-slate-200 h-10 w-10 rounded-xl" />
    </TableCell>
    <TableCell className="py-4">
      <div className="h-4 bg-slate-200 rounded w-48 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-32 mb-2" />
      <div className="flex gap-2">
        <div className="h-3 bg-slate-50 rounded w-16" />
        <div className="h-3 bg-slate-50 rounded w-16" />
      </div>
    </TableCell>
    <TableCell className="text-right pr-6">
      <div className="flex items-center justify-end gap-4">
        <div className="h-6 bg-slate-100 rounded-full w-20" />
        <div className="h-8 bg-slate-100 rounded-lg w-20" />
      </div>
    </TableCell>
  </TableRow>
);

export function SheetTable({ items, loading, onEdit, onExport, onDelete, pagination, onPageChange }) {
  const router = useRouter();

  // Loading state handling: Agar loading hai to 10 skeletons dikhao
  const renderRows = () => {
    if (loading) {
      return Array.from({ length: 10 }).map((_, i) => <TableRowSkeleton key={i} />);
    }

    if (!items || items.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={3} className="p-20 text-center text-muted-foreground italic">
            No sheets found.
          </TableCell>
        </TableRow>
      );
    }

    return items.map((sheet, index) => (
      <TableRow key={sheet.uuid || index} className="group transition-colors">
        <TableCell className="w-[70px] pl-6">
          <div className="bg-secondary/10 p-3 rounded-xl flex justify-center text-secondary transition-colors group-hover:bg-secondary group-hover:text-white">
            <FileText size={20} />
          </div>
        </TableCell>

        <TableCell className="py-4">
          <div className="font-bold text-foreground text-sm truncate max-w-[250px] tracking-tight uppercase">
            {sheet.sheet_number}
          </div>
          <div className="text-xs text-secondary font-semibold mb-1 opacity-90">{sheet.client}</div>
          
          <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground">
            <span className="text-foreground/80 font-black">{sheet.amount}</span>
            <span className="flex items-center gap-1">
              <Calendar size={10} className="text-secondary" /> {sheet.date}
            </span>
            <Badge className="bg-muted text-secondary border-none text-[9px] h-4 uppercase font-black px-1.5 rounded-sm">
              {sheet.tag}
            </Badge>
          </div>
        </TableCell>

        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-6">
            {getStatusBadge(sheet.status)}
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-secondary hover:secondary/70 hover:bg-blue-50"
                onClick={() => onExport(sheet.id, sheet.sheet_number)}
              >
                <Download size={16} />
              </Button>

              <Link href={`/sheets/preview/${sheet.id}`}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-secondary/60 hover:text-secondary hover:bg-secondary/5"
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

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  const getStatusBadge = (status) => {
    const variants = {
      approved: "border-green-500/50 text-green-600 bg-green-50/50",
      submitted: "border-secondary/50 text-secondary bg-secondary/10",
      pending: "border-orange-500/50 text-orange-600 bg-orange-50/50",
      draft: "border-muted-foreground/50 text-muted-foreground bg-muted",
    };
    
    return (
      <Badge variant="outline" className={`${variants[status] || "border-border"} capitalize font-bold px-3 py-0.5 rounded-full text-[10px]`}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col bg-background border overflow-hidden rounded">
      <Table>
        <TableBody>
          {renderRows()}
        </TableBody>
      </Table>

      {/* Pagination Footer - Always visible */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
        <div className="text-[10px] text-secondary font-black uppercase tracking-widest">
          {loading ? (
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
          ) : (
            <>Result: <span className="text-foreground">{((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span></>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            className="h-8 text-[10px] font-black uppercase border-secondary/20 text-secondary hover:bg-secondary hover:text-white transition-all"
            disabled={pagination.page <= 1 || loading}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={14} className="mr-1" /> Back
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className="h-8 text-[10px] font-black uppercase border-secondary/20 text-secondary hover:bg-secondary hover:text-white transition-all"
            disabled={pagination.page >= totalPages || loading}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}