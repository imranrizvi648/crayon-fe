"use client";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Calendar, User, MessageSquare, ShieldCheck } from "lucide-react";

export default function WorkflowDetail({ workflowData, selectedSheetInfo, isLoading }) {
  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Loading...</div>;
  }

  if (!workflowData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 bg-white rounded-2xl border">
        <div className="p-4 bg-gray-50 rounded-full">📁</div>
        <p className="text-sm font-medium">Select a sheet to see workflow details</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl border shadow-sm p-6 overflow-y-auto custom-scrollbar">
      {/* Compact Header */}
      <div className="flex justify-between items-end border-b pb-4 mb-6 text-black">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedSheetInfo?.sheet_number}</h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{selectedSheetInfo?.customer_name}</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-blue-600 leading-none">
            {selectedSheetInfo?.currency_code} {new Intl.NumberFormat().format(selectedSheetInfo?.total_eup)}
          </p>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-400 uppercase mt-1 inline-block">
            {selectedSheetInfo?.template_type} Template
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <h3 className="font-bold text-sm text-slate-800 uppercase tracking-widest">Workflow Status</h3>
        <div className="h-[1px] flex-1 bg-slate-100"></div>
      </div>
      
      {/* Steps Vertical Timeline */}
      <div className="relative ml-2 text-black">
        {workflowData.steps.map((step, index) => {
          const isCompleted = step.status === "COMPLETED";
          const isLast = index === workflowData.steps.length - 1;

          return (
            <div key={index} className="flex gap-4 pb-8 relative">
              {/* Vertical Line */}
              {!isLast && (
                <div className={`absolute left-[13px] top-[28px] bottom-[-8px] w-[1.5px] ${
                  isCompleted ? "bg-green-200" : "bg-slate-100"
                }`} />
              )}
              
              {/* Compact Step Icon */}
              <div className="relative z-10">
                {isCompleted ? (
                  <div className="bg-green-100 p-1 rounded-full ring-4 ring-white shadow-sm">
                    <CheckCircle2 className="text-green-600" size={18} />
                  </div>
                ) : (
                  <div className="bg-slate-50 p-1 rounded-full ring-4 ring-white shadow-sm border border-slate-200">
                    <Clock className="text-slate-400" size={18} />
                  </div>
                )}
              </div>

              {/* Step Content Card */}
              <div className={`flex-1 flex flex-col bg-white p-3 rounded-xl border transition-all ${
                isCompleted ? "border-slate-100 shadow-sm" : "border-slate-50 opacity-70"
              } -mt-1`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-blue-500/50 uppercase italic">Step 0{step.step_number}</span>
                      <p className="font-bold text-[13px] text-slate-800">{step.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{step.description}</p>
                  </div>
                  <Badge className={`text-[9px] px-1.5 h-5 shadow-none border-none uppercase font-black ${
                    isCompleted ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}>
                    {step.status}
                  </Badge>
                </div>

                {/* Extra Backend Fields */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-50">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <User size={12} className="text-slate-300" />
                    <span className="truncate">Assigned: <b>{step.assigned_to}</b></span>
                  </div>
                  
                  {step.completed_by && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <ShieldCheck size={12} className="text-green-400" />
                      <span className="truncate">By: <b>{step.completed_by}</b></span>
                    </div>
                  )}

                  {step.completed_at && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Calendar size={12} className="text-slate-300" />
                      <span>{new Date(step.completed_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  )}
                </div>

                {/* Dynamic Comments Box */}
                {step.comments && (
                  <div className="mt-3 p-2 bg-blue-50/50 rounded-lg border border-blue-100/50 flex gap-2 items-start">
                    <MessageSquare size={12} className="text-blue-400 mt-0.5" />
                    <p className="text-[10px] text-blue-700 italic font-medium leading-tight">
                      "{step.comments}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}