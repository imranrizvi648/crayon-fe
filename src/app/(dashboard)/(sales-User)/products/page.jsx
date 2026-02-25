"use client";

import { useProducts } from "./hooks/useProducts";
import { ProductTable } from "./components/ProductTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductCatalogPage() {
  const { products, loading, fetchProducts } = useProducts();

  return (
    <div className="px-5 space-y-6 bg-slate-50/30 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3556]">Product Catalog</h1>
          <p className="text-sm text-slate-500">Browse Microsoft products and pricing</p>
        </div>
            </div>

      {/* Filters Section (As per Image) */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <Input 
            placeholder="Search products..." 
            className="bg-white border-slate-200" 
            onChange={(e) => fetchProducts(1, e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] bg-white border-slate-200">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="enterprise">Enterprise Online</SelectItem>
            <SelectItem value="additional">Additional Online</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <ProductTable items={products} loading={loading} />
    </div>
  );
}