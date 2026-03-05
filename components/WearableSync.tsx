
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Watch, 
  Zap, 
  Activity, 
  Waves, 
  RefreshCw, 
  Bluetooth, 
  Shield, 
  Battery, 
  Heart, 
  ChevronRight, 
  BluetoothSearching, 
  BluetoothConnected,
  X,
  Signal,
  Smartphone,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  Target
} from 'lucide-react';
import { WearableStatus, RiskPrediction, UserProfile, DailyLog } from '../types';
import { calculateOsteoporosisRisk } from '../services/geminiService';

interface DetectedDevice {
  id: string;
  name: string;
  rssi: number; // Signal strength
  type: 'Watch' | 'Sensor' | 'Ring';
}

interface WearableSyncProps {
  userProfile: UserProfile;
  logs: DailyLog[];
}

const WearableSync: React.FC<WearableSyncProps> = ({ userProfile, logs }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<DetectedDevice | null>(null);
  const [livePulse, setLivePulse] = useState<number[]>(new Array(10).fill(0));
  const [riskData, setRiskData] = useState<RiskPrediction | null>(null);
  const [isAnalyzingRisk, setIsAnalyzingRisk] = useState(false);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  
  const [status, setStatus] = useState<WearableStatus>({
    isConnected: false,
    battery: 84,
    lastSync: new Date(),
    equilibriumScore: 0,
    skeletalLoading: 0
  });

  const latestLog = logs[0];
  const exerciseRecs = latestLog?.recommendations?.filter(r => r.type === 'exercise') || [];

  const availableDevices: DetectedDevice[] = [
    { id: 'CH-W3-09', name: 'CHOPPER Watch v3', rssi: -45, type: 'Watch' },
    { id: 'BONE-S1-X', name: 'Skeletal Sensor B1', rssi: -62, type: 'Sensor' },
    { id: 'RING-OS-01', name: 'Osteo-Ring Alpha', rssi: -78, type: 'Ring' }
  ];

  // Simulate Live Data Stream once connected
  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setLivePulse(prev => {
          const next = [...prev.slice(1), Math.floor(Math.random() * 40) + 40];
          return next;
        });
        setStatus(prev => ({
          ...prev,
          equilibriumScore: Math.min(100, Math.max(60, prev.equilibriumScore + (Math.random() > 0.5 ? 1 : -1))),
          skeletalLoading: Math.min(100, prev.skeletalLoading + 0.1)
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const startSearch = async () => {
    setBluetoothError(null);
    if ('bluetooth' in navigator) {
      try {
        // Real Web Bluetooth API call
        const device = await (navigator as any).bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ['battery_service', 'heart_rate']
        });
        
        setIsSearching(false);
        setIsPairing(true);
        setSelectedDevice({
          id: device.id,
          name: device.name || 'Unknown Device',
          rssi: -50,
          type: 'Watch'
        });

        // Simulate pairing completion
        setTimeout(() => {
          setIsPairing(false);
          setIsConnected(true);
          setStatus(prev => ({
            ...prev,
            isConnected: true,
            equilibriumScore: 72,
            skeletalLoading: 45,
            lastSync: new Date()
          }));
        }, 2000);

      } catch (error: any) {
        console.error("Bluetooth Error:", error);
        if (error.name !== 'NotFoundError') {
          setBluetoothError("Bluetooth connection failed. Please ensure Bluetooth is enabled.");
        }
        // Fallback to mock search if user cancels or error occurs
        setIsSearching(true);
      }
    } else {
      setIsSearching(true);
    }
  };

  const handlePair = (device: DetectedDevice) => {
    setIsSearching(false);
    setIsPairing(true);
    setSelectedDevice(device);
    
    // Simulate Bluetooth Handshake
    setTimeout(() => {
      setIsPairing(false);
      setIsConnected(true);
      setStatus(prev => ({
        ...prev,
        isConnected: true,
        equilibriumScore: 72,
        skeletalLoading: 45,
        lastSync: new Date()
      }));
    }, 2500);
  };

  const disconnect = () => {
    setIsConnected(false);
    setSelectedDevice(null);
    setStatus(prev => ({ ...prev, isConnected: false }));
  };

  const runRiskPrediction = async () => {
    setIsAnalyzingRisk(true);
    try {
      const prediction = await calculateOsteoporosisRisk(userProfile, logs);
      setRiskData(prediction);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingRisk(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-espresso uppercase tracking-tight">Connectivity & Risk Hub</h2>
          <p className="text-slate-400 font-medium italic">Synchronize sensors and predict structural integrity.</p>
        </div>
        {isConnected && (
          <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border-b-4 border-emerald-100 shadow-sm">
            <BluetoothConnected size={14} />
            Linked: {selectedDevice?.name}
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Device Connectivity */}
        <div className="lg:col-span-7 space-y-6">
          {/* Exercise Recommendations from Daily Log */}
          {exerciseRecs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-blue-50 p-6 rounded-[3rem] border-2 border-blue-100 shadow-sm space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white text-blue-500 rounded-2xl">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-blue-900 uppercase">Post-Log Exercises</h3>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Based on your latest daily log</p>
                </div>
              </div>
              <div className="space-y-3">
                {exerciseRecs.map((rec, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/80 p-4 rounded-2xl border border-blue-100">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <p className="text-sm font-bold text-blue-900">{rec.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!isConnected && !isSearching && !isPairing && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-sm flex flex-col items-center text-center space-y-6"
              >
                <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2.5rem] flex items-center justify-center relative">
                  <Bluetooth size={48} />
                  <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-slate-100 rounded-[2.5rem] -z-10"
                  />
                </div>
                <div className="max-w-xs">
                  <h3 className="text-xl font-black text-espresso uppercase tracking-tight">No Sensor Connected</h3>
                  <p className="text-sm font-medium text-slate-400 mt-2">Pair your CHOPPER wearable to unlock real-time skeletal loading metrics.</p>
                </div>
                <button 
                  onClick={startSearch}
                  className="px-10 py-4 bg-golden-brown text-white font-black rounded-2xl shadow-[0_6px_0_#7A5F3B] active:shadow-none active:translate-y-1 transition-all uppercase tracking-widest flex items-center gap-3"
                >
                  <BluetoothSearching size={20} />
                  Find My Device
                </button>
              </motion.div>
            )}

            {isSearching && (
              <motion.div 
                key="searching"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-slate-900 p-12 rounded-[3rem] text-center relative overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="w-32 h-32 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full flex items-center justify-center"
                    >
                      <BluetoothSearching size={40} className="text-emerald-400" />
                    </motion.div>
                    <h3 className="text-white font-black text-xl uppercase mt-6 tracking-widest">Scanning...</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Keep device within 3ft</p>
                  </div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b98111_0%,_transparent_70%)]" />
                  <button onClick={() => setIsSearching(false)} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">Detected Hardware</h4>
                  {availableDevices.map((device, idx) => (
                    <motion.div 
                      key={device.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handlePair(device)}
                      className="bg-white p-5 rounded-3xl border-2 border-slate-50 hover:border-golden-brown hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-amber-50 group-hover:text-golden-brown">
                          {device.type === 'Watch' ? <Watch size={24} /> : <Zap size={24} />}
                        </div>
                        <div>
                          <p className="font-black text-espresso uppercase">{device.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">{device.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Signal size={16} className={device.rssi > -50 ? 'text-emerald-500' : 'text-slate-300'} />
                        <ChevronRight size={20} className="text-slate-200 group-hover:text-golden-brown" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {isConnected && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="bg-espresso p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10 space-y-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-4xl font-black tracking-tight">Equilibrium Score</h3>
                        <div className="flex items-center gap-2 text-emerald-400 font-black uppercase text-xs tracking-widest mt-1">
                          <Waves size={16} /> Live Data Stream Active
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-6xl font-black">{status.equilibriumScore}</span>
                        <span className="text-slate-400 text-lg font-bold ml-1">%</span>
                      </div>
                    </div>

                    <div className="h-24 flex items-end justify-center gap-1.5 px-4">
                      {livePulse.map((val, i) => (
                        <motion.div 
                          key={i}
                          animate={{ height: `${val}%` }}
                          className="flex-1 bg-emerald-400/30 rounded-t-lg border-t-2 border-emerald-400"
                          style={{ minHeight: '10%' }}
                        />
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Skeletal Loading</p>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-black">{status.skeletalLoading.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: `${status.skeletalLoading}%` }} 
                            className="h-full bg-golden-brown" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Heart Consistency</p>
                        <div className="flex items-end gap-2 text-red-400">
                          <Heart size={20} fill="currentColor" className="mb-1" />
                          <span className="text-2xl font-black">78</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Activity size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: AI Risk Prediction (Kaggle Dataset Integrated) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] border-2 border-slate-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 text-golden-brown rounded-2xl">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-espresso uppercase">Risk Prediction</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kaggle Dataset Trained Model</p>
              </div>
            </div>

            {!riskData && !isAnalyzingRisk && (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center text-slate-300">
                  <TrendingUp size={32} />
                </div>
                <p className="text-xs text-slate-500 font-medium">Predict your risk based on 15+ clinical factors including age, BMI, and physical activity.</p>
                <button 
                  onClick={runRiskPrediction}
                  className="w-full py-4 bg-slate-900 text-emerald-400 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:bg-black transition-all"
                >
                  Analyze My Risk Profile
                </button>
              </div>
            )}

            {isAnalyzingRisk && (
              <div className="py-12 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-slate-100 border-t-golden-brown rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Running Clinical Matrix...</p>
              </div>
            )}

            {riskData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Category</p>
                    <p className={`text-3xl font-black ${
                      riskData.label === 'High' ? 'text-red-500' : 
                      riskData.label === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>{riskData.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</p>
                    <p className="text-3xl font-black text-espresso">{riskData.score}%</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Risk Factors (ROI)</h4>
                  {riskData.factors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          f.impact === 'negative' ? 'bg-red-500' : 
                          f.impact === 'positive' ? 'bg-emerald-500' : 'bg-slate-300'
                        }`} />
                        <span className="text-xs font-bold text-espresso">{f.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase">{f.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-golden-brown/10 p-5 rounded-[2rem] border border-golden-brown/20">
                  <h4 className="text-[10px] font-black text-golden-brown uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Target size={14} /> AI Optimization Path
                  </h4>
                  <ul className="space-y-2">
                    {riskData.recommendations.map((rec, i) => (
                      <li key={i} className="text-[11px] text-espresso font-medium flex gap-2">
                        <span className="text-golden-brown text-lg leading-none">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={runRiskPrediction}
                  className="w-full py-3 bg-white border-2 border-slate-100 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-golden-brown hover:text-golden-brown transition-all"
                >
                  Refresh Analysis
                </button>
              </motion.div>
            )}
          </div>

          {/* Clinical Disclaimer */}
          <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex gap-4">
            <AlertTriangle className="text-red-500 shrink-0" size={20} />
            <p className="text-[10px] text-red-700 leading-relaxed font-bold">
              The CHOPPER Risk Engine is based on population datasets. Individual outcomes vary. These results do not constitute a clinical diagnosis. Always consult a specialist for Bone Mineral Density (BMD) testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WearableSync;
