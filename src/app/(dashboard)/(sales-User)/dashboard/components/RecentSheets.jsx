"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecentSheets({ sheets, pagination, onPageChange, isLoading }) {
  const { page = 1, total = 0, limit = 5 } = pagination || {};
  const totalPages = Math.ceil(total / limit) || 1;

  const getStatusBadge = (status) => {

    
   const variants = {
  approved: "border-emerald-500 text-emerald-600 bg-emerald-50",
  submitted: "border-primary/50 text-primary bg-primary/5", // Scarlet Red (#FF370F)
  pending: "border-amber-500 text-amber-600 bg-amber-50",
  draft: "border-muted-foreground/30 text-muted-foreground bg-muted/20",
  locked: "border-gray-500 text-gray-600 bg-gray-50",           // Locked / disabled state
  underreview: "border-blue-500 text-blue-600 bg-blue-50",    // Under review state
};

    return (
      <Badge variant="outline" className={cn(
        "capitalize font-bold px-4 py-0.5 rounded-full text-[10px]",
        variants[status] || "border-muted-foreground"
      )}>
        {status?.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <Card className="h-full shadow-md overflow-hidden flex flex-col min-h-[500px]  bg-card">
      {/* Header with Theme Background */}
      <CardHeader className="flex flex-row items-center justify-between border-b py-4 px-6 flex-shrink-0 bg-background">
        <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
          <FileText className="text-primary" size={20} /> 
          <span>Recent Sheets</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground mr-2 font-bold uppercase">
            Page {page} of {totalPages}
          </span>
          <Button 
            variant="outline" size="icon" className="h-7 w-7 hover:border-primary hover:text-primary"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button 
            variant="outline" size="icon" className="h-7 w-7 hover:border-primary hover:text-primary"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 relative bg-background">
        <div className={cn("transition-opacity duration-300", isLoading ? 'opacity-30' : 'opacity-100')}>
          <Table>
            <TableBody>
              {sheets?.map((sheet) => (
                <TableRow key={sheet.id} className="hover:bg-muted/20 border-b transition-colors group">
                  <TableCell className="w-[60px] pl-6">
                    {/* Icon wrapper uses secondary (Deep Blue) with primary hover */}
                    <div className="bg-secondary/10 p-2 rounded-lg flex justify-center text-secondary group-hover:text-primary transition-colors">
                      <FileText size={18} />
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    {/* Text colors from theme variables */}
                    <div className="font-bold text-foreground text-sm truncate max-w-[250px]">{sheet.id}</div>
                    <div className="text-xs text-muted-foreground mb-2 truncate">{sheet.client}</div>
                    <div className="flex items-center gap-4 text-[10px] font-medium">
                      <span className="font-black text-foreground">{sheet.amount}</span>
                      <span className="text-muted-foreground">📅 {sheet.date}</span>
                      <Badge className="bg-secondary/10 text-secondary border-none text-[9px] h-4 font-black">
                        {sheet.tag}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-6">
                      {getStatusBadge(sheet.status)}
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                          <Eye size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-emerald-600">
                          <Download size={16} />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Loading Overlay with Theme Primary Color */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-10 backdrop-blur-[2px]">
            <div className="text-[10px] font-black text-primary tracking-widest animate-pulse border-2 border-primary px-4 py-2 rounded-md bg-background">
              LOADING...
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}