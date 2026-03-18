"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import { useCostingSheets } from "../_hooks/useCostingSheets";

import { CustomerDetails } from "./_components/CustomerDetails";
import { LineItemsSection } from "./_components/LineItemsSection";
import { CrayonDiscount } from "./_components/CrayonDiscount";
import { BidBondDetails } from "./_components/BidBondDetails";
import { OtherLSPRebate } from "./_components/OtherLSPRebate";
import { CIFProducts } from "./_components/CIFProducts";

export default function CreateSheetPage() {
  const router = useRouter();
  const { createSheet } = useCostingSheets();

  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    erp_customer_id: "",
    opportunity_id: "",

    customer_segment: "ENTERPRISE",
    business_area: "UAE",

    // Backend enum: UAE | KSA | AFRICA | GLOBAL
    region: "UAE",

    deal_type: "NORMAL",
    sales_location: "Dubai",

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

    line_items: [
      {
        id: Date.now(),
        category: "Enterprise Online",
        part_number: "",
        item_name: "",
        unit_type: 0,

        qty: 0,
        unit_net_usd: 0,
        unit_erp_usd: 0,
        ms_discount: 0,
        crayon_markup: 0,
        rebate_percent: 0,

        qty_y2: 0,
        unit_net_usd_y2: 0,
        unit_erp_usd_y2: 0,
        ms_discount_y2: 0,
        crayon_markup_y2: 0,
        rebate_percent_y2: 0,

        qty_y3: 0,
        unit_net_usd_y3: 0,
        unit_erp_usd_y3: 0,
        ms_discount_y3: 0,
        crayon_markup_y3: 0,
        rebate_percent_y3: 0,

        swo_gp_percent: 0,
      },
    ],

    discount_year_1: 0,
    discount_year_2: 0,
    discount_year_3: 0,

    bid_bond_percent: 0,
    bank_charges_percent: 0,

    performance_bond_percent: 0,
   performance_bank_charges_percent: 0,

    tender_cost: 0,

    rebate_year_1: 0,
    rebate_year_2: 0,
    rebate_year_3: 0,

    cif_m365_e5_value: 0,
    cif_m365_e3_value: 0,
    cif_azure_value: 0,
    cif_dynamics_365_value: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateLineItems = (items) => {
    setFormData((prev) => ({ ...prev, line_items: items }));
  };

  const handleSave = async () => {
    if (!formData.customer_id || isNaN(Number(formData.customer_id))) {
      alert("❌ Please enter valid Customer ID");
      return;
    }

    const validLineItems = formData.line_items.filter(
      (item) => item.part_number?.trim() || item.item_name?.trim(),
    );

    if (validLineItems.length === 0) {
      alert("❌ Add at least one valid product");
      return;
    }

    setIsSubmitting(true);

    try {
      const formattedLineItems = validLineItems.map((item) => ({
        part_number: item.part_number || "N/A",
        product_name: item.item_name || "Unknown Product",
        product_type: (() => {
          const cat = item.category || "Enterprise Online";
          if (/enterprise online/i.test(cat)) return "ENTERPRISE_ONLINE";
          if (/on.?premise/i.test(cat)) return "ON_PREMISE";
          if (/additional/i.test(cat)) return "ADDITIONAL_ONLINE";
          return "OTHER";
        })(),
        unit_type: Number(item.unit_type || 0),

        quantity_y1: Number(item.qty || 0),
        unit_net_usd_y1: Number(item.unit_net_usd || 0),
        unit_erp_usd_y1: Number(item.unit_erp_usd || 0),
        ms_discount_percentage_y1: Number(item.ms_discount || 0) / 100,
        markup_percentage_y1: Number(item.crayon_markup || 0) / 100,
        rebate_percentage_y1: Number(item.rebate_percent || 0) / 100,

        quantity_y2: Number(item.qty_y2 || 0),
        unit_net_usd_y2: Number(item.unit_net_usd_y2 || 0),
        unit_erp_usd_y2: Number(item.unit_erp_usd_y2 || 0),
        ms_discount_percentage_y2: Number(item.ms_discount_y2 || 0) / 100,
        markup_percentage_y2: Number(item.crayon_markup_y2 || 0) / 100,
        rebate_percentage_y2: Number(item.rebate_percent_y2 || 0) / 100,

        quantity_y3: Number(item.qty_y3 || 0),
        unit_net_usd_y3: Number(item.unit_net_usd_y3 || 0),
        unit_erp_usd_y3: Number(item.unit_erp_usd_y3 || 0),
        ms_discount_percentage_y3: Number(item.ms_discount_y3 || 0) / 100,
        markup_percentage_y3: Number(item.crayon_markup_y3 || 0) / 100,
        rebate_percentage_y3: Number(item.rebate_percent_y3 || 0) / 100,

        // BAAD
      swo_gp_percentage_y1: Number(item.swo_gp_percent    || 0) / 100,
swo_gp_percentage_y2: Number(item.swo_gp_percent_y2 || 0) / 100,
swo_gp_percentage_y3: Number(item.swo_gp_percent_y3 || 0) / 100,
      }));

      const payload = {
        template_type: "FEWA",

        customer_id: Number(formData.customer_id),
        opportunity_name: formData.customer_name || "New Opportunity",
        opportunity_id: formData.opportunity_id || "OPP-DEFAULT",
        agreement_type: "ENTERPRISE_ENROLLMENT",
        partner_id: 1,

        new_or_renewal: formData.new_renewal?.toUpperCase() || "RENEWAL",
        sales_location: formData.sales_location || "Dubai",

        // Direct pass — formData.region is already backend enum: UAE | KSA | AFRICA | GLOBAL
        sales_region: formData.region,

        currency_code: formData.currency || "AED",
        exchange_rate: Number(formData.exchange_rate),
        vat_rate: Number(formData.vat_percent) / 100,

        customer_segment: formData.customer_segment,
        deal_type: formData.deal_type,

        agreement_level_system: formData.agreement_level_system,
        agreement_level_server: formData.agreement_level_server,
        agreement_level_application: formData.agreement_level_application,

        discount_year_1: Number(formData.discount_year_1),
        discount_year_2: Number(formData.discount_year_2),
        discount_year_3: Number(formData.discount_year_3),

        rebate_year_1: Number(formData.rebate_year_1),
        rebate_year_2: Number(formData.rebate_year_2),
        rebate_year_3: Number(formData.rebate_year_3),

        cif_m365_e5_value: Number(formData.cif_m365_e5_value || 0),
        cif_m365_e3_value: Number(formData.cif_m365_e3_value || 0),
        cif_azure_value: Number(formData.cif_azure_value || 0),
        cif_dynamics_365_value: Number(formData.cif_dynamics_365_value || 0),

        tender_cost: Number(formData.tender_cost),
        bid_bond_percentage: Number(formData.bid_bond_percent),
        bank_charges_percentage: Number(formData.bank_charges_percent),
        performance_bond_percentage: Number(formData.performance_bond_percent),
        performance_bank_charges_percentage: Number(formData.performance_bank_charges_percent),

        line_items: formattedLineItems,
      };

      const result = await createSheet(payload);

      if (result?.success) {
        alert("✅ Sheet saved successfully");
        router.push("/sheets");
      }
    } catch (error) {
      console.error("Save error", error);
      alert("❌ Error saving sheet");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 px-5 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            <ArrowLeft size={16} className="mr-2" /> Back
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary/90 px-6"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save size={16} className="mr-2" />
            )}
            {isSubmitting ? "Saving..." : "Save Sheet"}
          </Button>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["customer", "line-items"]}
          className="space-y-4"
        >
          {/* Customer Details */}
          <AccordionItem
            value="customer"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
              Customer & Agreement Details
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <CustomerDetails data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          {/* Line Items */}
          <AccordionItem
            value="line-items"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
              Line Items
            </AccordionTrigger>
            <AccordionContent className="p-0 border-t">
              <LineItemsSection
                items={formData.line_items}
                onChange={updateLineItems}
                region={formData.region}
                dealType={formData.deal_type}
                exchangeRate={Number(formData.exchange_rate) || 3.6725}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Crayon Discounts */}
          <AccordionItem
            value="crayon-discount"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
              Crayon Discounts (%)
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <CrayonDiscount data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          {/* Bid Bond */}
          <AccordionItem
            value="bid-bond"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
              Bid Bond & Performance Details
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <BidBondDetails data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          {/* LSP Rebate */}
          <AccordionItem
            value="lsp-rebate"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
              Other LSP Rebates
            </AccordionTrigger>
            <AccordionContent className="border-t p-6">
              <OtherLSPRebate data={formData} onChange={updateField} />
            </AccordionContent>
          </AccordionItem>

          {/* CIF Products */}
          <AccordionItem
            value="cif-products"
            className="bg-white border rounded shadow-sm"
          >
            <AccordionTrigger className="px-6 py-4 font-semibold">
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
