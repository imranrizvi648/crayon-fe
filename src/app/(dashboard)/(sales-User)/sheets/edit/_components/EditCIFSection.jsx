"use client";
import { EditField } from "./EditFields";

export function EditCIFSection({ formData, onChange }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <EditField label="M365E5"      name="cif_m365_e5_value"      value={formData.cif_m365_e5_value}      onChange={onChange} type="number" />
      <EditField label="M365E3"      name="cif_m365_e3_value"      value={formData.cif_m365_e3_value}      onChange={onChange} type="number" />
      <EditField label="Azure"       name="cif_azure_value"        value={formData.cif_azure_value}        onChange={onChange} type="number" />
      <EditField label="Dynamics365" name="cif_dynamics_365_value" value={formData.cif_dynamics_365_value} onChange={onChange} type="number" />
    </div>
  );
}