"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Info, CalendarDays } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineItemRow } from "./LineItemRow";

export function SummaryFooter({ displayedItems, region, activeYear, isRamped }) {
  const isAfrica = region === "Africa";
  if (displayedItems.length === 0) return null;

  const calculateTotal = (field) => {
    return displayedItems.reduce((sum, item) => sum + (Number(item[field]) || 0), 0);
  };
  const totalQty = calculateTotal("qty");
  const totalNet = displayedItems.reduce((sum, item) => sum + ((Number(item.unit_net_usd) || 0) * (Number(item.qty) || 0)), 0);
  const totalErp = displayedItems.reduce((sum, item) => sum + ((Number(item.unit_erp_usd) || 0) * (Number(item.qty) || 0)), 0);

  return (
    <TableRow className="bg-slate-50 border-t-2 font-bold text-[10px]">
      <TableCell colSpan={11} className="py-2 text-right text-slate-700 uppercase">
        {isRamped ? `${activeYear.toUpperCase()} Totals:` : "Total Summary:"}
      </TableCell>
      <TableCell className="bg-blue-50 text-center text-blue-800 border-x">AED {totalNet.toLocaleString()}</TableCell>
      <TableCell className="bg-blue-50 text-center text-blue-800 border-r">AED {totalErp.toLocaleString()}</TableCell>
      <TableCell className="text-center bg-yellow-50">{totalQty}</TableCell>
      <TableCell></TableCell>
      <TableCell className="bg-green-50 text-center text-green-800 border-x">AED {totalErp.toLocaleString()}</TableCell>
      <TableCell colSpan={2} className="bg-blue-900/10"></TableCell>
      <TableCell className="bg-blue-900/20 text-center">-</TableCell>
      {isAfrica && (
        <><TableCell colSpan={4} className="bg-purple-50 text-center">-</TableCell></>
      )}
      <TableCell></TableCell>
    </TableRow>
  );
}

export function LineItemsSection({ items, onChange, region, dealType }) {
  const [activeYear, setActiveYear] = useState("year1");
  const isAfrica = region === "Africa";
  const isRamped = dealType === "RAMPED";

  // FILTER: Sirf active tab ka data dikhao!
  const displayedItems = isRamped ? items.filter(i => i.tab_year === activeYear) : items;

  const generateUID = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);

