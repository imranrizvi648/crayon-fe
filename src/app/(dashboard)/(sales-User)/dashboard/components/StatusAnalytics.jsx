"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LayoutDashboard } from 'lucide-react';

const StatusAnalytics = ({ breakdown }) => {
  const chartData = (breakdown || []).filter(item => item.count > 0);
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      
      {/* Chart Card */}
      <Card className="lg:col-span-3 border-none shadow-sm bg-white rounded-xl overflow-hidden border border-slate-100">
        <CardHeader className="pb-0 pt-5 px-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-md shadow-sm">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800 tracking-tight">
              Sheet Analytics
            </CardTitle>
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">Live Data</span>
        </CardHeader>

        <CardContent className="px-6 pb-6 pt-3">
          <div className="h-[200px] w-full bg-slate-50/50 rounded-xl border border-slate-100/50 p-3 shadow-inner">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  {COLORS.map((color, i) => (
                    <linearGradient key={`grad-${i}`} id={`barGrad-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.5}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e2e8f0" strokeOpacity={0.4} />
                <XAxis 
                  dataKey="status" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', radius: 8 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/95 backdrop-blur-sm border border-slate-100 p-3 shadow-xl rounded-lg">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{payload[0].payload.status}</p>
                          <p className="text-lg font-black text-slate-800">{payload[0].value} <span className="text-xs font-medium text-slate-500 ml-1">Sheets</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[5, 5, 5, 5]} barSize={28}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#barGrad-${index % COLORS.length})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Details */}
      <Card className="lg:col-span-2 border-none shadow-sm bg-white rounded-xl overflow-hidden border border-slate-100 flex flex-col">
        <CardHeader className="py-4 px-5 border-b border-slate-50 bg-slate-50/30">
          <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-[0.15em]">Distribution Details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-2 flex-1 overflow-y-auto">
          {chartData.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200 group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-2 h-6 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[13px] font-bold text-slate-700 tracking-tight truncate leading-none">
                  {item.status}
                </span>
              </div>
              <span className="text-[13px] font-black text-[#1a3556] bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm group-hover:border-blue-200 transition-colors">
                {item.count}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusAnalytics;