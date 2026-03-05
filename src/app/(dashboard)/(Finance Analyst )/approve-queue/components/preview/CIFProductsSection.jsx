import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CIFProductsSection({ sheet }) {
  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-1.5 flex-1">
      <Label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight">{label}</Label>
      <Input 
        readOnly 
        value={value || "0"} 
        className="h-10 bg-white border-[#E2E8F0] text-sm focus:ring-0 cursor-default font-medium" 
      />
    </div>
  );

  return (
    <div className="flex gap-6 p-1">
      <Field label="M365E5" value={sheet?.cif_m365_e5_value} />
      <Field label="M365E3" value={sheet?.cif_m365_e3_value} />
      <Field label="Azure" value={sheet?.cif_azure_value} />
      <Field label="Dynamics365" value={sheet?.cif_dynamics_365_value} />
    </div>
  );
}