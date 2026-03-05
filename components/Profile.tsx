
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, Save, Globe, Info, FileText, Upload, Trash2, 
  Eye, Plus, Shield, CheckCircle, Smartphone, KeyRound, 
  History, LogOut, ShieldAlert, Monitor, ChevronRight,
  Database, ShieldCheck, HelpCircle, Gift, Fingerprint, Pill
} from 'lucide-react';
import { UserProfile, LanguageCode, MedicalDocument } from '../types';
import { AuthLog } from '../services/authService';

interface ProfileProps {
  profile: UserProfile;
  loginHistory: AuthLog[];
  onUpdate: (updated: UserProfile) => void;
  t: any;
}

const Profile: React.FC<ProfileProps> = ({ profile, loginHistory, onUpdate, t }) => {
  const [formData, setFormData] = useState(profile);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'storage' | 'prescriptions'>('overview');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const securityScore = 92;

  const handleSave = () => {
    onUpdate(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const overviewCards = [
    { title: 'Identity Protection', desc: 'Secure encryption keys active', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Privacy Audit', desc: 'HIPAA compliant session logging', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Security Health', desc: 'System integrity: Critical-High', icon: Fingerprint, color: 'text-amber-500', bg: 'bg-amber-50' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 flex gap-2">
           <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100">Django Verified</span>
        </div>

        <div className="relative group shrink-0">
          <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
            {formData.profilePic ? (
              <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                <User size={64} />
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-3 bg-white text-espresso rounded-full shadow-lg cursor-pointer hover:bg-slate-50 transition-all border border-slate-100">
            <Camera size={18} />
            <input type="file" className="hidden" accept="image/*" />
          </label>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-black text-espresso tracking-tight">Identity Governance</h2>
          <div className="w-full max-w-md mx-auto md:mx-0">
            <div className="flex justify-between items-end mb-2">
               <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Security Score</span>
               <span className="text-sm font-black text-emerald-500">{securityScore}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
               <div className="h-full bg-blue-500" style={{ width: '40%' }} />
               <div className="h-full bg-emerald-500" style={{ width: '52%' }} />
            </div>
            <p className="text-[9px] font-black text-slate-300 mt-2 uppercase tracking-widest">Protected by 256-bit AES & Django Tokenization</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3 space-y-2">
           {[
             { id: 'overview', label: 'Dashboard', icon: User },
             { id: 'prescriptions', label: 'Prescription Vault', icon: Pill },
             { id: 'security', label: 'Security History', icon: ShieldCheck },
             { id: 'storage', label: 'Clinical Vault', icon: Database }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                 activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'
               }`}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>

        <div className="lg:col-span-9">
           <AnimatePresence mode="wait">
             {activeTab === 'overview' && (
               <motion.div key="overview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {overviewCards.map((card, i) => (
                      <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col gap-4">
                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg} ${card.color}`}>
                            <card.icon size={20} />
                         </div>
                         <div>
                            <h4 className="font-black text-espresso text-xs uppercase tracking-tight">{card.title}</h4>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">{card.desc}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-espresso text-sm uppercase tracking-widest">Clinical Identity Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                       <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-4 bg-slate-50 rounded-2xl font-bold border-2 border-transparent focus:border-blue-500 outline-none" />
                       <select value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value as LanguageCode})} className="w-full px-4 py-4 bg-slate-50 rounded-2xl font-bold">
                          <option value="en">English (Secured)</option>
                          <option value="ta">Tamil (Secured)</option>
                       </select>
                    </div>
                    <button onClick={handleSave} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                       {isSaved ? <CheckCircle size={16} className="text-emerald-400" /> : <Save size={16} />}
                       {isSaved ? 'Syncing to Django DB...' : 'Update Metadata'}
                    </button>
                 </div>
               </motion.div>
             )}

             {activeTab === 'prescriptions' && (
               <motion.div key="prescriptions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="font-black text-espresso text-lg uppercase tracking-tight">Active Prescriptions</h3>
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                          <ShieldCheck size={20} />
                       </div>
                    </div>
                    <div className="space-y-4">
                       {(profile.prescriptions || [
                         { name: 'Alendronate', dosage: '70mg', frequency: 'Once Weekly', instructions: 'Take on empty stomach with water' },
                         { name: 'Calcium + Vit D3', dosage: '500mg/250IU', frequency: 'Once Daily', instructions: 'Take after lunch' },
                         { name: 'Teriparatide', dosage: '20mcg', frequency: 'Once Daily', instructions: 'Subcutaneous injection at night' }
                       ]).map((pres, idx) => (
                         <div key={idx} className="p-6 bg-slate-50 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                                  <Pill size={24} />
                               </div>
                               <div>
                                  <h4 className="font-black text-espresso text-sm uppercase tracking-tight">{pres.name} <span className="text-[10px] text-slate-400">({pres.dosage})</span></h4>
                                  <p className="text-[10px] font-bold text-blue-600 uppercase mt-0.5">{pres.frequency}</p>
                                  <p className="text-[9px] font-medium text-slate-400 mt-1 italic">"{pres.instructions}"</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                  <CheckCircle size={16} />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
                       <div className="flex items-center gap-3 mb-2">
                          <Info size={16} className="text-blue-600" />
                          <h4 className="font-black text-blue-900 text-[10px] uppercase tracking-widest">Doctor's Note</h4>
                       </div>
                       <p className="text-[11px] text-blue-700 font-medium leading-relaxed italic">
                          "Please ensure strict adherence to the Alendronate protocol. Avoid lying down for 30 minutes post-intake to prevent esophageal irritation."
                       </p>
                    </div>
                 </div>
               </motion.div>
             )}

             {activeTab === 'security' && (
               <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                 <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                       <div className="flex items-center gap-3">
                          <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm border border-slate-100">
                             <History size={24} />
                          </div>
                          <div>
                             <h3 className="font-black text-espresso text-lg uppercase tracking-tight">Security & Device Vault</h3>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Detailed Django Session Audit Log</p>
                          </div>
                       </div>
                    </div>
                    
                    <div className="divide-y divide-slate-50">
                       {loginHistory.map((login) => (
                         <div key={login.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                  <Monitor size={22} />
                               </div>
                               <div>
                                  <p className="font-black text-espresso text-sm tracking-tight">{login.device}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                     <span className="text-[8px] font-black uppercase text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{login.status}</span>
                                     <span className="text-[9px] font-bold text-slate-300">{login.browser} • {login.location}</span>
                                  </div>
                                  <p className="text-[8px] font-mono text-slate-200 mt-1 uppercase tracking-tighter">X-CSRF-Token: {login.token_id}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black text-espresso uppercase">{new Date(login.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
                               <p className="text-[8px] font-bold text-slate-400">{login.ip}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">End of Audit Log</p>
                    </div>
                 </div>

                 <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                          <Smartphone size={24} className="text-emerald-400" />
                       </div>
                       <div>
                          <h4 className="font-black uppercase text-xs tracking-widest">Security Protocol</h4>
                          <p className="text-[10px] text-slate-500 font-bold">2FA/MFA Requirement: ENABLED</p>
                       </div>
                    </div>
                    <button className="px-6 py-2 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">Settings</button>
                 </div>
               </motion.div>
             )}

             {activeTab === 'storage' && (
               <motion.div key="storage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                 <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="font-black text-espresso text-lg uppercase tracking-tight">Encrypted Storage</h3>
                       <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg"><Plus size={20} /></button>
                    </div>
                    <div className="h-4 w-full bg-slate-50 rounded-full flex overflow-hidden border border-slate-100">
                       <div className="h-full bg-blue-500" style={{ width: '12%' }} />
                    </div>
                    <div className="space-y-2">
                       {profile.documents?.map(doc => (
                         <div key={doc.id} className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                               <FileText size={18} className="text-slate-400" />
                               <span className="text-xs font-bold text-espresso">{doc.name}</span>
                            </div>
                            <button className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                         </div>
                       ))}
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Profile;
