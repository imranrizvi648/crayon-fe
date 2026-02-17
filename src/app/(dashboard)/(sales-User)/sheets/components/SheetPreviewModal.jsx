"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, Globe, Landmark, Percent, Calculator, 
  Briefcase, Calendar, User, ShieldCheck, Info, Layers
} from "lucide-react";

export function SheetPreviewModal({ isOpen, onClose, sheet }) {
  if (!sheet) return null;

  const fmt = (val) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* FIX: 'max-h-[95vh]' ensure karta hai ke modal screen se bada na ho.
         'flex flex-col' header aur footer ko fix rakhega aur beech wala area scroll karega.
      */}
      <DialogContent className="max-w-[1450px] min-w-[1100px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden text-black">
        
        {/* Header - Fixed (Scroll nahi hoga) */}
        <DialogHeader className="p-6 border-b bg-slate-50 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="bg-[#1a3556] p-2 rounded-lg text-white">
                  <FileText size={24} />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-[#1a3556]">
                    {sheet.sheet_number}
                  </DialogTitle>
                  <div className="flex gap-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-700 uppercase font-black text-[10px]">
                      {sheet.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-300">
                      Version {sheet.version}
                    </Badge>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 font-medium ml-12 text-sm italic">
                {sheet.customer?.name} — {sheet.opportunity_name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Grand Total (Inc. VAT)</p>
              <p className="text-3xl font-black text-[#dc1e25]">
                {sheet.currency_code} {fmt(sheet.summary?.grand_total_with_vat)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* MAIN SCROLLABLE AREA 
           'flex-1' space fill karega aur 'overflow-y-auto' scroll enable karega
        */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="p-8 space-y-10">
            
            {/* 1. Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Entity Info */}
              <div className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-[11px] text-[#1a3556] flex items-center gap-2 border-b pb-2 uppercase tracking-wider">
                  <Globe size={14} /> Entity & Sales
                </h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-500">Segment: <span className="font-bold text-black">{sheet.customer_segment}</span></div>
                  <div className="flex justify-between text-slate-500">Region: <span className="font-bold text-black">{sheet.sales_region}</span></div>
                  <div className="flex justify-between text-slate-500">Deal: <span className="font-bold text-black">{sheet.deal_type}</span></div>
                </div>
              </div>

              {/* Agreement Specs */}
              <div className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-[11px] text-[#1a3556] flex items-center gap-2 border-b pb-2 uppercase tracking-wider">
                  <Briefcase size={14} /> Agreement Specs
                </h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-500">Type: <span className="font-bold text-black truncate max-w-[80px]">{sheet.agreement_type}</span></div>
                  <div className="flex justify-between text-slate-500">Category: <span className="font-bold text-blue-600">{sheet.new_or_renewal}</span></div>
                  <div className="flex justify-between text-slate-500">Levels: <span className="font-bold text-black">{sheet.agreement_level_system}/{sheet.agreement_level_server}</span></div>
                </div>
              </div>

              {/* GP & Markups */}
              <div className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-[11px] text-[#1a3556] flex items-center gap-2 border-b pb-2 uppercase tracking-wider">
                  <Percent size={14} /> GP & Markups
                </h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-500">GP Split: <span className="font-bold text-black">{sheet.gp_split_model}</span></div>
                  <div className="flex justify-between text-slate-500">Crayon GP: <span className="font-bold text-black">{sheet.crayon_gp_percentage}%</span></div>
                  <div className="flex justify-between text-slate-500">VAT: <span className="font-bold text-black">{(sheet.vat_rate * 100)}%</span></div>
                </div>
              </div>

              {/* Bonds & Costs */}
              <div className="p-4 border rounded-xl bg-slate-50/50 space-y-3">
                <h3 className="font-bold text-[11px] text-[#1a3556] flex items-center gap-2 border-b pb-2 uppercase tracking-wider">
                  <Layers size={14} /> Bonds & Costs
                </h3>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between text-slate-500">Bid Bond: <span className="font-bold text-black">{sheet.bid_bond_percentage}%</span></div>
                  <div className="flex justify-between text-slate-500">Perf Bond: <span className="font-bold text-black">{sheet.performance_bond_percentage}%</span></div>
                  <div className="flex justify-between text-slate-500 text-red-500">Tender: <span className="font-bold">{fmt(sheet.tender_cost)}</span></div>
                </div>
              </div>
            </div>

            {/* 2. CIF Section */}
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#1a3556] flex items-center gap-2 tracking-widest uppercase">
                <ShieldCheck size={16} className="text-blue-500" /> CIF Input Values ({sheet.currency_code})
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {['m365_e5', 'm365_e3', 'azure', 'dynamics_365'].map(key => (
                  <div key={key} className="p-3 border rounded-lg flex justify-between items-center shadow-sm bg-slate-50/30">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{key.replace('_', ' ')}</span>
                    <span className="text-xs font-black text-slate-700">{fmt(sheet[`cif_${key}_value`])}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Detailed Financial Summary */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-[#1a3556] flex items-center gap-2 uppercase tracking-tight">
                <Calculator size={20} className="text-blue-500" /> 3-Year Financial Summary Breakdown
              </h3>
              <div className="border rounded-xl overflow-hidden shadow-md">
                <Table>
                  <TableHeader className="bg-[#1a3556]">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-bold text-white text-xs">Metric Description</TableHead>
                      <TableHead className="text-right font-bold text-white text-xs">Year 1</TableHead>
                      <TableHead className="text-right font-bold text-white text-xs">Year 2</TableHead>
                      <TableHead className="text-right font-bold text-white text-xs">Year 3</TableHead>
                      <TableHead className="text-right font-bold text-blue-200 text-xs bg-white/10">Total (3Y)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Net Cost (USD)", k: "total_net" },
                      { label: "ERP Value", k: "total_erp" },
                      { label: "EUP Value", k: "total_eup" },
                      { label: "Rebate Amount", k: "total_rebate" },
                      { label: "Gross Profit (GP)", k: "gross_profit" },
                      { label: "EUP After Discount", k: "total_eup_after_discount" },
                    ].map((row, i) => (
                      <TableRow key={i} className="text-[11px] border-b hover:bg-slate-50 transition-colors">
                        <TableCell className="font-bold text-slate-600 italic uppercase tracking-tighter">{row.label}</TableCell>
                        <TableCell className="text-right font-medium">{fmt(sheet.summary?.[`${row.k}_y1`])}</TableCell>
                        <TableCell className="text-right font-medium">{fmt(sheet.summary?.[`${row.k}_y2`])}</TableCell>
                        <TableCell className="text-right font-medium">{fmt(sheet.summary?.[`${row.k}_y3`])}</TableCell>
                        <TableCell className="text-right font-black bg-blue-50 text-blue-800">{fmt(sheet.summary?.[`${row.k}_3y`])}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 4. Detailed Line Items Breakdown */}
            <div className="space-y-4 pb-20">
              <h3 className="font-bold text-lg text-[#1a3556] flex items-center gap-2 uppercase tracking-tight">
                <Info size={20} className="text-blue-500" /> Line Item Details & Individual Calculations
              </h3>
              <div className="border rounded-xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-slate-100">
                    <TableRow className="text-[10px] uppercase font-black">
                      <TableHead className="w-[350px]">Product / Part Number</TableHead>
                      <TableHead className="text-center">Quantities (Y1/2/3)</TableHead>
                      <TableHead className="text-right">Unit Net (USD)</TableHead>
                      <TableHead className="text-right">Markup %</TableHead>
                      <TableHead className="text-right bg-blue-50">Total EUP (3Y)</TableHead>
                      <TableHead className="text-right bg-green-50 text-green-700">GP (3Y)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheet.line_items?.map((item) => (
                      <TableRow key={item.id} className="text-xs hover:bg-slate-50 transition-colors border-b">
                        <TableCell>
                          <p className="font-black text-[#1a3556] uppercase tracking-tighter">{item.product_name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{item.part_number} | {item.product_type}</p>
                        </TableCell>
                        <TableCell className="text-center font-bold text-slate-600">
                          {item.quantity_y1} / {item.quantity_y2} / {item.quantity_y3}
                        </TableCell>
                        <TableCell className="text-right font-medium text-slate-500 italic">${fmt(item.unit_net_usd_y1)}</TableCell>
                        <TableCell className="text-right font-black text-blue-600">{(item.markup_percentage_y1 * 100).toFixed(1)}%</TableCell>
                        <TableCell className="text-right font-black text-slate-900 bg-blue-50">{fmt(item.calculated?.total_eup_3y)}</TableCell>
                        <TableCell className="text-right font-black bg-green-50 text-green-700 underline">{fmt(item.calculated?.total_gp_3y)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed (Scroll nahi hoga) */}
        <div className="p-4 bg-slate-100 border-t flex justify-between items-center px-8 flex-shrink-0">
           <div className="flex gap-8 items-center">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase">
                <User size={14} className="text-slate-400" /> 
                Created By: <span className="text-slate-800">{sheet.sales_user?.first_name} {sheet.sales_user?.last_name}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 border-l pl-8 uppercase">
                <Calendar size={14} className="text-slate-400" /> 
                Submitted At: <span className="text-slate-800">{new Date(sheet.submitted_at).toLocaleDateString('en-GB')}</span>
              </div>
           </div>
           <p className="text-[10px] text-slate-400 font-mono tracking-tighter italic">ID: {sheet.uuid}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}