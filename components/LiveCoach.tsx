
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { X, Mic, MicOff, Volume2, Info, Radio, Sparkles, User, Bot, Command } from 'lucide-react';
import { APP_LOGO } from '../constants';

interface LiveCoachProps {
  onClose: () => void;
  language: string;
}

const LiveCoach: React.FC<LiveCoachProps> = ({ onClose, language }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{sender: 'user' | 'ai', text: string}[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Manual encode/decode implementation as per SDK rules
  const encode = (bytes: Uint8Array) => {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
  ): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const startSession = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Initialize contexts
    const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    audioContextRef.current = inputCtx;
    outputAudioContextRef.current = outputCtx;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.outputTranscription) {
              setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
            } else if (message.serverContent?.inputTranscription) {
              setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }

            if (message.serverContent?.turnComplete) {
              if (currentInput) setTranscriptions(prev => [...prev, { sender: 'user', text: currentInput }]);
              if (currentOutput) setTranscriptions(prev => [...prev, { sender: 'ai', text: currentOutput }]);
              setCurrentInput('');
              setCurrentOutput('');
              setIsAiSpeaking(false);
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsAiSpeaking(true);
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsAiSpeaking(false);
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
              setIsAiSpeaking(false);
            }
          },
          onclose: () => setIsActive(false),
          onerror: (e) => console.error("Live API Error:", e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: `You are CHOPPER, the advanced bone health assistant. 
          Respond in ${language}. Be empathetic, encouraging, and clear. 
          Use your expertise in Osteoporosis to help the user. 
          Keep spoken responses relatively concise.`
        }
      });
      sessionPromiseRef.current = sessionPromise;
    } catch (err) {
      console.error("Failed to start voice session:", err);
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    startSession();
    return () => {
      if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(s => s.close());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) audioContextRef.current.close();
      if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0A0A0B] z-[100] flex flex-col items-center justify-between p-6 text-white overflow-hidden"
    >
      {/* Background Nebula Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: isAiSpeaking ? [1, 1.2, 1] : [1, 1.05, 1],
            rotate: [0, 90, 180, 270, 360],
            opacity: isActive ? 0.3 : 0.1
          }}
          transition={{ 
            duration: isAiSpeaking ? 4 : 10, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_#9A7B4F55_0%,_#3E362E11_40%,_transparent_70%)]"
        />
      </div>

      <header className="w-full max-w-lg flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10">
            <Radio size={20} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white/90">CHOPPER VOICE</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quantum Adherence Link</p>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/10"
        >
          <X size={20} />
        </button>
      </header>

      {/* Main Visualizer Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-lg space-y-12 z-10">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-72 h-72 border border-white/5 rounded-full"
          />
          
          {/* Middle Pulse */}
          <motion.div 
            animate={{ 
              scale: isAiSpeaking ? [1, 1.2, 1] : [1, 1.05, 1],
              opacity: isActive ? [0.4, 0.6, 0.4] : 0.2
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-60 h-60 bg-golden-brown/10 rounded-full blur-2xl"
          />

          {/* Central Nebula */}
          <div className="relative w-48 h-48">
            <AnimatePresence>
              {isConnecting ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-8 h-8 border-4 border-white/10 border-t-golden-brown rounded-full animate-spin" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Linking...</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-full h-full relative"
                >
                  <img src={APP_LOGO} alt="Mascot" className="w-full h-full object-contain relative z-20 drop-shadow-2xl brightness-110" />
                  {/* Dynamic Glow Background */}
                  <motion.div 
                    animate={{ 
                      scale: isAiSpeaking ? [1, 1.3, 1] : [1, 1.1, 1],
                      boxShadow: isAiSpeaking 
                        ? "0 0 60px 20px rgba(154, 123, 79, 0.4)" 
                        : "0 0 40px 10px rgba(154, 123, 79, 0.2)"
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-golden-brown/20 rounded-full blur-3xl z-0"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Captions / Transcript Area */}
        <div className="w-full space-y-6 text-center">
          <div className="min-h-[80px] flex flex-col items-center justify-center px-8">
            <AnimatePresence mode="wait">
              {currentOutput ? (
                <motion.p 
                  key="ai-speaking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-bold text-white leading-tight"
                >
                  {currentOutput}
                </motion.p>
              ) : currentInput ? (
                <motion.p 
                  key="user-speaking"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-bold text-emerald-400/80 leading-tight italic"
                >
                  "{currentInput}"
                </motion.p>
              ) : isActive ? (
                <motion.p 
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-black uppercase tracking-[0.2em] text-slate-500"
                >
                  Ready to assist
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          {/* History Bubble */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 h-32 overflow-y-auto no-scrollbar space-y-3">
            {transcriptions.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2">
                  <Command size={20} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Conversation History</p>
               </div>
            ) : (
              transcriptions.map((t, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-3 ${t.sender === 'user' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}
                >
                  <div className={`p-1.5 rounded-lg ${t.sender === 'user' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-golden-brown/20 text-golden-brown'}`}>
                    {t.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <p className="text-[11px] font-medium text-slate-300 leading-snug">{t.text}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      <footer className="w-full max-w-lg grid grid-cols-2 gap-4 z-10">
        <button 
          onClick={onClose}
          className="py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] border border-white/10 transition-all"
        >
          Terminate
        </button>
        <div className="bg-golden-brown text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-golden-brown/20 font-black uppercase text-xs tracking-[0.2em]">
          <div className="flex gap-1">
             {[0, 1, 2].map(i => (
               <motion.div 
                 key={i}
                 animate={{ height: isAiSpeaking ? [4, 16, 4] : [4, 8, 4] }}
                 transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                 className="w-1 bg-white rounded-full"
               />
             ))}
          </div>
          {isAiSpeaking ? 'Speaking' : 'Listening'}
        </div>
      </footer>
    </motion.div>
  );
};

export default LiveCoach;
