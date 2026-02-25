"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Info, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCostingSheets } from "../hooks/useCostingSheets";

export function LineItemsSection({ items, onChange, exchangeRate }) {
  const { searchProducts } = useCostingSheets();
  const [activeSearchId, setActiveSearchId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);

  // Dynamic Exchange Rate
  const EX_RATE = exchangeRate || 3.6725;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveSearchId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addRow = () => {
    const newItem = {
      id: Date.now(),
      category: "Enterprise Online",
      part_number: "",
      item_name: "",
      unit_net_usd: 0,
      unit_erp_usd: 0,
      ms_discount: 0,
      crayon_markup: 0,
      unit_type: 12,
      qty: 0,
      rebate_percent: 0,
    };
    onChange([...items, newItem]);
  };

  const removeRow = (id) => {
    onChange(items.filter((item) => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange(updatedItems);
  };

  // Product Autocomplete Logic
  const handleProductSearch = (id, value) => {
    updateItem(id, "item_name", value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (value.trim().length > 0) {
      setActiveSearchId(id);
      setIsSearching(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await searchProducts(value);
        setSearchResults(results);
        setIsSearching(false);
      }, 300);
    } else {
      setActiveSearchId(null);
    }
  };

  const selectProduct = (rowId, product) => {
    const updatedItems = items.map((item) =>
      item.id === rowId ? { 
        ...item, 
        item_name: product.name || "",
        part_number: product.part_number || "",
        unit_net_usd: product.unit_net_usd || 0,
        unit_erp_usd: product.unit_erp_usd || 0
      } : item
    );
    onChange(updatedItems);
    setActiveSearchId(null);
  };

  // Totals for Summary Footer
  const totalNetYearly = items.reduce((acc, item) => acc + (item.unit_net_usd * item.qty * EX_RATE), 0);
  const totalERPYearly = items.reduce((acc, item) => acc + (item.unit_erp_usd * item.qty * EX_RATE), 0);
  const totalRebateYearly = items.reduce((acc, item) => acc + ((item.unit_net_usd * item.qty * EX_RATE * (item.rebate_percent || 0)) / 100), 0);

  return (
    <div className="space-y-4 overflow-hidden bg-white p-4 rounded-xl border shadow-sm">
      <div className="bg-[#f0f7ff] border border-blue-100 p-3 rounded-lg flex items-center gap-3 text-[#1e40af] text-sm italic">
        <Info size={16} className="text-blue-500" />
        <p><span className="font-bold">Tip:</span> Search by Item Name to auto-populate prices and part numbers.</p>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-x-auto overflow-y-visible">
        <Table className="min-w-[1800px] border-collapse">
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[11px] font-bold uppercase text-slate-600">Category</TableHead>
              <TableHead className="bg-[#f0fff4] text-[11px] font-bold uppercase text-slate-600 border-x">Part Number</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 min-w-[200px]">Item Name</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Unit Net USD</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Unit ERP USD</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Default Markup %</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">MS Discount %</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Crayon Markup %</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Unit Type</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">MS Disc Net</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center border-r">MS Disc ERP</TableHead>
              <TableHead className="bg-[#f0f7ff] text-[11px] font-bold uppercase text-blue-700 text-center">Total Net (AED)</TableHead>
              <TableHead className="bg-[#f0f7ff] text-[11px] font-bold uppercase text-blue-700 text-center border-r">Total ERP (AED)</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">Qty</TableHead>
              <TableHead className="text-[11px] font-bold uppercase text-slate-600 text-center">EUP</TableHead>
              <TableHead className="bg-[#f0fff4] text-[11px] font-bold uppercase text-green-700 text-center border-x">Total EUP/Yr</TableHead>
              <TableHead className="bg-blue-700 text-white text-[11px] font-bold uppercase text-center">Markup %</TableHead>
              <TableHead className="bg-blue-700 text-white text-[11px] font-bold uppercase text-center border-l border-blue-600">Rebate %</TableHead>
              <TableHead className="bg-blue-700 text-white text-[11px] font-bold uppercase text-center border-l border-blue-600">Rebate</TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => {
              const rowNetAED = (item.unit_net_usd || 0) * (item.qty || 0) * EX_RATE;
              const rowERPAED = (item.unit_erp_usd || 0) * (item.qty || 0) * EX_RATE;
              const rowRebate = (rowNetAED * (item.rebate_percent || 0)) / 100;

              return (
                <TableRow key={item.id} className="hover:bg-slate-50/50 border-b relative">
                  <TableCell>
                    <Select value={item.category || ""} onValueChange={(v) => updateItem(item.id, "category", v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Enterprise Online">Enterprise Online</SelectItem>
                        <SelectItem value="Additional">Additional</SelectItem>
                        <SelectItem value="On Premise">On Premise</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="bg-[#f0fff4]/30 border-x">
                    <Input className="h-8 text-xs border-green-200" value={item.part_number || ""} onChange={(e) => updateItem(item.id, "part_number", e.target.value)} />
                  </TableCell>
                  
                  {/* Item Name Autocomplete */}
                  <TableCell className="relative" ref={item.id === activeSearchId ? dropdownRef : null}>
                    <div className="relative">
                      <Input className="h-8 text-xs min-w-[200px]" value={item.item_name || ""} onChange={(e) => handleProductSearch(item.id, e.target.value)} autoComplete="off" />
                      {isSearching && activeSearchId === item.id && <Loader2 className="absolute right-2 top-1.5 h-4 w-4 animate-spin text-slate-400" />}
                    </div>
                    {activeSearchId === item.id && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
                        {searchResults.map((p) => (
                          <div key={p.id} onClick={() => selectProduct(item.id, p)} className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer border-b last:border-none">
                            <div className="font-bold text-slate-700">{p.name}</div>
                            <div className="text-[10px] text-slate-400">{p.part_number}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Pricing Inputs with Fallbacks to prevent Controlled/Uncontrolled Error */}
                  <TableCell><Input className="h-8 text-xs text-center" type="number" value={item.unit_net_usd || 0} onChange={(e) => updateItem(item.id, "unit_net_usd", Number(e.target.value))} /></TableCell>
                  <TableCell><Input className="h-8 text-xs text-center" type="number" value={item.unit_erp_usd || 0} onChange={(e) => updateItem(item.id, "unit_erp_usd", Number(e.target.value))} /></TableCell>
                  <TableCell className="text-center text-[11px] text-slate-500 font-medium italic">0.00%</TableCell>
                  <TableCell><Input className="h-8 text-xs text-center" type="number" value={item.ms_discount || 0} onChange={(e) => updateItem(item.id, "ms_discount", Number(e.target.value))} /></TableCell>
                  <TableCell><Input className="h-8 text-xs text-center" type="number" value={item.crayon_markup || 0} onChange={(e) => updateItem(item.id, "crayon_markup", Number(e.target.value))} /></TableCell>
                  <TableCell><Input className="h-8 text-xs text-center" value={item.unit_type || ""} onChange={(e) => updateItem(item.id, "unit_type", e.target.value)} /></TableCell>
                  <TableCell className="text-center text-[10px] font-bold text-blue-600 italic">0.00</TableCell>
                  <TableCell className="text-center text-[10px] font-bold text-blue-600 border-r italic">0.00</TableCell>
                  
                  <TableCell className="bg-[#f0f7ff] text-center text-[10px] font-bold text-blue-700">AED {rowNetAED.toFixed(2)}</TableCell>
                  <TableCell className="bg-[#f0f7ff] text-center text-[10px] font-bold text-blue-700 border-r">AED {rowERPAED.toFixed(2)}</TableCell>
                  
                  <TableCell><Input className="h-8 w-14 mx-auto text-xs text-center" type="number" value={item.qty || 0} onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))} /></TableCell>
                  <TableCell className="text-center text-[11px] font-bold text-green-600 italic">0.00</TableCell>
                  <TableCell className="bg-[#c6f6d5] text-center text-[11px] font-bold text-green-800 border-x">AED {rowERPAED.toFixed(2)}</TableCell>
                  
                  <TableCell className="text-center text-[11px] font-medium italic">0.00%</TableCell>
                  <TableCell className="border-x"><Input className="h-8 w-14 mx-auto text-xs text-center" type="number" value={item.rebate_percent || 0} onChange={(e) => updateItem(item.id, "rebate_percent", Number(e.target.value))} /></TableCell>
                  <TableCell className="bg-yellow-50 text-center text-[11px] font-bold text-yellow-700 italic">AED {rowRebate.toFixed(2)}</TableCell>
                  
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => removeRow(item.id)}><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              );
            })}

            {/* Footer Summary */}
            {items.length > 0 && (
              <>
                <TableRow className="bg-slate-50 border-t-2">
                  <TableCell colSpan={11} className="py-2 text-right text-[11px] font-bold text-slate-700 uppercase">Yearly Installment:</TableCell>
                  <TableCell className="bg-[#dbeafe] text-center text-[10px] font-bold text-blue-800 border-x border-blue-200">AED {totalNetYearly.toFixed(2)}</TableCell>
                  <TableCell className="bg-[#dbeafe] text-center text-[10px] font-bold text-blue-800 border-r border-blue-200">AED {totalERPYearly.toFixed(2)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="bg-[#c6f6d5] text-center text-[11px] font-bold text-green-800 border-x border-green-300">AED {totalERPYearly.toFixed(2)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="bg-[#fefcbf] text-center text-[11px] font-bold text-yellow-700 border-x border-yellow-300">AED {totalRebateYearly.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow className="bg-white border-t border-slate-200 shadow-sm">
                  <TableCell colSpan={11} className="py-2 text-right text-[11px] font-black text-slate-900 uppercase italic">Total over 3 Years:</TableCell>
                  <TableCell className="bg-[#bfdbfe] text-center text-[10px] font-black text-blue-900 border-x border-blue-300">AED {(totalNetYearly * 3).toFixed(2)}</TableCell>
                  <TableCell className="bg-[#bfdbfe] text-center text-[10px] font-black text-blue-900 border-r border-blue-300">AED {(totalERPYearly * 3).toFixed(2)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                  <TableCell className="bg-[#9ae6b4] text-center text-[11px] font-black text-green-900 border-x border-green-400">AED {(totalERPYearly * 3).toFixed(2)}</TableCell>
                  <TableCell colSpan={4}></TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-start pt-4">
        <Button variant="outline" size="sm" onClick={addRow} className="text-blue-600 border-blue-200 hover:bg-blue-50 font-semibold gap-2">
          <Plus size={16} /> Add Product Row
        </Button>

        {/* Profit Summary Section */}
        <div className="w-80 space-y-1.5 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider italic">Profit /Year</span>
            <span className="text-green-600 font-bold text-sm">AED {(totalERPYearly - totalNetYearly).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs border-b pb-2">
            <span className="text-slate-500 font-bold uppercase tracking-wider italic">Profit /3 Years</span>
            <span className="text-green-600 font-bold text-sm">AED {((totalERPYearly - totalNetYearly) * 3).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2 bg-[#f0fff4] p-2 rounded-md border border-green-100 shadow-inner">
            <span className="text-slate-700 font-extrabold text-[11px] uppercase italic">Overall Margin</span>
            <span className="text-green-700 font-black text-sm">
              {totalERPYearly > 0 ? (((totalERPYearly - totalNetYearly) / totalERPYearly) * 100).toFixed(2) : "0.00"}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}