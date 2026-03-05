"use client";
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ApprovalQueueTable({ queueHook, onView }) {
  const { data, totalCount, loading, filters, updateFilters } = queueHook;

  return (
    <div className="space-y-4">
      {/* Search & Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-md border shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search sheet number or customer..." 
            className="pl-10 bg-slate-50/50"
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </div>
        <Select value={filters.priority} onValueChange={(v) => updateFilters({ priority: v })}>
          <SelectTrigger className="w-[140px] bg-slate-50/50">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Priority</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.region} onValueChange={(v) => updateFilters({ region: v })}>
          <SelectTrigger className="w-[130px] bg-slate-50/50">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UAE">UAE</SelectItem>
            <SelectItem value="KSA">Saudi Arabia</SelectItem>
            <SelectItem value="QA">Qatar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="text-[11px] uppercase tracking-wider font-bold">
              <TableHead className="px-6 py-4">Sheet Details</TableHead>
              <TableHead>Customer & Sales Rep</TableHead>
              <TableHead className="text-center">GP %</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-slate-400">Loading queue data...</TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-40 text-center text-slate-400 italic">No pending approvals found.</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.sheet_id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-slate-900 text-[13px]">{item.sheet_number}</span>
                      <span className="text-[10px] text-slate-500 font-medium uppercase">{item.sheet_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 text-[12px]">{item.customer_name}</span>
                      <span className="text-[10px] text-slate-400">Rep: {item.sales_rep_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      {item.gp_percentage}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{item.total_value?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{item.currency_code}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border",
                      item.status === "UNDER_REVIEW" 
                        ? "bg-blue-50 text-blue-600 border-blue-200" 
                        : "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {item.status?.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter",
                      item.priority === "CRITICAL" ? "bg-red-100 text-red-700 border border-red-200" : "bg-amber-100 text-amber-700 border border-amber-200"
                    )}>
                      {item.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onView(item.sheet_id)}
                      className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full"
                    >
                      <Eye className="h-4.5 w-4.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 pt-2">
        <p className="text-[11px] text-slate-500 font-medium">
          Showing <b>{data.length}</b> of <b>{totalCount}</b> pending approvals
        </p>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" size="sm" className="h-8 text-[11px] font-bold"
            disabled={filters.page === 1}
            onClick={() => updateFilters({ page: filters.page - 1 })}
          >
            <ChevronLeft size={14} className="mr-1" /> Previous
          </Button>
          <div className="bg-slate-100 px-3 py-1 rounded text-[11px] font-bold">
            Page {filters.page}
          </div>
          <Button 
            variant="outline" size="sm" className="h-8 text-[11px] font-bold"
            disabled={filters.page * filters.pageSize >= totalCount}
            onClick={() => updateFilters({ page: filters.page + 1 })}
          >
            Next <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}