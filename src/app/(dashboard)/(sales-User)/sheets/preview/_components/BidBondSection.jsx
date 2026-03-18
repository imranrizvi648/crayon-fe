import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function BidBondSection({ sheet }) {
  const Field = ({ label, value, isTender = false }) => (
    <div className="flex flex-col gap-1.5 flex-1">
      <Label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight">{label}</Label>
      <Input 
        readOnly 
        value={value || "0"} 
        className={`h-10 border-[#E2E8F0] text-sm focus:ring-0 ${isTender ? 'bg-[#FFFBEB]' : 'bg-white'}`} 
      />
    </div>
  );

  return (
    <div className="flex gap-6 p-1">
      <Field label="Bid Bond %" value={sheet?.bid_bond_percentage} />
      <Field label="Bank Charges %" value={sheet?.bank_charges_percentage} />
      <Field label="Performance Bond %" value={sheet?.performance_bond_percentage} />
      <Field label="Performance Bank Charges %" value={sheet?.performance_bank_charges_percentage} />
      <Field label="Tender Cost (AED)" value={sheet?.tender_cost} isTender />
    </div>
  );
}