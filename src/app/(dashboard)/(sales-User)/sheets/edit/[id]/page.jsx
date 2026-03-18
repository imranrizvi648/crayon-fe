"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCostingSheets } from "../../_hooks/useCostingSheets";
import { ChevronLeft, Save, Loader2, PencilLine, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { LineItemsSection } from "../../create-sheet/_components/LineItemsSection";
import { EditCustomerSection } from "../_components/EditCustomerSection";
import { EditDiscountSection } from "../_components/EditDiscountSection";
import { EditBidBondSection }   from "../_components/EditBidBondSection";
import { EditRebateSection }    from "../_components/EditRebateSection";
import { EditCIFSection }       from "../_components/EditCIFSection";

const SkeletonLoader = () => (
  <div className="w-full space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-16 bg-slate-100 rounded-xl border border-slate-200" />
      ))}
    </div>
    <div className="space-y-4">
      <div className="h-12 bg-slate-100 rounded-lg w-full" />
      <div className="h-64 bg-slate-50 rounded-lg w-full border border-slate-100" />
    </div>
  </div>
);

export default function EditSheetPage() {
  const params  = useParams();
  const router  = useRouter();
  const { fetchSheetDetail, updateSheet, exportSheet } = useCostingSheets();

  const [sheet,       setSheet]       = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [isSaving,    setIsSaving]    = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [formData,    setFormData]    = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!params.id) return;
      setLoading(true);
      const result = await fetchSheetDetail(params.id);
      if (result.success) {
        setSheet(result.data);
        initForm(result.data);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const initForm = (s) => {
    setFormData({
      opportunity_id:                      s.opportunity_id               || "",
      sales_region:                        s.sales_region                 || "UAE",
      deal_type:                           s.deal_type                    || "NORMAL",
      sales_location:                      s.sales_location               || "",
      customer_segment:                    s.customer_segment             || "ENTERPRISE",
      agreement_type:                      s.agreement_type               || "",
      new_or_renewal:                      s.new_or_renewal               || "RENEWAL",
      currency_code:                       s.currency_code                || "AED",
      exchange_rate:                       s.exchange_rate                || 3.6725,
      vat_rate:                            Number(s.vat_rate || 0.05) * 100,
      agreement_level_system:              s.agreement_level_system       || "D",
      agreement_level_server:              s.agreement_level_server       || "D",
      agreement_level_application:         s.agreement_level_application  || "D",
      discount_year_1:                     s.discount_year_1              || 0,
      discount_year_2:                     s.discount_year_2              || 0,
      discount_year_3:                     s.discount_year_3              || 0,
      bid_bond_percentage:                 s.bid_bond_percentage          || 0,
      bank_charges_percentage:             s.bank_charges_percentage      || 0,
      performance_bond_percentage:         s.performance_bond_percentage  || 0,
      performance_bank_charges_percentage: s.performance_bank_charges_percentage || 0,
      tender_cost:                         s.tender_cost                  || 0,
      rebate_year_1:                       s.rebate_year_1                || 0,
      rebate_year_2:                       s.rebate_year_2                || 0,
      rebate_year_3:                       s.rebate_year_3                || 0,
      cif_m365_e5_value:                   s.cif_m365_e5_value            || 0,
      cif_m365_e3_value:                   s.cif_m365_e3_value            || 0,
      cif_azure_value:                     s.cif_azure_value              || 0,
      cif_dynamics_365_value:              s.cif_dynamics_365_value       || 0,
      line_items: (s.line_items || []).map(item => ({
        id:               item.id,
        category: (() => {
          if (item.product_type === "ENTERPRISE_ONLINE") return "Enterprise Online";
          if (item.product_type === "ON_PREMISE")        return "Additional On Premise";
          if (item.product_type === "ADDITIONAL_ONLINE") return "Additional";
          return "Enterprise Online";
        })(),
        part_number:       item.part_number     || "",
        item_name:         item.product_name    || "",
        unit_type:         item.unit_type       || 0,
        qty:               item.quantity_y1     || 0,
        unit_net_usd:      item.unit_net_usd_y1 || 0,
        unit_erp_usd:      item.unit_erp_usd_y1 || 0,
        ms_discount:       Number(item.ms_discount_percentage_y1  || 0) * 100,
        crayon_markup:     Number(item.markup_percentage_y1       || 0) * 100,
        rebate_percent:    Number(item.rebate_percentage_y1       || 0) * 100,
        swo_gp_percent:    Number(item.swo_gp_percentage_y1       || 0) * 100,
        qty_y2:            item.quantity_y2     || 0,
        unit_net_usd_y2:   item.unit_net_usd_y2 || 0,
        unit_erp_usd_y2:   item.unit_erp_usd_y2 || 0,
        ms_discount_y2:    Number(item.ms_discount_percentage_y2  || 0) * 100,
        crayon_markup_y2:  Number(item.markup_percentage_y2       || 0) * 100,
        rebate_percent_y2: Number(item.rebate_percentage_y2       || 0) * 100,
        swo_gp_percent_y2: Number(item.swo_gp_percentage_y2       || 0) * 100,
        qty_y3:            item.quantity_y3     || 0,
        unit_net_usd_y3:   item.unit_net_usd_y3 || 0,
        unit_erp_usd_y3:   item.unit_erp_usd_y3 || 0,
        ms_discount_y3:    Number(item.ms_discount_percentage_y3  || 0) * 100,
        crayon_markup_y3:  Number(item.markup_percentage_y3       || 0) * 100,
        rebate_percent_y3: Number(item.rebate_percentage_y3       || 0) * 100,
        swo_gp_percent_y3: Number(item.swo_gp_percentage_y3       || 0) * 100,
      })),
    });
  };

  const updateField     = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const updateLineItems = (items)       => setFormData(prev => ({ ...prev, line_items: items }));

  const handleSave = async () => {
    if (!formData) return;
    setIsSaving(true);
    const validItems = formData.line_items.filter(i => i.part_number?.trim() || i.item_name?.trim());
    const payload = {
      opportunity_id:                      formData.opportunity_id,
      sales_region:                        formData.sales_region,
      deal_type:                           formData.deal_type,
      sales_location:                      formData.sales_location,
      customer_segment:                    formData.customer_segment,
      agreement_type:                      formData.agreement_type,
      new_or_renewal:                      formData.new_or_renewal,
      currency_code:                       formData.currency_code,
      exchange_rate:                       Number(formData.exchange_rate),
      vat_rate:                            Number(formData.vat_rate) / 100,
      agreement_level_system:              formData.agreement_level_system,
      agreement_level_server:              formData.agreement_level_server,
      agreement_level_application:         formData.agreement_level_application,
      discount_year_1:                     Number(formData.discount_year_1),
      discount_year_2:                     Number(formData.discount_year_2),
      discount_year_3:                     Number(formData.discount_year_3),
      bid_bond_percentage:                 Number(formData.bid_bond_percentage),
      bank_charges_percentage:             Number(formData.bank_charges_percentage),
      performance_bond_percentage:         Number(formData.performance_bond_percentage),
      performance_bank_charges_percentage: Number(formData.performance_bank_charges_percentage),
      tender_cost:                         Number(formData.tender_cost),
      rebate_year_1:                       Number(formData.rebate_year_1),
      rebate_year_2:                       Number(formData.rebate_year_2),
      rebate_year_3:                       Number(formData.rebate_year_3),
      cif_m365_e5_value:                   Number(formData.cif_m365_e5_value),
      cif_m365_e3_value:                   Number(formData.cif_m365_e3_value),
      cif_azure_value:                     Number(formData.cif_azure_value),
      cif_dynamics_365_value:              Number(formData.cif_dynamics_365_value),
      line_items: validItems.map(item => ({
        part_number:                 item.part_number  || "N/A",
        product_name:                item.item_name    || "Unknown",
        product_type: (() => {
          const cat = item.category || "Enterprise Online";
          if (/enterprise online/i.test(cat)) return "ENTERPRISE_ONLINE";
          if (/on.?premise/i.test(cat))       return "ON_PREMISE";
          if (/additional/i.test(cat))        return "ADDITIONAL_ONLINE";
          return "OTHER";
        })(),
        unit_type:                   Number(item.unit_type       || 0),
        quantity_y1:                 Number(item.qty             || 0),
        unit_net_usd_y1:             Number(item.unit_net_usd    || 0),
        unit_erp_usd_y1:             Number(item.unit_erp_usd    || 0),
        ms_discount_percentage_y1:   Number(item.ms_discount     || 0) / 100,
        markup_percentage_y1:        Number(item.crayon_markup   || 0) / 100,
        rebate_percentage_y1:        Number(item.rebate_percent  || 0) / 100,
        swo_gp_percentage_y1:        Number(item.swo_gp_percent  || 0) / 100,
        quantity_y2:                 Number(item.qty_y2          || 0),
        unit_net_usd_y2:             Number(item.unit_net_usd_y2 || 0),
        unit_erp_usd_y2:             Number(item.unit_erp_usd_y2 || 0),
        ms_discount_percentage_y2:   Number(item.ms_discount_y2  || 0) / 100,
        markup_percentage_y2:        Number(item.crayon_markup_y2|| 0) / 100,
        rebate_percentage_y2:        Number(item.rebate_percent_y2||0) / 100,
        swo_gp_percentage_y2:        Number(item.swo_gp_percent_y2||0) / 100,
        quantity_y3:                 Number(item.qty_y3          || 0),
        unit_net_usd_y3:             Number(item.unit_net_usd_y3 || 0),
        unit_erp_usd_y3:             Number(item.unit_erp_usd_y3 || 0),
        ms_discount_percentage_y3:   Number(item.ms_discount_y3  || 0) / 100,
        markup_percentage_y3:        Number(item.crayon_markup_y3|| 0) / 100,
        rebate_percentage_y3:        Number(item.rebate_percent_y3||0) / 100,
        swo_gp_percentage_y3:        Number(item.swo_gp_percent_y3||0) / 100,
      })),
    };
    const result = await updateSheet(params.id, payload);
    if (result?.success) router.push(`/sheets/preview/${params.id}`);
    setIsSaving(false);
  };

  const handleExport = async () => {
    if (!sheet) return;
    setIsExporting(true);
    await exportSheet(sheet.id, sheet.sheet_number);
    setIsExporting(false);
  };

  if (!formData && !loading) return null;

  return (
    <div className="min-h-screen bg-[#FBFCFE]">
      <div className="bg-white border-b sticky top-0 shadow-sm -mt-5 z-40">
        <div className="mx-auto flex items-center h-14 px-4 max-w-[1600px]">
          <Button variant="ghost" size="sm" onClick={() => router.back()} disabled={isSaving}
            className="mr-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft size={20} />
          </Button>
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-3 h-full">
              <div className="flex items-center gap-2 px-4 h-full border-b-2 border-primary text-secondary font-bold text-[13px]">
                <PencilLine size={16} />
                Edit Costing Sheet
                {sheet && <span className="text-[11px] font-mono text-muted-foreground ml-2">{sheet.sheet_number}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}
                disabled={loading || !sheet || isExporting}
                className="gap-2 h-9 border-border text-muted-foreground">
                {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                Export
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving || loading}
                className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold h-9 px-5 shadow-sm">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="py-6 px-4 max-w-[1600px] mx-auto">
        {loading ? <SkeletonLoader /> : (
          <div className="animate-in fade-in zoom-in-95 duration-500 space-y-4">
            <Accordion type="multiple" defaultValue={["customer","line-items"]} className="w-full space-y-4">

              <AccordionItem value="customer" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg">
                  <span className="text-[13px] font-bold text-foreground">Customer & Agreement Details</span>
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-6 rounded-b-lg">
                  <EditCustomerSection sheet={sheet} formData={formData} onChange={updateField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="line-items" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-foreground">Line Items</span>
                    <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {formData.line_items?.length || 0} products
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-0 rounded-b-lg">
                  <LineItemsSection
                    items={formData.line_items || []}
                    onChange={updateLineItems}
                    region={formData.sales_region}
                    dealType={formData.deal_type}
                    exchangeRate={Number(formData.exchange_rate) || 3.6725}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="discount" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg font-bold text-[13px] text-foreground">
                  Crayon Discount/Funding (AED)
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-6 rounded-b-lg">
                  <EditDiscountSection formData={formData} onChange={updateField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="bonds" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg font-bold text-[13px] text-foreground">
                  Bid Bond & Bank Charges
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-6 rounded-b-lg">
                  <EditBidBondSection formData={formData} onChange={updateField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="rebate" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg font-bold text-[13px] text-foreground">
                  Other LSP Rebate (AED)
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-6 rounded-b-lg">
                  <EditRebateSection formData={formData} onChange={updateField} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cif" className="bg-white border border-border rounded-lg shadow-sm border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-border rounded-t-lg font-bold text-[13px] text-foreground">
                  CIF Products (AED) - Yearly Value
                </AccordionTrigger>
                <AccordionContent className="border border-border border-t-0 p-6 rounded-b-lg">
                  <EditCIFSection formData={formData} onChange={updateField} />
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </div>
        )}
      </main>
    </div>
  );
}