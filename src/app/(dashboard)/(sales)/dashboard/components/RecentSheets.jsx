"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, ChevronRight, ChevronLeft } from "lucide-react";

export default function RecentSheets({ sheets, pagination, onPageChange, isLoading }) {

    console.log("📥 [COMPONENT DEBUG] Received Sheets:", sheets?.length, "Current Page:", pagination?.page);
  // Use default values to prevent "undefined" destructuring error
 const { page = 1, total = 0, limit = 5 } = pagination || {};
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status) => {
    const variants = {
      approved: "border-green-500 text-green-500 bg-green-50",
      submitted: "border-blue-500 text-blue-500 bg-blue-50",
      pending: "border-orange-500 text-orange-500 bg-orange-50",
      draft: "border-gray-400 text-gray-500 bg-gray-50",
    };
    return (
      <Badge variant="outline" className={`${variants[status] || "border-gray-400"} capitalize font-bold px-4 py-0.5 rounded-full`}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b py-4 px-6">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="text-red-500 italic">📄</span> Recent Sheets
        </CardTitle>
        <div className="flex items-center gap-2">
           <span className="text-[10px] text-muted-foreground mr-2 font-medium">
             Page {page} of {totalPages}
           </span>
           <Button 
             variant="outline" 
             size="icon" 
             className="h-7 w-7"
             disabled={page <= 1 || isLoading}
             onClick={() => onPageChange(page - 1)}
           >
             <ChevronLeft size={14} />
           </Button>
           <Button 
             variant="outline" 
             size="icon" 
             className="h-7 w-7"
             disabled={page >= totalPages || isLoading}
             onClick={() => onPageChange(page + 1)}
           >
             <ChevronRight size={14} />
           </Button>
        </div>
      </CardHeader>

      <div className={`relative ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        <Table>
          <TableBody>
            {sheets?.map((sheet) => (
              <TableRow key={sheet.id} className="hover:bg-gray-50/50 border-b transition-colors">
                <TableCell className="w-[60px] pl-6">
                  <div className="bg-gray-100 p-2 rounded-lg flex justify-center">
                    <FileText size={18} className="text-gray-600" />
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="font-bold text-gray-800 text-sm truncate max-w-[200px]">{sheet.id}</div>
                  <div className="text-xs text-muted-foreground mb-2">{sheet.client}</div>
                  <div className="flex items-center gap-4 text-[10px] font-medium text-gray-400">
                    <span className="font-bold text-gray-600">$ {sheet.amount}</span>
                    <span>📅 {sheet.date}</span>
                    <Badge className="bg-blue-100 text-blue-600 border-none text-[9px] h-4 uppercase font-extrabold px-1.5 rounded-sm">
                      {sheet.tag}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-6">
                    {getStatusBadge(sheet.status)}
                    <div className="flex items-center gap-3 text-gray-400">
                      <button className="hover:text-blue-600 transition-colors"><Eye size={16} /></button>
                      <button className="hover:text-green-600 transition-colors"><Download size={16} /></button>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Simple inline loader overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 text-[10px] font-bold text-red-500 uppercase tracking-widest">
            Loading...
          </div>
        )}
      </div>

      {sheets?.length === 0 && !isLoading && (
        <div className="p-12 text-center text-gray-400 text-sm italic">
          No costing sheets found.
        </div>
      )}
    </Card>
  );
}