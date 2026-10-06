"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/*
  FILE PURPOSE:
  Renders the interactive bodyweight trend line chart.

  WHY IT EXISTS:
  Uses Recharts to display bodyweight variations logged over the last 7 entries,
  offering users visual cues on their weight progress.

  NEXT.JS ROLE:
  This is a Client Component (`"use client"`). Canvas renderings and dynamic tooltip SVG mouse trackers
  require browser-side DOM access.

  DATA FLOW:
  Receives a structured `data` array of `{ date, weight }` from the parent Server Page.
*/

interface WeightData {
  date: string; // e.g. "24 Aug"
  weight: number;
}

interface WeightTrendChartProps {
  data: WeightData[];
}

export default function WeightTrendChart({ data }: WeightTrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 text-xs py-10">
        No weight metrics logged in the past week. Log your metrics to show trends.
      </div>
    );
  }

  return (
    <div className="w-full h-48 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.18}/>
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            domain={['dataMin - 1', 'dataMax + 1']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#1e293b'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="weight" 
            name="Weight (kg)"
            stroke="#2563eb" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#weightGrad)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
