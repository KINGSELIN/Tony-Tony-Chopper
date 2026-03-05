
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, Heart, Pill, Star, Trophy, Smile, Frown, Meh, Sun, Droplets, 
  Moon, MessageSquare, Zap, Wind, Milk, Sparkles, X, ChevronRight, 
  Utensils, Activity, Target, ShieldCheck, Info, BrainCircuit, Beef, Coffee, ListChecks,
  RefreshCw, Cloud, CloudOff
} from 'lucide-react';
import { DailyLog, ReportInsight } from '../types';
import { APP_LOGO, DIET_ROUTINE } from '../constants';

interface DailyCheckInProps {
  onComplete: (log: DailyLog, points: number) => void;
  onCancel: () => void;
  latestInsight?: ReportInsight;
}

const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onComplete, onCancel, latestInsight }) => {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is the Clinical Briefing
  const [answers, setAnswers] = useState<Record<string, any>>({
    calcium: 0,
    protein: 0,
    vitaminD: 0,
    routineItems: [],
    medications: [
      { name: 'Alendronate', dosage: '70mg', time: 'Morning (Empty Stomach)', taken: false },
      { name: 'Calcium + Vit D3', dosage: '500mg/250IU', time: 'After Lunch', taken: false },
      { name: 'Teriparatide', dosage: '20mcg', time: 'Night', taken: false },
    ],
  });
  const [isFinished, setIsFinished] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [currentAffirmation, setCurrentAffirmation] = useState("");
  const [selectedValue, setSelectedValue] = useState<any>(null);

  // Sync Status State
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'offline'>(navigator.onLine ? 'synced' : 'offline');

  // Monitor Network Status
  useEffect(() => {
    const handleOnline = () => setSyncStatus('synced');
    const handleOffline = () => setSyncStatus('offline');
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Simulate Real-time persistence whenever values change
  useEffect(() => {
    if (currentStep >= 0 && selectedValue !== null) {
      if (!navigator.onLine) {
        setSyncStatus('offline');
        return;
      }
      setSyncStatus('syncing');
      const timer = setTimeout(() => {
        setSyncStatus('synced');
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [selectedValue, currentStep]);

  // Clinical Goals based on Report Insight
  const clinicalGoals = useMemo(() => {
    const tScore = latestInsight?.tScore || -1.0;
    return {
      calcium: tScore <= -2.5 ? 1200 : 1000,
      vitaminD: tScore <= -2.5 ? 2000 : 1000,
      protein: 60,
      water: 8
    };
  }, [latestInsight]);

  // Combine routine items from constants
  const allRoutineItems = useMemo(() => {
    return DIET_ROUTINE.flatMap(section => section.items);
  }, []);

  const steps = [
    { id: 'mood', label: 'Mood', icon: Smile, question: 'How is your mental energy today?' },
    { id: 'calcium', label: 'Calcium', icon: Milk, question: 'Estimated Calcium Intake today?', type: 'scale', max: 1500, step: 100, unit: 'mg', target: clinicalGoals.calcium },
    { id: 'protein', label: 'Protein', icon: Beef, question: 'Estimated Protein Intake?', type: 'scale', max: 120, step: 10, unit: 'g', target: clinicalGoals.protein },
    { id: 'routineItems', label: 'Routine Plan', icon: ListChecks, question: 'Which prescribed routine items did you have?', type: 'multi-select', options: allRoutineItems },
    { id: 'medications', label: 'Medications', icon: Pill, question: 'Check your prescribed medication intake:', type: 'med-check' },
    { id: 'pain', label: 'Pain', icon: Heart, question: 'What is your current pain level?', type: 'scale', max: 10, target: 0 },
    { id: 'sunlight', label: 'Sunlight', icon: Sun, question: 'Time spent in direct sunlight?', type: 'scale', max: 60, unit: 'min', target: 15 },
    { id: 'hydration', label: 'Hydration', icon: Droplets, question: 'Glasses of water consumed?', type: 'scale', max: 12, unit: 'glasses', target: clinicalGoals.water },
    { id: 'sleep', label: 'Sleep', icon: Moon, question: 'How was your sleep quality?', type: 'options', options: ['Poor', 'Fair', 'Good', 'Excellent'] },
  ];

  const progress = ((currentStep + 1) / (steps.length + 1)) * 100;

  const handleNext = () => {
    if (currentStep >= 0 && selectedValue === null && steps[currentStep].type !== 'multi-select' && steps[currentStep].type !== 'med-check') return;
    
    if (currentStep >= 0) {
      const stepId = steps[currentStep].id;
      if (stepId === 'medications') {
        setAnswers(prev => ({ ...prev, medications: selectedValue }));
      } else {
        setAnswers(prev => ({ ...prev, [stepId]: selectedValue }));
      }
      const affirmations = ["Perfect!", "Aligned!", "Synchronized!", "Target Hit!", "Remodeling active!"];
      setCurrentAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
      setShowAffirmation(true);
    }
    
    setTimeout(() => {
      setShowAffirmation(false);
      setSelectedValue(null);
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsFinished(true);
      }
    }, currentStep >= 0 ? 600 : 0);
  };

  const solution = useMemo(() => {
    const recommendations: { icon: any; text: string; color: string; bg: string; type: 'diet' | 'exercise' }[] = [];
    if (answers.calcium < clinicalGoals.calcium) recommendations.push({ icon: Milk, text: `Calcium deficit detected (${answers.calcium}/${clinicalGoals.calcium}mg). Add 2 servings of Greek Yogurt or Ragi to bridge the gap.`, color: "text-amber-600", bg: "bg-amber-50", type: 'diet' });
    if (answers.pain > 4) recommendations.push({ icon: Activity, text: "Elevated pain detected. Switch high-impact routine for underwater walking or swimming.", color: "text-blue-500", bg: "bg-blue-50", type: 'exercise' });
    if (answers.protein < clinicalGoals.protein) recommendations.push({ icon: Beef, text: "Low protein inhibits bone matrix formation. Consider plant-based collagen or soy protein.", color: "text-emerald-500", bg: "bg-emerald-50", type: 'diet' });
    if (answers.routineItems && answers.routineItems.length < 3) recommendations.push({ icon: Target, text: "Low Routine Adherence. Try to incorporate at least 3 prescribed bone-builders tomorrow.", color: "text-purple-600", bg: "bg-purple-50", type: 'diet' });
    
    if (recommendations.length === 0) {
      recommendations.push({ icon: ShieldCheck, text: "Total clinical adherence achieved! Your bone remodeling environment is optimal.", color: "text-emerald-600", bg: "bg-emerald-50", type: 'diet' });
    }
    
    return recommendations;
  }, [answers, clinicalGoals]);

  const finish = () => {
    const newLog: DailyLog = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: answers.mood === 'Great' ? 5 : 3,
      pain: parseInt(answers.pain || 0),
      stressLevel: 5,
      mindfulnessMinutes: 10,
      medsTaken: (answers.medications || []).every((m: any) => m.taken),
      medications: answers.medications || [],
      calciumIntake: parseInt(answers.calcium || 0),
      vitaminD: 2000,
      proteinIntake: parseInt(answers.protein || 0),
      carbsIntake: 150,
      fatIntake: 50,
      magnesium: 300,
      vitaminK2: 100,
      activityMinutes: 30,
      steps: 5000,
      sleepHours: 7,
      sleepQuality: (answers.sleep?.toLowerCase() as any) || 'good',
      sunlightMinutes: parseInt(answers.sunlight || 0),
      waterGlasses: parseInt(answers.hydration || 0),
      caffeineCups: 1,
      routineItems: answers.routineItems || [],
      recommendations: solution,
    };
    onComplete(newLog, 150);
  };

  const toggleMultiSelect = (opt: string) => {
    const current = selectedValue || [];
    if (current.includes(opt)) {
      setSelectedValue(current.filter((item: string) => item !== opt));
    } else {
      setSelectedValue([...current, opt]);
    }
  };

  const toggleMedication = (index: number) => {
    const current = [...(selectedValue || answers.medications)];
    current[index] = { ...current[index], taken: !current[index].taken };
    setSelectedValue(current);
  };

  if (currentStep === -1) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8 text-center">
           <div className="w-24 h-24 bg-slate-900 rounded-[2rem] mx-auto flex items-center justify-center shadow-xl border-4 border-emerald-400">
              <BrainCircuit size={48} className="text-emerald-400" />
           </div>
           <div className="space-y-2">
              <h2 className="text-3xl font-black text-espresso uppercase tracking-tight">Clinical Briefing</h2>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personalizing your log targets</p>
           </div>
           
           <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 text-left space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-golden-brown shadow-sm">
                    <Target size={18} />
                 </div>
                 <p className="text-xs font-black text-espresso uppercase tracking-wider">Today's Protocol</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Calcium</p>
                    <p className="font-black text-espresso">{clinicalGoals.calcium}mg</p>
                 </div>
                 <div className="bg-white p-3 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase">Protein</p>
                    <p className="font-black text-espresso">{clinicalGoals.protein}g</p>
                 </div>
              </div>
              <div className="p-3 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                 <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Prescribed Routine</p>
                 <div className="flex flex-wrap gap-1">
                    {allRoutineItems.slice(0, 4).map(item => (
                      <span key={item} className="text-[8px] bg-white text-slate-500 px-1.5 py-0.5 rounded-full font-bold">{item}</span>
                    ))}
                    <span className="text-[8px] text-slate-400 font-bold">+{allRoutineItems.length - 4} more</span>
                 </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                 "Targets derived from your {latestInsight?.date || 'latest'} {latestInsight?.type || 'clinical'} report showing a T-Score of {latestInsight?.tScore || 'baseline'}."
              </p>
           </div>

           <button 
             onClick={handleNext}
             className="w-full py-5 bg-golden-brown text-white font-black rounded-2xl shadow-[0_6px_0_#7A5F3B] active:translate-y-1 transition-all uppercase tracking-widest"
           >
             Start Daily Log
           </button>
        </motion.div>
      </div>
    );
  }

  if (showSolution) {
    return (
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 bg-white z-[70] flex flex-col p-6 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full py-10 space-y-8">
          <header className="text-center">
            <h2 className="text-3xl font-black text-espresso uppercase tracking-tight">Post-Log Strategy</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Adjusting your routine based on report gaps</p>
          </header>

          <div className="space-y-4">
            {solution.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`${item.bg} p-6 rounded-[2.5rem] border-b-4 border-slate-200/50 flex gap-5 items-center`}>
                <div className={`p-4 bg-white rounded-2xl shadow-sm ${item.color}`}>
                  <item.icon size={28} strokeWidth={3} />
                </div>
                <p className="font-bold text-slate-700 leading-tight text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <button onClick={finish} className="w-full py-5 bg-golden-brown text-white font-black rounded-2xl shadow-[0_6px_0_#7A5F3B] active:shadow-none active:translate-y-1 transition-all text-xl uppercase tracking-widest mt-10">
            Finalize Entry
          </button>
        </div>
      </motion.div>
    );
  }

  if (isFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-48 h-48 mb-8">
          <img src={APP_LOGO} alt="Mascot" className="w-full h-full object-contain" />
        </motion.div>
        <h2 className="text-4xl font-black text-golden-brown uppercase tracking-tight">Sync Complete!</h2>
        <p className="text-xl font-bold text-slate-500 mt-2">+150 Points toward bone strength!</p>
        <button onClick={() => setShowSolution(true)} className="w-full max-w-sm py-5 bg-golden-brown text-white font-black rounded-2xl shadow-[0_6px_0_#7A5F3B] active:translate-y-1 transition-all text-xl uppercase tracking-widest mt-10">
          Review Adjustments
        </button>
      </motion.div>
    );
  }

  const activeStep = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full px-6 pt-10 pb-4 flex items-center gap-4">
        <button onClick={onCancel} className="text-slate-300 hover:text-slate-500 transition-colors">
          <X size={28} strokeWidth={3} />
        </button>
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-golden-brown" />
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 flex flex-col overflow-y-auto no-scrollbar">
        <AnimatePresence>
          {showAffirmation && (
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] pointer-events-none">
              <div className="bg-golden-brown text-white px-8 py-4 rounded-3xl font-black text-2xl shadow-2xl border-b-4 border-golden-dark">
                {currentAffirmation}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col justify-center space-y-12">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 shrink-0">
              <img src={APP_LOGO} alt="Chopper" className="w-full h-full object-contain" />
            </div>
            <div className="relative bg-white border-2 border-slate-200 p-6 rounded-[2rem] shadow-sm flex-1">
              <h2 className="text-xl font-black text-espresso leading-tight">{activeStep.question}</h2>
              {activeStep.target !== undefined && (
                <div className="mt-2 flex items-center gap-2 text-golden-brown font-black text-[10px] uppercase tracking-widest">
                   <Target size={12} /> Target: {activeStep.target}{activeStep.unit || ''}
                </div>
              )}
            </div>
          </div>

          <motion.div key={currentStep} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            {activeStep.type === 'scale' && (
              <div className="space-y-10">
                <input 
                  type="range"
                  min="0"
                  max={activeStep.max}
                  step={activeStep.step || 1}
                  value={selectedValue || 0}
                  onChange={(e) => setSelectedValue(parseInt(e.target.value))}
                  className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-golden-brown"
                />
                <div className="flex flex-col items-center">
                   <div className="text-6xl font-black text-espresso">
                      {selectedValue || 0}<span className="text-xl text-slate-300 ml-1">{activeStep.unit || ''}</span>
                   </div>
                   {activeStep.target !== undefined && (
                     <div className={`mt-4 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                       (selectedValue || 0) >= activeStep.target ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                     }`}>
                        {(selectedValue || 0) >= activeStep.target ? 'Target Met' : `${activeStep.target - (selectedValue || 0)} more needed`}
                     </div>
                   )}
                </div>
              </div>
            )}

            {activeStep.type === 'multi-select' && (
              <div className="grid grid-cols-2 gap-3">
                 {activeStep.options?.map((opt) => {
                   const isSelected = (selectedValue || []).includes(opt);
                   return (
                    <button 
                      key={opt} 
                      onClick={() => toggleMultiSelect(opt)}
                      className={`p-4 rounded-2xl border-2 text-xs font-black uppercase tracking-tight transition-all flex items-center justify-between ${
                        isSelected ? 'bg-golden-brown text-white border-golden-brown shadow-lg' : 'bg-white text-slate-400 border-slate-100'
                      }`}
                    >
                      {opt}
                      {isSelected && <Check size={14} />}
                    </button>
                   );
                 })}
              </div>
            )}

            {activeStep.type === 'med-check' && (
              <div className="space-y-3">
                {(selectedValue || answers.medications).map((med: any, idx: number) => (
                  <button 
                    key={idx} 
                    onClick={() => toggleMedication(idx)}
                    className={`w-full p-5 rounded-3xl border-2 flex items-center justify-between transition-all ${
                      med.taken ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`font-black uppercase text-xs tracking-wider ${med.taken ? 'text-emerald-600' : 'text-espresso'}`}>
                        {med.name} <span className="text-[10px] opacity-60">({med.dosage})</span>
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{med.time}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      med.taken ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {med.taken ? <Check size={18} strokeWidth={3} /> : <Pill size={16} />}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeStep.id === 'mood' && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Frown, label: 'Low', color: 'text-red-500' },
                  { icon: Meh, label: 'Stable', color: 'text-amber-500' },
                  { icon: Smile, label: 'Optimal', color: 'text-emerald-500' }
                ].map((item) => (
                  <button key={item.label} onClick={() => setSelectedValue(item.label)} className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-2 transition-all ${selectedValue === item.label ? 'border-golden-brown bg-amber-50' : 'border-slate-100 bg-white'}`}>
                    <item.icon size={48} className={selectedValue === item.label ? 'text-golden-brown' : 'text-slate-300'} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>
            )}

            {activeStep.type === 'binary' && (
              <div className="grid grid-cols-2 gap-4">
                {[true, false].map((val) => (
                  <button key={val.toString()} onClick={() => setSelectedValue(val)} className={`p-8 rounded-[2.5rem] border-2 font-black text-lg uppercase transition-all ${selectedValue === val ? 'border-golden-brown bg-amber-50' : 'border-slate-100'}`}>
                    {val ? 'Adhered' : 'Missed'}
                  </button>
                ))}
              </div>
            )}

            {activeStep.type === 'options' && (
              <div className="space-y-3">
                {activeStep.options?.map((opt) => (
                  <button key={opt} onClick={() => setSelectedValue(opt)} className={`w-full p-6 rounded-3xl border-2 text-left font-black uppercase text-sm tracking-widest transition-all ${selectedValue === opt ? 'border-golden-brown bg-amber-50' : 'border-slate-100'}`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="pt-10 flex items-center justify-end gap-6">
          {/* Real-time Sync Indicator */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {syncStatus === 'syncing' && (
                <motion.div key="syncing" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                   <RefreshCw size={14} className="animate-spin text-blue-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Syncing...</span>
                </motion.div>
              )}
              {syncStatus === 'synced' && (
                <motion.div key="synced" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                   <Cloud size={14} className="text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Synced</span>
                </motion.div>
              )}
              {syncStatus === 'offline' && (
                <motion.div key="offline" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                   <CloudOff size={14} className="text-red-400" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Offline</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleNext} 
            disabled={selectedValue === null && activeStep.type !== 'multi-select' && activeStep.type !== 'med-check'} 
            className={`px-10 py-4 font-black rounded-2xl transition-all uppercase tracking-widest ${selectedValue !== null || activeStep.type === 'multi-select' || activeStep.type === 'med-check' ? 'bg-golden-brown text-white shadow-[0_4px_0_#7A5F3B]' : 'bg-slate-200 text-slate-400'}`}
          >
            Next Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyCheckIn;
