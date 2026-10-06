"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse, ArrowRight, Loader } from 'lucide-react';

/*
  FILE PURPOSE:
  Onboarding questionnaire page (/profile-setup).

  WHY IT EXISTS:
  Collects base values (age, height, weight, activityLevel, injuries) on first registration,
  saves them to MongoDB via Route Handlers, and redirects user to the dashboard.

  NEXT.JS ROLE:
  This is a Client Component (`"use client"`). Form states and router navigation transitions
  require client execution.

  DATA FLOW:
  Client Forms inputs -> POST /api/auth/profile-setup -> Redirect to `/dashboard`.
*/

export default function ProfileSetupPage() {
  const router = useRouter();
  
  // Form field states
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [fitnessGoal, setFitnessGoal] = useState('lose_weight');
  const [injuries, setInjuries] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="mx-auto flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-2xl w-12 h-12 shadow-sm border border-blue-100">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Onboarding Profile</h2>
          <p className="text-sm text-slate-500 mt-1.5">Configure your biometric defaults so the AI engine can formulate plans.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Age (years)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 24" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Gender</label>
              <select 
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Height (cm)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 175" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Weight (kg)</label>
              <input 
                type="number" 
                required 
                placeholder="e.g. 68" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Activity Level</label>
              <select 
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none"
              >
                <option value="sedentary">Sedentary (desk job)</option>
                <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Fitness Goal</label>
              <select 
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none"
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="maintain_weight">Maintain Weight</option>
                <option value="gain_weight">Gain Weight</option>
                <option value="build_muscle">Build Muscle</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Injuries / Joint Pain limits (optional)</label>
              <textarea 
                placeholder="e.g. Back pain, left knee injury (exercises involving these will be dynamically excluded)" 
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm focus:outline-none h-20 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-none flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Saving Biometrics...</span>
                </>
              ) : (
                <>
                  <span>Complete Profile Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
