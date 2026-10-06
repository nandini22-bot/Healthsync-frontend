"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowRight, ShieldCheck, Sparkles, Activity, Target, MessageSquare, MapPin, X } from 'lucide-react';

/*
  FILE PURPOSE:
  Landing entry page for the HealthSync application (`/`).

  WHY IT EXISTS:
  It serves as the public marketing/informational portal with interactive privacy policy/disclaimer popup modals.
*/

const carouselSlides = [
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&auto=format&fit=crop&q=80",
    title: "Intelligent Nutrition Engine",
    desc: "Calculate meal calories and macros instantly with dynamic targets adjusted to your fitness objective."
  },
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
    title: "Injury-Safe Exercise Logs",
    desc: "Protect your joints with custom physical safety alerts that flag routines conflicting with your medical history."
  },
  {
    url: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1200&auto=format&fit=crop&q=80",
    title: "Clinical Medication Catalog",
    desc: "Manage prescription rosters with region-aware dosage search indices spanning FDA and local catalog datasets."
  }
];

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // Auto-play carousel slides
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between relative">
      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto w-full px-6 h-16 flex items-center justify-between border-b border-slate-200/50">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <HeartPulse className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-slate-800 text-base tracking-wide">HealthSync</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-all px-4 py-2 rounded-xl text-decoration-none">
            Sign In
          </Link>
          <Link href="/register" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all px-4.5 py-2 rounded-xl text-decoration-none shadow-sm shadow-blue-550/10">
            Create Account
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex flex-col space-y-12">
        
        {/* Text Area */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase border border-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Advanced Clinical Health Ecosystem</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Your Intelligent Personal <span className="text-blue-600">Wellness Engine</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed">
            Synchronize daily macro profiles, plan workout routines with injury-safe parameters, locate nearby healthcare providers via GPS geocoding, and extract AI clinical insights.
          </p>

          <div className="flex justify-center gap-4 pt-2">
            <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 text-xs text-decoration-none">
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Dynamic Image Carousel Slider */}
        <div className="relative w-full h-[320px] md:h-[450px] bg-slate-200 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <img 
            src={carouselSlides[activeSlide].url} 
            alt={carouselSlides[activeSlide].title}
            className="w-full h-full object-cover transition-opacity duration-1000"
          />
          {/* Text Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent flex flex-col justify-end p-8 md:p-12 text-white space-y-2">
            <span className="text-xs font-bold bg-blue-600 text-white py-1 px-3 rounded-full w-fit">
              {carouselSlides[activeSlide].title}
            </span>
            <p className="text-sm md:text-base text-slate-200 max-w-xl font-medium">
              {carouselSlides[activeSlide].desc}
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="absolute top-6 right-6 flex gap-2">
            {carouselSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`w-3 h-3 rounded-full border-none cursor-pointer transition-all ${
                  idx === activeSlide ? 'bg-blue-600 scale-125' : 'bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          
          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg w-fit">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Dynamic Goals Matching</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Target calories intake and burn thresholds calculate instantly based on active goals. Track daily compliance ratios dynamically.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Injury Safety Interceptors</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Safety check flags automatically tag cardio and lifting movements matching logged injuries, highlighting risks before you exercise.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg w-fit">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">GPS Geocoding Finder</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Geocode queries using OpenStreetMap APIs to display actual, real-world pharmacies, hospitals, and medical clinics near you.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-indigo-50 text-indigo-650 rounded-lg w-fit">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">AI Triage Assistant</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Query wellness companion systems with emergency filters that flag symptoms and route alerts directly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg w-fit">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Custom AI Health Insights</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Query Gemini to aggregate macro intakes, hydration telemetry, and prescriptions to compile clinical logs recommendations.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl space-y-3 flex flex-col justify-center items-start bg-blue-50/20 border-dashed">
            <h3 className="text-sm font-bold text-blue-750">Exportable Health Summary</h3>
            <p className="text-xs text-slate-550 leading-relaxed mt-1">
              Export clinical health summaries and logged historical entries to formatted PDF reports directly.
            </p>
            <Link href="/register" className="mt-4 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
              <span>Sign Up Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </main>

      {/* Footer with legal disclaimer */}
      <footer className="border-t border-slate-200/50 bg-white py-8 px-6 text-slate-400 text-[10px] font-bold">
        <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span>© 2026 HealthSync Wellness Systems. All rights reserved.</span>
            <p className="text-[9px] opacity-75 font-normal max-w-2xl leading-normal mt-1">
              Disclaimer: HealthSync is an informational wellness engine. AI suggestions, calorie targets, and medication search catalogues do not constitute professional medical advice, diagnosis, or clinical prescriptions.
            </p>
          </div>
          
          <div className="flex gap-4 shrink-0">
            <button onClick={() => setShowPrivacy(true)} className="hover:underline text-[10px] font-bold text-slate-400 bg-transparent border-none cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => setShowDisclaimer(true)} className="hover:underline text-[10px] font-bold text-slate-400 bg-transparent border-none cursor-pointer">Disclaimer</button>
          </div>
        </div>
      </footer>

      {/* PRIVACY POLICY MODAL */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-slate-100 flex flex-col max-h-[85vh]">
            <button 
              onClick={() => setShowPrivacy(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Privacy & Data Portability Policy</h3>
            <div className="overflow-y-auto space-y-3 text-xs text-slate-550 leading-relaxed pr-2">
              <p><strong>1. Information Collection:</strong> HealthSync collects biometric properties (age, height, weight, physical injuries) and telemetry metrics (meals, workouts, hydration levels) logged explicitly by the user.</p>
              <p><strong>2. Local & Database Storage:</strong> All logged records are secured via MongoDB cluster connections using standard SSL schemas. HealthSync does not sell, distribute, or share private physiological logs with third-party networks.</p>
              <p><strong>3. Dynamic AI Usage:</strong> When requesting AI assistant insights or search lookup recommendations, parameters are passed anonymously to the LLM model endpoints. No account identifiers are shared with AI processors.</p>
              <p><strong>4. User Control:</strong> You can completely erase your demographics records, hydration trackers, and prescription reminders at any time by executing the account delete option inside the Settings menu.</p>
            </div>
            <button 
              onClick={() => setShowPrivacy(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* DISCLAIMER MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-[1.5px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-slate-100 flex flex-col max-h-[85vh]">
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-4">Medical & Clinical Disclaimer</h3>
            <div className="overflow-y-auto space-y-3 text-xs text-slate-550 leading-relaxed pr-2">
              <p><strong>1. Not Medical Advice:</strong> HealthSync is an informational tracking engine. Suggestions provided by the AI Assistant, nutritional calculators, macro targets, and exercise warning checks are for informational purposes only.</p>
              <p><strong>2. Consult Professionals:</strong> Do not use HealthSync to substitute clinical consulting, diagnoses, or prescriptions from qualified healthcare providers. Always consult a general physician before undertaking significant physical routines or dietary restrictions.</p>
              <p><strong>3. Warning Flags:</strong> The injury-safe routine warnings are mock safety rules mapped to typical guidelines (such as flagging squats for knee limits). They do not constitute complete clinical clearances for physical loads.</p>
            </div>
            <button 
              onClick={() => setShowDisclaimer(true)}
              className="hidden" // Just a hidden button if needed
            />
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs border-none cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
