"use client";
import { useState, useEffect } from "react";
import { useCostingSheets } from "./hooks/useCostingSheets";
import { TemplateModal } from "./components/TemplateModal";
import { SheetCreationWizard } from "./components/SheetCreationWizard";
import { SheetTable } from "./components/SheetTable";
import { EditSheetModal } from "./components/EditSheetModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export default function CostingSheetsList() {
  const { data, loading, fetchSheets, createSheet, deleteSheet, updateSheet } = useCostingSheets();
  
  // UI States
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  
  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    opportunity_name: "",
    discount_year_1: 0,
    internal_notes: ""
  });

  // Filter States
  const [filters, setFilters] = useState({ 
    template_type: "all", 
    status: "all", 
    sales_region: "all" 
  });

  // 1. Handle Edit Logic
  const handleEditClick = (sheet) => {
    setSelectedSheetId(sheet.id);
    setEditFormData({
      opportunity_name: sheet.opportunity,
      discount_year_1: 0,
      internal_notes: sheet.notes || ""
    });
    setIsEditOpen(true);
  };

  const handleUpdateSave = async () => {
    const res = await updateSheet(selectedSheetId, editFormData);
    if (res.success) setIsEditOpen(false);
  };

  // 2. Handle Pagination & Filters
  const handlePageChange = (newPage) => {
    const apiFilters = Object.fromEntries(
      Object.entries(filters).map(([k, v]) => [k, v === "all" ? "" : v])
    );
    fetchSheets(newPage, apiFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    const apiFilters = Object.fromEntries(
      Object.entries(newFilters).map(([k, v]) => [k, v === "all" ? "" : v])
    );
    fetchSheets(1, apiFilters); 
  };

  const resetFilters = () => {
    setFilters({ template_type: "all", status: "all", sales_region: "all" });
    fetchSheets(1, {});
    toast.info("Filters reset to default");
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3556]">Costing Dashboard</h1>
          <p className="text-sm text-slate-500">Manage FEWA and MCC estimates</p>
        </div>
        <Button 
          onClick={() => setShowTemplateModal(true)} 
          className="bg-[#dc1e25] hover:bg-[#b0181e] text-white shadow-lg px-6"
        >
          + New Sheet
        </Button>
      </div>

      {/* Triple Filters Bar - Back in Action! */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
        <Select value={filters.template_type} onValueChange={(v) => handleFilterChange("template_type", v)}>
          <SelectTrigger className="h-10 text-sm border-slate-200">
            <SelectValue placeholder="Template Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Templates</SelectItem>
            <SelectItem value="FEWA">FEWA</SelectItem>
            <SelectItem value="MCC">MCC</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
          <SelectTrigger className="h-10 text-sm border-slate-200">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.sales_region} onValueChange={(v) => handleFilterChange("sales_region", v)}>
          <SelectTrigger className="h-10 text-sm border-slate-200">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="KSA">KSA</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="text-slate-500 border-slate-200 hover:bg-slate-50 gap-2"
        >
          <RotateCcw size={14} /> Reset Filters
        </Button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <SheetTable 
          items={data.items} 
          loading={loading} 
          pagination={data.pagination} 
          onPageChange={handlePageChange} 
          onDelete={deleteSheet}
          onEdit={handleEditClick} 
        />
      </div>

      {/* --- ALL MODALS --- */}
      <EditSheetModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateSave}
      />

      <TemplateModal 
        isOpen={showTemplateModal} 
        onClose={() => setShowTemplateModal(false)} 
        onSelect={(id) => { setSelectedTemplate(id); setShowTemplateModal(false); setShowWizard(true); }} 
      />

      {showWizard && (
        <SheetCreationWizard 
          isOpen={showWizard} 
          onClose={() => { setShowWizard(false); setSelectedTemplate(null); }} 
          template={selectedTemplate}
          onSubmit={async (p) => {
            const res = await createSheet(p);
            if (res.success) setShowWizard(false);
          }}
        />
      )}
    </div>
  );
}