"use client";

import React, { useState } from 'react';
import { Target, Flame, Apple, Check, RefreshCw, Heart, Calendar } from 'lucide-react';

interface GoalData {
  goal: string;
  targets: {
    intake: number;
    protein: number;
    carbs: number;
    fat: number;
    burn: number;
  };
  today: {
    intake: number;
    protein: number;
    carbs: number;
    fat: number;
    burn: number;
  };
  history: Array<{
    date: string;
    intake: number;
    burn: number;
    intakeTarget: number;
    burnTarget: number;
  }>;
}

export default function GoalsPage() {
  const [data, setData] = useState<GoalData>({
    goal: 'maintain',
    targets: { intake: 2000, protein: 120, carbs: 250, fat: 70, burn: 250 },
    today: { intake: 0, protein: 0, carbs: 0, fat: 0, burn: 0 },
    history: []
  });

  const [msg, setMsg] = useState<string | null>(null);

  const height = 0;
  const weight = 0;

  const computeTargets = (goal: string) => {
    if (goal === 'lose_weight') return { intake: 1700, protein: 130, carbs: 180, fat: 55, burn: 400 };
    if (goal === 'gain_weight') return { intake: 2600, protein: 140, carbs: 340, fat: 80, burn: 200 };
    if (goal === 'build_muscle') return { intake: 2800, protein: 160, carbs: 320, fat: 90, burn: 300 };
    return { intake: 2000, protein: 120, carbs: 250, fat: 70, burn: 250 };
  };

  const handleUpdateGoal = (newGoal: string) => {
    setData(prev => ({
      ...prev,
      goal: newGoal,
      targets: computeTargets(newGoal)
    }));
    setMsg('Goal updated! Targets recalculated for your new objective.');
    setTimeout(() => setMsg(null), 3000);
  };

  const intakePercent = Math.round((data.today.intake / data.targets.intake) * 100);
  const burnPercent = Math.round((data.today.burn / data.targets.burn) * 100);

  // BMI calculation
  const bmi = 0;
  const bmiCategory = 'N/A';
  const bmiColor = 'bg-slate-300';
  const bmiPercent = 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Health Goals</h1>
          <p className="text-slate-500 mt-1">Configure your fitness targets, and review calorie intake/burn progress logs.</p>
        </div>
        <button
          type="button"
          onClick={() => { setMsg('Targets refreshed!'); setTimeout(() => setMsg(null), 2000); }}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold p-2.5 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {msg && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs flex items-center gap-2 font-bold max-w-md animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Goal Selector Cards */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Select Your Daily Health Objective</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { key: 'lose_weight', name: 'Weight Loss', desc: 'Lower calories limit, high fat-burning exercise target' },
            { key: 'gain_weight', name: 'Weight Gain', desc: 'Surplus calories limit, low calorie-burn targets' },
            { key: 'build_muscle', name: 'Muscle Building', desc: 'High protein focus with structured lifting routines' },
            { key: 'maintain', name: 'Maintain Fit', desc: 'Standard calorie intake limits and standard cardios' }
          ].map((item) => {
            const isSelected = data.goal === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleUpdateGoal(item.key)}
                className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between h-28 ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10' 
                    : 'bg-slate-50 hover:bg-slate-150 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                <span className="font-extrabold text-xs block">{item.name}</span>
                <span className={`text-[10px] leading-relaxed block mt-1.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {item.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BMI Section on goals page */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <span>Biometric Body Mass Index (BMI)</span>
        </h3>

        {bmi > 0 ? (
          <>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-2xl font-black text-slate-850 block">{bmi}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">BMI Status Value</span>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-lg text-white ${bmiColor}`}>
                {bmiCategory}
              </span>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full relative">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${bmiColor}`}
                  style={{ width: `${bmiPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase">
                <span>Deficit</span>
                <span>Normal</span>
                <span>Overweight</span>
                <span>Obese</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs py-2 text-slate-400">
            Add height & weight in Profile to view your BMI assessment.
          </div>
        )}
      </div>

      {/* Progress Snapshots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Intake Progress */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
          <h3 className="text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
            <Apple className="w-5 h-5 text-green-605" />
            <span>Today's Nutrition Intake Target</span>
          </h3>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-slate-100 dark:border-slate-800"></div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-800 block">{intakePercent}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Completed</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-semibold">
            {data.today.intake} / {data.targets.intake} kcal consumed
          </p>
        </div>

        {/* Burn Progress */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 text-center">
          <h3 className="text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
            <Flame className="w-5 h-5 text-red-605" />
            <span>Today's Calories Burn Target</span>
          </h3>

          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-[10px] border-slate-100 dark:border-slate-800"></div>
            <div className="space-y-1">
              <span className="text-3xl font-black text-slate-800 block">{burnPercent}%</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Burned</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-semibold">
            {data.today.burn} / {data.targets.burn} kcal burned
          </p>
        </div>

      </div>

      {/* Target Macros Breakdown */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-850">Ideal Daily Targets Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl">
            <span className="text-[9px] font-bold text-slate-550 dark:text-slate-400 uppercase block">Daily Calories</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 block mt-1">{data.targets.intake} kcal</span>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl">
            <span className="text-[9px] font-bold text-slate-555 dark:text-slate-400 uppercase block">Proteins Target</span>
            <span className="text-sm font-extrabold text-red-600 dark:text-red-400 block mt-1">{data.targets.protein}g</span>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl">
            <span className="text-[9px] font-bold text-slate-555 dark:text-slate-400 uppercase block">Carbs Target</span>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 block mt-1">{data.targets.carbs}g</span>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl">
            <span className="text-[9px] font-bold text-slate-555 dark:text-slate-400 uppercase block">Fats Target</span>
            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 block mt-1">{data.targets.fat}g</span>
          </div>
        </div>
      </div>

      {/* History Compliance */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-sm font-bold text-slate-850 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <span>Past Compliance History</span>
        </h3>

        {data.history.length === 0 ? (
          <div className="text-xs text-slate-400 py-6 text-center border border-dashed rounded-xl">
            No historical target logs recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {data.history.map((day, idx) => {
              const dayIntakePct = Math.round((day.intake / day.intakeTarget) * 100) || 0;
              const dayBurnPct = Math.round((day.burn / day.burnTarget) * 100) || 0;

              return (
                <div key={idx} className="p-4 bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">{day.date}</span>
                  </div>

                  <div className="flex gap-6">
                    <div className="space-y-1 min-w-36 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Intake Met</span>
                        <span className="text-slate-850">{dayIntakePct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(100, dayIntakePct)}%` }}></div>
                      </div>
                    </div>

                    <div className="space-y-1 min-w-36 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-500">Burn Met</span>
                        <span className="text-slate-850">{dayBurnPct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(100, dayBurnPct)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
