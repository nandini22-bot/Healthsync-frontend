import React, { useState } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Sparkles, Apple, Loader, ClipboardList, ShieldAlert } from 'lucide-react';

export default function DietPlanner() {
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    try {
      const plan = await api.ai.generateDietPlan();
      setDietPlan(plan);
    } catch (err) {
      setError(err.message || 'Failed to generate diet plan. Please save physical profile details first.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      <Sidebar />

      <main className="flex-1 pl-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div>
            <h1 className="text-3xl font-extrabold text-white">AI Diet Planner</h1>
            <p className="text-gray-400 mt-1">Generate a daily customized meal layout taking into account calorie target limits and profile allergies.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center space-y-6">
            {!dietPlan && !loading && (
              <>
                <Apple className="w-12 h-12 text-gray-700" />
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-white">No Diet Plan Active</h3>
                  <p className="text-xs text-gray-400 mt-1">Press generate below to read a customized nutritional schedule balancing proteins, carbs, and fats according to your goals.</p>
                </div>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader className="w-8 h-8 animate-spin text-green-400" />
                <span className="text-xs text-gray-450 font-semibold animate-pulse">Gemini consulting recipe databases...</span>
              </div>
            )}

            {!loading && (
              <button
                onClick={generatePlan}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{dietPlan ? 'Regenerate Plan' : 'Generate Diet Plan'}</span>
              </button>
            )}
          </div>

          {/* Plan Display */}
          {dietPlan && !loading && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Breakfast */}
                <div className="glass-panel p-5 rounded-xl border border-gray-850 space-y-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                    <span>Breakfast Plan</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{dietPlan.breakfast}</p>
                </div>

                {/* Lunch */}
                <div className="glass-panel p-5 rounded-xl border border-gray-850 space-y-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-full"></span>
                    <span>Lunch Plan</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{dietPlan.lunch}</p>
                </div>

                {/* Dinner */}
                <div className="glass-panel p-5 rounded-xl border border-gray-850 space-y-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    <span>Dinner Plan</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{dietPlan.dinner}</p>
                </div>

                {/* Snack */}
                <div className="glass-panel p-5 rounded-xl border border-gray-850 space-y-3">
                  <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>
                    <span>Snacks Plan</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{dietPlan.snack}</p>
                </div>

              </div>

              {/* Justification Box */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gradient-to-br from-[#111827]/40 to-[#0b0f19] space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-green-400" />
                  <span>Dietary Selections Justification</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">{dietPlan.justification}</p>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
