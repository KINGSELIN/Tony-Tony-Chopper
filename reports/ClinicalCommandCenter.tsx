
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Upload,
  BrainCircuit,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { MedicalDocument, TriagePriority, AiStatus, Department } from '../types';
import PathologyScanner from '../components/PathologyScanner';
import { analyzeMedicalReport } from '../services/geminiService';

interface ClinicalCommandCenterProps {
  documents: MedicalDocument[];
  onUpload: (doc: MedicalDocument) => void;
  onUpdateDoc: (doc: MedicalDocument) => void;
}

const ClinicalCommandCenter: React.FC<ClinicalCommandCenterProps> = ({ documents, onUpload, onUpdateDoc }) => {
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState<Department | 'ALL'>('ALL');

  const filteredDocs = documents.filter(doc => filter === 'ALL' || doc.dept === filter);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      
      // Simulate Aidoc AI ingestion process
      const newDoc: MedicalDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        date: new Date().toISOString().split('T')[0],
        type: 'DEXA SCAN',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        triage: 'ROUTINE',
        aiStatus: 'SCANNING',
        dept: 'MSK'
      };
      
      onUpload(newDoc);
      
      // Mock AI Triage Processing
      setTimeout(async () => {
        const insight = await analyzeMedicalReport("Sample DEXA Data: L1-L4 T-Score -2.9. High fracture risk.");
        // Fix: Explicitly cast triage and aiStatus to their union types to satisfy MedicalDocument interface
        const processedDoc: MedicalDocument = {
          ...newDoc,
          triage: (insight.tScore && insight.tScore < -2.5 ? 'URGENT' : 'HIGH') as TriagePriority,
          aiStatus: 'AI-POSITIVE' as AiStatus,
          insight: insight
        };
        onUpdateDoc(processedDoc);
        setIsUploading(false);
      }, 3000);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col gap-6">
      {/* AI Orchestration Header */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border-b-8 border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-xl">
                 <BrainCircuit size={24} className="text-slate-900" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">AI Command Center</h2>
            </div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Active Triage & Notification Engine</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-500 uppercase">AI Utilization</p>
              <p className="text-2xl font-black text-emerald-400">98.4%</p>
            </div>
            <div className="h-10 w-[2px] bg-slate-800" />
            <label className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20">
               <Upload size={18} strokeWidth={3} />
               Ingest Scan
               <input type="file" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Worklist Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-espresso uppercase tracking-widest text-xs flex items-center gap-2">
              <Layers size={14} /> AI Worklist ({filteredDocs.length})
            </h3>
            <div className="flex gap-1">
              {['ALL', 'MSK', 'CARDIO', 'NEURO'].map(d => (
                <button 
                  key={d} 
                  onClick={() => setFilter(d as any)}
                  className={`px-2 py-1 rounded-md text-[9px] font-black uppercase transition-all ${filter === d ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 no-scrollbar">
            <AnimatePresence>
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 rounded-[2rem] border-2 cursor-pointer transition-all relative group overflow-hidden ${
                    selectedDoc?.id === doc.id 
                      ? 'border-slate-900 bg-white shadow-xl translate-x-2' 
                      : 'border-slate-50 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${
                      doc.triage === 'URGENT' ? 'bg-red-50 text-red-500 border-red-100' : 
                      doc.triage === 'HIGH' ? 'bg-amber-50 text-amber-500 border-amber-100' : 
                      'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      {doc.aiStatus === 'SCANNING' ? <Activity className="animate-pulse" /> : <FileText size={24} />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-espresso text-sm truncate uppercase tracking-tight">{doc.name}</h4>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${
                           doc.aiStatus === 'AI-POSITIVE' ? 'bg-red-500 text-white' : 
                           doc.aiStatus === 'SCANNING' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {doc.aiStatus}
                        </span>
                      </div>
                      <div className="flex gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span className="flex items-center gap-1"><Clock size={10} /> {doc.date}</span>
                        <span>•</span>
                        <span>{doc.dept}</span>
                      </div>
                    </div>
                    
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-espresso group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  {doc.triage === 'URGENT' && (
                    <div className="absolute top-0 right-0 w-1 h-full bg-red-500" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredDocs.length === 0 && !isUploading && (
              <div className="py-20 text-center space-y-4">
                 <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-200">
                    <Layers size={32} />
                 </div>
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Worklist Empty</p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedDoc ? (
              <motion.div
                key={selectedDoc.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Digital Twin Anatomy Viewer */}
                <PathologyScanner regions={selectedDoc.insight?.regions} />

                {/* AI Findings Summary */}
                <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                       <div className="w-12 h-12 bg-slate-900 text-emerald-400 rounded-2xl flex items-center justify-center shadow-lg">
                          <BrainCircuit size={24} />
                       </div>
                       <div>
                          <h3 className="text-xl font-black text-espresso uppercase">Clinical Insights</h3>
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Always-on AI Findings</p>
                       </div>
                    </div>
                    <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border-2 ${
                      selectedDoc.triage === 'URGENT' ? 'bg-red-50 border-red-100 text-red-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'
                    }`}>
                       <ShieldAlert size={18} />
                       <span className="text-xs font-black uppercase tracking-widest">{selectedDoc.triage} PRIORITY</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 rounded-[2rem] space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detection Confidence</p>
                        <p className="text-2xl font-black text-espresso">98.2%</p>
                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} className="h-full bg-emerald-500" />
                        </div>
                     </div>
                     <div className="p-5 bg-slate-50 rounded-[2rem] space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bone Density (T-Score)</p>
                        <p className={`text-2xl font-black ${selectedDoc.insight?.tScore && selectedDoc.insight.tScore <= -2.5 ? 'text-red-500' : 'text-amber-500'}`}>
                           {selectedDoc.insight?.tScore || 'Pending'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Osteoporosis Threshold: -2.5</p>
                     </div>
                  </div>

                  <div className="bg-espresso text-white p-6 rounded-[2rem] space-y-3 relative overflow-hidden">
                     <h4 className="font-black uppercase text-xs tracking-widest flex items-center gap-2 relative z-10">
                        <CheckCircle2 size={16} className="text-emerald-400" /> AI Executive Summary
                     </h4>
                     <p className="text-sm font-medium leading-relaxed text-slate-300 relative z-10">
                        {selectedDoc.insight?.summary || "Analyzing architectural structural integrity..."}
                     </p>
                     <BrainCircuit size={100} className="absolute -right-10 -bottom-10 text-white opacity-5" />
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-200">
                   <BrainCircuit size={64} strokeWidth={1} />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-black text-espresso uppercase tracking-tight">Select a Clinical Case</h3>
                  <p className="text-sm font-medium text-slate-400">Choose an AI-analyzed report from the worklist to view diagnostic metrics and digital twin simulations.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ClinicalCommandCenter;
