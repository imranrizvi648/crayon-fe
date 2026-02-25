"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Building2, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";

export function CustomerTable({ items, loading, pagination, onPageChange }) {
  if (loading) return (
    <div className="p-10 text-center animate-pulse font-bold text-secondary italic">
      Loading customers...
    </div>
  );
  
  if (!items?.length) return (
    <div className="p-10 text-center text-muted-foreground italic border rounded-xl">
      No customers found.
    </div>
  );

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <div className="flex flex-col bg-background border  overflow-hidden">
      <Table>
        <TableBody>
          {items.map((customer) => (
            <TableRow key={customer.id} className="group hover:bg-muted/20 transition-colors border-b border-border last:border-0">
              {/* Avatar Section - Using Secondary/Primary based on Partner status */}
              <TableCell className="w-[80px] pl-6">
                <div className={`p-3 rounded-2xl flex justify-center transition-all group-hover:scale-105 ${
                  customer.is_partner 
                    ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5' 
                    : 'bg-secondary/10 text-secondary'
                }`}>
                  <User size={20} />
                </div>
              </TableCell>

              {/* Customer Info Section */}
              <TableCell className="py-5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground text-sm tracking-tight ">
                    {customer.name}
                  </span>
                  {customer.is_partner && (
                    <Badge className="bg-primary text-white border-none text-[8px] h-4 uppercase font-black px-2 rounded-sm tracking-widest">
                      Partner
                    </Badge>
                  )}
                </div>
                <div className="text-[11px] text-secondary font-semibold flex items-center gap-3 mt-1.5 opacity-80">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} className="text-secondary/60" /> {customer.customer_code}
                  </span>
                  <span className="flex items-center gap-1 border-l border-border pl-3">
                    <MapPin size={12} className="text-secondary/60" /> {customer.region} ({customer.country})
                  </span>
                </div>
              </TableCell>

              {/* Business Stats Section */}
              <TableCell className="hidden md:table-cell">
                <div className="text-[10px] font-black text-foreground uppercase tracking-wider">
                  Currency: <span className="text-secondary">{customer.currency_code}</span>
                </div>
                <div className="text-[10px] text-muted-foreground font-bold mt-1">
                  Org Size: {customer.company_size}
                </div>
              </TableCell>

              {/* Status & Actions Section */}
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-5">
                  <Badge variant="outline" className={`capitalize font-black px-3 py-1 rounded-full text-[9px] tracking-tight ${
                    customer.is_active 
                      ? 'border-green-500/30 text-green-600 bg-green-50/50' 
                      : 'border-destructive/30 text-destructive bg-destructive/5'
                  }`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-secondary/40 hover:text-primary hover:bg-primary/5 transition-all"
                  >
                    <Edit3 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer - Branded */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <div className="text-[10px] text-secondary font-black uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-1 bg-primary rounded-full" />
          {pagination.total} Records Found
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-black uppercase border-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={14} className="mr-1" /> Back
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            className="h-8 text-[10px] font-black uppercase border-secondary/10 text-secondary hover:bg-secondary hover:text-white transition-all shadow-sm"
            disabled={pagination.page >= totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}