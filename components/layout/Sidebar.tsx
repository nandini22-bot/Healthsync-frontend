"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  Pill, 
  Apple, 
  Dumbbell, 
  User, 
  LogOut,
  HeartPulse,
  Sparkles,
  MessageSquare,
  Menu,
  X,
  History,
  MapPin,
  Settings,
  Sun,
  Moon,
  Target
} from 'lucide-react';

interface SidebarProps {
  userEmail?: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on client side
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(savedTheme);
  }, []);

  // Update HTML class list when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const links = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Health Goals', path: '/dashboard/goals', icon: Target },
    { name: 'Medications', path: '/dashboard/medications', icon: Pill },
    { name: 'Nutrition Log', path: '/dashboard/nutrition', icon: Apple },
    { name: 'Exercise Log', path: '/dashboard/exercise', icon: Dumbbell },
    { name: 'Wellness Tracker', path: '/dashboard/wellness', icon: Activity },
    { name: 'AI Assistant', path: '/dashboard/ai-assistant', icon: MessageSquare },
    { name: 'AI Insights', path: '/dashboard/insights', icon: Sparkles },
    { name: 'Health History', path: '/dashboard/health-history', icon: History },
    { name: 'Nearby Services', path: '/dashboard/nearby-services', icon: MapPin },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: User }
  ];

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login');
  };

  return (
    <>
      {/* Fixed Top Header */}
      <header suppressHydrationWarning className="fixed top-0 left-0 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-40 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            suppressHydrationWarning
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-650 transition-all border-none bg-transparent"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-all ml-1 text-decoration-none"
          >
            <div className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 text-sm tracking-wide font-sans leading-none">HealthSync</span>
              <span className="text-[7px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">Clinical Wellness Hub</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {/* Day / Night Theme Button */}
          <button
            type="button"
            suppressHydrationWarning
            onClick={toggleTheme}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-slate-500 dark:text-slate-400 transition-all border-none bg-transparent flex items-center justify-center"
            aria-label="Toggle Theme Mode"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
          </button>

          {userEmail && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">{userEmail}</span>
              <Link 
                href="/dashboard/profile"
                className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white border border-blue-500/10 cursor-pointer text-decoration-none hover:opacity-90 transition-all"
              >
                {userEmail.substring(0, 2).toUpperCase()}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] z-45"
        ></div>
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside suppressHydrationWarning className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-800 text-sm tracking-wide leading-none">HealthSync</span>
              <span className="text-[7px] font-bold text-blue-600 tracking-wider uppercase mt-0.5">Clinical Menu</span>
            </div>
          </div>
          <button 
            suppressHydrationWarning
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-550 hover:text-slate-800 transition-all cursor-pointer border-none bg-transparent"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer text-decoration-none ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                    : 'text-slate-500 hover:text-blue-600 transition-colors'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            suppressHydrationWarning
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer border-none bg-transparent text-left"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
