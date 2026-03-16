"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CrayonDiscount({ data, onChange }) {
  const [local, setLocal] = useState({
    discount_year_1: data.discount_year_1 ?? 0,
    discount_year_2: data.discount_year_2 ?? 0,
    discount_year_3: data.discount_year_3 ?? 0,
  });

  useEffect(() => {
    setLocal({
      discount_year_1: data.discount_year_1 ?? 0,
      discount_year_2: data.discount_year_2 ?? 0,
      discount_year_3: data.discount_year_3 ?? 0,
    });
  }, [data.discount_year_1, data.discount_year_2, data.discount_year_3]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    onChange(name, value === "" ? 0 : Number(value));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white">
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 1</Label>
        <Input type="number" name="discount_year_1"
          value={local.discount_year_1}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 2</Label>
        <Input type="number" name="discount_year_2"
          value={local.discount_year_2}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Year 3</Label>
        <Input type="number" name="discount_year_3"
          value={local.discount_year_3}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:ring-primary"
        />
      </div>
    </div>
  );
}