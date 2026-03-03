"use client";
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const formatCurrency = (value) => {
  if (!value) return "$0";
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-200 shadow-sm rounded-md">
        <p className="font-bold text-slate-800 text-xs">{payload[0].payload.name}</p>
        <p className="font-bold text-primary text-xs">
          {payload[0].payload.isCount ? payload[0].value : formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function TeamOverview({ data, loading }) {
  if (loading) {
    return <div className="h-64 flex items-center justify-center border rounded-xl bg-white mb-6 text-slate-400 text-xs font-bold uppercase tracking-widest">Syncing Overview...</div>;
  }

  const overview = data || {
    total_team_revenue: 0,
    total_partial_submitted: 0,
    approval_rate: 0,
    average_deal_size: 0,
    top_performers: []
  };

  // Chart Data: Showing Revenue, Sheets (Scaled for visibility), and Avg Deal Size
  const chartData = [
    { name: 'Revenue', value: overview.total_team_revenue, color: '#f43f5e' },
    { name: 'Avg Deal', value: overview.average_deal_size, color: '#6366f1' },
    { name: 'Sheets', value: overview.total_partial_submitted * 50000, isCount: true, color: '#10b981' }, 
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* LEFT: Team KPI Chart */}
      <div className="lg:col-span-2 bg-white rounded border border-slate-200 shadow-sm p-6 flex flex-col ">
        <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tight">Team Performance Chart</h3>
        <div className="flex-1 w-full min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={45}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RIGHT: Metrics & Performers */}
      <div className="flex flex-col gap-6">
        
        {/* Key Metrics */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-[13px] font-bold text-slate-600 mb-4 ">Key Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Total Revenue</span>
              <span className="text-sm font-bold text-slate-600">{formatCurrency(overview.total_team_revenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Sheets Sub</span>
              <span className="text-sm font-bold text-slate-600">{overview.total_partial_submitted}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Avg Deal Size</span>
              <span className="text-sm font-bold text-slate-600">{formatCurrency(overview.average_deal_size)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-tight">Approval Rate</span>
              <span className="text-sm font-bold text-emerald-500">{overview.approval_rate}%</span>
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-[13px] font-black text-slate-600 mb-4 ">Top Performers</h3>
          <div className="space-y-3">
            {overview.top_performers?.slice(0, 2).map((performer, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">{performer.name}</span>
                <span className="text-xs font-bold text-slate-600">{formatCurrency(performer.total_value)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}