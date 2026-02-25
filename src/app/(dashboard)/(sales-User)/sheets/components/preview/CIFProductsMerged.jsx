import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function CIFProductsMerged({ sheet }) {
  if (!sheet) return null;

  const { currency_code } = sheet;

  // Helper row to keep it clean (No formatting functions used)
  const CIFRow = ({ label, value, isHighlighted = false }) => (
    <div className={`grid grid-cols-[1fr_200px] items-center px-6 py-2 border-b border-[#E2E8F0] last:border-0 ${isHighlighted ? 'bg-[#FEFCE8]' : ''}`}>
      <span className="text-[12px] text-slate-700 font-medium">{label}</span>
      <span className="text-[12px] font-mono text-slate-900 text-right">
        {value && value !== "0.00" ? `${currency_code} ${value}` : "—"}
      </span>
    </div>
  );

  return (
    <div className="w-full mt-2">
      <Accordion type="single" collapsible defaultValue="cif-products" className="w-full">
        <AccordionItem value="cif-products" className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden border-none shadow-none">
          <AccordionTrigger className="px-6 py-3 hover:no-underline bg-white border border-[#E2E8F0] rounded-t-lg font-bold text-[13px] text-[#1E293B]">
            CIF Products
          </AccordionTrigger>
          
          <AccordionContent className="border border-[#E2E8F0] border-t-0 p-0 rounded-b-lg">
            {/* Sub-header */}
            <div className="bg-[#F8FAFC] grid grid-cols-[1fr_200px] px-6 py-2 border-b border-[#E2E8F0]">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CIF Products</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Yearly Value</span>
            </div>

            <div className="flex flex-col">
              <CIFRow 
                label="M365E5" 
                value={sheet.cif_m365_e5_value} 
                isHighlighted={sheet.cif_m365_e5_value && sheet.cif_m365_e5_value !== "0.00"}
              />
              <CIFRow 
                label="M365E3" 
                value={sheet.cif_m365_e3_value} 
              />
              <CIFRow 
                label="Azure" 
                value={sheet.cif_azure_value} 
              />
              <CIFRow 
                label="Dynamics365" 
                value={sheet.cif_dynamics_365_value} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}