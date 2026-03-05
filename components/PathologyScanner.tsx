
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Search, Activity, Target, Zap, ChevronRight, BarChart3 } from 'lucide-react';

interface Region {
  name: string;
  severity: 'normal' | 'low' | 'critical';
  confidence: number;
}

interface PathologyScannerProps {
  regions?: Region[];
}

const PathologyScanner: React.FC<PathologyScannerProps> = ({ 
  regions = [
    { name: 'L1-L4 Spine', severity: 'critical', confidence: 98.4 },
    { name: 'Femoral Neck (Left)', severity: 'low', confidence: 94.2 },
    { name: 'Trochanter (Right)', severity: 'normal', confidence: 99.1 }
  ]
}) => {
  return (
    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest">Precision Analysis</h4>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Digital Twin v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
           <span className="text-[10px] text-emerald-400 font-black">AI ACTIVE</span>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Anatomy Viewer Simulation */}
        <div className="relative aspect-square bg-slate-800 rounded-3xl flex items-center justify-center overflow-hidden border border-white/5 group">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#10b981_0%,_transparent_70%)] group-hover:opacity-20 transition-opacity" />
          <div className="relative z-10 w-full h-full flex items-center justify-center p-8">
             <Activity className="w-full h-full text-slate-700/50" strokeWidth={0.5} />
             {/* ROI Markers */}
             <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
               transition={{ repeat: Infinity, duration: 2 }}
               className="absolute top-1/4 left-1/2 -translate-x-1/2 w-12 h-12 bg-red-500/20 rounded-full border border-red-500/50 flex items-center justify-center"
             >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
             </motion.div>
             <div className="absolute bottom-1/3 left-1/3 w-8 h-8 bg-yellow-500/20 rounded-full border border-yellow-500/50 flex items-center justify-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
             </div>
          </div>
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ top: ['0%', '100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
            className="absolute left-0 right-0 h-0.5 bg-emerald-400/30 blur-[1px] z-20 shadow-[0_0_15px_#10b981]"
          />

          <div className="absolute bottom-4 left-4 right-4 flex justify-between">
             <div className="px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase border border-white/10">
                FOV: Spinal Segment
             </div>
             <div className="px-2 py-1 bg-emerald-500 text-black rounded-lg text-[9px] font-black uppercase shadow-lg">
                ROI: Detected
             </div>
          </div>
        </div>

        {/* Quantitative Metrics */}
        <div className="space-y-4">
           <div>
             <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <BarChart3 size={12} /> Biomarker Identification
             </h5>
             <div className="space-y-3">
                {regions.map((region, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-default group">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-bold text-xs">{region.name}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        region.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        region.severity === 'low' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {region.severity}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${region.confidence}%` }}
                            className={`h-full ${
                               region.severity === 'critical' ? 'bg-red-400' :
                               region.severity === 'low' ? 'bg-yellow-400' :
                               'bg-emerald-400'
                            }`}
                          />
                       </div>
                       <span className="text-[10px] font-black text-slate-400">{region.confidence}% <span className="text-[8px] opacity-50">CONF.</span></span>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="pt-4 border-t border-white/5 flex gap-4">
              <div className="flex-1 p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Bone Density Score</p>
                 <p className="text-xl font-black text-white">-2.7</p>
              </div>
              <div className="flex-1 p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                 <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Z-Score Variant</p>
                 <p className="text-xl font-black text-white">0.42</p>
              </div>
           </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-6 py-3 bg-slate-900 border-t border-white/5 text-[9px] font-bold text-slate-500 italic">
        * PathAI Precision Protocol: Analyzed with multi-layered neural bone scanning. Quantitative metrics derived from pixel-level mineral density analysis.
      </div>
    </div>
  );
};

export default PathologyScanner;
