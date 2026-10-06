import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  X
} from 'lucide-react';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Trackers', path: '/trackers', icon: Activity },
    { name: 'Medications', path: '/medications', icon: Pill },
    { name: 'Nutrition', path: '/nutrition', icon: Apple },
    { name: 'Exercise', path: '/exercise', icon: Dumbbell },
    { name: 'AI Diet Planner', path: '/diet', icon: Sparkles },
    { name: 'AI Workout Planner', path: '/workout', icon: Sparkles },
    { name: 'AI Health Chat', path: '/chat', icon: MessageSquare },
    { name: 'Profile Settings', path: '/profile', icon: User }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer text-slate-600 transition-all"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-all ml-1"
          >
            <div className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm tracking-wide">Healthsync</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">{user.email}</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white border border-blue-500/10">
              {user.email.substring(0, 2).toUpperCase()}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] z-45"
        ></div>
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside className={`w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <HeartPulse className="w-4.5 h-4.5" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm tracking-wide">Healthsync Menu</span>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/10' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5 shrink-0 transition-transform" />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
