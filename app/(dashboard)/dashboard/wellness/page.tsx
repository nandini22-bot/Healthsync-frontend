"use client";

import React, { useState } from 'react';
import { Droplet, Moon, Scale, Star, Check, Plus } from 'lucide-react';

export default function WellnessPage() {
  const [waterMl, setWaterMl] = useState(0);
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);
  const [weightKg, setWeightKg] = useState(0);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showSleepForm, setShowSleepForm] = useState(false);
  const [inputSleep, setInputSleep] = useState('');
  const [inputQuality, setInputQuality] = useState('5');

  const [showWeightForm, setShowWeightForm] = useState(false);
  const [inputWeight, setInputWeight] = useState('');

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAddWater = (amount: number) => {
    const newTotal = Math.max(0, waterMl + amount);
    setWaterMl(newTotal);
    showToast(`${amount > 0 ? '+' : ''}${amount}ml hydration logged!`);
  };

  const handleLogSleep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSleep) return;
    setSleepHours(Number(inputSleep));
    setSleepQuality(Number(inputQuality));
    showToast('Sleep log updated!');
    setShowSleepForm(false);
    setInputSleep('');
  };

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputWeight) return;
    setWeightKg(Number(inputWeight));
    showToast('Weight profile updated!');
    setShowWeightForm(false);
    setInputWeight('');
  };

  const waterGoal = 2500;
  const waterPct = Math.min(100, Math.round((waterMl / waterGoal) * 100));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>Wellness Telemetry</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Track body weight logs, maintain hydration goals, and record sleep patterns.</p>
      </div>

      {/* Floating Success Toast */}
      {successMsg && (
        <div className="fixed top-20 right-6 bg-green-500 text-white p-4 rounded-xl text-xs flex items-center gap-2 font-bold z-50 shadow-xl">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Hydration Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Hydration</span>
            <Droplet className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{waterMl} ml</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Daily Goal: {waterGoal.toLocaleString()} ml</p>
            {/* Progress bar */}
            <div className="mt-3 w-full rounded-full h-2" style={{ backgroundColor: 'var(--border-color)' }}>
              <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${waterPct}%` }} />
            </div>
            <p className="text-[10px] mt-1 font-semibold text-blue-500">{waterPct}% of daily goal</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '+ 250ml', amount: 250, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
              { label: '+ 500ml', amount: 500, color: 'bg-blue-600 hover:bg-blue-700 text-white' },
              { label: '− 250ml', amount: -250, color: 'bg-red-500 hover:bg-red-600 text-white' },
              { label: '− 500ml', amount: -500, color: 'bg-red-500 hover:bg-red-600 text-white' },
            ].map(({ label, amount, color }) => (
              <button
                key={label}
                onClick={() => handleAddWater(amount)}
                disabled={amount < 0 && waterMl < Math.abs(amount)}
                className={`${color} font-bold py-2 rounded-xl text-xs border-none cursor-pointer transition-all disabled:opacity-40`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Sleep Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Sleep</span>
            <Moon className="w-5 h-5 text-indigo-400" />
          </div>

          {!showSleepForm ? (
            <>
              <div>
                <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{sleepHours > 0 ? `${sleepHours} hrs` : '-- hrs'}</h3>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span>Quality:</span>
                  {sleepQuality > 0 ? (
                    <span className="font-bold flex items-center text-indigo-400">
                      {sleepQuality}/5 <Star className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </span>
                  ) : (
                    <span>Not logged</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowSleepForm(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer transition-all mt-auto"
              >
                Log Sleep Routine
              </button>
            </>
          ) : (
            <form onSubmit={handleLogSleep} className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <input
                  type="number" step="0.1" required
                  placeholder="Hours slept (e.g. 7.5)"
                  value={inputSleep}
                  onChange={(e) => setInputSleep(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)', border: '1px solid' }}
                />
                <div className="flex justify-between items-center gap-2">
                  <label className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>Quality (1–5)</label>
                  <select
                    value={inputQuality}
                    onChange={(e) => setInputQuality(e.target.value)}
                    className="px-2 py-1 rounded-lg text-xs focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)', border: '1px solid' }}
                  >
                    <option value="5">5 – Excellent</option>
                    <option value="4">4 – Good</option>
                    <option value="3">3 – Fair</option>
                    <option value="2">2 – Poor</option>
                    <option value="1">1 – Terrible</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs border-none cursor-pointer">Save</button>
                <button type="button" onClick={() => setShowSleepForm(false)} className="flex-1 font-bold py-2 rounded-xl text-xs border-none cursor-pointer" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>

        {/* Weight Card */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Body Weight</span>
            <Scale className="w-5 h-5 text-emerald-400" />
          </div>

          {!showWeightForm ? (
            <>
              <div>
                <h3 className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>{weightKg > 0 ? `${weightKg} kg` : '-- kg'}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Scale telemetry record</p>
              </div>
              <button
                onClick={() => setShowWeightForm(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer transition-all mt-auto"
              >
                Log Scale Weight
              </button>
            </>
          ) : (
            <form onSubmit={handleLogWeight} className="space-y-3 flex-1 flex flex-col justify-between">
              <input
                type="number" step="0.1" required
                placeholder="Weight in kg (e.g. 72.5)"
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)', border: '1px solid' }}
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs border-none cursor-pointer">Save</button>
                <button type="button" onClick={() => setShowWeightForm(false)} className="flex-1 font-bold py-2 rounded-xl text-xs border-none cursor-pointer" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}>Cancel</button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
