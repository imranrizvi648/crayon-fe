"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Plus, Package } from "lucide-react";

export function ProductTable({ items, loading }) {
  const getCategoryColor = (cat) => {
    const category = cat.toUpperCase();
    if (category.includes("ENTERPRISE")) return "border-secondary/30 text-secondary bg-secondary/5 ";
    if (category.includes("ADDITIONAL")) return "border-secondary/30 text-secondary bg-secondary/5";
    return "bg-muted text-muted-foreground border-border";
  };

  // --- Skeleton Loading Component ---
  const TableSkeleton = () => (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i} className="border-b border-border last:border-0">
          <TableCell className="pl-6"><Skeleton className="h-3 w-12" /></TableCell>
          <TableCell className="py-4">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </TableCell>
          <TableCell><Skeleton className="h-5 w-20 rounded-sm" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
          <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto" /></TableCell>
          <TableCell className="text-right pr-6"><Skeleton className="h-9 w-28 ml-auto rounded-xl" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="bg-card rounded-md shadow-xl shadow-secondary/5 border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary border-b-0">
          <TableRow className="hover:bg-secondary border-none">
            <TableHead className="text-white font-semibold text-[16px]   tracking-wide pl-6 h-14">SKU</TableHead>
            <TableHead className="text-white font-semibold text-[16px]  h-14 tracking-wide">Product Details</TableHead>
            <TableHead className="text-white font-semibold text-[16px] h-14 tracking-wide">Category</TableHead>
            <TableHead className="text-white font-semibold text-[16px]  h-14 tracking-widetext-center ">Base Price</TableHead>
            <TableHead className="text-white font-semibold text-[16px]  h-14 tracking-widetext-center ">Markup</TableHead>
            <TableHead className="text-white font-semibold text-[16px]  h-14 tracking-wide text-right pr-6 ">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableSkeleton />
          ) : (
            items.map((product) => (
              <TableRow key={product.id} className="group hover:bg-muted/30 transition-all border-b border-border last:border-0">
                <TableCell className="font-bold text-foreground pl-6 text-[12px] ">
                  {product.sku}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-foreground uppercase text-[12px] ">
                      {product.name}
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                    <Package size={10} className="text-secondary/40" /> Standard License
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getCategoryColor(product.category)} capitalize text-[9px] font-black px-2.5 py-0.5 rounded-sm tracking-tight`}>
                    {product.category.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-bold text-foreground text-[12px]">
                    ${product.basePrice.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="inline-flex items-center justify-center text-foreground rounded font-bold  text-[12px]">
                    {product.markup}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <Button 
                    variant="ghost" 
                    className="text-secondary hover:text-white hover:bg-secondary font-bold  text-[12px]  gap-2 h-9 px-4 rounded-xl transition-all active:scale-95"
                  >
                    <Plus size={14} strokeWidth={3} /> Add to Sheet
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}