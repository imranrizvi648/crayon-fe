"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CIFProducts({ data, onChange }) {
  const [local, setLocal] = useState({
    cif_m365_e5_value:    data.cif_m365_e5_value    ?? 0,
    cif_m365_e3_value:    data.cif_m365_e3_value    ?? 0,
    cif_azure_value:      data.cif_azure_value      ?? 0,
    cif_dynamics_365_value: data.cif_dynamics_365_value ?? 0,
  });

  useEffect(() => {
    setLocal({
      cif_m365_e5_value:    data.cif_m365_e5_value    ?? 0,
      cif_m365_e3_value:    data.cif_m365_e3_value    ?? 0,
      cif_azure_value:      data.cif_azure_value      ?? 0,
      cif_dynamics_365_value: data.cif_dynamics_365_value ?? 0,
    });
  }, [data.cif_m365_e5_value, data.cif_m365_e3_value, data.cif_azure_value, data.cif_dynamics_365_value]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    onChange(name, value === "" ? 0 : Number(value));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-white">
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">M365E5</Label>
        <Input type="number" name="cif_m365_e5_value"
          value={local.cif_m365_e5_value}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">M365E3</Label>
        <Input type="number" name="cif_m365_e3_value"
          value={local.cif_m365_e3_value}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Azure</Label>
        <Input type="number" name="cif_azure_value"
          value={local.cif_azure_value}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dynamics365</Label>
        <Input type="number" name="cif_dynamics_365_value"
          value={local.cif_dynamics_365_value}
          onChange={handleChange} onBlur={handleBlur}
          placeholder="0.00" className="h-10 border-slate-200 focus:border-primary"
        />
      </div>
    </div>
  );
}