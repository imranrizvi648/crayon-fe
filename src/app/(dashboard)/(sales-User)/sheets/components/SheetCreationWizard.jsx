"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, User, FileText, Package, DollarSign, Percent, BarChart3, ChevronRight, ChevronLeft } from "lucide-react";

export const SheetCreationWizard = ({ isOpen, onClose, template, onSubmit }) => {
  const [activeTab, setActiveTab] = useState("Customer Info");
  const tabs = ["Customer Info", "Agreement", "Products", "Pricing", "Discounts", "Summary"];

  const [formData, setFormData] = useState({
    template_type: template || "FEWA",
    customer_id: 1,
    opportunity_name: "",
    opportunity_id: "OPP-" + Math.floor(Math.random() * 1000000).toString().padStart(6, "0"),
    agreement_type: "ENTERPRISE_ENROLLMENT",
    partner_id: 1,
    new_or_renewal: "NEW",
    sales_location: "Dubai",
    sales_region: "UAE",
    currency_code: "AED",
    exchange_rate: 3.6725,
    customer_segment: "ENTERPRISE",
    deal_type: "NORMAL",
    agreement_level_system: "A",
    agreement_level_server: "B",
    agreement_level_application: "C",
    enterprise_online_markup: 0.015,
    additional_online_markup: 0.05,
    on_premise_markup: 0.05,
    azure_markup: 0,
    vat_rate: 0.05,
    discount_year_1: 0,
    discount_year_2: 0,
    discount_year_3: 0,
    rebate_year_1: 0,
    rebate_year_2: 0,
    rebate_year_3: 0,
    tender_cost: 0,
    bid_bond_percentage: 0,
    bank_charges_percentage: 1,
    performance_bond_percentage: 0,
    performance_bank_charges_percentage: 0,
    cif_m365_e5_value: 0,
    cif_m365_e3_value: 0,
    cif_azure_value: 0,
    cif_dynamics_365_value: 0,
    internal_notes: "Created via UI Wizard",
    customer_notes: "",
    line_items: [
      {
        part_number: "AAA-22335",
        product_name: "M365 E5 Unified",
        product_type: "ENTERPRISE_ONLINE",
        unit_type: 12,
        quantity_y1: 100, unit_net_usd_y1: 100.00, unit_erp_usd_y1: 110.00,
        ms_discount_percentage_y1: 0.05, markup_percentage_y1: 0.08, rebate_percentage_y1: 0.02,
        quantity_y2: 0, unit_net_usd_y2: 0, unit_erp_usd_y2: 0,
        ms_discount_percentage_y2: 0, markup_percentage_y2: 0, rebate_percentage_y2: 0,
        quantity_y3: 0, unit_net_usd_y3: 0, unit_erp_usd_y3: 0,
        ms_discount_percentage_y3: 0, markup_percentage_y3: 0, rebate_percentage_y3: 0,
        notes: "Main license SKU",
      },
    ],
  });

  const addLineItem = () => {
    setFormData((prev) => ({
      ...prev,
      line_items: [...prev.line_items, {
        part_number: "", product_name: "", product_type: "ENTERPRISE_ONLINE", unit_type: 12,
        quantity_y1: 0, unit_net_usd_y1: 0, unit_erp_usd_y1: 0,
        ms_discount_percentage_y1: 0, markup_percentage_y1: 0, rebate_percentage_y1: 0,
        quantity_y2: 0, unit_net_usd_y2: 0, unit_erp_usd_y2: 0,
        ms_discount_percentage_y2: 0, markup_percentage_y2: 0, rebate_percentage_y2: 0,
        quantity_y3: 0, unit_net_usd_y3: 0, unit_erp_usd_y3: 0,
        ms_discount_percentage_y3: 0, markup_percentage_y3: 0, rebate_percentage_y3: 0,
        notes: "",
      }],
    }));
  };

  const updateLineItem = (index, field, value) => {
    setFormData((prev) => {
      const newItems = [...prev.line_items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, line_items: newItems };
    });
  };

  const removeLineItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      line_items: prev.line_items.filter((_, i) => i !== index),
    }));
  };

  const handleFinish = () => {
    const isRamped = formData.deal_type === "RAMPED";
    const finalPayload = {
      ...formData,
      line_items: formData.line_items.map((item) => ({
        ...item,
        unit_type: Number(item.unit_type),
        quantity_y1: Number(item.quantity_y1),
        unit_net_usd_y1: Number(item.unit_net_usd_y1),
        unit_erp_usd_y1: Number(item.unit_erp_usd_y1),
        ms_discount_percentage_y1: Number(item.ms_discount_percentage_y1),
        markup_percentage_y1: Number(item.markup_percentage_y1),
        rebate_percentage_y1: Number(item.rebate_percentage_y1),
        quantity_y2: isRamped ? Number(item.quantity_y2) : 0,
        unit_net_usd_y2: isRamped ? Number(item.unit_net_usd_y2) : 0,
        unit_erp_usd_y2: isRamped ? Number(item.unit_erp_usd_y2) : 0,
        ms_discount_percentage_y2: isRamped ? Number(item.ms_discount_percentage_y2) : 0,
        markup_percentage_y2: isRamped ? Number(item.markup_percentage_y2) : 0,
        rebate_percentage_y2: isRamped ? Number(item.rebate_percentage_y2) : 0,
        quantity_y3: isRamped ? Number(item.quantity_y3) : 0,
        unit_net_usd_y3: isRamped ? Number(item.unit_net_usd_y3) : 0,
        unit_erp_usd_y3: isRamped ? Number(item.unit_erp_usd_y3) : 0,
        ms_discount_percentage_y3: isRamped ? Number(item.ms_discount_percentage_y3) : 0,
        markup_percentage_y3: isRamped ? Number(item.markup_percentage_y3) : 0,
        rebate_percentage_y3: isRamped ? Number(item.rebate_percentage_y3) : 0,
      })),
    };
    onSubmit(finalPayload);
  };

  const renderTabContent = () => {
    const isRamped = formData.deal_type === "RAMPED";

    switch (activeTab) {
      case "Customer Info":
        return (
          <div className="space-y-6 min-w-[800px]">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight border-b border-border pb-2">Customer Information</h3>
            <div className="grid grid-cols-3 gap-x-10 gap-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Opportunity Name / Customer *</label>
                <Input className="h-9 text-xs bg-background" value={formData.opportunity_name} onChange={(e) => setFormData({ ...formData, opportunity_name: e.target.value })} placeholder="e.g. FEWA 2024 Renewal" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Opportunity ID *</label>
                <Input className="h-9 text-xs bg-background" value={formData.opportunity_id} onChange={(e) => setFormData({ ...formData, opportunity_id: e.target.value })} placeholder="OPP-2024-001" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Customer Segment</label>
                <Select value={formData.customer_segment} onValueChange={(v) => setFormData({ ...formData, customer_segment: v })}>
                  <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMB">SMB</SelectItem>
                    <SelectItem value="MID_MARKET">Mid-Market</SelectItem>
                    <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                    <SelectItem value="GOVERNMENT">Government</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Deal Type</label>
                <Select value={formData.deal_type} onValueChange={(v) => setFormData({ ...formData, deal_type: v })}>
                  {/* focus ring used primary color variable */}
                  <SelectTrigger className="h-9 text-xs ring-primary/20 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normal (1 Year)</SelectItem>
                    <SelectItem value="RAMPED">Ramped (3 Years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Region</label>
                <Select value={formData.sales_region} onValueChange={(v) => setFormData({ ...formData, sales_region: v })}>
                  <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="UAE">UAE</SelectItem><SelectItem value="KSA">KSA</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Currency</label>
                <Select value={formData.currency_code} onValueChange={(v) => setFormData({ ...formData, currency_code: v })}>
                  <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="AED">AED (UAE Dirham)</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case "Agreement":
        return (
          <div className="space-y-6 min-w-[800px]">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-tight border-b border-border pb-2">Agreement Details</h3>
            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Sales Location</label>
                <Input className="h-9 text-xs bg-background" value={formData.sales_location} onChange={(e) => setFormData({ ...formData, sales_location: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Agreement Type</label>
                <Select value={formData.agreement_type} onValueChange={(v) => setFormData({ ...formData, agreement_type: v })}>
                  <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="ENTERPRISE_ENROLLMENT">Enterprise Enrollment</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">New / Renewal</label>
                <Select value={formData.new_or_renewal} onValueChange={(v) => setFormData({ ...formData, new_or_renewal: v })}>
                  <SelectTrigger className="h-9 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="NEW">New</SelectItem><SelectItem value="RENEWAL">Renewal</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              {["system", "server", "application"].map((key) => (
                <div key={key} className="border border-border p-4 rounded-xl space-y-3 bg-muted/30 shadow-sm">
                  <p className="font-bold text-[10px] text-foreground uppercase border-b border-border pb-1">{key} Level</p>
                  <div className="grid grid-cols-4 gap-2">
                    {["A", "B", "C", "D"].map((level) => (
                      <div key={level} className="flex items-center gap-2">
                        <input type="radio" className="w-3.5 h-3.5 accent-primary" checked={formData[`agreement_level_${key}`] === level} onChange={() => setFormData({ ...formData, [`agreement_level_${key}`]: level })} />
                        <label className="text-[10px] text-muted-foreground font-medium">Level {level}</label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "Products":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">Product Line Items ({formData.deal_type})</h3>
              <Button size="sm" onClick={addLineItem} className="bg-primary/10 text-primary hover:bg-primary/20 h-8 text-xs px-4 font-bold border-none transition-colors">+ Add Product</Button>
            </div>
            <div className="border border-border rounded-lg overflow-x-auto shadow-sm max-h-[500px]">
              <table className={`w-full text-[10px] ${isRamped ? 'min-w-[2200px]' : 'min-w-[1200px]'}`}>
                <thead className="bg-secondary text-secondary-foreground sticky top-0 z-10">
                  <tr>
                    <th className="p-3 text-left w-32">Part #</th>
                    <th className="p-3 text-left w-48">Item Name</th>
                    <th className="p-3 text-left w-40">Category</th>
                    <th className="p-3 text-center w-20">Unit</th>
                    <th colSpan={6} className="p-3 text-center bg-secondary/80 border-l border-white/10">Year 1 Data</th>
                    {isRamped && (
                      <>
                        <th colSpan={6} className="p-3 text-center bg-secondary/70 border-l border-white/10">Year 2 Data</th>
                        <th colSpan={6} className="p-3 text-center bg-secondary/60 border-l border-white/10">Year 3 Data</th>
                      </>
                    )}
                    <th className="p-3 text-left w-40">Notes</th>
                    <th className="p-3 text-center w-16"></th>
                  </tr>
                  <tr className="bg-secondary/90 text-secondary-foreground text-[9px]">
                    <th></th><th></th><th></th><th></th>
                    <th className="border-l border-white/5">Qty</th><th>Net $</th><th>ERP $</th><th>MS %</th><th>Mk %</th><th>Rb %</th>
                    {isRamped && (
                      <>
                        <th className="border-l border-white/5">Qty</th><th>Net $</th><th>ERP $</th><th>MS %</th><th>Mk %</th><th>Rb %</th>
                        <th className="border-l border-white/5">Qty</th><th>Net $</th><th>ERP $</th><th>MS %</th><th>Mk %</th><th>Rb %</th>
                      </>
                    )}
                    <th></th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.line_items.map((item, idx) => (
                    <tr key={idx} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="p-2"><Input className="h-8 text-xs bg-background" value={item.part_number} onChange={(e) => updateLineItem(idx, "part_number", e.target.value)} /></td>
                      <td className="p-2"><Input className="h-8 text-xs bg-background" value={item.product_name} onChange={(e) => updateLineItem(idx, "product_name", e.target.value)} /></td>
                      <td className="p-2">
                        <Select value={item.product_type} onValueChange={(v) => updateLineItem(idx, "product_type", v)}>
                          <SelectTrigger className="h-8 text-xs bg-background"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ENTERPRISE_ONLINE">ENTERPRISE_ONLINE</SelectItem>
                            <SelectItem value="ON_PREMISE">ON_PREMISE</SelectItem>
                            <SelectItem value="AZURE">AZURE</SelectItem>
                            <SelectItem value="DYNAMICS">DYNAMICS</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-2 text-center">
                        <Input type="number" className="h-8 text-xs text-center w-14 mx-auto bg-background" value={item.unit_type} onChange={(e) => updateLineItem(idx, "unit_type", Number(e.target.value))} />
                      </td>
                      {/* Year 1 */}
                      <td className="p-1.5 bg-primary/5 border-l border-border"><Input type="number" className="h-8 text-xs text-center bg-background" value={item.quantity_y1} onChange={(e) => updateLineItem(idx, "quantity_y1", Number(e.target.value))} /></td>
                      <td className="p-1.5 bg-primary/5"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_net_usd_y1} onChange={(e) => updateLineItem(idx, "unit_net_usd_y1", Number(e.target.value))} /></td>
                      <td className="p-1.5 bg-primary/5"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_erp_usd_y1} onChange={(e) => updateLineItem(idx, "unit_erp_usd_y1", Number(e.target.value))} /></td>
                      <td className="p-1.5 bg-primary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.ms_discount_percentage_y1} onChange={(e) => updateLineItem(idx, "ms_discount_percentage_y1", Number(e.target.value))} /></td>
                      <td className="p-1.5 bg-primary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.markup_percentage_y1} onChange={(e) => updateLineItem(idx, "markup_percentage_y1", Number(e.target.value))} /></td>
                      <td className="p-1.5 bg-primary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.rebate_percentage_y1} onChange={(e) => updateLineItem(idx, "rebate_percentage_y1", Number(e.target.value))} /></td>
                      {isRamped && (
                        <>
                          {/* Year 2 */}
                          <td className="p-1.5 bg-secondary/5 border-l border-border"><Input type="number" className="h-8 text-xs text-center bg-background" value={item.quantity_y2} onChange={(e) => updateLineItem(idx, "quantity_y2", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-secondary/5"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_net_usd_y2} onChange={(e) => updateLineItem(idx, "unit_net_usd_y2", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-secondary/5"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_erp_usd_y2} onChange={(e) => updateLineItem(idx, "unit_erp_usd_y2", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-secondary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.ms_discount_percentage_y2} onChange={(e) => updateLineItem(idx, "ms_discount_percentage_y2", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-secondary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.markup_percentage_y2} onChange={(e) => updateLineItem(idx, "markup_percentage_y2", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-secondary/5"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.rebate_percentage_y2} onChange={(e) => updateLineItem(idx, "rebate_percentage_y2", Number(e.target.value))} /></td>
                          {/* Year 3 */}
                          <td className="p-1.5 bg-accent/20 border-l border-border"><Input type="number" className="h-8 text-xs text-center bg-background" value={item.quantity_y3} onChange={(e) => updateLineItem(idx, "quantity_y3", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-accent/20"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_net_usd_y3} onChange={(e) => updateLineItem(idx, "unit_net_usd_y3", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-accent/20"><Input type="number" step="0.01" className="h-8 text-xs bg-background" value={item.unit_erp_usd_y3} onChange={(e) => updateLineItem(idx, "unit_erp_usd_y3", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-accent/20"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.ms_discount_percentage_y3} onChange={(e) => updateLineItem(idx, "ms_discount_percentage_y3", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-accent/20"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.markup_percentage_y3} onChange={(e) => updateLineItem(idx, "markup_percentage_y3", Number(e.target.value))} /></td>
                          <td className="p-1.5 bg-accent/20"><Input type="number" step="0.001" className="h-8 text-xs bg-background" value={item.rebate_percentage_y3} onChange={(e) => updateLineItem(idx, "rebate_percentage_y3", Number(e.target.value))} /></td>
                        </>
                      )}
                      <td className="p-2"><Input className="h-8 text-xs bg-background" value={item.notes || ""} onChange={(e) => updateLineItem(idx, "notes", e.target.value)} /></td>
                      <td className="p-2 text-center"><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-colors" onClick={() => removeLineItem(idx)}><X size={14} /></Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Pricing":
        return (
          <div className="space-y-10 min-w-[950px]">
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-5">
                <h3 className="text-sm font-bold uppercase border-b border-border pb-2 text-foreground">Markups</h3>
                {["enterprise_online_markup", "additional_online_markup", "on_premise_markup", "azure_markup"].map((key) => (
                  <div key={key} className="flex justify-between items-center max-w-md">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground w-40">{key.replace(/_/g, " ")}</label>
                    <div className="flex items-center gap-2">
                      <Input type="number" className="w-20 h-8 text-xs text-right bg-background" value={formData[key] * 100} onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) / 100 })} />
                      <span className="text-[10px] text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-5">
                <h3 className="text-sm font-bold uppercase border-b border-border pb-2 text-foreground">Charges & Bonds</h3>
                {["tender_cost", "bid_bond_percentage", "bank_charges_percentage", "performance_bond_percentage"].map((key) => (
                  <div key={key} className="flex justify-between items-center max-w-md">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground w-40">{key.replace(/_/g, " ")}</label>
                    <Input type="number" className="w-24 h-8 text-xs text-right bg-background" value={formData[key]} onChange={(e) => setFormData({ ...formData, [key]: Number(e.target.value) })} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "Discounts":
        return (
          <div className="grid grid-cols-2 gap-16 min-w-[900px]">
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase border-b border-border pb-2 text-primary">Crayon Discount (Funding)</p>
              {[1, isRamped ? 2 : null, isRamped ? 3 : null].filter(Boolean).map((y) => (
                <div key={y} className="flex justify-between items-center max-w-sm">
                  <span className="text-[11px] text-muted-foreground font-medium">Year {y}</span>
                  <Input type="number" className="w-32 h-8 text-xs text-right bg-background" value={formData[`discount_year_${y}`]} onChange={(e) => setFormData({ ...formData, [`discount_year_${y}`]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
            <div className="space-y-4 border-l border-border pl-12">
              <p className="text-[10px] font-bold uppercase border-b border-border pb-2 text-foreground">Other LSP Rebate</p>
              {[1, isRamped ? 2 : null, isRamped ? 3 : null].filter(Boolean).map((y) => (
                <div key={y} className="flex justify-between items-center max-w-sm">
                  <span className="text-[11px] text-muted-foreground font-medium">Year {y}</span>
                  <Input type="number" className="w-32 h-8 text-xs text-right bg-background" value={formData[`rebate_year_${y}`]} onChange={(e) => setFormData({ ...formData, [`rebate_year_${y}`]: Number(e.target.value) })} />
                </div>
              ))}
            </div>
          </div>
        );

      case "Summary":
        return (
          <div className="p-10 text-center space-y-6 bg-card rounded-xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary transition-transform hover:scale-110">
              <FileText size={28} />
            </div>
            <h3 className="font-bold text-lg uppercase text-foreground">Ready to Submit</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">
              Costing sheet for <span className="font-bold text-primary">{formData.opportunity_name || "New Opportunity"}</span> is complete.
            </p>
          </div>
        );

      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[1450px] min-w-[1100px] w-[95vw] p-0 border-none rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] bg-background">
        
        <DialogHeader className="sr-only">
          <DialogTitle>Costing Sheet Creation Wizard</DialogTitle>
          <DialogDescription>
            Step-by-step form to create a new costing sheet for {formData.opportunity_name || "an opportunity"}.
          </DialogDescription>
        </DialogHeader>

        {/* Custom Visible Header */}
        <div className="px-8 py-5 pr-20 border-b border-border bg-card flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-secondary tracking-tight">{formData.opportunity_id.replace("OPP-", "CS-")}</h2>
            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">CRAYON COSTING TOOL v2.0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-8 border-b border-border bg-card overflow-x-auto shrink-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab === "Customer Info" && <User size={14} />}
              {tab === "Agreement" && <FileText size={14} />}
              {tab === "Products" && <Package size={14} />}
              {tab === "Pricing" && <DollarSign size={14} />}
              {tab === "Discounts" && <Percent size={14} />}
              {tab === "Summary" && <BarChart3 size={14} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 px-12 bg-background/50">{renderTabContent()}</div>

        {/* Footer */}
        <div className="px-10 py-5 bg-muted/30 border-t border-border flex justify-between items-center shrink-0">
          <button
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm font-bold disabled:opacity-30 transition-colors"
            onClick={() => {
              const idx = tabs.indexOf(activeTab);
              if (idx > 0) setActiveTab(tabs[idx - 1]);
            }}
            disabled={activeTab === tabs[0]}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <Button
            className="bg-primary hover:opacity-90 text-primary-foreground px-8 h-10 font-bold transition-all shadow-md"
            onClick={() => {
              const idx = tabs.indexOf(activeTab);
              if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
              else handleFinish();
            }}
          >
            {activeTab === "Summary" ? "Finish & Submit" : `Next: ${tabs[tabs.indexOf(activeTab) + 1] || ""}`}
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};