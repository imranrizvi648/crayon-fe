"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Edit, ChevronLeft, ChevronRight, Eye } from "lucide-react";

export function SheetTable({ items, loading, onEdit, onDelete, onPreview, pagination, onPageChange }) {
  if (loading) return <div className="p-10 text-center animate-pulse font-bold text-[#1a3556]">Loading...</div>;
  if (!items || items.length === 0) return <div className="p-10 text-center text-slate-500 italic">No sheets found.</div>;

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  // Status Badge Logic (vahi colors jo RecentSheets mein thay)
  const getStatusBadge = (status) => {
    const variants = {
      approved: "border-green-500 text-green-500 bg-green-50",
      submitted: "border-blue-500 text-blue-500 bg-blue-50",
      pending: "border-orange-500 text-orange-500 bg-orange-50",
      draft: "border-gray-400 text-gray-500 bg-gray-50",
    };
    return (
      <Badge variant="outline" className={`${variants[status] || "border-gray-400"} capitalize font-bold px-3 py-0.5 rounded-full text-[10px]`}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col">
      <Table>
        <TableBody>
          {items.map((sheet, index) => (
            <TableRow key={sheet.uuid || index} className="hover:bg-gray-50/50 border-b transition-colors">
              {/* Icon Section */}
              <TableCell className="w-[70px] pl-6">
                <div className="bg-slate-100 p-3 rounded-xl flex justify-center">
                  <FileText size={20} className="text-[#1a3556]" />
                </div>
              </TableCell>

              {/* Main Info Section */}
              <TableCell className="py-4">
                <div className="font-bold text-[#1a3556] text-sm truncate max-w-[250px]">
                  {sheet.sheet_number}
                </div>
                <div className="text-xs text-slate-500 mb-1">{sheet.client}</div>
                
                {/* Meta Data Row (Amount, Date, Tag) */}
                <div className="flex items-center gap-4 text-[10px] font-medium text-gray-400">
                  <span className="font-bold text-[#1a3556]">{sheet.amount}</span>
                  <span>📅 {sheet.date}</span>
                  <Badge className="bg-blue-100 text-blue-600 border-none text-[9px] h-4 uppercase font-extrabold px-1.5 rounded-sm">
                    {sheet.tag}
                  </Badge>
                </div>
              </TableCell>

              {/* Status & Actions Section */}
              <TableCell className="text-right pr-6">
                <div className="flex items-center justify-end gap-6">
                  {getStatusBadge(sheet.status)}
                  
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-[#1a3556]"
                      onClick={() => onEdit(sheet)}
                    >
                      <Edit size={16} />
                    </Button>
                  <Button 
  variant="ghost" size="icon" 
  className="h-8 w-8 text-blue-500" 
  onClick={() => onPreview(sheet.id)}
>
  <Eye size={16} />
</Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer (As requested) */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
        <div className="text-xs text-slate-500 font-medium italic">
          Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            size="sm"
            className="h-8 text-xs font-bold"
            disabled={pagination.page <= 1 || loading}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            <ChevronLeft size={14} className="mr-1" /> Previous
          </Button>
          <Button
            variant="outline" 
            size="sm"
            className="h-8 text-xs font-bold"
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