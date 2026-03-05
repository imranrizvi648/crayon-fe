"use client";
import { useAuditLogs } from "./_hook/useAuditLogs";
import { AuditLogTable } from "./components/AuditLogTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search, RefreshCw, FilterX } from "lucide-react";

export default function AuditLogsPage() {
  const { logs, total, currentPage, loading, setPage, setSearch, refresh, setFilters, filters } = useAuditLogs();

  const totalPages = Math.ceil(total / 10);

  // Filter clear karne ka function
  const clearFilters = () => {
    setFilters({ user_id: "", entity_type: "", action: "" });
    setPage(1);
  };

  return (
    <div className=" space-y-6 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Audit Logs</h1>
            <p className="text-slate-500 text-sm font-medium">Monitoring real-time system activities.</p>
          </div>
        <Button
  variant="outline"
  onClick={refresh}
  disabled={loading}
  className="rounded-full shadow-sm flex items-center gap-2 px-4"
>
  <RefreshCw
    size={16}
    className={loading ? "animate-spin text-secondary" : ""}
  />

  {loading ? "Refreshing..." : "Refresh"}
</Button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white p-3 rounded-xl border shadow-sm">
          {/* Search */}
          <div className="relative col-span-1 md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <Input 
              placeholder="Quick search..." 
              className="pl-9 h-9 text-xs"
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Action Filter */}
          <Select 
            value={filters.action} 
            onValueChange={(v) => { setFilters(prev => ({...prev, action: v})); setPage(1); }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREATE">Create</SelectItem>
              <SelectItem value="UPDATE">Update</SelectItem>
              <SelectItem value="DELETE">Delete</SelectItem>
              <SelectItem value="LOGIN">Login</SelectItem>
            </SelectContent>
          </Select>

          {/* Entity Type Filter */}
          <Select 
            value={filters.entity_type} 
            onValueChange={(v) => { setFilters(prev => ({...prev, entity_type: v})); setPage(1); }}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="All Entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="COSTING_SHEET">Costing Sheet</SelectItem>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="EXCHANGE_RATE">Exchange Rate</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
            </SelectContent>
          </Select>

          {/* User ID (Input or Select) */}
          <Input 
            placeholder="User ID..." 
            className="h-9 text-xs"
            value={filters.user_id}
            onChange={(e) => { setFilters(prev => ({...prev, user_id: e.target.value})); setPage(1); }}
          />

          {/* Clear Filters */}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs text-red-500 hover:text-red-600 hover:bg-red-50">
            <FilterX size={14} className="mr-2" /> Reset
          </Button>
        </div>
      </div>

      <AuditLogTable logs={logs} loading={loading} />

      {/* Pagination (Same as before but with / 10 logic) */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-xs font-medium text-slate-500">
          Showing <span className="text-slate-900">{(currentPage - 1) * 10 + 1}</span> to{" "}
          <span className="text-slate-900">{Math.min(currentPage * 10, total)}</span> of{" "}
          <span className="text-slate-900">{total}</span> entries
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" size="sm" className="h-8 text-xs"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft size={14} /> Previous
          </Button>
          <span className="text-xs font-bold px-2">Page {currentPage} of {totalPages || 1}</span>
          <Button 
            variant="outline" size="sm" className="h-8 text-xs"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || loading || totalPages === 0}
          >
            Next <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}