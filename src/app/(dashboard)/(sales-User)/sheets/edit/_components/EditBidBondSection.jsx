"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditField } from "./EditFields";

export function EditBidBondSection({ formData, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <EditField label="Bid Bond %"                 name="bid_bond_percentage"                 value={formData.bid_bond_percentage}                 onChange={onChange} type="number" />
      <EditField label="Bank Charges %"             name="bank_charges_percentage"             value={formData.bank_charges_percentage}             onChange={onChange} type="number" />
      <EditField label="Performance Bond %"         name="performance_bond_percentage"         value={formData.performance_bond_percentage}         onChange={onChange} type="number" />
      <EditField label="Performance Bank Charges %" name="performance_bank_charges_percentage" value={formData.performance_bank_charges_percentage} onChange={onChange} type="number" />
      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Tender Cost (AED)</Label>
        <Input
          type="number"
          value={formData.tender_cost ?? ""}
          onChange={e => onChange("tender_cost", e.target.value)}
          className="h-9 bg-yellow-50/50 border-border text-sm font-medium"
        />
      </div>
    </div>
  );
}