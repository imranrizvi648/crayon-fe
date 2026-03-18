"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, MapPin, Building2, ChevronLeft, ChevronRight } from "lucide-react";

const TableRowSkeleton = () => (
  <TableRow className="animate-pulse">
    <TableCell className="w-20 pl-6"><Skeleton className="h-12 w-12 rounded-2xl" /></TableCell>
    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
    <TableCell className="text-right pr-6"><Skeleton className="h-6 w-16 rounded-full ml-auto" /></TableCell>
  </TableRow>
);

export function CustomerTable({ items, loading, pagination, onPageChange }) {
  // Use page_size if limit isn't provided to avoid NaN errors
  const limit = pagination.limit || pagination.page_size || 20;
  const totalPages = Math.ceil(pagination.total / limit) || 1;

  const renderRows = () => {
    if (loading) return Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />);
    
    if (!items || items.length === 0) return (
      <TableRow>
        <TableCell colSpan={6} className="p-20 text-center text-muted-foreground italic border rounded-xl">
          No customers found.
        </TableCell>
      </TableRow>
    );

    return items.map((customer) => (
      <TableRow key={customer.id} className="group hover:bg-slate-50 transition-all border-b border-border last:border-0">
        <TableCell className="w-20 pl-6">
          <div className="bg-secondary/10 text-secondary p-3 rounded-2xl flex justify-center transition-all group-hover:scale-105 group-hover:bg-secondary group-hover:text-white">
            <User size={20} />
          </div>
        </TableCell>

        <TableCell className="py-5">
          <div className="font-bold text-foreground text-[13px]">{customer.name}</div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2 text-[12px] text-foreground font-semibold">
            <Building2 size={14} className="text-slate-400" />
            {customer.customer_code}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2 text-[12px] text-foreground font-semibold">
            <MapPin size={14} className="text-slate-400" />
            {customer.region}, {customer.country}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex flex-col justify-center gap-1">
            <div className="text-[12px] font-bold text-foreground">
              Currency: <span className="text-slate-600 font-bold text-[11px] ml-1">{customer.currency_code || "USD"}</span>
            </div>
            <div className="text-[12px] font-bold text-foreground leading-none">
              Size: <span className="text-slate-600 font-bold text-[11px] ml-1">{customer.company_size}</span>
            </div>
          </div>
        </TableCell>

        <TableCell className="text-right pr-6">
          <Badge variant="outline" className={`capitalize font-semibold px-3 py-1 rounded-full text-[9px] tracking-tight ${
            customer.is_active
              ? 'border-emerald-500/30 text-emerald-700 bg-emerald-50'
              : 'border-destructive/30 text-destructive bg-destructive/5'
          }`}>
            {customer.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="flex flex-col bg-background rounded-lg shadow-2xl shadow-secondary/5 border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary border-b border-border">
          <TableRow className="hover:bg-secondary border-none">
            <TableHead className="text-white font-semibold text-[15px] pl-6 h-14 tracking-wide w-20">Ref</TableHead>
            <TableHead className="text-white font-semibold text-[15px] h-14 tracking-wide">Customer Name</TableHead>
            <TableHead className="text-white font-semibold text-[15px] h-14 tracking-wide">Code</TableHead>
            <TableHead className="text-white font-semibold text-[15px] h-14 tracking-wide">Location</TableHead>
            <TableHead className="text-white font-semibold text-[15px] h-14 tracking-wide">Account Info</TableHead>
            <TableHead className="text-white font-semibold text-[15px] text-right pr-6 h-14 tracking-wide">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderRows()}</TableBody>
      </Table>

      <div className="flex items-center justify-between px-6 py-5 border-t border-border bg-slate-50/50">
        <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
          {loading ? <Skeleton className="h-3 w-32" /> : <>{pagination.total} Records Found</>}
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-secondary hover:text-white rounded-md"
            disabled={pagination.page <= 1 || loading}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={16} className="mr-1" /> Previous
          </Button>
          <Button 
            variant="outline" size="sm" className="h-9 px-4 text-[10px] font-bold uppercase border-slate-200 text-slate-600 hover:bg-secondary hover:text-white rounded-md"
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