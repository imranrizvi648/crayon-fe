"use client";
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Helper function to get Initials
const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

// Helper function to determine performance badge style based on approval rate
const getPerformanceBadge = (rate) => {
  if (rate >= 85) return { label: "Excellent", className: "bg-blue-50 text-blue-600 hover:bg-blue-100" };
  if (rate >= 75) return { label: "Good", className: "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" };
  if (rate >= 60) return { label: "Average", className: "bg-slate-100 text-slate-600 hover:bg-slate-200" };
  return { label: "Needs Improvement", className: "bg-red-50 text-red-600 hover:bg-red-100" };
};

export function PerformanceTable({ data, loading }) {
  return (
    // Same wrapper design as ApprovalTable
    <div className="">
      <Table className="text-sm">
        {/* Same Header design as ApprovalTable */}
        <TableHeader className="bg-slate-100 border-b-2 border-slate-200">
          <TableRow className="h-12 hover:bg-transparent">
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">Team Member</TableHead>
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">Sheets Created</TableHead>
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">Approval Rate</TableHead>
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">Total Value</TableHead>
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">Target %</TableHead>
            <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase text-right">Performance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500 font-medium">Loading report data...</TableCell></TableRow>
          ) : data.length === 0 ? (
            <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-400">No performance data available.</TableCell></TableRow>
          ) : (
            data.map((user) => {
              const performance = getPerformanceBadge(user.approval_rate);
              const targetProgress = user.target !== null ? user.target : Math.min(user.approval_rate, 100); 

              return (
                <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors h-16">
                  
                  {/* Team Member */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Avatar Alignment Fix: AvatarFallback mein flex center ensure kiya hai aur color primary use kiya hai */}
                      <Avatar className="h-9 w-9 border border-primary/10">
                        <AvatarFallback className="flex items-center justify-center bg-primary text-white text-[11px] font-bold tracking-wider">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{user.region}</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Sheets Created */}
                  <TableCell className="font-semibold text-slate-700">
                    {user.sheets}
                  </TableCell>

                
                  {/* Approval rate color logic */}
                  <TableCell className={`font-semibold ${user.approval_rate >= 75 ? '!text-slate-700' : user.approval_rate >= 60 ? 'text-yellow-600' : 'text-slate-700'}`}>
                    {user.approval_rate}%
                  </TableCell>

                  {/* Total Value */}
                  <TableCell className="font-bold text-slate-900">
                    ${user.total_value > 1000 ? `${(user.total_value / 1000).toFixed(0)}K` : user.total_value}
                  </TableCell>

                  {/* Target % (Progress Bar) */}
                  <TableCell>
                    {/* Bar background */}
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      {/* Bar fill (using primary color) */}
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out" 
                        style={{ width: `${targetProgress}%` }}
                      />
                    </div>
                  </TableCell>

                  {/* Performance Badge */}
                  <TableCell className="text-right">
                    <Badge variant="outline" className={`${performance.className} font-bold px-3 py-0.5 border-transparent`}>
                      {performance.label}
                    </Badge>
                  </TableCell>

                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}