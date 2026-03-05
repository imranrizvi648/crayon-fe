"use client";
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Globe, Calendar } from "lucide-react";
import { EditRateModal } from "./EditRateModal";

export function ExchangeRateTable({ ratesHook }) {
  const { rates, loading, updateRate } = ratesHook;
  const [selectedRate, setSelectedRate] = useState(null);

  const handleSave = async (id, val) => {
    const res = await updateRate(id, val);
    if (res.success) setSelectedRate(null);
  };

  return (
    <div className="bg-white rounded-md border shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow className="text-[12px] font-bold uppercase">
            <TableHead className="px-6">Currency Pair</TableHead>
            <TableHead className="text-center">Rate</TableHead>
            <TableHead className="text-center">Effective Date</TableHead>
            <TableHead className="text-center">Source</TableHead>
            <TableHead className="text-center w-[100px]">Status</TableHead>
            <TableHead className="text-right px-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rates.map((item) => (
            <TableRow key={item.id} className="hover:bg-slate-50/50">
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary"><Globe size={14}/></div>
                  <span className="font-bold text-slate-800">{item.from_currency} → {item.to_currency}</span>
                </div>
              </TableCell>
              <TableCell className="text-center font-bold text-secondary ">
                {item.rate}
              </TableCell>
              <TableCell className="text-center text-slate-500 text-xs">
                 <div className="flex items-center justify-center gap-1">
                    <Calendar size={12}/> {item.effective_date}
                 </div>
              </TableCell>
              <TableCell className="text-center">
                <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded">{item.source}</span>
              </TableCell>
              <TableCell className="text-center">
                {item.is_current && <span className="h-2 w-2 rounded-full bg-primary inline-block ring-4 ring-green-50 mr-2"/>}
                <span className="text-[10px] font-bold text-secondary uppercase">Current</span>
              </TableCell>
              <TableCell className="text-right px-6">
                <Button variant="ghost" size="sm" onClick={() => setSelectedRate(item)} className="hover:bg-primary/10 hover:text-primary h-8 w-8 p-0 rounded-full">
                  <Edit2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedRate && (
        <EditRateModal 
          isOpen={!!selectedRate} 
          onClose={() => setSelectedRate(null)} 
          rateData={selectedRate}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </div>
  );
}