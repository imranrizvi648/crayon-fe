"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { 
  FileText, Globe, Percent, Calculator, 
  Briefcase, Calendar, User, ShieldCheck, Info, Layers
} from "lucide-react";

export function SheetPreviewModal({ isOpen, onClose, sheet }) {
  if (!sheet) return null;

  const fmt = (val) => 
    new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(val || 0);

  const fmtPct = (val) => `${((val || 0) * 100).toFixed(1)}%`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1450px] min-w-[1100px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-background text-foreground border-none shadow-2xl">
        
        {/* --- Header: Fixed --- */}
        <DialogHeader className="p-6 border-b bg-muted/20 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                {/* Branding Icon remains Primary */}
                <div className="bg-primary p-2.5 rounded-xl text-primary-foreground shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <DialogTitle className="text-2xl font-bold text-secondary tracking-tight">
                      {sheet.sheet_number}
                    </DialogTitle>
                    <Badge variant="outline" className="uppercase font-bold text-[10px] border-secondary/30 text-secondary">
                      {sheet.status}
                    </Badge>
                  </div>
                  <p className="text-secondary font-medium mt-1 text-sm flex items-center gap-2">
                    <span className="font-bold">{sheet.customer?.name}</span>
                    <span className="opacity-30">|</span>
                    <span className="italic">{sheet.opportunity_name}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Accent color for the most important number */}
            <div className="text-right bg-background p-3 px-5 mr-10 rounded-2xl border border-border shadow-sm">
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-1">Grand Total (Inc. VAT)</p>
              <p className="text-2xl font-bold text-secondary flex items-center justify-end gap-2">
                <span className="text-sm font-bold text-secondary">{sheet.currency_code}</span>
                {fmt(sheet.summary?.grand_total_with_vat)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* --- Main Content --- */}
        <div className="flex-1 overflow-y-auto bg-background scroll-smooth custom-scrollbar">
          <div className="p-8 space-y-10">
            
            {/* 1. Metadata Grid (Headings switched to Secondary) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Entity & Sales', icon: Globe, items: [['Segment', 'customer_segment'], ['Region', 'sales_region'], ['Deal Type', 'deal_type']] },
                { label: 'Agreement Specs', icon: Briefcase, items: [['Type', 'agreement_type'], ['Category', 'new_or_renewal'], ['Lvl', 'agreement_level_system']] },
                { label: 'GP & Markups', icon: Percent, items: [['GP Model', 'gp_split_model'], ['Crayon GP', `${sheet.crayon_gp_percentage}%`], ['VAT Rate', fmtPct(sheet.vat_rate)]] },
                { label: 'Bonds & Costs', icon: Layers, items: [['Bid Bond', `${sheet.bid_bond_percentage}%`], ['Perf Bond', `${sheet.performance_bond_percentage}%`], ['Tender Cost', fmt(sheet.tender_cost), true]] }
              ].map((section, idx) => (
                <section key={idx} className="p-4 border border-border rounded-xl bg-muted/5 space-y-3 hover:border-secondary/40 transition-colors">
                  <h3 className="font-bold text-[11px] text-secondary flex items-center gap-2 border-b border-border pb-2 uppercase tracking-wider">
                    <section.icon size={14} className="opacity-70" /> {section.label}
                  </h3>
                  <div className="space-y-2.5 text-[11px]">
                    {section.items.map(([lbl, val, isCritical], i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{lbl}</span>
                        <span className={`font-bold ${isCritical ? 'text-accent' : 'text-foreground'}`}>
                          {sheet[val] || val}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* 2. CIF Section (Subtle Style) */}
            <div className="space-y-4">
              <h3 className="font-black text-xs text-secondary tracking-widest uppercase flex items-center gap-2">
                <ShieldCheck size={16} className="text-secondary/60" /> CIF Input Values
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {['m365_e5', 'm365_e3', 'azure', 'dynamics_365'].map(key => (
                  <div key={key} className="p-4 border border-border rounded-xl flex justify-between items-center bg-muted/10">
                    <span className="text-[10px] text-secondary font-black uppercase">{key.replace('_', ' ')}</span>
                    <span className="text-sm font-black text-primary">{fmt(sheet[`cif_${key}_value`])}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Financial Summary Table (Soft Header) */}
            <div className="space-y-4">
              <h3 className="font-black text-lg text-secondary flex items-center gap-2 uppercase tracking-tight">
                <Calculator size={22} className="text-secondary/50" /> 3-Year Financial Summary
              </h3>
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-bold text-secondary text-[11px] uppercase">Metric</TableHead>
                      <TableHead className="text-right font-bold text-secondary text-[11px] uppercase">Year 1</TableHead>
                      <TableHead className="text-right font-bold text-secondary text-[11px] uppercase">Year 2</TableHead>
                      <TableHead className="text-right font-bold text-secondary text-[11px] uppercase">Year 3</TableHead>
                      <TableHead className="text-right font-black text-primary text-[11px] uppercase bg-primary/5">Total (3Y)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { label: "Net Cost (USD)", k: "total_net" },
                      { label: "ERP Value", k: "total_erp" },
                      { label: "EUP Value", k: "total_eup" },
                      { label: "Rebate Amount", k: "total_rebate" },
                      { label: "Gross Profit (GP)", k: "gross_profit", highlight: true },
                    ].map((row, i) => (
                      <TableRow key={i} className={`text-[11px] border-b border-border hover:bg-muted/20 ${row.highlight ? 'bg-accent/5' : ''}`}>
                        <TableCell className="font-bold text-secondary uppercase py-4">{row.label}</TableCell>
                        <TableCell className="text-right">{fmt(sheet.summary?.[`${row.k}_y1`])}</TableCell>
                        <TableCell className="text-right">{fmt(sheet.summary?.[`${row.k}_y2`])}</TableCell>
                        <TableCell className="text-right">{fmt(sheet.summary?.[`${row.k}_y3`])}</TableCell>
                        <TableCell className={`text-right font-black text-xs ${row.highlight ? '' : 'text-primary bg-primary/5'}`}>
                          {fmt(sheet.summary?.[`${row.k}_3y`])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* 4. Line Items Table */}
            <div className="space-y-4 pb-12">
              <h3 className="font-black text-lg text-secondary flex items-center gap-2 uppercase tracking-tight">
                <Info size={22} className="text-secondary/50" /> Line Item Details
              </h3>
              <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="text-[10px] uppercase font-black border-none">
                      <TableHead className="w-[400px] text-secondary">Product</TableHead>
                      <TableHead className="text-center text-secondary">Quantities</TableHead>
                      <TableHead className="text-right text-secondary">Unit Net</TableHead>
                      <TableHead className="text-right text-secondary">Markup</TableHead>
                      <TableHead className="text-right bg-primary/5 text-primary">Total EUP</TableHead>
                      <TableHead className="text-right bg-accent/5 text-secondary">GP (3Y)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sheet.line_items?.map((item) => (
                      <TableRow key={item.id} className="text-xs hover:bg-muted/10 transition-colors border-b border-border">
                        <TableCell className="py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-secondary uppercase text-[11px]">{item.product_name}</span>
                            <span className="text-[10px] text-muted-foreground font-bold">{item.part_number}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          <div className="flex justify-center gap-1">
                            {['y1', 'y2', 'y3'].map(y => (
                              <span key={y} className="bg-muted/50 px-1.5 rounded text-secondary">{item[`quantity_${y}`]}</span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">${fmt(item.unit_net_usd_y1)}</TableCell>
                        <TableCell className="text-right font-black text-secondary">{fmtPct(item.markup_percentage_y1)}</TableCell>
                        <TableCell className="text-right font-black text-primary bg-primary/5">{fmt(item.calculated?.total_eup_3y)}</TableCell>
                        <TableCell className="text-right font-black text-foreground bg-accent/5">
                           {fmt(item.calculated?.total_gp_3y)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer (Clean & Secondary) --- */}
        <footer className="p-4 bg-muted/10 border-t flex justify-between items-center px-8 flex-shrink-0">
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-2.5 text-[11px] font-bold uppercase text-secondary">
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                <User size={14} />
              </div>
              <div>
                <p className="text-[9px] opacity-60 leading-none">Creator</p>
                <p className="text-foreground">{sheet.sales_user?.first_name} {sheet.sales_user?.last_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-[11px] font-bold border-l border-border pl-10 uppercase text-secondary">
              <Calendar size={14} /> 
              <div>
                <p className="text-[9px] opacity-60 leading-none">Submitted</p>
                <p className="text-foreground">
                  {sheet.submitted_at ? new Date(sheet.submitted_at).toLocaleDateString('en-GB') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
          <code className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">ID: {sheet.uuid}</code>
        </footer>
      </DialogContent>
    </Dialog>
  );
}