import React from 'react';
import Link from 'next/link';
import { HeartPulse, Mail, ArrowRight } from 'lucide-react';

/*
  FILE PURPOSE:
  Request password reset tokens (/forgot-password).
*/
export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        <div className="mx-auto flex items-center justify-center p-2 bg-blue-50 text-blue-600 rounded-2xl w-12 h-12 shadow-sm border border-blue-100">
          <HeartPulse className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-905 tracking-tight">Reset Password</h2>
          <p className="text-sm text-slate-500 mt-1.5">Enter your email to receive a password reset numeric token.</p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 sm:rounded-2xl space-y-6">
          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-550 block">Email address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-55/50 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <Mail className="absolute left-3.5 top-3 text-slate-400 w-4 h-4" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer border-none flex items-center justify-center gap-1.5 text-sm"
            >
              <span>Send Reset Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            Back to{' '}
            <Link href="/login" className="font-bold text-blue-655 hover:underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
