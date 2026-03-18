"use client";
import { EditField } from "./EditFields";

export function EditDiscountSection({ formData, onChange }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {["discount_year_1","discount_year_2","discount_year_3"].map((k, i) => (
        <EditField key={k} label={`Year ${i+1}`} name={k} value={formData[k]} onChange={onChange} type="number" />
      ))}
    </div>
  );
}