"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";

export function ProductTable({ items, loading }) {
  // Category colors based on theme variables
  const getCategoryColor = (cat) => {
    const category = cat.toUpperCase();
    if (category.includes("ENTERPRISE")) return "border-secondary/30 text-secondary bg-secondary/5";
    if (category.includes("ADDITIONAL")) return "border-primary/30 text-primary bg-primary/5";
    return "bg-muted text-muted-foreground border-border";
  };

  if (loading) return (
    <div className="p-20 text-center animate-pulse font-black text-secondary/40 uppercase tracking-widest italic">
      Fetching Inventory...
    </div>
  );

  return (
    <div className="bg-card rounded-lg shadow-xl shadow-secondary/5 border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary border-b-0">
          <TableRow className="hover:bg-secondary border-none">
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] pl-6 h-12">SKU</TableHead>
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] h-12">Product Details</TableHead>
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] h-12">Category</TableHead>
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-center h-12">Base Price</TableHead>
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-center h-12">Markup</TableHead>
            <TableHead className="text-white font-black text-[10px] uppercase tracking-[0.2em] text-right pr-6 h-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => (
            <TableRow key={product.id} className="group hover:bg-muted/30 transition-all border-b border-border last:border-0">
              {/* SKU - Small & Muted */}
              <TableCell className="font-bold text-secondary/60 pl-6 text-[11px] tracking-tighter">
                {product.sku}
              </TableCell>

              {/* Product Name & License */}
              <TableCell className="py-4">
                <div className="flex items-center gap-2">
                  <div className="font-black text-foreground text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1 mt-0.5">
                  <Package size={10} className="text-secondary/40" /> Standard License
                </div>
              </TableCell>

              {/* Category Badge */}
              <TableCell>
                <Badge variant="outline" className={`${getCategoryColor(product.category)} capitalize text-[9px] font-black px-2.5 py-0.5 rounded-sm tracking-tight`}>
                  {product.category.toLowerCase()}
                </Badge>
              </TableCell>

              {/* Pricing - Using Foreground */}
              <TableCell className="text-center">
                <span className="font-black text-foreground text-sm">
                  ${product.basePrice.toFixed(2)}
                </span>
              </TableCell>

              {/* Markup - Using Primary Scarlet */}
              <TableCell className="text-center">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-2 py-1 rounded font-black text-xs min-w-[45px]">
                  {product.markup}
                </div>
              </TableCell>

              {/* Action Button - Branded Primary */}
              <TableCell className="text-right pr-6">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-white hover:bg-primary font-black text-[10px] uppercase tracking-widest gap-2 h-9 px-4 rounded-xl transition-all active:scale-95"
                >
                  <Plus size={14} strokeWidth={3} /> Add to Sheet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}