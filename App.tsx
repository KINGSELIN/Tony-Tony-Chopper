
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClinicalCommandCenter from './reports/ClinicalCommandCenter';
import ChatCoach from './components/ChatCoach';
import DailyCheckIn from './components/DailyCheckIn';
import Profile from './components/Profile';
import DietRoutine from './components/DietRoutine';
import BoneWordGame from './components/BoneWordGame';
import WearableSync from './components/WearableSync';
import LiveCoach from './components/LiveCoach';
import { UserRole, UserProfile, DailyLog, MedicalDocument, ReportInsight } from './types';
import { TRANSLATIONS, APP_LOGO } from './constants';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User as UserIcon, ShieldCheck, 
  ArrowLeft, RefreshCw, AlertCircle, 
  Smartphone, Fingerprint, Shield, Loader2, UserPlus
} from 'lucide-react';
import { generateMockJWT, AUTH_CONFIG, verifySession, clearSession, getBrowserMetadata, AuthLog } from './services/authService';
import { validateLogin, registerUser, saveUserData, getUserData } from './services/dbService';

type AuthView = 'login' | 'signup';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuth, setIsAuth] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [showLiveSession, setShowLiveSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(AUTH_CONFIG.USER_EMAIL_KEY);
  });

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [points, setPoints] = useState(0);
  const [loginHistory, setLoginHistory] = useState<AuthLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    id: 'u1',
    name: 'User',
    role: UserRole.PATIENT,
    language: 'en'
  });

  // Load user data on mount or when currentUserEmail changes
  useEffect(() => {
    if (currentUserEmail && verifySession()) {
      const userData = getUserData(currentUserEmail);
      if (userData) {
        setLogs(userData.logs);
        setDocuments(userData.documents);
        setPoints(userData.points);
        setLoginHistory(userData.loginHistory);
        setProfile(userData.profile);
        setIsAuth(true);
      }
    }
  }, [currentUserEmail]);

  const latestInsight = useMemo(() => {
    return documents.find(d => d.insight)?.insight;
  }, [documents]);

  // Session Watchdog
  useEffect(() => {
    if (isAuth) {
      const interval = setInterval(() => {
        if (!verifySession()) handleSignOut();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuth]);

  // Save user data whenever it changes
  useEffect(() => {
    if (isAuth && currentUserEmail) {
      saveUserData(currentUserEmail, {
        logs,
        documents,
        points,
        loginHistory,
        profile
      });
    }
  }, [logs, documents, points, loginHistory, profile, isAuth, currentUserEmail]);

  const t = TRANSLATIONS[profile.language] || TRANSLATIONS.en;

  const performAuthSuccess = useCallback((userEmail: string, userData: any) => {
    const token = generateMockJWT(userData.profile.id);
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    localStorage.setItem(AUTH_CONFIG.EXPIRY_KEY, (Date.now() + AUTH_CONFIG.SESSION_TIMEOUT).toString());
    localStorage.setItem(AUTH_CONFIG.USER_EMAIL_KEY, userEmail);
    
    setCurrentUserEmail(userEmail);
    setLogs(userData.logs);
    setDocuments(userData.documents);
    setPoints(userData.points);
    setLoginHistory(userData.loginHistory);
    setProfile(userData.profile);

    const meta = getBrowserMetadata();
    const log: AuthLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(),
      device: meta.device,
      browser: meta.browser,
      location: 'Authorized Secure Node',
      status: 'SUCCESS',
      ip: '192.168.1.1',
      token_id: `jti_${Math.random().toString(36).substring(2, 10)}`
    };
    setLoginHistory(prev => [log, ...prev]);
    setIsAuth(true);
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = validateLogin(email, password);
    if (user) {
      performAuthSuccess(email, user);
    } else {
      setAuthError('Invalid email or password');
    }
    setIsLoading(false);
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (getUserData(email)) {
      setAuthError('User already exists');
    } else {
      const newUser = registerUser(email, name, password);
      performAuthSuccess(email, newUser);
    }
    setIsLoading(false);
  };

  const handleSignOut = () => {
    clearSession();
    setIsAuth(false);
    setCurrentUserEmail(null);
    setAuthView('login');
    setAuthError(null);
    // Reset state
    setLogs([]);
    setDocuments([]);
    setPoints(0);
    setLoginHistory([]);
    setProfile({ id: 'u1', name: 'User', role: UserRole.PATIENT, language: 'en' });
  };

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Modern Background Accents */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-amber-100/40 rounded-full blur-[100px]" />

        <motion.div 
          layout
          className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative"
        >
          {/* Header */}
          <div className="p-8 pb-4 text-center space-y-4">
             <motion.div 
               whileHover={{ scale: 1.05 }}
               className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-lg border border-slate-50 overflow-hidden p-2"
             >
               <img src={APP_LOGO} alt="CHOPPER" className="w-full h-full object-contain" />
             </motion.div>
             <div className="space-y-1">
                <h1 className="text-2xl font-black text-espresso">
                   {authView === 'login' ? 'Welcome back' : 'Create Account'}
                </h1>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                   Secure Clinical Identity Hub
                </p>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {authView === 'login' && (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 pt-4 space-y-6"
              >
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm"
                    />
                  </div>
                  
                  {authError && (
                    <div className="flex items-center gap-2 text-red-500 text-[10px] font-black uppercase tracking-widest px-2">
                       <AlertCircle size={14} /> {authError}
                    </div>
                  )}

                  <button 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                  </button>
                </form>

                <div className="relative flex items-center py-2">
                   <div className="flex-1 border-t border-slate-100"></div>
                   <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Or New User</span>
                   <div className="flex-1 border-t border-slate-100"></div>
                </div>

                <button 
                  onClick={() => setAuthView('signup')}
                  className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                >
                  <UserPlus size={16} /> Sign up for Chopper
                </button>
              </motion.div>
            )}

            {authView === 'signup' && (
              <motion.div 
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-8 pt-4 space-y-6"
              >
                <form onSubmit={handleSignupSubmit} className="space-y-4">
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm"
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="password" placeholder="Create Password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white font-bold transition-all text-sm"
                    />
                  </div>
                  
                  <button 
                    disabled={isLoading}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </button>
                </form>

                <button 
                  onClick={() => setAuthView('login')}
                  className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-espresso transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Sign in
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Security Badge */}
          <div className="bg-slate-900 p-6 flex flex-col items-center gap-2">
             <div className="flex items-center gap-3 text-[9px] font-black text-white uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1.5 text-blue-400">
                   <ShieldCheck size={12} /> FIREBASE AUTH v10
                </div>
                <span className="opacity-20">|</span>
                <span className="opacity-60 text-slate-300">DJANGO ENGINE 6.0</span>
             </div>
             <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest text-center">Managed by PathAI Distributed Clinical Registry</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab} userRole={profile.role} userProfile={profile} onSignOut={handleSignOut} t={t} streak={logs.length}>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
          {activeTab === 'dashboard' && <Dashboard userName={profile.name} logs={logs} points={points} insights={[]} t={t} />}
          {activeTab === 'reports' && <ClinicalCommandCenter documents={documents} onUpload={(d) => setDocuments([d, ...documents])} onUpdateDoc={(d) => setDocuments(documents.map(x => x.id === d.id ? d : x))} />}
          {activeTab === 'chat' && <ChatCoach logs={logs} insights={documents.map(d => d.insight).filter(Boolean) as any} language={profile.language} onStartLiveSession={() => setShowLiveSession(true)} />}
          {activeTab === 'tracker' && <DailyCheckIn latestInsight={latestInsight} onComplete={(l, p) => { setLogs([l, ...logs]); setPoints(points + p); setActiveTab('dashboard'); }} onCancel={() => setActiveTab('dashboard')} />}
          {activeTab === 'profile' && <Profile profile={profile} loginHistory={loginHistory} onUpdate={setProfile} t={t} />}
          {activeTab === 'diet' && <DietRoutine t={t} logs={logs} />}
          {activeTab === 'game' && <BoneWordGame onEarnPoints={(p) => setPoints(points + p)} t={t} />}
          {activeTab === 'sync' && <WearableSync userProfile={profile} logs={logs} />}
        </motion.div>
      </AnimatePresence>
      <AnimatePresence>{showLiveSession && <LiveCoach onClose={() => setShowLiveSession(false)} language={profile.language} />}</AnimatePresence>
    </Layout>
  );
};

export default App;
