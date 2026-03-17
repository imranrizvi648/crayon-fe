"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this is installed via shadcn
import { FileText, ChevronRight, ChevronLeft, Calendar, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

// --- SKELETON ROW COMPONENT ---
const SkeletonRow = () => (
  <TableRow>
    <TableCell className="w-16 pl-6">
      <Skeleton className="h-8 w-8 rounded-lg" />
    </TableCell>
    <TableCell className="py-4">
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-3 w-32" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-16" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-20 mb-1" />
      <Skeleton className="h-3 w-12" />
    </TableCell>
    <TableCell className="text-right pr-6">
      <Skeleton className="h-6 w-20 rounded-full ml-auto" />
    </TableCell>
  </TableRow>
);

export default function RecentSheets({ sheets, pagination, onPageChange, isLoading }) {
  const { page = 1, total = 0, limit = 6 } = pagination || {};
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status) => {
    const variants = {
      approved: "border-emerald-500 text-emerald-600 bg-emerald-50",
      submitted: "border-secondary/50 text-secondary bg-secondary/5",
      pending: "border-amber-500 text-amber-600 bg-amber-50",
      draft: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
      locked: "border-gray-500 text-gray-600 bg-gray-50",
      underreview: "border-blue-500 text-blue-600 bg-blue-50",
      rejected: "border-primary/50 text-primary bg-primary/5",
    };

    return (
      <Badge variant="outline" className={cn(
        "capitalize font-semibold px-3 py-0.5 rounded-full text-[10px]",
        variants[status] || "border-muted-foreground"
      )}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card className="h-full shadow-2xl shadow-secondary/5 overflow-hidden flex flex-col min-h-125 bg-card border-border rounded-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b py-4 px-6 shrink-0 bg-background">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground tracking-wider">
          <FileText className="text-primary" size={18} /> 
          <span>Recent Sheets</span>
        </CardTitle>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
            {page} / {totalPages}
          </span>
          <div className="flex gap-1">
            <Button 
              variant="outline" size="icon" className="h-7 w-7 rounded-md hover:border-primary hover:text-primary transition-all"
              disabled={page <= 1 || isLoading}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={14} />
            </Button>
            <Button 
              variant="outline" size="icon" className="h-7 w-7 rounded-md hover:border-primary hover:text-primary transition-all"
              disabled={page >= totalPages || isLoading}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <div className="flex-1 relative bg-background overflow-x-auto">
        <Table>
          <TableHeader className="bg-secondary/5 border-b">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-6 h-10 w-16">Ref</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest h-10">Client Details</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest h-10">Amount</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest h-10">Date</TableHead>
              <TableHead className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest h-10 text-right pr-6">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              /* Render Skeletons when loading */
              Array.from({ length: limit }).map((_, i) => <SkeletonRow key={i} />)
            ) : sheets?.length > 0 ? (
              sheets.map((sheet) => (
                <TableRow key={sheet.id} className="hover:bg-muted/30 border-b border-border transition-colors group">
                  <TableCell className="w-16 pl-6">
                    <div className="bg-secondary/10 p-2 rounded-lg flex justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:scale-110">
                      <FileText size={16} />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="font-bold text-foreground text-[13px] tracking-tight truncate max-w-[150px] uppercase">
                      {sheet.sheet_number || sheet.id}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-semibold truncate max-w-[150px]">
                      {sheet.client}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-[12px] font-bold text-foreground">
                      <CircleDollarSign size={13} className="text-muted-foreground" />
                      {sheet.amount}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground">
                        <Calendar size={12} />
                        {sheet.date}
                      </div>
                      <Badge className="bg-muted text-secondary border-none text-[8px] h-4 w-fit uppercase font-bold px-1.5 rounded-sm">
                        {sheet.tag}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    {getStatusBadge(sheet.status)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              /* Empty State */
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-xs italic">
                  No activity found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}