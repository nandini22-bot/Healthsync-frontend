import React, { useState } from 'react';
import { api } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Sparkles, Dumbbell, Loader, ShieldCheck, ShieldAlert } from 'lucide-react';

export default function WorkoutPlanner() {
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePlan = async () => {
    setLoading(true);
    setError('');
    try {
      const plan = await api.ai.generateWorkoutPlan();
      setWorkoutPlan(plan);
    } catch (err) {
      setError(err.message || 'Failed to generate workout plan. Please save physical profile details first.');
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
            <h1 className="text-3xl font-extrabold text-white">AI Workout Planner</h1>
            <p className="text-gray-400 mt-1">Generate a customized workout schedule. The engine automatically filters out movements dangerous for your active injuries.</p>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 flex flex-col items-center justify-center text-center space-y-6">
            {!workoutPlan && !loading && (
              <>
                <Dumbbell className="w-12 h-12 text-gray-700" />
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-white">No Workout Schedule Configured</h3>
                  <p className="text-xs text-gray-400 mt-1">Press generate below to read a weekly exercise layout mapped dynamically around any joints or movement boundaries in your profile.</p>
                </div>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader className="w-8 h-8 animate-spin text-green-400" />
                <span className="text-xs text-gray-455 font-semibold animate-pulse">Gemini filtering compound movements & assembling routines...</span>
              </div>
            )}

            {!loading && (
              <button
                onClick={generatePlan}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-green-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{workoutPlan ? 'Regenerate Plan' : 'Generate Workout Routine'}</span>
              </button>
            )}
          </div>

          {/* Schedule Display */}
          {workoutPlan && !loading && (
            <div className="space-y-6">
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Your Weekly Training Layout</h3>
                <div className="grid grid-cols-1 gap-4">
                  {workoutPlan.schedule?.map((item, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-xl border border-gray-850 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="md:w-1/4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-lg">{item.day}</span>
                        <h4 className="text-sm font-extrabold text-white mt-2">{item.focus}</h4>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-300 leading-relaxed">{item.activities}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Regulations */}
              <div className="glass-panel p-6 rounded-2xl border border-gray-850 bg-gradient-to-br from-[#111827]/40 to-[#0b0f19] space-y-3">
                <h4 className="text-xs font-bold text-amber-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Safety Exclusions & Recommendations</span>
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">{workoutPlan.safety_rules}</p>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
