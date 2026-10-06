import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { KeyRound, Mail, AlertCircle, ArrowLeft, CheckCircle2, Loader } from 'lucide-react';

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [debugToken, setDebugToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');
    setDebugToken('');
    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(data.email);
      setSuccessMsg(res.message || 'Reset token generated.');
      if (res.debugToken) {
        setDebugToken(res.debugToken);
      }
    } catch (err) {
      setServerError(err.message || 'Failed to submit forgot password request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19] px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="mb-6">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm font-medium text-gray-400 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-xl mb-3 border border-green-500/20">
            <KeyRound className="w-6 h-6 text-green-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Reset Password</h2>
          <p className="text-gray-400 mt-2 text-sm">Enter your email and we'll generate a reset token</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <span>{serverError}</span>
          </div>
        )}

        {successMsg ? (
          <div className="space-y-6">
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-200 text-sm rounded-xl flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-green-400" />
              <div>
                <p className="font-semibold text-white">{successMsg}</p>
                {debugToken && (
                  <div className="mt-3 p-3 bg-[#111827] rounded-lg border border-gray-800 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Your Reset Token (Demo Mode)</p>
                    <span className="text-xl font-bold font-mono tracking-widest text-green-400">{debugToken}</span>
                  </div>
                )}
              </div>
            </div>
            <Link
              to="/reset-password"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg text-center block"
            >
              Go to Enter Reset Token
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-[#111827]/80 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all placeholder:text-gray-600"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                />
              </div>
              {errors.email && <span className="text-xs text-red-400 mt-1 block">{errors.email.message}</span>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-green-500/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <span>Request Reset Token</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
