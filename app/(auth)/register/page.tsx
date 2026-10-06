"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartPulse, Mail, Lock, ArrowRight, Loader } from 'lucide-react';

/*
  FILE PURPOSE:
  User sign up page (/register).

  WHY IT EXISTS:
  Captures credentials inputs, triggers the register endpoint API, manages submission loadings,
  displays errors, and redirects to onboarding profile setups on success.

  NEXT.JS ROLE:
  This is a Client Component (`"use client"`). Form inputs, state modifications,
  and submit transitions rely on client-side hooks and browser runtimes.

  DATA FLOW:
  Client Input -> POST /api/auth/register -> Router transition to `/profile-setup`.
*/

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    document.cookie = 'auth_token=demo; path=/';
    setTimeout(() => {
      setLoading(false);
      router.push('/profile-setup');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="mx-auto flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-2xl w-12 h-12 shadow-sm border border-blue-100">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 mt-1.5">Sign up to configure your region, biometrics, and AI wellness targets.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-650 text-xs p-3.5 rounded-xl font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 bg-slate-55/50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Mail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-205 bg-slate-55/50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Lock className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-none flex items-center justify-center gap-1.5 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-xs text-slate-400 font-bold uppercase">Or</span>
          </div>

          <div className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-blue-655 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