const addRow = () => {
    const newItem = {
      id: generateUID(),
      tab_year: isRamped ? activeYear : "year1",
      category: "Enterprise Online",
      part_number: "", item_name: "", unit_type: "12",
      qty: 0, unit_net_usd: 0, unit_erp_usd: 0, ms_discount: 0, crayon_markup: 0, rebate_percent: 0, swo_gp_percent: 50,
    };
    onChange([...items, newItem]);
  };

  // ✅ FIX: Yeh useEffect add karein
  useEffect(() => {
    // Current tab/year ka data filter karein
    const currentYearItems = isRamped 
      ? items.filter(i => i.tab_year === activeYear)
      : items; // Normal mode mein saare items dekho

    // Agar current view mein koi item nahi hai, toh automatically row add kardo
    if (currentYearItems.length === 0) {
      addRow();
    }
  }, [activeYear, isRamped, items.length]);

  const updateItem = (id, field, value) => {
    onChange(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

const handleBatchPaste = (parsedItemsToMerge, currentIndex) => {
    // 1. Pehle pure items ki copy lo
    let allItems = [...items];

    // 2. Sirf active tab ke items dhoondo taaki humein sahi 'global index' mil sake
    // Kyunke 'currentIndex' sirf displayedItems ka index hota hai
    const displayedItemsIds = displayedItems.map(i => i.id);
    const targetId = displayedItemsIds[currentIndex];
    
    // 3. Global array mein wo index dhoondo jahan paste hua hai
    const globalIndex = allItems.findIndex(i => i.id === targetId);

    if (globalIndex !== -1) {
      // FIX: 'globalIndex' se shuru karo, 1 item (khali row) ko delete karo, 
      // aur uski jagah saara naya data daal do.
      allItems.splice(globalIndex, 1, ...parsedItemsToMerge);
    } else {
      // Fallback: Agar kuch na mile toh end mein push kardo
      allItems.push(...parsedItemsToMerge);
    }

    onChange(allItems);
  };
  // --- COPY BUTTONS LOGIC ---
  const copyToOtherYear = (targetYear) => {
    const year1Items = items.filter(i => i.tab_year === "year1" && i.part_number);
    const copiedItems = year1Items.map(i => ({ ...i, id: generateUID(), tab_year: targetYear }));
    const otherItems = items.filter(i => i.tab_year !== targetYear);
    onChange([...otherItems, ...copiedItems]);
  };

  return (
    <div className="space-y-4 overflow-hidden bg-white p-4 rounded-xl border shadow-sm">
      {isRamped && (
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-blue-100">
          <Tabs value={activeYear} onValueChange={setActiveYear} className="w-[300px]">
            <TabsList className="grid grid-cols-3 h-9">
              <TabsTrigger value="year1" className="text-xs font-bold">Year 1</TabsTrigger>
              <TabsTrigger value="year2" className="text-xs font-bold">Year 2</TabsTrigger>
              <TabsTrigger value="year3" className="text-xs font-bold">Year 3</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => copyToOtherYear("year2")} className="h-9 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200">Copy to Year 2</Button>
            <Button variant="outline" size="sm" onClick={() => copyToOtherYear("year3")} className="h-9 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200">Copy to Year 3</Button>
          </div>
        </div>
      )}

      <div className="bg-[#f0f7ff] border border-blue-100 p-3 rounded-lg flex flex-col gap-1 text-[#1e40af] text-sm">
        <div className="flex items-center gap-2 mt-1 italic text-slate-600 text-xs">
          <Info size={14} className="text-blue-500" />
          <p>Tip: Edit <span className="font-bold uppercase text-blue-700">{activeYear}</span>. Paste Excel data into Part Number.</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 overflow-x-auto">
        <Table className={`${isAfrica ? "min-w-[2400px]" : "min-w-[2000px]"} border-collapse`}>
          <TableHeader className="bg-slate-100/80">
            <TableRow>
              <TableHead className="text-[10px] font-bold uppercase">Category</TableHead>
              <TableHead className="bg-[#f0fff4] text-[10px] font-bold uppercase border-x">Part Number</TableHead>
              <TableHead className="text-[10px] font-bold uppercase min-w-[200px]">Item Name</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Unit Net</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Unit ERP</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Def MU%</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">MS Disc%</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Crayon MU%</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Type</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">Disc Net</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center border-r">Disc ERP</TableHead>
              <TableHead className="bg-blue-600 text-white text-[10px] text-center">Total Net</TableHead>
              <TableHead className="bg-blue-600 text-white text-[10px] text-center border-r">Total ERP</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center bg-yellow-50">Qty</TableHead>
              <TableHead className="text-[10px] font-bold uppercase text-center">EUP</TableHead>
              <TableHead className="bg-green-600 text-white text-[10px] text-center border-x">Total EUP</TableHead>
              <TableHead className="bg-blue-800 text-white text-[10px] text-center">MU %</TableHead>
              <TableHead className="bg-blue-800 text-white text-[10px] text-center border-l">Reb %</TableHead>
              <TableHead className="bg-blue-800 text-white text-[10px] text-center border-l">Rebate</TableHead>
              {isAfrica && (
                <>
                  <TableHead className="bg-purple-100 text-purple-700 font-bold text-center border-l text-[10px]">GP</TableHead>
                  <TableHead className="bg-purple-200 text-purple-800 font-bold text-center border-l text-[10px]">SWO %</TableHead>
                  <TableHead className="bg-purple-300 text-purple-900 text-[10px] font-bold text-center border-l">SWO GP</TableHead>
                  <TableHead className="bg-orange-100 text-orange-700 text-[10px] font-bold text-center border-l">Part GP</TableHead>
                </>
              )}
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={20} className="text-center py-8 text-slate-400">No items in {activeYear}. Click Add Row or Paste Data.</TableCell>
              </TableRow>
            ) : (
              displayedItems.map((item, index) => (
                <LineItemRow 
                  key={item.id} item={item} index={index} activeYear={activeYear} isRamped={isRamped}
                  onUpdate={(f, v) => updateItem(item.id, f, v)}
                  onRemove={() => onChange(items.filter(i => i.id !== item.id))}
                  onBatchPaste={handleBatchPaste} region={region}
                />
              ))
            )}
            <SummaryFooter displayedItems={displayedItems} region={region} activeYear={activeYear} isRamped={isRamped} />
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-start pt-4">
        <Button variant="outline" size="sm" onClick={addRow} className="text-blue-600 border-blue-200 font-bold gap-2">
          <Plus size={16} /> Add Product Row
        </Button>
      </div>
    </div>
  );
}