
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Zap, 
  Activity, 
  ChevronRight, 
  CheckCircle, 
  Droplets, 
  Info, 
  AlertTriangle, 
  Sparkles, 
  PieChart as PieChartIcon, 
  FlaskConical, 
  Plus, 
  Check,
  History,
  Target,
  Settings2,
  Trash2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DIET_ROUTINE, ABSORPTION_TIPS, FADE_UP } from '../constants';

import { DailyLog } from '../types';

interface WaterLogEntry {
  id: string;
  amount: number;
  time: string;
}

const DietRoutine: React.FC<{ t: any; logs: DailyLog[] }> = ({ t, logs }) => {
  const [waterIntake, setWaterIntake] = useState(1250); // in ml
  const [waterTarget, setWaterTarget] = useState(2500); // in ml
  
  const latestLog = logs[0];
  const dietRecs = latestLog?.recommendations?.filter(r => r.type === 'diet') || [];

  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>([
    { id: '1', amount: 500, time: '08:30 AM' },
    { id: '2', amount: 250, time: '10:15 AM' },
    { id: '3', amount: 500, time: '12:45 PM' },
  ]);
  
  const [showLogFeedback, setShowLogFeedback] = useState(false);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [floatingValue, setFloatingValue] = useState<{ id: number, text: string } | null>(null);

  const macroData = [
    { name: 'Protein', value: 30, color: '#34D399' }, 
    { name: 'Carbs', value: 45, color: '#FBBF24' },   
    { name: 'Fats', value: 25, color: '#38BDF8' },    
  ];

  const handleAddWater = (amount: number) => {
    setWaterIntake(prev => Math.min(waterTarget * 1.5, prev + amount));
    const newLog: WaterLogEntry = {
      id: Date.now().toString(),
      amount,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setWaterLogs(prev => [newLog, ...prev]);
    triggerFloating(`+${amount}ml`);
  };

  const removeWaterLog = (id: string) => {
    const entry = waterLogs.find(l => l.id === id);
    if (entry) {
      setWaterIntake(prev => Math.max(0, prev - entry.amount));
      setWaterLogs(prev => prev.filter(l => l.id !== id));
    }
  };

  const handleLogMeal = () => {
    setShowLogFeedback(true);
    setTimeout(() => setShowLogFeedback(false), 2000);
  };

  const toggleItem = (item: string, sectionTitle: string) => {
    const isChecked = checkedItems.includes(item);
    if (isChecked) {
      setCheckedItems(prev => prev.filter(i => i !== item));
    } else {
      setCheckedItems(prev => [...prev, item]);
      let feedback = "+5mg Ca";
      if (sectionTitle.includes("Vitamin D")) feedback = "+100 IU";
      if (sectionTitle.includes("synergy")) feedback = "+Magnesium";
      triggerFloating(feedback);
    }
  };

  const triggerFloating = (text: string) => {
    const id = Date.now();
    setFloatingValue({ id, text });
    setTimeout(() => setFloatingValue(null), 1000);
  };

  const waterProgress = (waterIntake / waterTarget) * 100;

  return (
    <div className="space-y-8 relative pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-espresso">{t.diet}</h2>
          <p className="text-slate-400 font-medium">Synergistic nutrition for skeletal integrity.</p>
        </div>
      </header>

      {/* Floating Info Badge */}
      <AnimatePresence>
        {floatingValue && (
          <motion.div
            key={floatingValue.id}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0 }}
            className="fixed z-[60] left-1/2 -translate-x-1/2 top-1/2 pointer-events-none bg-golden-brown text-white px-4 py-2 rounded-full font-black text-xs shadow-lg border-2 border-white"
          >
            {floatingValue.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Diet Recommendations from Daily Log */}
      {dietRecs.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 p-6 rounded-[3rem] border-2 border-emerald-100 shadow-sm space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white text-emerald-500 rounded-2xl">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-emerald-900 uppercase">Personalized Diet Boosters</h3>
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Based on your latest intake log</p>
            </div>
          </div>
          <div className="space-y-3">
            {dietRecs.map((rec, i) => (
              <div key={i} className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="text-sm font-bold text-emerald-900">{rec.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* NEW: PROFESSIONAL WATER INTAKE TRACKER */}
      <section className="bg-white rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden">
        <div className="bg-blue-600 p-8 text-white relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-4 max-w-xs">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                       <Droplets size={24} />
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tight">Hydration Log</h3>
                 </div>
                 <p className="text-blue-100 text-xs font-medium leading-relaxed">
                    Optimal hydration ensures efficient mineral transport to the bone matrix and prevents renal calcification.
                 </p>
                 <div className="flex items-center gap-4">
                    <div>
                       <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Daily Target</p>
                       <p className="text-xl font-black">{waterTarget}ml</p>
                    </div>
                    <button 
                      onClick={() => setWaterTarget(prev => prev === 2500 ? 3000 : 2500)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                    >
                       <Settings2 size={16} />
                    </button>
                 </div>
              </div>

              {/* Water Vessel Visualization */}
              <div className="flex items-center gap-8">
                 <div className="relative w-24 h-48 bg-white/10 rounded-[2rem] border-4 border-white/20 overflow-hidden shadow-inner">
                    <motion.div 
                       initial={{ height: 0 }}
                       animate={{ height: `${Math.min(100, waterProgress)}%` }}
                       className="absolute bottom-0 left-0 right-0 bg-white/40 backdrop-blur-sm"
                    >
                       <motion.div 
                         animate={{ x: [-10, 10, -10] }}
                         transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                         className="absolute -top-4 left-0 right-0 h-8 bg-white/30 rounded-[100%] blur-sm"
                       />
                    </motion.div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className="text-2xl font-black">{Math.round(waterProgress)}%</span>
                       <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Filled</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { amount: 250, label: 'Small Glass' },
                      { amount: 500, label: 'Large Tumbler' },
                      { amount: 750, label: 'Standard Bottle' }
                    ].map((vessel) => (
                      <button
                        key={vessel.label}
                        onClick={() => handleAddWater(vessel.amount)}
                        className="bg-white text-blue-600 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:translate-x-1 active:scale-95 transition-all flex items-center justify-between gap-4"
                      >
                         <span>{vessel.label}</span>
                         <span className="opacity-60">{vessel.amount}ml</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
           <WavesDecoration className="absolute bottom-0 left-0 right-0 opacity-20 pointer-events-none" />
        </div>

        {/* History Log */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h4 className="font-black text-espresso uppercase text-xs tracking-widest flex items-center gap-2">
                 <History size={14} className="text-blue-500" /> Today's Timeline
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 no-scrollbar">
                 {waterLogs.length === 0 ? (
                   <p className="text-xs text-slate-400 italic">No hydration events recorded yet.</p>
                 ) : (
                   waterLogs.map((log) => (
                    <motion.div 
                      key={log.id} 
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                             <Droplets size={14} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-espresso">{log.amount}ml Ingested</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{log.time}</p>
                          </div>
                       </div>
                       <button onClick={() => removeWaterLog(log.id)} className="text-slate-300 hover:text-red-500 p-1">
                          <Trash2 size={14} />
                       </button>
                    </motion.div>
                   ))
                 )}
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="font-black text-espresso uppercase text-xs tracking-widest flex items-center gap-2">
                 <Target size={14} className="text-emerald-500" /> Bone Synergy Insight
              </h4>
              <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 space-y-3">
                 <p className="text-xs text-emerald-800 font-medium leading-relaxed">
                    Hydration tip: Drinking water 30 minutes before calcium-rich meals significantly improves the solubility of minerals in the digestive tract.
                 </p>
                 <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-white rounded-lg text-[9px] font-black text-emerald-600 border border-emerald-100 uppercase">
                       Phase: Absorption Optimized
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Bio-metric Style Macro Bar & Chart */}
      <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
           <h3 className="font-bold text-espresso flex items-center gap-2"><PieChartIcon size={18} /> Daily Macro Balance</h3>
           <div className="flex items-center gap-3">
             <button 
               onClick={handleLogMeal}
               className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-100 transition-colors flex items-center gap-2"
             >
               <Plus size={14} /> Log Meal
             </button>
             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest hidden sm:inline">Optimized for Osteo</span>
           </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative">
          <AnimatePresence>
            {showLogFeedback && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 0 }}
                animate={{ opacity: 1, scale: 1, y: -20 }}
                exit={{ opacity: 0, scale: 1.2, y: -40 }}
                className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
              >
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-2xl border-4 border-emerald-400 flex flex-col items-center gap-2">
                   <div className="w-12 h-12 bg-emerald-400 text-white rounded-full flex items-center justify-center">
                      <CheckCircle size={24} />
                   </div>
                   <p className="font-black text-emerald-600 uppercase tracking-widest text-sm">Meal Logged!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full md:w-1/2 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 space-y-4">
            <div className="flex h-10 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
               <motion.div initial={{ width: 0 }} animate={{ width: '30%' }} className="bg-emerald-400 h-full flex items-center justify-center text-[10px] font-bold text-white">PRO 30%</motion.div>
               <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="bg-amber-400 h-full flex items-center justify-center text-[10px] font-bold text-white">CARB 45%</motion.div>
               <motion.div initial={{ width: 0 }} animate={{ width: '25%' }} className="bg-sky-400 h-full flex items-center justify-center text-[10px] font-bold text-white">FAT 25%</motion.div>
            </div>
            <div className="grid grid-cols-3 gap-2">
               <div className="bg-emerald-50/50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-emerald-600 uppercase">Protein</p>
                  <p className="font-bold text-espresso">65g</p>
               </div>
               <div className="bg-amber-50/50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-amber-600 uppercase">Carbs</p>
                  <p className="font-bold text-espresso">180g</p>
               </div>
               <div className="bg-sky-50/50 p-3 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-sky-600 uppercase">Fats</p>
                  <p className="font-bold text-espresso">45g</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DIET_ROUTINE.map((section, idx) => (
          <motion.div
            key={section.title}
            {...FADE_UP}
            transition={{ delay: idx * 0.1 }}
            className={`p-6 rounded-3xl border-2 border-slate-50 shadow-sm space-y-4 ${section.color}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/50 text-espresso rounded-2xl shadow-sm">
                {idx === 0 ? <Utensils size={24} /> : idx === 1 ? <Zap size={24} /> : idx === 2 ? <FlaskConical size={24} /> : <Activity size={24} />}
              </div>
              <h3 className="font-bold text-espresso text-lg leading-tight">{section.title}</h3>
            </div>
            
            <div className="space-y-2">
              {section.items.map((item) => {
                const isChecked = checkedItems.includes(item);
                return (
                  <motion.div 
                    key={item} 
                    onClick={() => toggleItem(item, section.title)}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-between p-3 rounded-2xl transition-all shadow-sm cursor-pointer border ${isChecked ? 'bg-white border-golden-brown' : 'bg-white/60 border-transparent hover:border-amber-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${isChecked ? 'bg-golden-brown border-golden-brown text-white' : 'border-slate-200 bg-white'}`}>
                        {isChecked && <Check size={12} strokeWidth={4} />}
                      </div>
                      <span className={`font-medium text-sm transition-all ${isChecked ? 'text-golden-brown font-bold' : 'text-espresso'}`}>{item}</span>
                    </div>
                    <ChevronRight size={14} className={isChecked ? 'text-golden-brown' : 'text-slate-300'} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper SVG for waves
const WavesDecoration: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
  </svg>
);

export default DietRoutine;
