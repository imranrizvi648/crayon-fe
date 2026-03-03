"use client";
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, X, Eye, Clock, Calendar, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// --- ROW SKELETON COMPONENT ---
const RowSkeleton = () => (
  <TableRow className="border-b border-slate-100">
    <TableCell className="py-4"><div className="h-10 w-32 bg-slate-100 animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-5 w-24 bg-slate-100 animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-8 w-40 bg-slate-100 animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-5 w-32 bg-slate-100 animate-pulse rounded-md" /></TableCell>
    <TableCell><div className="h-6 w-20 bg-slate-100 animate-pulse rounded-md ml-auto" /></TableCell>
    <TableCell><div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md mx-auto" /></TableCell>
  </TableRow>
);

export function ApprovalTable({ data = [], loading, approveAction, rejectAction }) {
  // ... (States same rahengi)
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [comments, setComments] = useState("Ready for finance review");
  const [isApproving, setIsApproving] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Needs revision");
  const [rejectionCode, setRejectionCode] = useState("REVISION_NEEDED"); 
  const [isRejecting, setIsRejecting] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);

  // ... (Logics same rahengi)
  const handleApproveClick = (sheet) => { setSelectedSheet(sheet); setComments("Ready for finance review"); setApproveModalOpen(true); };
  const handleConfirmApprove = async () => { /* ... same logic ... */ };
  const handleRejectClick = (sheet) => { setSelectedSheet(sheet); setRejectReason("Needs revision"); setRejectionCode("REVISION_NEEDED"); setRejectModalOpen(true); };
  const handleConfirmReject = async () => { /* ... same logic ... */ };

  return (
    <>
      <div className="rounded-sm border bg-white shadow-sm overflow-x-auto">
        <Table className="text-sm whitespace-nowrap">
          <TableHeader className="bg-slate-100 border-b-2 border-slate-200">
            <TableRow className="h-12">
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">SHEET DETAILS</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">SALES REP</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">CUSTOMER</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase">OPPORTUNITY</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase text-right">VALUE</TableHead>
              <TableHead className="font-bold text-slate-800 text-sm tracking-wide uppercase text-center">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // LOADING STATE: Show 5 skeleton rows
              Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
            ) : data.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-400">No pending submissions requiring approval.</TableCell></TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.sheet_id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900">CS-2026-00{item.sheet_id}</span>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1 italic"><Clock className="h-3 w-3" /> {item.waiting_time}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(item.partial_submitted_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700">{item.sales_rep_name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col max-w-[150px]">
                      <span className="font-semibold text-slate-800 truncate" title={item.customer_name}>{item.customer_name}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-bold">{item.sales_region}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-slate-700 max-w-[150px] truncate" title={item.opportunity_name}>{item.opportunity_name}</TableCell>
                  <TableCell className="text-right">
                    <span className="font-bold text-slate-900">{item.currency_code} {item.sheet_value.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1.5">
                      <Button size="sm" onClick={() => handleApproveClick(item)} className="bg-secondary hover:bg-secondary/97 text-white h-7 px-2 text-xs font-bold gap-1 rounded-md">
                        <Check className="h-3 w-3 stroke-[3px]" />
                        <span className="hidden sm:inline">Approve</span>
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleRejectClick(item)} className="text-rose-500 border-rose-200 hover:bg-rose-50 h-7 px-2 text-xs font-bold gap-1 rounded-md">
                        <X className="h-3 w-3 stroke-[3px]" />
                        <span className="hidden sm:inline">Reject</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* APPROVE MODAL (Same as before) */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Approve Costing Sheet</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="comments" className="text-sm font-semibold text-slate-700">Comments</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveModalOpen(false)} disabled={isApproving}>Cancel</Button>
            <Button onClick={handleConfirmApprove} disabled={isApproving} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
              {isApproving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Approving...</> : 'Submit Approval'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* REJECT MODAL (Updated) */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle className="text-primary">Reject Costing Sheet</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            
            {/* Naya: Rejection Code Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="rejectionCode" className="text-sm font-semibold text-slate-700">Rejection Code</label>
              <select
                id="rejectionCode"
                value={rejectionCode}
                onChange={(e) => setRejectionCode(e.target.value)}
                className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 text-slate-700 font-medium"
              >
                <option value="REVISION_NEEDED">Needs Revision</option>
                <option value="PRICING_ISSUE">Pricing Issue</option>
                <option value="INCOMPLETE_DATA">Incomplete Data</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Rejection Reason Textarea */}
            <div className="flex flex-col gap-2">
              <label htmlFor="reason" className="text-sm font-semibold text-slate-700">Detailed Reason</label>
              <textarea
                id="reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[100px] w-full rounded-md border border-rose-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose-500"
                placeholder="Why are you rejecting this sheet?"
              />
            </div>

            {selectedSheet && (
              <p className="text-xs text-slate-500">
                You are about to return <span className="font-bold">CS-2026-00{selectedSheet.sheet_id}</span> back to the sales rep.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModalOpen(false)} disabled={isRejecting}>Cancel</Button>
            <Button onClick={handleConfirmReject} disabled={isRejecting} className="bg-primary hover:bg-primary/95 text-white font-bold">
              {isRejecting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Rejecting...</> : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}