import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProductTable({ items, loading }) {
  const getCategoryColor = (cat) => {
    if (cat.includes("ENTERPRISE")) return "bg-blue-50 text-blue-600 border-blue-100";
    if (cat.includes("ADDITIONAL")) return "bg-purple-50 text-purple-600 border-purple-100";
    return "bg-slate-50 text-slate-600";
  };

  if (loading) return <div className="p-20 text-center animate-pulse font-bold text-slate-400">Loading...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <Table>
        <TableHeader className="bg-[#1a3556] ">
          <TableRow className="hover:bg-[#1a3556]">
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider pl-6">SKU</TableHead>
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider">Product Name</TableHead>
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider">Category</TableHead>
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider text-center">Base Price</TableHead>
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider text-center">Markup</TableHead>
            <TableHead className="text-white font-bold text-[11px] uppercase tracking-wider text-right pr-6">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((product) => (
            <TableRow key={product.id} className="hover:bg-slate-50/50 transition-colors border-b">
              <TableCell className="font-medium text-slate-600 pl-6 text-xs">{product.sku}</TableCell>
              <TableCell>
                <div className="font-bold text-[#1a3556] text-sm">{product.name}</div>
                <div className="text-[10px] text-slate-400">Standard License</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`${getCategoryColor(product.category)} capitalize text-[10px] px-2 py-0`}>
                  {product.category.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-center font-bold text-slate-700 text-sm">
                ${product.basePrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-center font-bold text-[#dc1e25] text-sm">
                {product.markup}
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button variant="ghost" className="text-[#dc1e25] hover:text-[#dc1e25] hover:bg-red-50 font-bold text-xs gap-1">
                  <Plus size={14} /> Add to Sheet
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}