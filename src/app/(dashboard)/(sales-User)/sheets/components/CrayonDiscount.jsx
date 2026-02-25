"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CrayonDiscount({ data, onChange }) {
  const handleInputChange = (e) => {
    // Number conversion taaki calculation mein masla na ho
    const value = e.target.type === "number" ? Number(e.target.value) : e.target.value;
    onChange(e.target.name, value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 1</Label>
        <Input 
          type="number" 
          name="discount_year_1" 
          value={data.discount_year_1} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 2</Label>
        <Input 
          type="number" 
          name="discount_year_2" 
          value={data.discount_year_2} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 3</Label>
        <Input 
          type="number" 
          name="discount_year_3" 
          value={data.discount_year_3} 
          onChange={handleInputChange} 
          placeholder="0.00"
          className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
    </div>
  );
}