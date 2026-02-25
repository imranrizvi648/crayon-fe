"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCostingSheets } from "../../hooks/useCostingSheets";
import { ChevronLeft, Loader2, PencilLine, DollarSign, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";

// Accordion imports direct yahan
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// In dono ko aapko import karna hoga kyunke ye alag files hain
import { CostingFormView } from "../../components/preview/CostingFormView";
import { LineItemsSection } from "../../components/preview/LineItemsSection";
import { DiscountSection } from "../../components/preview/DiscountSection";
import { BidBondSection } from "../../components/preview/BidBondSection";
import { RebateSection } from "../../components/preview/RebateSection";
import { CIFProductsSection } from "../../components/preview/CIFProductsSection";

//merge
import { MergedSummarySection } from "../../components/preview/MergedSummarySection";
import { MergedFinancialCards } from "../../components/preview/MergedFinancialCards";
import { CostPriceSection } from "../../components/preview/CostPriceSection"; 
import { RetailPriceSection } from "../../components/preview/RetailPriceSection";// New Import
import { GPWithoutRebates } from "../../components/preview/GPWithoutRebates";
import { GPWithRebates } from "../../components/preview/GPWithRebates";
import { GPWithCrayonCost } from "../../components/preview/GPWithCrayonCost"; 
import { MergedBidBondSection } from "../../components/preview/MergedBidBondSection";
import { EUPWithoutCrayonDiscount } from "../../components/preview/EUPWithoutCrayonDiscount";
import { CrayonFundingSection } from "../../components/preview/CrayonFundingSection";


// final price table

import { PriceQuotationTable } from "../../components/preview/PriceQuotationTable";
import { EUPWithCrayonDiscount } from "../../components/preview/EUPWithCrayonDiscount";
import { CrayonRebateSection } from "../../components/preview/CrayonRebateSection";
import { OtherLSPRebate } from "../../components/preview/OtherLSPRebate";
import { CIFProductsMerged } from "../../components/preview/CIFProductsMerged";



export default function SheetPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchSheetDetail } = useCostingSheets();
  
  const [activeTab, setActiveTab] = useState("costing");
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (params.id) {
        setLoading(true);
        const result = await fetchSheetDetail(params.id);
        if (result.success) setSheet(result.data);
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, fetchSheetDetail]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white font-bold text-secondary">
      <Loader2 className="animate-spin mr-2" size={40} /> Loading Data...
    </div>
  );

  return (
    <div className="min-h-screen  ">
   
      {/* Page Header Strip ko niche waale code se badal dein */}
<div className="bg-white border-b sticky  z-40 shadow-sm -mt-5">
  <div className="mx-auto flex items-center h-14 ">
    
    {/* Back Button */}
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={() => router.back()} 
      className="mr-4 text-slate-500 hover:text-slate-900"
    >
      <ChevronLeft size={20} />
    </Button>

    {/* Tab Buttons Container */}
    <div className="flex h-full gap-0 relative">
      {[
        { id: "costing", label: "Costing Form", icon: PencilLine },
        { id: "merged", label: "Merged", icon: DollarSign },
        { id: "final", label: "Final Price Table", icon: FileSpreadsheet },
      ].map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`h-full px-6 flex items-center gap-2 font-semibold text-[13px] transition-all border-b-2 outline-none ${
            activeTab === tab.id 
              ? "border-primary bg-[#F8FAFF] text-secondary" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          <tab.icon size={16} /> 
          {tab.label}
        </button>
      ))}
    </div>
  </div>
</div>

      {/* --- Main Content Area --- */}
      <main className="py-6  mx-auto">
        
        {/* Costing Form Tab: Direct Accordion Implementation */}
        {activeTab === "costing" && sheet && (
          <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-500">
            <Accordion type="multiple" defaultValue={["customer", "line-items"]} className="w-full space-y-4">
              
              {/* Section 1: Customer Details */}
              <AccordionItem value="customer" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg">
                  <span className="text-[13px] font-bold text-[#1E293B]">Customer & Agreement Details</span>
                </AccordionTrigger>
                <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                  <CostingFormView sheet={sheet} />
                </AccordionContent>
              </AccordionItem>

              {/* Section 2: Line Items */}
              <AccordionItem value="line-items" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-bold text-[#1E293B]">Line Items</span>
                    <span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {sheet?.line_items?.length || 0} products
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
                  <LineItemsSection sheet={sheet} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="discount" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
              <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">Crayon Discount/Funding (AED)</AccordionTrigger>
              <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg"><DiscountSection sheet={sheet} /></AccordionContent>
            </AccordionItem>

             {/* Bid Bonds */}
            <AccordionItem value="bonds" className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden shadow-none border-none">
              <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
                Bid Bond & Bank Charges
              </AccordionTrigger>
              <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                <BidBondSection sheet={sheet} />
              </AccordionContent>
            </AccordionItem>

              {/* 5. Other LSP Rebate Section */}
            <AccordionItem value="rebate" className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden border-none shadow-none">
              <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
                Other LSP Rebate (AED)
              </AccordionTrigger>
              <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                <RebateSection sheet={sheet} />
              </AccordionContent>
            </AccordionItem>

            {/* Section 6: CIF Products Yearly Value */}
              <AccordionItem value="cif" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
                <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
                  CIF Products (AED) - Yearly Value
                </AccordionTrigger>
                <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                  <CIFProductsSection sheet={sheet} />
                </AccordionContent>
              </AccordionItem>

            

            </Accordion>
          </div>
        )}
        
       {/* --- Updated Merged Tab View --- */}
        {activeTab === "merged" && sheet && (
          <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Direct render of the summary section */}
            <MergedSummarySection sheet={sheet} />
            
           {/* 2. 3-Year Financial Summary Cards */}
            <MergedFinancialCards sheet={sheet} />

{/* 3. Cost Price Breakdown Accordion */}
            <CostPriceSection sheet={sheet} />

            {/* 4. Estimated Retail Price Section */}
            <RetailPriceSection sheet={sheet} />

<div className="flex flex-col md:flex-row gap-4 w-full">
<EUPWithoutCrayonDiscount sheet={sheet} />
<CrayonFundingSection sheet={sheet} />
</div>

<div className="flex flex-col md:flex-row gap-4 w-full">
<EUPWithCrayonDiscount sheet={sheet} />
<CrayonRebateSection sheet={sheet} />

</div>

<div className="flex flex-col md:flex-row gap-4 w-full">
<OtherLSPRebate sheet={sheet} />
<CIFProductsMerged sheet={sheet} />
</div>

     {/* 5. GP Comparison Sections (Side-by-side) */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <GPWithoutRebates sheet={sheet} />
              <GPWithRebates sheet={sheet} />
            </div>
{/* 6. GP Comparison Sections (Side-by-side) */}
            <GPWithCrayonCost sheet={sheet} />

            {/* Naya Detailed Bond Section */}
    <MergedBidBondSection sheet={sheet} />
        
           
          </div>
        )}
       {/* --- 3. FINAL PRICE TABLE TAB --- */}
        {activeTab === "final" && sheet && (
          <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-500">
            {/* Price Quotation Table yahan render ho raha hai */}
            <PriceQuotationTable sheet={sheet} />
          </div>
        )}
      </main>
    </div>
  );
}