import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { User, Activity, AlertTriangle, ShieldCheck, Dumbbell, Save, Loader } from 'lucide-react';

export default function Profile() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { setHasProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [calculators, setCalculators] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchProfileAndStats = async () => {
    try {
      const data = await api.profile.get();
      if (data) {
        setProfile(data);
        // Pre-fill form fields
        Object.keys(data).forEach(key => setValue(key, data[key]));
        
        // Fetch calculations from wellness endpoint
        const summary = await api.wellness.getSummary();
        if (summary.calculators) {
          setCalculators(summary.calculators);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndStats();
  }, []);

  const onSubmit = async (data) => {
    setSaveLoading(true);
    setMsg({ text: '', type: '' });
    try {
      const parsedData = {
        ...data,
        age: parseInt(data.age),
        height: parseFloat(data.height),
        weight: parseFloat(data.weight)
      };

      await api.profile.save(parsedData);
      setHasProfile(true);
      setMsg({ text: 'Profile saved successfully!', type: 'success' });
      fetchProfileAndStats();
    } catch (err) {
      setMsg({ text: err.message || 'Failed to save profile.', type: 'error' });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex">
      <Sidebar />
      
      <main className="flex-1 pl-64 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400 mt-1">Configure your physical indicators, medical filters, and wellness parameters.</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="w-8 h-8 animate-spin text-green-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Profile Config Form */}
              <div className="lg:col-span-2 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 rounded-2xl space-y-6">
                  {msg.text && (
                    <div className={`p-4 rounded-xl border text-sm ${
                      msg.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/20 text-green-200' 
                        : 'bg-red-500/10 border-red-500/20 text-red-200'
                    }`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Section 1: Demographics */}
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-green-400" />
                      <span>Physical Metrics</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Age</label>
                        <input
                          type="number"
                          placeholder="e.g. 28"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('age', { required: 'Age is required', min: 1, max: 120 })}
                        />
                        {errors.age && <span className="text-xs text-red-400">{errors.age.message}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Height (cm)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 175"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('height', { required: 'Height is required', min: 50, max: 250 })}
                        />
                        {errors.height && <span className="text-xs text-red-400">{errors.height.message}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Weight (kg)</label>
                        <input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 72.5"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('weight', { required: 'Weight is required', min: 20, max: 400 })}
                        />
                        {errors.weight && <span className="text-xs text-red-400">{errors.weight.message}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Gender</label>
                        <select
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('gender', { required: 'Gender is required' })}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Activity Level</label>
                        <select
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('activity_level', { required: 'Activity level is required' })}
                        >
                          <option value="sedentary">Sedentary (desk job)</option>
                          <option value="lightly_active">Lightly Active (1-3 days/wk)</option>
                          <option value="moderately_active">Moderately Active (3-5 days/wk)</option>
                          <option value="very_active">Very Active (6-7 days/wk)</option>
                          <option value="extra_active">Extra Active (heavy work/2x day)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Fitness Goal</label>
                        <select
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('fitness_goal', { required: 'Goal is required' })}
                        >
                          <option value="lose_weight">Lose Weight</option>
                          <option value="maintain_weight">Maintain Weight</option>
                          <option value="gain_weight">Gain Weight</option>
                          <option value="build_muscle">Build Muscle</option>
                          <option value="improve_endurance">Improve Endurance</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-850" />

                  {/* Section 2: Dietary Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <Activity className="w-5 h-5 text-green-400" />
                      <span>Dietary Profile</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Dietary Preference</label>
                        <select
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm"
                          {...register('dietary_preference')}
                        >
                          <option value="none">Standard Diet</option>
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="keto">Ketogenic</option>
                          <option value="paleo">Paleolithic</option>
                          <option value="pescatarian">Pescatarian</option>
                          <option value="gluten_free">Gluten Free</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Food Allergies</label>
                        <input
                          type="text"
                          placeholder="e.g. Peanuts, Shellfish, Dairy"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm placeholder:text-gray-600"
                          {...register('allergies')}
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-850" />

                  {/* Section 3: Medical and Injury Filters */}
                  <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      <span>Medical Constraints (Safety Filters)</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Existing Medical Conditions</label>
                        <input
                          type="text"
                          placeholder="e.g. Hypertension, Diabetes, Asthma"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm placeholder:text-gray-600"
                          {...register('medical_conditions')}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1.5">Injuries / Limitations</label>
                        <input
                          type="text"
                          placeholder="e.g. Knee injury, Lower back pain"
                          className="w-full bg-[#111827]/85 border border-gray-800 rounded-xl py-2.5 px-3.5 text-white focus:outline-none focus:border-green-500 transition-all text-sm placeholder:text-gray-600"
                          {...register('injuries')}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {saveLoading ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span>Save Configuration</span>
                  </button>
                </form>
              </div>

              {/* Calculations sidebar */}
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-gray-800 text-center">
                  <h3 className="text-xl font-bold text-white mb-2">My Health Indexes</h3>
                  <p className="text-xs text-gray-400">Values calculated based on demographic parameters</p>
                  
                  {calculators ? (
                    <div className="mt-8 space-y-6">
                      <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-850">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Body Mass Index (BMI)</span>
                        <h4 className="text-3xl font-extrabold text-green-400 mt-1">{calculators.bmi}</h4>
                        <span className="text-xs text-gray-400 block mt-1.5 font-medium">
                          {calculators.bmi < 18.5 ? 'Underweight' : calculators.bmi < 25 ? 'Normal weight' : 'Overweight'}
                        </span>
                      </div>

                      <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-850">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Basal Metabolic Rate (BMR)</span>
                        <h4 className="text-3xl font-extrabold text-emerald-400 mt-1">{calculators.bmr} kcal</h4>
                        <span className="text-xs text-gray-400 block mt-1">Calorie burned at rest daily</span>
                      </div>

                      <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-850">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Daily Calorie Target (TDEE)</span>
                        <h4 className="text-3xl font-extrabold text-blue-400 mt-1">{calculators.tdee} kcal</h4>
                        <span className="text-xs text-gray-400 block mt-1">Energy expenditure including activity</span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 p-6 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-200 text-sm">
                      Enter and save your Physical Metrics to calculate and display your BMI, BMR, and TDEE results.
                    </div>
                  )}
                </div>

                <div className="glass-panel p-5 rounded-2xl bg-gradient-to-b from-[#111827]/40 to-[#0b0f19] border border-gray-850">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-green-400" />
                    <span>Important Constraint Disclaimer</span>
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Healthsync is exclusively an educational wellness system and **does not** provide medical advice, diagnosis, prescription suggestions, or recommendations for drugs. In case of medical emergencies, please consult a licensed medical practitioner immediately.
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
