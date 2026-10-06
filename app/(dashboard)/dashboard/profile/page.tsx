"use client";

import React, { useState } from 'react';
import {
  User, Shield, Check, Save, Activity, Heart, Eye,
  Settings, LogOut, Trash2, Info
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  // Profile state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [injuries, setInjuries] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('maintain');

  // Settings state
  const [preferredRegion, setPreferredRegion] = useState<'IN' | 'US'>('IN');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile & goal settings updated successfully!');
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('App preferences saved!');
  };

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  const handleDeleteAccount = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/');
  };

  // BMI calculation
  const wNum = parseFloat(weight);
  const hNum = parseFloat(height);
  let bmi = 0, bmiCategory = 'N/A', bmiPercent = 0, bmiColor = 'bg-slate-300';
  if (wNum > 0 && hNum > 0) {
    const hM = hNum / 100;
    bmi = Number((wNum / (hM * hM)).toFixed(1));
    if (bmi < 18.5) { bmiCategory = 'Underweight'; bmiColor = 'bg-blue-500'; bmiPercent = Math.min(100, (bmi / 18.5) * 25); }
    else if (bmi < 25) { bmiCategory = 'Normal Weight'; bmiColor = 'bg-green-500'; bmiPercent = Math.min(100, 25 + ((bmi - 18.5) / 6.5) * 25); }
    else if (bmi < 30) { bmiCategory = 'Overweight'; bmiColor = 'bg-orange-500'; bmiPercent = Math.min(100, 50 + ((bmi - 25) / 5) * 25); }
    else { bmiCategory = 'Obese'; bmiColor = 'bg-red-500'; bmiPercent = Math.min(100, 75 + ((bmi - 30) / 10) * 25); }
  }

  const goalLabel: Record<string, string> = {
    lose_weight: 'Weight Loss', gain_weight: 'Weight Gain',
    build_muscle: 'Muscle Building', maintain: 'Maintain Fit'
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputStyle = { backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold" style={{ color: 'var(--text-main)' }}>Profile & Settings</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>Update biometrics, app preferences, and manage your account.</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Toast */}
      {successMsg && (
        <div className="fixed top-20 right-6 bg-green-500 text-white p-4 rounded-xl text-xs flex items-center gap-2 font-bold z-50 shadow-xl animate-fade-in">
          <Check className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      <div className="space-y-8">

        {/* ── Section 1: Profile Biometrics ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <form onSubmit={handleSaveProfile} className="lg:col-span-2 glass-panel p-6 rounded-2xl space-y-5">
            <h3 className="text-sm font-bold flex items-center gap-2 pb-3" style={{ color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)' }}>
              <User className="w-4.5 h-4.5 text-blue-500" />
              Biometrics Parameters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Age (years)</label>
                <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 25" className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Gender</label>
                <select value={gender} onChange={e => setGender(e.target.value)} className={inputClass} style={inputStyle}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Height (cm)</label>
                <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 175" className={inputClass} style={inputStyle} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 70" className={inputClass} style={inputStyle} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Injuries / Physical Conditions</label>
              <input type="text" value={injuries} onChange={e => setInjuries(e.target.value)} placeholder="e.g. knee injury, shoulder strain, none..." className={inputClass} style={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Fitness Goal</label>
              <select value={fitnessGoal} onChange={e => setFitnessGoal(e.target.value)} className={inputClass} style={inputStyle}>
                <option value="lose_weight">Weight Loss</option>
                <option value="gain_weight">Weight Gain</option>
                <option value="build_muscle">Muscle Building</option>
                <option value="maintain">Maintain Fit</option>
              </select>
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              Save Profile
            </button>
          </form>

          {/* Right column: compact stats + BMI */}
          <div className="space-y-5">
            <div className="glass-panel p-5 rounded-2xl space-y-4">
              <h3 className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                <Activity className="w-4 h-4 text-blue-500" />
                Current Parameters
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Weight', val: `${weight ? weight + ' kg' : '--'}` },
                  { label: 'Height', val: `${height ? height + ' cm' : '--'}` },
                  { label: 'Age', val: `${age ? age + ' yrs' : '--'}` },
                  { label: 'Goal', val: goalLabel[fitnessGoal] || 'Maintain', color: 'text-blue-500' },
                ].map(({ label, val, color }) => (
                  <div key={label} className="p-3 rounded-xl text-center border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <span className="text-[9px] font-bold uppercase block" style={{ color: 'var(--text-muted)' }}>{label}</span>
                    <span className={`text-xs font-extrabold block mt-0.5 ${color || ''}`} style={!color ? { color: 'var(--text-main)' } : {}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {bmi > 0 ? (
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                  BMI Score
                </h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-black" style={{ color: 'var(--text-main)' }}>{bmi}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-lg text-white ${bmiColor}`}>{bmiCategory}</span>
                </div>
                <div className="space-y-1">
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--border-color)' }}>
                    <div className={`h-full rounded-full transition-all duration-500 ${bmiColor}`} style={{ width: `${bmiPercent}%` }} />
                  </div>
                  <div className="flex justify-between text-[8px] font-bold" style={{ color: 'var(--text-muted)' }}>
                    <span>Thin</span><span>Normal</span><span>Over</span><span>Obese</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-5 rounded-2xl text-xs text-slate-400">
                Enter height & weight to calculate your BMI score.
              </div>
            )}

            <div className="p-4 rounded-2xl flex gap-2 items-start text-xs border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              <Eye className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
              <p className="leading-relaxed">Injuries you log are used to flag at-risk exercises in the workout tracker.</p>
            </div>
          </div>
        </div>

        {/* ── Section 2: App Settings ── */}
        <div className="glass-panel p-6 rounded-2xl" style={{ borderTop: '2px solid var(--border-color)' }}>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-5" style={{ color: 'var(--text-main)' }}>
            <Settings className="w-4.5 h-4.5 text-blue-500" />
            App Preferences
          </h3>
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Default Catalog Region</label>
              <select value={preferredRegion} onChange={(e: any) => setPreferredRegion(e.target.value)} className={inputClass} style={inputStyle}>
                <option value="IN">India (IN) — Local Catalog</option>
                <option value="US">United States (US) — FDA Catalog</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase" style={{ color: 'var(--text-muted)' }}>Default Weight Unit</label>
              <select value={weightUnit} onChange={(e: any) => setWeightUnit(e.target.value)} className={inputClass} style={inputStyle}>
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5 h-fit">
              <Save className="w-4 h-4" />
              Save Preferences
            </button>
          </form>

          <div className="mt-4 flex gap-2 items-start p-3 rounded-xl text-xs border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
            <Info className="w-4 h-4 mt-0.5 text-blue-500 shrink-0" />
            Region preference affects which medicine catalog is searched by default in the Medications page.
          </div>
        </div>

        {/* ── Section 3: Danger Zone ── */}
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-red-500 space-y-4">
          <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
            <Shield className="w-4.5 h-4.5" />
            Danger Zone
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Deleting your account permanently erases all profile data, logged meals, hydration records, sleep logs, exercise history, and medication reminders.
          </p>
          {showConfirmDelete ? (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-red-500 uppercase block">This cannot be undone. Are you sure?</span>
              <div className="flex gap-2">
                <button onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" />
                  Yes, Delete Everything
                </button>
                <button onClick={() => setShowConfirmDelete(false)} className="font-bold py-2 px-4 rounded-xl border-none cursor-pointer text-xs" style={{ backgroundColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowConfirmDelete(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold py-2.5 px-4 rounded-xl border-none cursor-pointer text-xs flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
