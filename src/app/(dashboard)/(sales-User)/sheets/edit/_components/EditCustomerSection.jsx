"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditField, EditSelect } from "./EditFields";

export function EditCustomerSection({ sheet, formData, onChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">

      <div className="md:col-span-2 flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">
          Customer Name <span className="text-primary">*</span>
        </Label>
        <Input readOnly value={sheet?.customer?.name || ""} className="h-9 bg-muted border-border text-sm font-medium cursor-default" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">ERP Customer ID</Label>
        <Input readOnly value={sheet?.customer?.id || ""} className="h-9 bg-muted border-border text-sm cursor-default" />
      </div>

      <EditField label="Opportunity ID"    name="opportunity_id"   value={formData.opportunity_id}   onChange={onChange} />
      <EditSelect label="Customer Segment" name="customer_segment" value={formData.customer_segment} onChange={onChange}
        options={[
          { value:"ENTERPRISE", label:"Enterprise" },
          { value:"SMB",        label:"SMB"        },
          { value:"GOVERNMENT", label:"Government" },
        ]}
      />

      <EditSelect label="Region" name="sales_region" value={formData.sales_region} onChange={onChange}
        options={[
          { value:"UAE",    label:"UAE"    },
          { value:"KSA",    label:"KSA"    },
          { value:"AFRICA", label:"Africa" },
          { value:"GLOBAL", label:"Global" },
        ]}
      />
      <EditSelect label="Deal Type" name="deal_type" value={formData.deal_type} onChange={onChange}
        options={[
          { value:"NORMAL", label:"Normal" },
          { value:"RAMPED", label:"Ramped" },
        ]}
      />
      <EditField label="Sales Location" name="sales_location" value={formData.sales_location} onChange={onChange} />

      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Account Manager</Label>
        <Input readOnly value={`${sheet?.sales_user?.first_name || ""} ${sheet?.sales_user?.last_name || ""}`} className="h-9 bg-muted border-border text-sm cursor-default" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Account Manager ID</Label>
        <Input readOnly value={sheet?.sales_user?.id || ""} className="h-9 bg-muted border-border text-sm cursor-default" />
      </div>

      <EditField label="Agreement Type" name="agreement_type" value={formData.agreement_type} onChange={onChange} />
      <EditSelect label="New/Renewal" name="new_or_renewal" value={formData.new_or_renewal} onChange={onChange}
        options={[
          { value:"NEW",     label:"New"     },
          { value:"RENEWAL", label:"Renewal" },
        ]}
      />
      <EditField label="Currency"      name="currency_code"  value={formData.currency_code}  onChange={onChange} />
      <EditField label="Exchange Rate" name="exchange_rate"  value={formData.exchange_rate}  onChange={onChange} type="number" />
      <EditField label="VAT %"         name="vat_rate"       value={formData.vat_rate}       onChange={onChange} type="number" />

      <EditSelect label="Agreement Level - System" name="agreement_level_system" value={formData.agreement_level_system} onChange={onChange}
        options={["A","B","C","D"].map(v => ({ value:v, label:v }))}
      />
      <EditSelect label="Agreement Level - Server" name="agreement_level_server" value={formData.agreement_level_server} onChange={onChange}
        options={["A","B","C","D"].map(v => ({ value:v, label:v }))}
      />
      <EditSelect label="Agreement Level - Application" name="agreement_level_application" value={formData.agreement_level_application} onChange={onChange}
        options={["A","B","C","D"].map(v => ({ value:v, label:v }))}
      />
    </div>
  );
}