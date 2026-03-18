"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCostingSheets } from "../../_hooks/useCostingSheets";
import { 
  ChevronLeft, 
  Loader2, 
  PencilLine, 
  DollarSign, 
  FileSpreadsheet, 
  Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

// --- Tab Components Imports ---
import { CostingFormView } from "../_components/CostingFormView";
import { LineItemsSection } from "../_components/LineItemsSection";
import { DiscountSection } from "../_components/DiscountSection";
import { BidBondSection } from "../_components/BidBondSection";
import { RebateSection } from "../_components/RebateSection";
import { CIFProductsSection } from "../_components/CIFProductsSection";
import { MergedSummarySection } from "../_components/MergedSummarySection";
import { MergedFinancialCards } from "../_components/MergedFinancialCards";
import { CostPriceSection } from "../_components/CostPriceSection"; 
import { RetailPriceSection } from "../_components/RetailPriceSection";
import { GPWithoutRebates } from "../_components/GPWithoutRebates";
import { GPWithRebates } from "../_components/GPWithRebates";
import { GPWithCrayonCost } from "../_components/GPWithCrayonCost"; 
import { MergedBidBondSection } from "../_components/MergedBidBondSection";
import { EUPWithoutCrayonDiscount } from "../_components/EUPWithoutCrayonDiscount";
import { CrayonFundingSection } from "../_components/CrayonFundingSection";
import { PriceQuotationTable } from "../_components/PriceQuotationTable";
import { EUPWithCrayonDiscount } from "../_components/EUPWithCrayonDiscount";
import { CrayonRebateSection } from "../_components/CrayonRebateSection";
import { OtherLSPRebate } from "../_components/OtherLSPRebate";
import { CIFProductsMerged } from "../_components/CIFProductsMerged";

// --- Skeleton Component for Loading State ---
const SkeletonLoader = () => (
  <div className="w-full space-y-6 animate-pulse">
    {/* Financial Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-28 bg-slate-100 rounded-xl border border-slate-200" />
      ))}
    </div>
    {/* Main Content Area Skeleton */}
    <div className="space-y-4">
      <div className="h-12 bg-slate-100 rounded-lg w-full" />
      <div className="h-64 bg-slate-50 rounded-lg w-full border border-slate-100" />
      <div className="h-12 bg-slate-100 rounded-lg w-full" />
    </div>
  </div>
);

export default function SheetPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchSheetDetail, exportSheet } = useCostingSheets();
  
  const [activeTab, setActiveTab] = useState("costing");
  const [sheet, setSheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (params.id) {
        setLoading(true);
        const result = await fetchSheetDetail(params.id);
        if (result.success) {
          setSheet(result.data);
        }
        setLoading(false);
      }
    };
    loadData();
  }, [params.id, fetchSheetDetail]);

  const handleExport = async () => {
    if (!sheet) return;
    setIsExporting(true);
    await exportSheet(sheet.id, sheet.sheet_number);
    setIsExporting(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFCFE]">
      
      {/* --- STICKY HEADER --- */}
      <div className="bg-white border-b sticky top-0  shadow-sm -mt-5">
        <div className="mx-auto flex items-center h-14 px-4 max-w-[1600px]">
          
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()} 
            className="mr-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </Button>

          <div className="flex items-center justify-between w-full h-full">
            {/* Tabs */}
            <div className="flex h-full">
              {[
                { id: "costing", label: "Costing Form", icon: PencilLine },
                { id: "merged", label: "Merged", icon: DollarSign },
                { id: "final", label: "Final Price Table", icon: FileSpreadsheet },
              ].map((tab) => (
                <button
                  key={tab.id}
                  disabled={loading}
                  onClick={() => setActiveTab(tab.id)}
                  className={`h-full px-6 flex items-center gap-2 font-bold text-[13px] transition-all border-b-2 outline-none ${
                    activeTab === tab.id 
                      ? "border-primary bg-[#F8FAFF] text-secondary" 
                      : "border-transparent text-slate-500 hover:text-slate-600 hover:bg-slate-50"
                  } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <tab.icon size={16} /> 
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Export Action */}
            <Button 
              variant="default"
              size="sm"
              className="gap-2 bg-secondary hover:bg-secondary/90 text-white font-bold h-9 px-4 transition-all shadow-sm shadow-secondary/20"
              onClick={handleExport}
              disabled={loading || !sheet || isExporting}
            >
              {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              {isExporting ? "Exporting..." : "Export to Excel"}
            </Button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="py-6 px-4 max-w-[1600px] mx-auto">
        
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            
            {/* --- TAB 1: COSTING FORM --- */}
            {activeTab === "costing" && sheet && (
              <div className="w-full space-y-4">
                <Accordion type="multiple" defaultValue={["customer", "line-items"]} className="w-full space-y-4">
                  
                  <AccordionItem value="customer" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm border-none">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg">
                      <span className="text-[13px] font-bold text-[#1E293B]">Customer & Agreement Details</span>
                    </AccordionTrigger>
                    <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                      <CostingFormView sheet={sheet} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="line-items" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm border-none">
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

                  <AccordionItem value="discount" className="bg-white border border-[#E2E8F0] rounded-lg border-none shadow-none">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">Crayon Discount/Funding (AED)</AccordionTrigger>
                    <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                      <DiscountSection sheet={sheet} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bonds" className="bg-white border border-[#E2E8F0] rounded-lg border-none shadow-none">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">Bid Bond & Bank Charges</AccordionTrigger>
                    <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                      <BidBondSection sheet={sheet} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="rebate" className="bg-white border border-[#E2E8F0] rounded-lg border-none shadow-none">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">Other LSP Rebate (AED)</AccordionTrigger>
                    <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                      <RebateSection sheet={sheet} />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="cif" className="bg-white border border-[#E2E8F0] rounded-lg border-none shadow-none">
                    <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">CIF Products (AED) - Yearly Value</AccordionTrigger>
                    <AccordionContent className="border border-[#E2E8F0] border-t-0 p-6 rounded-b-lg">
                      <CIFProductsSection sheet={sheet} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            {/* --- TAB 2: MERGED VIEW --- */}
            {activeTab === "merged" && sheet && (
              <div className="w-full space-y-6">
                <MergedSummarySection sheet={sheet} />
                <MergedFinancialCards sheet={sheet} />
                <CostPriceSection sheet={sheet} />
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

                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <GPWithoutRebates sheet={sheet} />
                  <GPWithRebates sheet={sheet} />
                </div>
                
                <GPWithCrayonCost sheet={sheet} />
                <MergedBidBondSection sheet={sheet} />
              </div>
            )}

            {/* --- TAB 3: FINAL PRICE TABLE --- */}
            {activeTab === "final" && sheet && (
              <div className="w-full space-y-6">
                <PriceQuotationTable sheet={sheet} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}