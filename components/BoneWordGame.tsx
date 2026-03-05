
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Trophy, Lightbulb, ChevronRight, CheckCircle, RefreshCw, Star } from 'lucide-react';
import { CALCIUM_QUEST_LEVELS, APP_LOGO } from '../constants';

interface BoneWordGameProps {
  onEarnPoints: (points: number) => void;
  t: any;
}

const BoneWordGame: React.FC<BoneWordGameProps> = ({ onEarnPoints, t }) => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFact, setShowFact] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const level = CALCIUM_QUEST_LEVELS[currentLevelIdx];

  const handleCheck = () => {
    if (userInput.toUpperCase() === level.answer) {
      setIsCorrect(true);
      setTotalPoints(prev => prev + 50);
      onEarnPoints(50);
      setShowFact(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  const nextLevel = () => {
    if (currentLevelIdx < CALCIUM_QUEST_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
      setUserInput('');
      setIsCorrect(null);
      setShowFact(false);
    } else {
      // Game Over / Restart
      setCurrentLevelIdx(0);
      setUserInput('');
      setIsCorrect(null);
      setShowFact(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-black text-espresso uppercase tracking-tight">Calcium Quest</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Unscramble the Bone Builders</p>
      </header>

      <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm space-y-8 relative overflow-hidden">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-4">
          {CALCIUM_QUEST_LEVELS.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === currentLevelIdx ? 'w-8 bg-golden-brown' : 'w-2 bg-slate-100'}`} />
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="bg-amber-50 p-6 rounded-[2rem] border-2 border-amber-100 relative group">
            <h3 className="text-5xl font-black text-golden-brown tracking-[0.2em] uppercase select-none">
              {level.scrambled}
            </h3>
            <div className="absolute -top-3 -right-3 bg-white p-2 rounded-xl shadow-sm border border-amber-100 text-amber-500">
               <Lightbulb size={18} />
            </div>
          </div>

          <div className="w-full space-y-4">
             <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 italic text-slate-500 text-sm">
                <span className="font-black text-golden-brown">HINT:</span>
                {level.hint}
             </div>

             <input 
               type="text"
               value={userInput}
               onChange={(e) => setUserInput(e.target.value.toUpperCase())}
               onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
               placeholder="TYPE THE FOOD..."
               disabled={isCorrect === true}
               className={`w-full text-center py-5 rounded-2xl border-2 text-2xl font-black uppercase tracking-widest transition-all outline-none ${
                 isCorrect === true ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 
                 isCorrect === false ? 'border-red-400 bg-red-50 text-red-500 animate-shake' : 
                 'border-slate-200 bg-white focus:border-golden-brown'
               }`}
             />
          </div>

          <button
            onClick={isCorrect ? nextLevel : handleCheck}
            className={`w-full py-5 font-black text-xl rounded-2xl shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest flex items-center justify-center gap-2 ${
              isCorrect 
                ? 'bg-emerald-500 text-white shadow-[0_6px_0_#059669]' 
                : 'bg-golden-brown text-white shadow-[0_6px_0_#7A5F3B]'
            }`}
          >
            {isCorrect ? 'Next Challenge' : 'Check Answer'}
            <ChevronRight size={24} strokeWidth={3} />
          </button>
        </div>

        <AnimatePresence>
          {showFact && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-emerald-50 p-6 rounded-3xl border border-emerald-100 space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-700">
                 <Sparkles size={20} />
                 <span className="font-black uppercase tracking-widest text-xs">Bone Nutrition Fact</span>
              </div>
              <p className="font-bold text-emerald-800 leading-tight">
                {level.funFact}
              </p>
              <div className="flex items-center gap-3 mt-2">
                 <div className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-emerald-600 border border-emerald-200 uppercase tracking-tighter">
                   +{level.calciumMg}mg Calcium Source
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mascot Toast Overlay */}
      <AnimatePresence>
        {isCorrect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-32 right-8 z-[60] flex items-center gap-4 bg-white p-4 rounded-3xl shadow-2xl border-4 border-emerald-400"
          >
             <div className="w-16 h-16 shrink-0">
                <img src={APP_LOGO} alt="Mascot" className="w-full h-full object-contain" />
             </div>
             <div>
                <p className="text-xs font-black text-emerald-600 uppercase">Correct!</p>
                <p className="font-bold text-slate-700">Strong bones for you! +50 XP</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoneWordGame;
