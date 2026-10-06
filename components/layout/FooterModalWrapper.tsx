"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';

/*
  FILE PURPOSE:
  Client side wrapper for displaying Privacy Policy and Medical Disclaimer modals in the footer.
*/

export default function FooterModalWrapper() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <div suppressHydrationWarning className="flex gap-4 mt-1.5 opacity-80 print-hide">
        <button 
          suppressHydrationWarning
          onClick={() => setShowPrivacy(true)} 
          className="hover:underline text-[9px] text-slate-400 font-bold bg-transparent border-none cursor-pointer"
        >
          Privacy Policy
        </button>
        <span>•</span>
        <button 
          suppressHydrationWarning
          onClick={() => setShowDisclaimer(true)} 
          className="hover:underline text-[9px] text-slate-400 font-bold bg-transparent border-none cursor-pointer"
        >
          Disclaimer
        </button>
      </div>

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] text-left">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Privacy & Data Portability Policy</h3>
            <div className="overflow-y-auto space-y-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
              <p><strong>1. Information Collection:</strong> HealthSync collects biometric properties (age, height, weight, physical injuries) and telemetry metrics (meals, workouts, hydration levels) logged explicitly by the user.</p>
              <p><strong>2. Local & Database Storage:</strong> All logged records are secured via MongoDB connections. HealthSync does not sell, distribute, or share private physiological logs with third-party networks.</p>
              <p><strong>3. Dynamic AI Usage:</strong> When requesting AI assistant insights or search lookup recommendations, parameters are passed anonymously to the LLM model endpoints. No account identifiers are shared with AI processors.</p>
              <p><strong>4. User Control:</strong> You can completely erase your demographics records, hydration trackers, and prescription reminders at any time by executing the account delete option inside the Settings menu.</p>
            </div>
            <button 
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-slate-100 dark:border-slate-800 flex flex-col max-h-[85vh] text-left">
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-655 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Medical & Clinical Disclaimer</h3>
            <div className="overflow-y-auto space-y-3 text-xs text-slate-505 dark:text-slate-400 leading-relaxed pr-2">
              <p><strong>1. Not Medical Advice:</strong> HealthSync is an informational tracking engine. Suggestions provided by the AI Assistant, nutritional calculators, macro targets, and exercise warning checks are for informational purposes only.</p>
              <p><strong>2. Consult Professionals:</strong> Do not use HealthSync to substitute clinical consulting, diagnoses, or prescriptions from qualified healthcare providers. Always consult a general physician before undertaking significant physical routines or dietary restrictions.</p>
              <p><strong>3. Warning Flags:</strong> The injury-safe routine warnings are mock safety rules mapped to typical guidelines (such as flagging squats for knee limits). They do not constitute complete clinical clearances for physical loads.</p>
            </div>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
