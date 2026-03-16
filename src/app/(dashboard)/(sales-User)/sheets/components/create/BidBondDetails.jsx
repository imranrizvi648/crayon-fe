"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BidBondDetails({ data, onChange }) {
  const [local, setLocal] = useState({
    bid_bond_percent:                 data.bid_bond_percent                 ?? 0,
    bank_charges_percent:             data.bank_charges_percent             ?? 0,
    performance_bond_percent:         data.performance_bond_percent         ?? 0,
    performance_bank_charges_percent: data.performance_bank_charges_percent ?? 0,
    tender_cost:                      data.tender_cost                      ?? 0,
  });

  useEffect(() => {
    setLocal({
      bid_bond_percent:                 data.bid_bond_percent                 ?? 0,
      bank_charges_percent:             data.bank_charges_percent             ?? 0,
      performance_bond_percent:         data.performance_bond_percent         ?? 0,
      performance_bank_charges_percent: data.performance_bank_charges_percent ?? 0,
      tender_cost:                      data.tender_cost                      ?? 0,
    });
  }, [
    data.bid_bond_percent,
    data.bank_charges_percent,
    data.performance_bond_percent,
    data.performance_bank_charges_percent,
    data.tender_cost,
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    onChange(name, value === "" ? 0 : Number(value));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5 bg-white">
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Bid Bond %</Label>
        <Input type="number" name="bid_bond_percent"
          value={local.bid_bond_percent}
          onChange={handleChange} onBlur={handleBlur}
          className="h-10 border-slate-200"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Bank Charges %</Label>
        <Input type="number" name="bank_charges_percent"
          value={local.bank_charges_percent}
          onChange={handleChange} onBlur={handleBlur}
          className="h-10 border-slate-200"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Performance Bond %</Label>
        <Input type="number" name="performance_bond_percent"
          value={local.performance_bond_percent}
          onChange={handleChange} onBlur={handleBlur}
          className="h-10 border-slate-200"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Performance Bank Charges %</Label>
        <Input type="number" name="performance_bank_charges_percent"
          value={local.performance_bank_charges_percent}
          onChange={handleChange} onBlur={handleBlur}
          className="h-10 border-slate-200"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Tender Cost (AED)</Label>
        <Input type="number" name="tender_cost"
          value={local.tender_cost}
          onChange={handleChange} onBlur={handleBlur}
          className="h-10 border-slate-200 bg-yellow-50/30"
        />
      </div>
    </div>
  );
}