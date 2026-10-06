"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import WeightTrendChart from '@/components/dashboard/WeightTrendChart';

import {
  Flame,
  Droplet,
  Moon,
  Scale,
  ArrowUpRight,
  Award,
  Plus,
  Pill,
  AlertTriangle,
  Heart,
  Target
} from 'lucide-react';

export default function DashboardPage() {
  const [waterMl] = useState(0);
  const totalCaloriesLogged = 0;
  const sleepHours = 0;
  const sleepQuality = 0;
  const currentWeight = 0;

  const goal = 'maintain';
  const calorieGoal = 2000;
  const waterGoal = 2500;

  const waterPct = Math.min(100, Math.round((waterMl / waterGoal) * 100));
  const caloriePct = Math.min(100, Math.round((totalCaloriesLogged / calorieGoal) * 100));

  // BMI calculation
  const bmi = 0;
  const bmiCategory = 'N/A';
  const bmiColor = '#94a3b8';
  const bmiPct = 0;

  const injuries = '';
  const goalLabel: Record<string, string> = {
    lose_weight: 'Weight Loss',
    gain_weight: 'Weight Gain',
    build_muscle: 'Muscle Building',
    maintain: 'Maintain Fit'
  };

  const weightChartData: Array<{ date: string; weight: number }> = [];
  const activeMeds: Array<{ _id: string; brandName: string; time: string }> = [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>Daily Snapshot</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            Real-time health statistics, telemetry logs, and AI wellness observations.
          </p>
        </div>
        <Link
          href="/dashboard/wellness"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all cursor-pointer border-none flex items-center gap-2 text-xs no-underline"
        >
          <Plus className="w-4 h-4" />
          Log Metric
        </Link>
      </div>

      {/* ── Row 1: Core 4 metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Calories */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Nutrition Intake</span>
            <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{totalCaloriesLogged.toLocaleString()} kcal</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Goal: {calorieGoal.toLocaleString()} kcal</p>
          </div>
          <div className="p-3.5 bg-green-500/10 rounded-xl text-green-500">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Hydration */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hydration Log</span>
            <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{waterMl} ml</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Goal: {waterGoal.toLocaleString()} ml</p>
          </div>
          <div className="p-3.5 bg-blue-500/10 rounded-xl text-blue-500">
            <Droplet className="w-6 h-6" />
          </div>
        </div>

        {/* Sleep */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sleep Summary</span>
            <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              {sleepHours > 0 ? `${sleepHours} hrs` : '— hrs'}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Quality: {sleepQuality > 0 ? `${sleepQuality}/5` : 'N/A'}
            </p>
          </div>
          <div className="p-3.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Moon className="w-6 h-6" />
          </div>
        </div>

        {/* Weight */}
        <div className="glass-panel p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Body Weight</span>
            <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>
              {currentWeight > 0 ? `${currentWeight} kg` : '— kg'}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Not logged today</p>
          </div>
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-500">
            <Scale className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ── Row 2: Water Jar + Calorie % + BMI ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Water Jar Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hydration</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-end gap-4">
            {/* Jar SVG */}
            <div className="relative w-14 h-20 shrink-0">
              <svg viewBox="0 0 56 80" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="6" y="8" width="44" height="64" rx="6" fill="none" stroke="currentColor" strokeWidth="3" style={{ color: 'var(--border-color)' }} />
                <rect x="10" y="2" width="36" height="10" rx="3" fill="currentColor" style={{ color: 'var(--border-color)' }} />
                <clipPath id="jarClip">
                  <rect x="7" y="9" width="42" height="62" rx="5" />
                </clipPath>
                <rect
                  x="7"
                  y={9 + 62 * (1 - waterPct / 100)}
                  width="42"
                  height={62 * (waterPct / 100)}
                  rx="3"
                  fill="#3b82f6"
                  fillOpacity="0.75"
                  clipPath="url(#jarClip)"
                />
                {waterPct > 5 && (
                  <ellipse cx="28" cy={9 + 62 * (1 - waterPct / 100) + 3} rx="18" ry="3" fill="#60a5fa" fillOpacity="0.4" clipPath="url(#jarClip)" />
                )}
              </svg>
            </div>
            <div>
              <span className="text-3xl font-black text-blue-500">{waterPct}%</span>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{waterMl} / {waterGoal} ml</p>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
            <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${waterPct}%` }} />
          </div>
          <Link href="/dashboard/wellness" className="text-[10px] font-bold text-blue-500 hover:underline no-underline">+ Log water →</Link>
        </div>

        {/* Calorie % Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Calorie Goal</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="7" style={{ color: 'var(--border-color)' }} />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - caloriePct / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.7s ease' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black" style={{ color: 'var(--text-main)' }}>
                {caloriePct}%
              </span>
            </div>
            <div>
              <p className="text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>{totalCaloriesLogged.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>of {calorieGoal.toLocaleString()} kcal</p>
              <p className="text-[10px] font-bold text-orange-500 mt-1">Goal: {goalLabel[goal]}</p>
            </div>
          </div>
          <Link href="/dashboard/goals" className="text-[10px] font-bold text-orange-500 hover:underline no-underline">Change goal →</Link>
        </div>

        {/* BMI Card */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Body Mass Index</span>
            <Heart className="w-4 h-4 text-red-500" />
          </div>
          {bmi > 0 ? (
            <>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black" style={{ color: 'var(--text-main)' }}>{bmi}</span>
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-lg text-white" style={{ backgroundColor: bmiColor }}>
                  {bmiCategory}
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border-color)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${bmiPct}%`, backgroundColor: bmiColor }} />
                </div>
                <div className="flex justify-between text-[8px] font-bold" style={{ color: 'var(--text-muted)' }}>
                  <span>Thin</span><span>Normal</span><span>Over</span><span>Obese</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs py-2" style={{ color: 'var(--text-muted)' }}>
              Add height & weight in <Link href="/dashboard/profile" className="text-blue-500 hover:underline no-underline">Profile</Link> to calculate BMI.
            </div>
          )}
          <Link href="/dashboard/profile" className="text-[10px] font-bold text-red-500 hover:underline no-underline">Update biometrics →</Link>
        </div>
      </div>

      {/* ── Row 3: Active Medicines + Injuries + Goal ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Active Medicines */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Active Medicines</span>
            <Pill className="w-4 h-4 text-blue-500" />
          </div>
          {activeMeds.length === 0 ? (
            <p className="text-xs py-1" style={{ color: 'var(--text-muted)' }}>No medications scheduled.</p>
          ) : (
            <div className="space-y-2">
              {activeMeds.map((m) => (
                <div key={m._id} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="font-semibold truncate" style={{ color: 'var(--text-main)' }}>{m.brandName}</span>
                  <span className="text-[9px] shrink-0" style={{ color: 'var(--text-muted)' }}>{m.time}</span>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/medications" className="text-[10px] font-bold text-blue-500 hover:underline no-underline">Manage medications →</Link>
        </div>

        {/* Injuries & Conditions */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Injuries & Conditions</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          {!injuries ? (
            <p className="text-xs py-1" style={{ color: 'var(--text-muted)' }}>No injuries recorded.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-500">
                {injuries}
              </span>
            </div>
          )}
          <Link href="/dashboard/profile" className="text-[10px] font-bold text-amber-500 hover:underline no-underline">Update profile →</Link>
        </div>

        {/* Active Goal */}
        <div className="glass-panel p-5 rounded-2xl flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Active Goal</span>
            <Target className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-xl font-extrabold" style={{ color: 'var(--text-main)' }}>{goalLabel[goal]}</p>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Balanced intake · Standard cardio
            </p>
            <p className="text-[10px] mt-2 font-semibold text-purple-500">Target: {calorieGoal.toLocaleString()} kcal/day</p>
          </div>
          <Link href="/dashboard/goals" className="text-[10px] font-bold text-purple-500 hover:underline no-underline">Change goal →</Link>
        </div>
      </div>

      {/* ── Row 4: Chart + AI Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl flex flex-col min-h-[300px]">
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>Weekly Health Trends</h3>
            <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>Visual tracking for logged body weight metrics.</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <WeightTrendChart data={weightChartData} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
              <Award className="w-5 h-5 text-blue-500" />
              Weekly AI Report
            </h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Personalized health intelligence summary.</p>
            <div className="p-4 rounded-xl text-xs leading-relaxed" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border-color)' }}>
              No health metrics logged today. Log your meals, water intake, sleep, or workouts to generate custom observations.
            </div>
          </div>
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Link href="/dashboard/insights" className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 no-underline">
              View wellness insights
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
