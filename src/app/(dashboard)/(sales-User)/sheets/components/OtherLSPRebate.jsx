"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function OtherLSPRebate({ data, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value === "" ? 0 : Number(value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-white">
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Rebate Year 1
        </Label>
        <Input 
          type="number" 
          name="rebate_year_1" 
          value={data.rebate_year_1} 
          onChange={handleInputChange} 
          placeholder="0"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Rebate Year 2
        </Label>
        <Input 
          type="number" 
          name="rebate_year_2" 
          value={data.rebate_year_2} 
          onChange={handleInputChange} 
          placeholder="0"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Rebate Year 3
        </Label>
        <Input 
          type="number" 
          name="rebate_year_3" 
          value={data.rebate_year_3} 
          onChange={handleInputChange} 
          placeholder="0"
          className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
    </div>
  );
}