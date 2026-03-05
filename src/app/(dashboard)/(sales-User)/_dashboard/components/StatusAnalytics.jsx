"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { LayoutDashboard } from "lucide-react";

const StatusAnalytics = ({ breakdown }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chartData = (breakdown || []).filter((item) => item.count > 0);
  const COLORS = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#3b82f6",
    "#8b5cf6",
  ];

  if (!isMounted)
    return (
      <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" />
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[410px] my-15">

      {/* Chart */}
      <Card className="lg:col-span-3 border shadow-md bg-white rounded-xl  border-gray-200 h-full flex flex-col">
        <CardHeader className="pb-0 pt-4 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-md shadow-sm">
              <LayoutDashboard size={16} className="text-white" />
            </div>

            <CardTitle className="text-sm font-bold text-slate-800">
              Sheet Analytics
            </CardTitle>
          </div>

          <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-2 py-0.5 rounded-full">
            Live
          </span>
        </CardHeader>

        <CardContent className="px-4 pt-2 flex-1">
          <div className="h-[260px] w-full bg-slate-50 rounded-lg border border-gray-200 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  {COLORS.map((color, i) => (
                    <linearGradient
                      key={i}
                      id={`barGrad-${i}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                      <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#e2e8f0"
                  strokeOpacity={0.4}
                />

                <XAxis
                  dataKey="status"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 9, fontWeight: 700 }}
                />

                <YAxis hide />

                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white border border-slate-200 p-2 shadow-lg rounded-md">
                          <p className="text-[9px] font-bold text-slate-400 uppercase">
                            {payload[0].payload.status}
                          </p>

                          <p className="text-sm font-black text-slate-800">
                            {payload[0].value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={`url(#barGrad-${index % COLORS.length})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <Card className="lg:col-span-2  shadow-md bg-white rounded-xl border-slate-200 flex flex-col h-full">
        <CardHeader className="py-1 px-4 border-b border-slate-100">
          <CardTitle className="text-[12px] font-black text-slate-700 uppercase tracking-wider">
            Distribution
          </CardTitle>
        </CardHeader>

        <CardContent className="p-3 space-y-2 flex-1">

          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-2 py-1.5 rounded-md bg-slate-50 border border-transparent hover:border-slate-200"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-1.5 h-4 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />

                <span className="text-[12px] font-bold text-slate-700 truncate">
                  {item.status}
                </span>
              </div>

              <span className="text-[12px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded border">
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