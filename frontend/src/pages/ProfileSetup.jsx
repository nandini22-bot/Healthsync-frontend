import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Heart, User, Loader } from 'lucide-react';

export default function ProfileSetup() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { setHasProfile } = useAuth();
  const [saveLoading, setSaveLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setSaveLoading(true);
    setServerError('');
    try {
      const parsedData = {
        ...data,
        age: parseInt(data.age),
        height: parseFloat(data.height),
        weight: parseFloat(data.weight)
      };

      await api.profile.save(parsedData);
      setHasProfile(true);
      navigate('/');
    } catch (err) {
      setServerError(err.message || 'Failed to complete profile registration.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl glass-panel p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-xl mb-3 border border-green-500/20 text-green-400">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Complete Profile Setup</h2>
          <p className="text-gray-400 mt-2 text-sm">We personalize calorie goals, diet strategies, and workout limits using your details.</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Age</label>
              <input
                type="number"
                placeholder="Years"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                {...register('age', { required: 'Age is required', min: 1 })}
              />
              {errors.age && <span className="text-xs text-red-400 mt-1 block">{errors.age.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Height (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="cm"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                {...register('height', { required: 'Height is required', min: 50 })}
              />
              {errors.height && <span className="text-xs text-red-400 mt-1 block">{errors.height.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                placeholder="kg"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                {...register('weight', { required: 'Weight is required', min: 20 })}
              />
              {errors.weight && <span className="text-xs text-red-400 mt-1 block">{errors.weight.message}</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Gender</label>
              <select
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                {...register('gender', { required: 'Gender is required' })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Activity Level</label>
              <select
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Fitness Goal</label>
              <select
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
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

          <hr className="border-gray-850" />

          {/* Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Dietary Preference</label>
              <select
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm"
                {...register('dietary_preference')}
              >
                <option value="none">Standard Diet</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Ketogenic</option>
                <option value="paleo">Paleo</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="gluten_free">Gluten Free</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Food Allergies</label>
              <input
                type="text"
                placeholder="e.g. Nuts, Dairy (optional)"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm placeholder:text-gray-650"
                {...register('allergies')}
              />
            </div>
          </div>

          {/* Safety */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Medical Conditions & Injuries</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="e.g. Hypertension, Asthma (optional)"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm placeholder:text-gray-650"
                {...register('medical_conditions')}
              />
              <input
                type="text"
                placeholder="e.g. Knee injury, Back pain (optional)"
                className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all text-sm placeholder:text-gray-650"
                {...register('injuries')}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-900/60 border border-gray-800 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong>Health Disclaimer:</strong> Healthsync is an educational wellness portal. It does not replace medical advice, diagnose diseases, prescribe medication, or assist in medical emergencies. Always speak to a physician for health issues.
            </p>
          </div>

          <button
            type="submit"
            disabled={saveLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saveLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>Initialize Dashboard</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
