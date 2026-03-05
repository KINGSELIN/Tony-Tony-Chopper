
import React, { useState } from 'react';
import { 
  Home, ClipboardList, MessageCircle, User, FileText, 
  Utensils, Heart, Gamepad2, Watch, Mic, Radio, 
  ShieldCheck, Lock, LogOut, ChevronRight, Activity
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { APP_LOGO } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userRole: UserRole;
  userProfile: UserProfile;
  onSignOut: () => void;
  t: any;
  streak: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userRole, userProfile, onSignOut, t, streak }) => {
  const tabs = [
    { id: 'dashboard', label: t.dashboard, icon: Home },
    { id: 'tracker', label: t.tracker, icon: ClipboardList },
    { id: 'game', label: t.game, icon: Gamepad2 },
    { id: 'sync', label: t.sync, icon: Watch },
    { id: 'diet', label: t.diet, icon: Utensils },
    { id: 'reports', label: t.reports, icon: FileText },
    { id: 'chat', label: t.chat, icon: MessageCircle },
    { id: 'profile', label: t.profile, icon: User },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row pb-20 md:pb-0 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 h-screen sticky top-0 p-6 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-8 mb-10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-xl border-2 border-amber-50 p-1.5 overflow-hidden">
              <img src={APP_LOGO} alt="CHOPPER" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-espresso tracking-tight">CHOPPER</h1>
              <div className="flex items-center gap-1 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Session Secure
              </div>
            </div>
          </div>

          {/* Firewall Status Badge */}
          <div className="bg-slate-900 p-4 rounded-2xl text-white space-y-3 relative overflow-hidden group">
             <div className="flex items-center justify-between relative z-10">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Firewall Integrity</span>
                <ShieldCheck size={14} className="text-emerald-400" />
             </div>
             <div className="flex items-end justify-between relative z-10">
                <p className="text-xl font-black">99.8%</p>
                <div className="flex gap-0.5 h-3">
                   {[1,2,3,4].map(i => <div key={i} className="w-1 bg-emerald-400 rounded-full" style={{ height: `${20 + i*20}%` }} />)}
                </div>
             </div>
             <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 font-bold text-sm group ${
                activeTab === tab.id
                  ? 'bg-amber-50 text-golden-brown shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon size={20} className={activeTab === tab.id ? 'text-golden-brown' : 'text-slate-300 group-hover:text-espresso'} />
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRight size={14} />}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-6">
          <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 border border-slate-100 overflow-hidden">
                  {userProfile.profilePic ? (
                    <img src={userProfile.profilePic} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-espresso truncate text-xs">{userProfile.name}</p>
                  <p className="text-[9px] text-golden-brown font-black uppercase tracking-widest">{userRole}</p>
                </div>
             </div>
             <button 
               onClick={onSignOut}
               className="w-full flex items-center justify-center gap-2 py-2.5 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors border border-slate-100 shadow-sm"
             >
               <LogOut size={14} /> End Session
             </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-[8px] font-black text-slate-300 uppercase tracking-widest">
             <Lock size={10} /> AES-256 Protected
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-cream">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-50 p-1 overflow-hidden">
              <img src={APP_LOGO} alt="CHOPPER" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-espresso text-base leading-none">CHOPPER</span>
              <span className="text-[7px] font-black text-emerald-500 uppercase tracking-tighter">Secure Link Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                <ShieldCheck size={18} />
             </div>
             <div className="flex items-center gap-1.5 text-golden-brown font-black text-sm">
                <Heart size={18} fill="currentColor" />
                <span>{streak}</span>
             </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-4 md:p-10">
          {children}
        </div>

        {/* Floating Voice Assistant Button */}
        <div className="fixed bottom-24 right-6 md:bottom-10 md:right-10 z-40">
           <motion.button
             whileHover={{ scale: 1.05, y: -2 }}
             whileTap={{ scale: 0.95 }}
             onClick={() => onTabChange('chat-voice')}
             className="w-16 h-16 bg-espresso text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl relative group overflow-hidden"
           >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Radio size={28} className="text-golden-brown group-hover:text-emerald-400 transition-colors relative z-10" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-emerald-500/20"
              />
           </motion.button>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around py-3 px-2 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 p-2 min-w-[50px] transition-all ${
              activeTab === tab.id ? 'text-golden-brown' : 'text-slate-300'
            }`}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} />
            <span className="text-[7px] font-black uppercase tracking-widest whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
