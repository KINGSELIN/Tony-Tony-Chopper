
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Trophy, ArrowRight, Activity, Zap, Pill, Info, HeartPulse, Brain, Waves, Watch, ListChecks, CheckCircle2 } from 'lucide-react';
import { FADE_UP, SPRING_CONFIG } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DailyLog, ReportInsight } from '../types';

interface DashboardProps {
  userName: string;
  logs: DailyLog[];
  points: number;
  insights: ReportInsight[];
  t: any;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, logs, points, insights, t }) => {
  // Process real-time data for charts
  const chartData = [...logs].reverse().slice(-7).map(log => ({
    name: new Date(log.date).toLocaleDateString(undefined, { weekday: 'short' }),
    pain: log.pain,
    calcium: log.calciumIntake,
    activity: log.activityMinutes,
    stress: log.stressLevel
  }));

  const hasData = logs.length > 0;
  const lastLog = logs[0];
  const progressPercent = hasData ? Math.min(100, (Object.keys(lastLog).filter(k => lastLog[k as keyof DailyLog]).length / 18) * 100) : 0;

  // Bio-metric calculations
  const strainScore = hasData ? Math.round((lastLog.activityMinutes / 60) * 10) : 0;
  const recoveryScore = hasData ? Math.round((lastLog.sleepHours / 8) * 10 + (lastLog.calciumIntake / 1500) * 10) / 2 : 0;
  
  // Routine Fidelity: Based on the count of routineItems logged
  const routineFidelity = hasData && lastLog.routineItems ? Math.min(100, (lastLog.routineItems.length / 4) * 100) : 0;

  // Medication Adherence: Based on medications logged
  const medAdherence = hasData && lastLog.medications ? Math.round((lastLog.medications.filter(m => m.taken).length / lastLog.medications.length) * 100) : (lastLog?.medsTaken ? 100 : 0);

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-espresso">{t.hi}, {userName.split(' ')[0]}! 👋</h2>
          <p className="text-slate-400 font-medium">
            {hasData ? "Your holistic bone harmony is improving." : "Start your journey to stronger bones!"}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Watch Status Pill */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-slate-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-bold shadow-lg hidden sm:flex"
          >
            <Watch size={18} className="text-emerald-400" />
            <span className="text-[10px] uppercase tracking-widest">Bodywave Active</span>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-amber-100 text-amber-700 px-4 py-2 rounded-2xl flex items-center gap-2 font-bold border-b-4 border-amber-200 shadow-sm"
          >
            <Flame size={20} fill="currentColor" />
            {logs.length} Day Streak
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-orange-50 text-golden-brown px-4 py-2 rounded-2xl flex items-center gap-2 font-bold border-b-4 border-orange-100 shadow-sm"
          >
            <Star size={20} fill="currentColor" />
            {points} {t.points}
          </motion.div>
        </div>
      </header>

      {/* Bio-metric Equilibrium Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {/* Strain Widget */}
         <motion.div {...FADE_UP} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-3"><Zap size={20} /></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Bone Strain</p>
            <h4 className="text-2xl font-black text-espresso my-1">{strainScore}<span className="text-xs text-slate-300">/10</span></h4>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${strainScore * 10}%` }} className="h-full bg-red-400" />
            </div>
         </motion.div>

         {/* Recovery Widget */}
         <motion.div {...FADE_UP} transition={{ delay: 0.1 }} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-3"><Waves size={20} /></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Recovery Level</p>
            <h4 className="text-2xl font-black text-espresso my-1">{Math.round(recoveryScore)}<span className="text-xs text-slate-300">/10</span></h4>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${recoveryScore * 10}%` }} className="h-full bg-emerald-400" />
            </div>
         </motion.div>

         {/* Fidelity Widget - NEW: Focus on Routine Plan adherence */}
         <motion.div {...FADE_UP} transition={{ delay: 0.15 }} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mb-3"><ListChecks size={20} /></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Routine Fidelity</p>
            <h4 className="text-2xl font-black text-espresso my-1">{Math.round(routineFidelity)}<span className="text-xs text-slate-300">%</span></h4>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${routineFidelity}%` }} className="h-full bg-purple-400" />
            </div>
         </motion.div>

         {/* Medication Adherence Widget */}
         <motion.div {...FADE_UP} transition={{ delay: 0.18 }} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-3"><Pill size={20} /></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Medication Adherence</p>
            <h4 className="text-2xl font-black text-espresso my-1">{medAdherence}<span className="text-xs text-slate-300">%</span></h4>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${medAdherence}%` }} className="h-full bg-blue-400" />
            </div>
         </motion.div>

         {/* Mindfulness Widget */}
         <motion.div {...FADE_UP} transition={{ delay: 0.2 }} className="bg-white p-5 rounded-[2rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center mb-3"><Brain size={20} /></div>
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Mind Harmony</p>
            <h4 className="text-2xl font-black text-espresso my-1">{hasData ? lastLog.mindfulnessMinutes : 0}<span className="text-xs text-slate-300">m</span></h4>
            <div className="w-full h-1 bg-slate-50 rounded-full mt-1 overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: `${(lastLog?.mindfulnessMinutes || 0) / 20 * 100}%` }} className="h-full bg-sky-400" />
            </div>
         </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <motion.div 
          {...FADE_UP}
          className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-sm"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-espresso">{t.dailyGoal}</h3>
            <Trophy className="text-amber-500" />
          </div>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-50"
              />
              <motion.circle
                cx="64"
                cy="64"
                r="58"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="364.4"
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 * (1 - progressPercent / 100) }}
                transition={{ duration: 1.5, ...SPRING_CONFIG }}
                className="text-golden-brown"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-espresso">{Math.round(progressPercent)}%</span>
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Body Map</span>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest">
            {progressPercent === 100 ? "Optimization met!" : "Keep remodeling!"}
          </p>
        </motion.div>

        {/* Task Card - Enhanced to show Report Adherence */}
        <motion.div 
          {...FADE_UP}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-sm col-span-1 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-espresso">{t.tasks}</h3>
            <div className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-purple-100">
               Prescription Match: {routineFidelity}%
            </div>
          </div>
          <div className="space-y-3">
            {[
              { id: 1, title: 'Check-in Daily', done: hasData && logs[0].date === new Date().toISOString().split('T')[0], icon: Activity, color: 'text-amber-600' },
              { id: 2, title: 'Prescription Fidelity', done: routineFidelity >= 50, icon: ListChecks, color: 'text-purple-500' },
              { id: 3, title: 'Medication Adherence', done: medAdherence === 100, icon: Pill, color: 'text-blue-500' },
              { id: 4, title: '15min Sunlight Pulse', done: hasData && logs[0].sunlightMinutes >= 15, icon: Zap, color: 'text-orange-500' },
            ].map((task) => (
              <div key={task.id} className="flex items-center gap-4 p-4 rounded-3xl border-2 border-slate-50 border-b-4 bg-cream/30 hover:translate-y-[-2px] transition-all">
                <div className={`p-3 rounded-2xl bg-white ${task.color} shadow-sm border border-slate-50`}>
                  <task.icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-bold text-sm ${task.done ? 'text-slate-300 line-through' : 'text-espresso'}`}>{task.title}</h4>
                </div>
                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  task.done ? 'bg-golden-brown border-golden-brown text-white shadow-lg' : 'border-slate-100 bg-white'
                }`}>
                  {task.done && <Star size={18} fill="currentColor" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Real-time Bio-metric Trends */}
      <motion.div 
        {...FADE_UP}
        transition={{ delay: 0.2 }}
        className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm min-h-[350px]"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
             <h3 className="font-bold text-espresso text-xl">Bio-Metric Trends</h3>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Holistic Data Synthesis</p>
          </div>
          {hasData && (
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                Activity
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-red-400"></div>
                Stress
              </div>
            </div>
          )}
        </div>
        
        {hasData ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9A7B4F" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#9A7B4F" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F87171" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F1E9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#8C8C8C', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#8C8C8C', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', fontFamily: ' Fredoka'}} />
                <Area type="monotone" dataKey="activity" stroke="#9A7B4F" strokeWidth={4} fillOpacity={1} fill="url(#colorActivity)" />
                <Area type="monotone" dataKey="stress" stroke="#F87171" strokeWidth={2} strokeDasharray="4 4" fill="url(#colorStress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-200">
             <HeartPulse size={80} className="mb-4 opacity-10 animate-pulse" />
             <p className="font-black uppercase tracking-widest text-sm">Waiting for Bio-Metrics</p>
             <p className="text-[10px] mt-1 font-bold">Log your first session to calibrate</p>
          </div>
        )}
      </motion.div>

      {/* AI Bone Matrix Insight */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-golden-brown p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group cursor-pointer border-b-8 border-golden-dark"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
               <Zap className="text-amber-300" fill="currentColor" size={24} />
            </div>
            <h3 className="font-black text-xl uppercase tracking-wider">{t.boneInsight}</h3>
          </div>
          <p className="text-amber-50/90 text-sm leading-relaxed mb-6 max-w-2xl font-medium">
            {!hasData 
              ? "\"I'm calibrating your bodywave harmony. Provide 3 daily logs for a deep skeletal health analysis.\""
              : `\"Based on your recent fidelity (${routineFidelity}%), you are successfully meeting the protein targets prescribed in your medical report. Your bone matrix density is in an optimization phase. Keep following the Calcium Log.\"`
            }
          </p>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-200 group-hover:text-white transition-colors">
            {t.analyzeTrends} <ArrowRight size={18} />
          </div>
        </div>
        <Waves size={240} className="absolute -right-20 -bottom-20 text-white opacity-5" />
      </motion.div>
    </div>
  );
};

export default Dashboard;
