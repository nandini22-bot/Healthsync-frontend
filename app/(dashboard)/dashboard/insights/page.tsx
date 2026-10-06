"use client";

import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  TrendingUp, 
  Droplet, 
  Moon, 
  Apple, 
  RefreshCw,
  Activity
} from 'lucide-react';

interface InsightItem {
  category: 'Nutrition' | 'Sleep' | 'Hydration' | 'Medications';
  status: 'warning' | 'optimal' | 'info';
  text: string;
}

interface InsightsData {
  summary: string;
  insights: InsightItem[];
  metrics: {
    waterMl: number;
    sleepHours: number;
    totalCalories: number;
    totalProtein: number;
  };
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsData | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleRefresh = () => {
    setToast('Insights evaluation checked!');
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Health Insights</h1>
          <p className="text-slate-500 mt-1">AI-powered evaluations of your daily nutrition, sleep, and compliance parameters.</p>
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2.5 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5"
          aria-label="Refresh insights"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {toast && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-xl text-xs font-bold max-w-md">
          {toast}
        </div>
      )}

      {!data ? (
        <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Metrics Logged Today</h3>
          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Begin logging your daily meals, hydration, sleep routine, or exercises in the wellness tracker to generate personalized clinical AI health insights.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Daily Summary Hero */}
          <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-blue-600 space-y-3 bg-gradient-to-r from-blue-50/50 to-transparent">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>Today's Clinical Summary</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
              {data.summary}
            </p>
          </div>

          {/* Quick Metrics Glance */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Water Log</span>
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                <Droplet className="w-4 h-4 text-blue-600" />
                {data.metrics.waterMl} ml
              </span>
            </div>
            
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sleep Log</span>
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                <Moon className="w-4 h-4 text-indigo-650" />
                {data.metrics.sleepHours} hrs
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Calories Log</span>
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                <Apple className="w-4 h-4 text-amber-650" />
                {data.metrics.totalCalories} kcal
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Protein Log</span>
              <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-red-600" />
                {data.metrics.totalProtein}g
              </span>
            </div>
          </div>

          {/* Categorized Detailed Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.insights.map((insight, index) => {
              const isWarning = insight.status === 'warning';
              const isOptimal = insight.status === 'optimal';

              return (
                <div 
                  key={index} 
                  className={`p-5 rounded-2xl border flex gap-4 items-start ${
                    isWarning 
                      ? 'bg-red-50/40 border-red-100 text-red-900' 
                      : isOptimal 
                        ? 'bg-green-50/40 border-green-100 text-green-900' 
                        : 'bg-blue-50/40 border-blue-100 text-blue-900'
                  }`}
                >
                  {isWarning ? (
                    <AlertCircle className="w-5 h-5 mt-0.5 text-red-650 shrink-0" />
                  ) : isOptimal ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 text-green-650 shrink-0" />
                  ) : (
                    <Info className="w-5 h-5 mt-0.5 text-blue-650 shrink-0" />
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block opacity-70">
                      {insight.category}
                    </span>
                    <p className="text-xs leading-relaxed font-medium">
                      {insight.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
