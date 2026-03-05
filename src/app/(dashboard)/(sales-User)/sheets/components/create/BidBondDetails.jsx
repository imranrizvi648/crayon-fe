"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BidBondDetails({ data, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Number conversion taaki backend calculation sahi rahe
    onChange(name, value === "" ? "" : Number(value));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 p-5 bg-white">
      {/* Bid Bond % */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Bid Bond %</Label>
        <Input 
          type="number" 
          name="bid_bond_percent" 
          value={data.bid_bond_percent} 
          onChange={handleInputChange} 
          className="h-10 border-slate-200"
        />
      </div>

      {/* Bank Charges % */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Bank Charges %</Label>
        <Input 
          type="number" 
          name="bank_charges_percent" 
          value={data.bank_charges_percent} 
          onChange={handleInputChange} 
          className="h-10 border-slate-200"
        />
      </div>

      {/* Performance Bond % */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Performance Bond %</Label>
        <Input 
          type="number" 
          name="performance_bond_percent" 
          value={data.performance_bond_percent} 
          onChange={handleInputChange} 
          className="h-10 border-slate-200"
        />
      </div>

      {/* Performance Bank Charges % */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Performance Bank Charges %</Label>
        <Input 
          type="number" 
          name="performance_bank_charges_percent" 
          value={data.performance_bank_charges_percent} 
          onChange={handleInputChange} 
          className="h-10 border-slate-200"
        />
      </div>

      {/* Tender Cost (AED) */}
      <div className="space-y-2">
        <Label className="text-[11px] font-semibold text-slate-500 uppercase">Tender Cost (AED)</Label>
        <Input 
          type="number" 
          name="tender_cost" 
          value={data.tender_cost} 
          onChange={handleInputChange} 
          className="h-10 border-slate-200 bg-yellow-50/30" // Image ki tarah light yellow tint
        />
      </div>
    </div>
  );
}