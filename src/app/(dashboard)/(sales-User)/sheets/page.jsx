"use client";
import { useState } from "react";
import Link from "next/link"; // Link import kiya gaya hai
import { useCostingSheets } from "./hooks/useCostingSheets";
import { SheetTable } from "./components/SheetTable";
import { EditSheetModal } from "./components/EditSheetModal";
import { SheetPreviewModal } from "./components/SheetPreviewModal";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, Plus, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";

export default function CostingSheetsList() {
  const { data, loading, fetchSheets, deleteSheet, updateSheet, fetchSheetDetail } = useCostingSheets();
  
  // --- UI STATES ---
  // Wizard aur Template ki states yahan se hta di gayi hain

  // Preview States
  const [showPreview, setShowPreview] = useState(false);
  const [previewSheet, setPreviewSheet] = useState(null);

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

  // --- HANDLERS ---

  const handlePreviewClick = async (id) => {
    const res = await fetchSheetDetail(id);
    if (res.success) {
      setPreviewSheet(res.data);
      setShowPreview(true);
    }
  };

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
    <div className="px-5 space-y-8 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-secondary p-3 rounded-2xl shadow-lg shadow-secondary/20">
            <LayoutDashboard className="text-white" size={23} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary">
              Costing <span className="">Dashboard</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium italic">
              Manage FEWA and MCC estimates with precision
            </p>
          </div>
        </div>
        
        {/* Navigation to Create Page */}
        <Link href="/sheets/create-sheet">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white rounded-lg shadow-primary/20 px-8 py-5 pr-13 font-bold tracking-wider cursor-pointer"
          >
            <Plus size={20} className="mr-2" /> New Sheet
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg shadow-sm border border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <Select value={filters.template_type} onValueChange={(v) => handleFilterChange("template_type", v)}>
            <SelectTrigger className="h-11 border-border bg-muted/30 font-semibold text-secondary focus:ring-primary/20">
              <SelectValue placeholder="Template Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Templates</SelectItem>
              <SelectItem value="FEWA">FEWA</SelectItem>
              <SelectItem value="MCC">MCC</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.status} onValueChange={(v) => handleFilterChange("status", v)}>
            <SelectTrigger className="h-11 border-border bg-muted/30 font-semibold text-secondary focus:ring-primary/20">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.sales_region} onValueChange={(v) => handleFilterChange("sales_region", v)}>
            <SelectTrigger className="h-11 border-border bg-muted/30 font-semibold text-secondary focus:ring-primary/20">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="KSA">KSA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="h-11 px-6 text-secondary border-secondary/20 hover:bg-secondary hover:text-white gap-2 font-bold transition-colors"
        >
          <RotateCcw size={16} /> Reset
        </Button>
      </div>

      {/* Main Table Container */}
      <div className="bg-card rounded-2xl shadow-xl shadow-secondary/5 border border-border overflow-hidden">
        <SheetTable 
          items={data.items} 
          loading={loading} 
          pagination={data.pagination} 
          onPageChange={handlePageChange} 
          onDelete={deleteSheet}
          onEdit={handleEditClick} 
          onPreview={handlePreviewClick}
        />
      </div>

      {/* --- MODALS --- */}

      <SheetPreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
        sheet={previewSheet} 
      />

      <EditSheetModal 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        formData={editFormData}
        setFormData={setEditFormData}
        onSave={handleUpdateSave}
      />
    </div>
  );
}