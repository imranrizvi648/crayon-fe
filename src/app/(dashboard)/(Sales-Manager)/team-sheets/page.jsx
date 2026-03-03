"use client";

import { useTeamSheets } from "./_hook/useTeamSheets";
import TeamSheetsTable from "./components/TeamSheetsTable";
import TeamSheetsStats from "./components/TeamSheetsStats";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

export default function TeamSheetsPage() {
  const { data, loading, updateFilters, setPage, globalSummary, summaryLoading } = useTeamSheets();

  return (
    <div className="min-h-screen  space-y-8 bg-slate-50/50">
      
      {/* ROW 1: Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black  text-gray-700 ">
            Team Sheets
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
           Review and manage your team’s sheets in one place
          </p>
        </div>

        {/* Filters Area - Header ke saath aligned */}
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search by sheet, customer..." 
              className="pl-10 h-10 border-slate-200 focus:ring-primary"
              onChange={(e) => updateFilters({ search: e.target.value })}
            />
          </div>
          <Select onValueChange={(val) => updateFilters({ status: val })}>
            <SelectTrigger className="w-32 h-10 border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ROW 2: Summary Cards Section - Pehle Cards aayenge */}
    <TeamSheetsStats 
        summary={globalSummary} // 🔥 Use globalSummary here
        totalItems={globalSummary.total_count} // 🔥 Use global count here
        isLoading={summaryLoading} // 🔥 Use specific summary loader
      />

      {/* ROW 3: Table Section - Cards ke baad Table */}
      <TeamSheetsTable 
        sheets={data.items} 
        isLoading={loading} 
        pagination={data.pagination} 
        onPageChange={setPage} 
      />
      
    </div>
  );
}