"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useCostingSheets } from "../hooks/useCostingSheets";

// Components
import { CustomerDetails } from "../components/CustomerDetails";
import { LineItemsSection } from "../components/LineItemsSection"; 
import { CrayonDiscount } from "../components/CrayonDiscount";
import { BidBondDetails } from "../components/BidBondDetails";
import { OtherLSPRebate } from "../components/OtherLSPRebate";
import { CIFProducts } from "../components/CIFProducts";

export default function CreateSheetPage() {
  const router = useRouter();
  const { createSheet } = useCostingSheets(); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: "", 
    customer_name: "", 
    erp_customer_id: "",
    opportunity_id: "",
    customer_segment: "",
    business_area: "",
    region: "UAE",
    deal_type: "NORMAL",
    sales_location: "",
    producer_name: "",
    account_manager: "",
    account_manager_id: "",
    agreement_type: "Enterprise Enrollment",
    new_renewal: "Renewal",
    currency: "AED",
    exchange_rate: 3.6725,
    vat_percent: 5,
    agreement_level_system: "D",
    agreement_level_server: "D",
    agreement_level_application: "D",

    line_items: [{
      id: Date.now(),
      category: "Enterprise Online",
    part_number: "", 
  item_name: "", 
  unit_net_usd: 0, 
      unit_net_usd_y1: 0,
      unit_erp_usd: 0,
      ms_discount: 0,
      crayon_markup: 0,
      qty: 0,
      unit_type: 12,
      rebate_percent: 0,
    }],
    discount_year_1: 0,
    discount_year_2: 0,
    discount_year_3: 0,
    bid_bond_percent: 0,
    bank_charges_percent: 3,
    performance_bond_percent: 0,
    performance_bank_charges_percent: 1,
    tender_cost: 0,
    rebate_year_1: 0,
    rebate_year_2: 0,
    rebate_year_3: 0,
    cif_m365e5: 0,
    cif_m365e3: 0,
    cif_azure: 0,
    cif_dynamics365: 0,
  });

  const updateField = (name, value) => {
    const numericFields = [
      "customer_id", "exchange_rate", "vat_percent", "discount_year_1", 
      "bid_bond_percent", "bank_charges_percent", "tender_cost",
      "rebate_year_1", "cif_m365e5", "cif_azure"
    ];
    const finalValue = numericFields.includes(name) ? (value === "" ? "" : Number(value)) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const updateLineItems = (newItems) => {
    setFormData(prev => ({ ...prev, line_items: newItems }));
  };
const handleSave = async () => {
  if (!formData.customer_id || !formData.customer_name) {
    alert("❌ Please enter Customer ID and Name!");
    return;
  }

  setIsSubmitting(true);

  try {
    // Backend requirements ke mutabiq payload mapping
    const payload = {
      template_type: "FEWA",
      customer_id: Number(formData.customer_id),
      opportunity_name: formData.customer_name,
      opportunity_id: formData.opportunity_id || "OPP-DEFAULT",
      agreement_type: "ENTERPRISE_ENROLLMENT",
      partner_id: 1,
      new_or_renewal: formData.new_renewal?.toUpperCase() || "RENEWAL",
      sales_location: formData.sales_location || "Dubai",
      sales_region: formData.region || "UAE",
      currency_code: "AED",
      exchange_rate: Number(formData.exchange_rate),
      vat_rate: Number(formData.vat_percent) / 100,
      customer_segment: formData.customer_segment || "ENTERPRISE",
      deal_type: formData.deal_type || "NORMAL",
      
      // Mandatory levels
      agreement_level_system: formData.agreement_level_system || "A",
      agreement_level_server: formData.agreement_level_server || "B",
      agreement_level_application: formData.agreement_level_application || "C",

      // Global Financials
      discount_year_1: Number(formData.discount_year_1 || 0),
      discount_year_2: Number(formData.discount_year_2 || 0),
      discount_year_3: Number(formData.discount_year_3 || 0),
      rebate_year_1: Number(formData.rebate_year_1 || 0),
      rebate_year_2: Number(formData.rebate_year_2 || 0),
      rebate_year_3: Number(formData.rebate_year_3 || 0),

      tender_cost: Number(formData.tender_cost || 0),
      bid_bond_percentage: Number(formData.bid_bond_percent || 0),
      bank_charges_percentage: Number(formData.bank_charges_percent || 0),
      performance_bond_percentage: Number(formData.performance_bond_percent || 0),
      performance_bank_charges_percentage: Number(formData.performance_bank_charges_percent || 0),

      // handleSave function ke andar payload mapping ko sahi karein
line_items: formData.line_items.map(item => ({
  part_number: item.part_number || "",
  
  // FIXED: item.product_name ko hata kar item.item_name karein
  // Kyunke LineItemsSection ki state mein field 'item_name' hai
  product_name: item.item_name || "", 
  
  product_type: item.category?.toUpperCase().replace(/\s+/g, "_") || "ENTERPRISE_ONLINE",
  unit_type: Number(item.unit_type || 12),
  quantity_y1: Number(item.qty || 0),
  
  // Pricing mapping update
  unit_net_usd_y1: Number(item.unit_net_usd || 0),
  unit_erp_usd_y1: Number(item.unit_erp_usd || 0),
  
  ms_discount_percentage_y1: Number(item.ms_discount || 0) / 100,
  markup_percentage_y1: Number(item.crayon_markup || 0) / 100,
  rebate_percentage_y1: Number(item.rebate_percent || 0) / 100,

  // Year 2 & 3 Auto-Fill
  quantity_y2: Number(item.qty || 0),
  unit_net_usd_y2: Number(item.unit_net_usd || 0),
  unit_erp_usd_y2: Number(item.unit_erp_usd || 0),
  ms_discount_percentage_y2: Number(item.ms_discount || 0) / 100,
  markup_percentage_y2: Number(item.crayon_markup || 0) / 100,
  rebate_percentage_y2: Number(item.rebate_percent || 0) / 100,

  quantity_y3: Number(item.qty || 0),
  unit_net_usd_y3: Number(item.unit_net_usd || 0),
  unit_erp_usd_y3: Number(item.unit_erp_usd || 0),
  ms_discount_percentage_y3: Number(item.ms_discount || 0) / 100,
  markup_percentage_y3: Number(item.crayon_markup || 0) / 100,
  rebate_percentage_y3: Number(item.rebate_percent || 0) / 100,
}))
    };

    const result = await createSheet(payload); 

    if (result && result.success) {
      alert("✅ Sheet saved successfully!");
      router.push("/sheets");
    }
  } catch (error) {
    // ERROR HANDLING LOGIC
    if (error.code === "ERR_NETWORK" || error.message.includes("CORS")) {
      alert("🚫 CORS/Network Error: Backend server access block kar raha hai. Backend team ko bolein ke CORS allow karein.");
    } else if (error.response) {
      const { status, data } = error.response;
      if (status === 500) {
        alert("🔥 Server Error (500): Backend crash ho raha hai. Shayad customer_id ya partner_id database mein nahi hai.");
      } else if (status === 422) {
        const detailMsg = data.details?.map(d => `${d.field}: ${d.message}`).join("\n");
        alert(`📝 Validation Error:\n${detailMsg}`);
      } else {
        alert(`❌ Error ${status}: ${data.message || "Something went wrong"}`);
      }
    } else {
      alert(`⚠️ Unexpected Error: ${error.message}`);
    }
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-slate-50/50 px-5 ">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.back()} disabled={isSubmitting}>
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <Button className="bg-primary px-6" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={16} className="mr-2" />} 
            {isSubmitting ? "Saving..." : "Save Sheet"}
          </Button>
        </div>

        <Accordion type="multiple" defaultValue={["customer", "line-items"]} className="space-y-4">
          <AccordionItem value="customer" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700">Customer & Agreement Details</AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <CustomerDetails data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="line-items" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700 hover:no-underline">
              Line Items
            </AccordionTrigger>
            <AccordionContent className="p-0 border-t">
              <LineItemsSection items={formData.line_items} onChange={updateLineItems} dealType={formData.deal_type} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crayon-discount" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700 hover:no-underline">
              Crayon Discounts (%)
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <CrayonDiscount data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bid-bond" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700 hover:no-underline">
              Bid Bond & Performance Details
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <BidBondDetails data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="lsp-rebate" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700 hover:no-underline">
              Other LSP Rebates
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <OtherLSPRebate data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cif-products" className="bg-white border rounded shadow-sm overflow-hidden">
            <AccordionTrigger className="px-6 py-4 font-semibold text-slate-700 hover:no-underline">
              CIF Products (Investment)
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <CIFProducts data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}