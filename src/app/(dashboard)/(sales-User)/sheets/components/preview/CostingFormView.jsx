"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function CostingFormView({ sheet }) {
  if (!sheet) return null;

  const FormField = ({ label, value, required = false, isSelect = false }) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-[11px] font-bold text-[#64748B] uppercase tracking-tight">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input 
          readOnly 
          value={value || ""} 
          className="h-9 bg-[#F8FAFC] border-[#E2E8F0] text-[#1E293B] text-sm focus-visible:ring-0 cursor-default pr-8 font-medium"
        />
        {isSelect && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-5">
      {/* Row 1 */}
      <div className="md:col-span-2">
        <FormField label="Customer Name" value={sheet.customer?.name} required />
      </div>
      <FormField label="ERP Customer ID" value={sheet.customer?.id} />
      <FormField label="Opportunity ID" value={sheet.opportunity_id} />
      <FormField label="Customer Segment" value={sheet.customer_segment} />

      {/* Row 2 */}
      <FormField label="Region" value={sheet.sales_region} isSelect />
      <FormField label="Deal Type" value={sheet.deal_type} isSelect />
      <FormField label="Sales Location" value={sheet.sales_location} />
      {/* <FormField label="Producer Name" value="Producer" /> */}
      <FormField label="Account Manager" value={`${sheet.sales_user?.first_name} ${sheet.sales_user?.last_name}`} />

      {/* Row 3 */}
      <FormField label="Account Manager ID" value={`${sheet.sales_user?.id}`} />
      <FormField label="Agreement Type" value={sheet.agreement_type} />
      <FormField label="New/Renewal" value={sheet.new_or_renewal} isSelect />
      <FormField label="Currency" value={sheet.currency_code} />
      <FormField label="Exchange Rate" value={sheet.exchange_rate} />

      {/* Row 4 */}
      <FormField label="VAT %" value={sheet.vat_rate} />
      <FormField label="Agreement Level - System" value={sheet.agreement_level_system} isSelect />
      <FormField label="Agreement Level - Server" value={sheet.agreement_level_server} isSelect />
      <FormField label="Agreement Level - Application" value={sheet.agreement_level_application} isSelect />
    </div>
  );
}