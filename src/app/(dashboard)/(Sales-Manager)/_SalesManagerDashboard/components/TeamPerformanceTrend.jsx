"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, BarChart3, Loader2,TrendingUp  } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

export default function TeamPerformanceTrend({ searchUsers, onUserSelect, perfData, isLoading }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const chartData = useMemo(() => {
    if (!perfData?.metrics) return [];
    return [
      { name: "Total", value: perfData.metrics.sheets_submitted, color: "#6366f1" },
      { name: "Approved", value: perfData.metrics.approved, color: "#10b981" },
      { name: "Rejected", value: perfData.metrics.rejected, color: "#ef4444" },
    ];
  }, [perfData]);

  const handleSearch = async (val) => {
    setSearch(val);
    if (val.length > 1) {
      const users = await searchUsers(val);
      setResults(users);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const selectUser = (user) => {
    setSearch(user.full_name);
    setShowDropdown(false);
    onUserSelect(user.id);
  };

  return (
    <Card className="p-5  shadow  bg-card border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 self-start">
            <BarChart3 className="text-primary" size={18} />
            <h2 className="text-lg font-bold tracking-tight">Performance Trend</h2>
        </div>
        
        <div className="relative w-full sm:w-60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <Input 
              placeholder="Search member..." 
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-40 overflow-auto text-sm">
              {results.map(user => (
                <div key={user.id} onClick={() => selectUser(user)} className="px-3 py-1.5 hover:bg-accent cursor-pointer border-b last:border-0">
                  {user.full_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-11 gap-6 px-12">
        {/* Left Side: Chota Chart Area */}
        <div className="md:col-span-7 bg-muted/10 rounded-xl p-3 border border-muted/30 h-[220px]">
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
          ) : perfData ? (
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} content={({ active, payload }) => (
                        active && payload && (
                            <div className="bg-white p-2 shadow-md rounded border text-[10px] font-bold">
                                {payload[0].value} {payload[0].payload.name}
                            </div>
                        )
                    )} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                </BarChart>
             </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center opacity-30 text-xs">
              <TrendingUp size={30} className="mb-1" />
              <p>Select a user</p>
            </div>
          )}
        </div>

        {/* Right Side: Compact Summary */}
        <div className="md:col-span-4 flex flex-col justify-center space-y-3">
            <SummaryItem label="Revenue" value={perfData?.metrics?.total_revenue ? `$${(perfData.metrics.total_revenue / 1000000).toFixed(1)}M` : "$0.0M"} />
            <SummaryItem label="Sheets" value={perfData?.metrics?.sheets_submitted ?? "0"} />
            <SummaryItem label="Approved" value={perfData?.metrics?.approved ?? "0"} color="text-emerald-500" />
            <SummaryItem label="Rejected" value={perfData?.metrics?.rejected ?? "0"} color="text-rose-500" />
            
            {perfData?.metrics?.approval_rate_percentage && (
                <div className="pt-2">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{width: `${perfData.metrics.approval_rate_percentage}%`}} />
                    </div>
                    <p className="text-[10px] font-bold mt-1 text-primary">{perfData.metrics.approval_rate_percentage}% Approval Rate</p>
                </div>
            )}
        </div>
      </div>
    </Card>
  );
}

function SummaryItem({ label, value, color = "text-foreground" }) {
  return (
    <div className="flex justify-between items-center border-b border-muted/30 pb-1">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <span className={cn("font-bold text-sm", color)}>{value}</span>
    </div>
  );
}