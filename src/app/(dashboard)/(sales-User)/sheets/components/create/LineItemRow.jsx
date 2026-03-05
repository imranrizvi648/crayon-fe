"use client";
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

export function LineItemRow({ 
  item, 
  index, 
  onUpdate, 
  onRemove, 
  region, 
  onBatchPaste, 
  activeYear 
}) {
  const isAfrica = region === "Africa";

  const handlePaste = async (e) => {
    const pasteData = e.clipboardData.getData("text");
    if (!pasteData) return;
    e.preventDefault();

    const generateUID = () => Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    const rowRegex = /\r?\n(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const rawRows = pasteData.split(rowRegex).filter(row => row.trim() !== "");
    const parsedItems = [];

    for (const row of rawRows) {
      const columns = row.split("\t").map(col => col.replace(/^"|"$/g, '').trim());
      const partNo = columns[0] || "";
      const itemNameRaw = columns[1] || "";
      if (!partNo || partNo.toLowerCase().includes("part number")) continue;

      const rawQty = Number(columns[11]?.replace(/[^0-9.-]+/g, "")) || 1;
      const netUsd = Number(columns[2]?.replace(/[^0-9.-]+/g, "")) || 0;
      const erpUsd = Number(columns[3]?.replace(/[^0-9.-]+/g, "")) || 0;
      const msDisc = Number(columns[5]?.replace(/[^0-9.-]+/g, "")) || 0;
      const crMU = Number(columns[6]?.replace(/[^0-9.-]+/g, "")) || 0;
      const reb = Number(columns[16]?.replace(/[^0-9.-]+/g, "")) || 0;

      // 100% ISOLATION: Yeh data sirf current active tab ko milega!
      let newItem = {
        id: generateUID(),
        tab_year: activeYear, // <--- MASTER FIX (Ye row ab is tab ki ho gayi)
        category: "Enterprise Online",
        part_number: partNo,
        item_name: itemNameRaw,
        unit_type: columns[7] || "12",
        qty: Math.round(rawQty),
        unit_net_usd: netUsd,
        unit_erp_usd: erpUsd,
        ms_discount: msDisc,
        crayon_markup: crMU,
        rebate_percent: reb,
        swo_gp_percent: 50
      };

      parsedItems.push(newItem);
    }
    
    if (onBatchPaste) onBatchPaste(parsedItems, index);
  };

  // Auto Calculations
  const currentNet = Number(item.unit_net_usd) || 0;
  const currentErp = Number(item.unit_erp_usd) || 0;
  const qty = Number(item.qty) || 0;
  
  const defaultMarkup = currentNet > 0 ? (((currentErp - currentNet) / currentNet) * 100).toFixed(2) : "0.00";
  const msDiscNet = (currentNet * (Number(item.ms_discount) / 100)).toFixed(2);
  const msDiscErp = (currentErp * (Number(item.ms_discount) / 100)).toFixed(2);
  const totalNet = (currentNet * qty).toFixed(2);
  const totalErp = (currentErp * qty).toFixed(2);

  return (
    <TableRow className="hover:bg-slate-50 border-b">
      <TableCell className="w-[150px]">
        <Select value={item.category || ""} onValueChange={(v) => onUpdate("category", v)}>
          <SelectTrigger className="h-8 text-[10px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Enterprise Online">Enterprise Online</SelectItem>
            <SelectItem value="Additional">Additional</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      
      <TableCell className="bg-[#f0fff4]/30 border-x w-[130px]">
        <Input 
          className="h-8 text-[10px]" 
          value={item.part_number || ""} 
          onChange={(e) => onUpdate("part_number", e.target.value)}
          onPaste={handlePaste}
          placeholder="Paste Excel here"
        />
      </TableCell>

      <TableCell className="w-[250px]">
        <Input className="h-8 text-[10px]" value={item.item_name || ""} onChange={(e) => onUpdate("item_name", e.target.value)} />
      </TableCell>

      <TableCell><Input className="h-8 text-[10px] text-center" type="number" value={item.unit_net_usd || 0} onChange={(e) => onUpdate("unit_net_usd", Number(e.target.value))} /></TableCell>
      <TableCell><Input className="h-8 text-[10px] text-center" type="number" value={item.unit_erp_usd || 0} onChange={(e) => onUpdate("unit_erp_usd", Number(e.target.value))} /></TableCell>
      
      <TableCell className="text-center text-[10px] text-slate-500 font-medium">{defaultMarkup}%</TableCell> 

      <TableCell><Input className="h-8 text-[10px] text-center" type="number" value={item.ms_discount || 0} onChange={(e) => onUpdate("ms_discount", Number(e.target.value))} /></TableCell>
      <TableCell><Input className="h-8 text-[10px] text-center" type="number" value={item.crayon_markup || 0} onChange={(e) => onUpdate("crayon_markup", Number(e.target.value))} /></TableCell>

      <TableCell><Input className="h-8 text-[10px] text-center" value={item.unit_type || "12"} onChange={(e) => onUpdate("unit_type", e.target.value)} /></TableCell>
      
      <TableCell className="text-center text-[10px] text-blue-600">{msDiscNet}</TableCell>
      <TableCell className="text-center text-[10px] text-blue-600 border-r">{msDiscErp}</TableCell>
      <TableCell className="bg-blue-50/30 text-center font-bold text-[10px] text-slate-700">AED {totalNet}</TableCell>
      <TableCell className="bg-blue-50/30 text-center font-bold text-[10px] text-slate-700 border-r">AED {totalErp}</TableCell>

      <TableCell className="bg-yellow-50/50">
        <Input className="h-8 w-12 mx-auto text-[10px] text-center font-bold" type="number" value={item.qty || 0} onChange={(e) => onUpdate("qty", Math.round(Number(e.target.value)))} />
      </TableCell>

      <TableCell className="text-center text-[10px] text-slate-500">-</TableCell>
      <TableCell className="bg-green-50/30 text-center font-bold text-green-700 text-[10px] border-x">AED {totalErp}</TableCell>
      <TableCell className="text-center text-[10px] text-slate-500">-</TableCell>
      
      <TableCell className="border-x">
        <Input className="h-8 w-12 mx-auto text-[10px] text-center" type="number" value={item.rebate_percent || 0} onChange={(e) => onUpdate("rebate_percent", Number(e.target.value))} />
      </TableCell>

      <TableCell className="bg-blue-50/30 text-center text-[10px] text-slate-500">-</TableCell>

      {isAfrica && (
        <>
          <TableCell className="bg-purple-50/30 text-center text-[10px]">-</TableCell>
          <TableCell className="bg-purple-50">
            <Input type="number" className="h-8 w-12 mx-auto text-center text-[10px]" value={item.swo_gp_percent || 50} onChange={(e) => onUpdate("swo_gp_percent", Number(e.target.value))} />
          </TableCell>
          <TableCell className="bg-purple-100/30 text-center text-[10px]">-</TableCell>
          <TableCell className="bg-orange-50/30 text-center text-[10px]">-</TableCell>
        </>
      )}

      <TableCell>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => onRemove(item.id)}>
          <Trash2 size={12} />
        </Button>
      </TableCell>
    </TableRow>
  );
}