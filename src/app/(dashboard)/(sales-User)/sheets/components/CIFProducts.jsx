"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CIFProducts({ data, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Number conversion taaki calculations sahi rahein
    onChange(name, value === "" ? 0 : Number(value));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white">
      {/* M365E5 */}
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          M365E5
        </Label>
        <Input 
          type="number" 
          name="cif_m365e5" 
          value={data.cif_m365e5} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>

      {/* M365E3 */}
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          M365E3
        </Label>
        <Input 
          type="number" 
          name="cif_m365e3" 
          value={data.cif_m365e3} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>

      {/* Azure */}
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Azure
        </Label>
        <Input 
          type="number" 
          name="cif_azure" 
          value={data.cif_azure} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>

      {/* Dynamics365 */}
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Dynamics365
        </Label>
        <Input 
          type="number" 
          name="cif_dynamics365" 
          value={data.cif_dynamics365} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
    </div>
  );
}