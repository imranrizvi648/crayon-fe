"use client";
import { EditField } from "./EditFields";

export function EditRebateSection({ formData, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {["rebate_year_1","rebate_year_2","rebate_year_3"].map((k, i) => (
        <EditField key={k} label={`Rebate Year ${i+1}`} name={k} value={formData[k]} onChange={onChange} type="number" />
      ))}
    </div>
  );
}