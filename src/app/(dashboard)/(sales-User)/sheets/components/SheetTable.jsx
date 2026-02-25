"use client";
import Link from "next/link";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Edit, ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
// 1. useRouter import karein
import { useRouter } from "next/navigation"; 

export function SheetTable({ items, loading, onEdit, onDelete, pagination, onPageChange }) {
  const router = useRouter(); // 2. Router initialize karein

  if (loading) return (
    <div className="p-10 text-center animate-pulse font-bold text-secondary">
      Loading...
    </div>
  );
  
  if (!items || items.length === 0) return (
    <div className="p-10 text-center text-muted-foreground italic">
      No sheets found.
    </div>
  );

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  // Navigation function
  const handlePreviewClick = (id) => {
    // 3. User ko preview page par bhej dein
    // Note: Agar aapka folder structure 'app/sheets/preview/[id]/page.js' hai
    router.push(`/sheets/preview/${id}`);
  };

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
    <div className="flex flex-col bg-background border overflow-hidden">
      <Table>
        <TableBody>
          {items.map((sheet, index) => (
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
                      className="h-8 w-8 text-secondary hover:text-primary hover:bg-primary/5"
                      onClick={() => onEdit(sheet)}
                    >
                      <Edit size={16} />
                    </Button>

                    {/* 4. OnClick update kiya gaya hai */}
                  
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
          ))}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
        <div className="text-[10px] text-secondary font-black uppercase tracking-widest">
          Result: <span className="text-foreground">{((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)}</span>
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