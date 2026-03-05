import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function DiscountSection({ sheet }) {
  const Field = ({ label, value }) => (
    <div className="flex flex-col gap-1.5 flex-1">
      <Label className="text-[11px] font-bold text-[#64748B] uppercase">{label}</Label>
      <Input readOnly value={value || "0.00"} className="h-10 bg-white border-[#E2E8F0] text-sm focus:ring-0" />
    </div>
  );

  return (
    <div className="flex gap-6 p-1">
      <Field label="Year 1" value={sheet?.discount_year_1} />
      <Field label="Year 2" value={sheet?.discount_year_2} />
      <Field label="Year 3" value={sheet?.discount_year_3} />
    </div>
  );
}