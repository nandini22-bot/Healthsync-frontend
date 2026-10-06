"use client";

import React, { useState, useEffect } from 'react';
import { History, Calendar, FileText, RefreshCw, Apple, Dumbbell, Droplet } from 'lucide-react';

interface HistoryItem {
  id: string;
  type: 'nutrition' | 'exercise' | 'wellness';
  title: string;
  detail: string;
  date: string;
}

export default function HealthHistoryPage() {
  const [feed] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'nutrition' | 'exercise' | 'wellness'>('all');
  const [generatedDate, setGeneratedDate] = useState<string>('');

  useEffect(() => {
    setGeneratedDate(new Date().toLocaleString('en-US'));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const filteredFeed = feed.filter(item => 
    filter === 'all' ? true : item.type === filter
  );

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Print Stylesheet Hook */}
      <style jsx global>{`
        @media print {
          header, aside, button, nav, footer, select, .print-hide {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .glass-panel {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
          }
          .print-title {
            display: block !important;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
          }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center print-hide">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-905">Health History</h1>
          <p className="text-slate-500 mt-1">Review historical records of your physical activities, sleep, and nutrition items.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl border-none cursor-pointer flex items-center justify-center"
            title="Refresh history logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* PDF Header (Only visible on print) */}
      <div className="hidden print-title">
        <h2>HealthSync Daily Clinical Logs Report</h2>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }} suppressHydrationWarning>
          Generated on: {generatedDate}
        </p>
      </div>

      {/* Feed Panel */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6 print-hide">
          <h3 className="text-sm font-bold text-slate-800">Historical Telemetry Feed</h3>
          
          <select 
            value={filter}
            onChange={(e: any) => setFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 bg-white dark:bg-slate-900 text-slate-700 text-xs font-semibold rounded-lg focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="nutrition">Nutrition Logs</option>
            <option value="exercise">Exercise Logs</option>
            <option value="wellness">Wellness Logs</option>
          </select>
        </div>

        {filteredFeed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-slate-200 rounded-xl bg-slate-50 text-slate-400 text-sm">
            <History className="w-8 h-8 text-slate-300 mb-2" />
            <span>No historical records logged. Feed will populate once you begin logging meals and workouts.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeed.map((item) => (
              <div 
                key={item.id} 
                className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex justify-between items-center"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    item.type === 'nutrition' 
                      ? 'bg-green-50 text-green-600' 
                      : item.type === 'exercise' 
                        ? 'bg-red-50 text-red-600' 
                        : 'bg-blue-50 text-blue-600'
                  }`}>
                    {item.type === 'nutrition' ? <Apple className="w-4 h-4" /> : item.type === 'exercise' ? <Dumbbell className="w-4 h-4" /> : <Droplet className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <span className="font-extrabold text-slate-900 text-xs block">{item.title}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{item.detail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
