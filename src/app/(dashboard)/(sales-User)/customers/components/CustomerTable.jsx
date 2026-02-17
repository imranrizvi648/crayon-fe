import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Globe, Building2, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";

export function CustomerTable({ items, loading, pagination, onPageChange }) {
  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-[#1a3556]">Loading...</div>;
  if (!items.length) return <div className="p-10 text-center text-slate-500 italic">No customers found.</div>;

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <Table>
        <TableBody>
          {items.map((customer) => (
            <TableRow key={customer.id} className="hover:bg-slate-50/50 transition-colors border-b last:border-0">
              {/* Avatar/Icon */}
              <TableCell className="w-[70px] pl-6">
                <div className={`p-3 rounded-xl flex justify-center ${customer.is_partner ? 'bg-orange-50' : 'bg-blue-50'}`}>
                  <User size={20} className={customer.is_partner ? 'text-orange-600' : 'text-[#1a3556]'} />
                </div>
              </TableCell>

              {/* Customer Info */}
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1a3556] text-sm">{customer.name}</span>
                  {customer.is_partner && (
                    <Badge className="bg-orange-100 text-orange-600 border-none text-[9px] h-4 uppercase font-bold px-1.5">Partner</Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1"><Building2 size={12}/> {customer.customer_code}</span>
                  <span className="flex items-center gap-1"><MapPin size={12}/> {customer.region} ({customer.country})</span>
                </div>
              </TableCell>

              {/* Business Details */}
              <TableCell>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Currency: {customer.currency_code}</div>
                <div className="text-[10px] text-slate-400 mt-1">Size: {customer.company_size}</div>
              </TableCell>

              {/* Status & Action */}
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-4">
                   <Badge variant="outline" className={`${customer.is_active ? 'border-green-500 text-green-500 bg-green-50' : 'border-red-500 text-red-500'} capitalize font-bold px-3 py-0.5 rounded-full text-[10px]`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#1a3556]">
                    <Edit3 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
        <span className="text-[11px] text-slate-500 font-medium italic">
          Total {pagination.total} Customers found
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline" size="sm" className="h-8 text-xs font-bold"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={14} className="mr-1" /> Prev
          </Button>
          <Button
            variant="outline" size="sm" className="h-8 text-xs font-bold"
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