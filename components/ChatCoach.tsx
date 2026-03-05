
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, User, Bot, Sparkles, Copy, Check, RotateCcw, 
  ThumbsUp, ThumbsDown, Lightbulb, Activity, Utensils, 
  Mic, MicOff, Brain, Radio, Layers, Target, ChevronDown, 
  Plus, Square, Share2
} from 'lucide-react';
import { chatWithAI, transcribeAudio } from '../services/geminiService';
import { ChatMessage, DailyLog, ReportInsight, LanguageCode } from '../types';
import PathologyScanner from './PathologyScanner';

interface ChatCoachProps {
  logs: DailyLog[];
  insights: ReportInsight[];
  language: LanguageCode;
  onStartLiveSession?: () => void;
}

const formatText = (text: string) => {
  // Enhanced formatting for a more professional "ChatGPT" look
  let formatted = text.replace(/^### (.*$)/gim, '<h2 class="text-2xl font-black text-espresso mt-6 mb-3">$1</h2>');
  formatted = formatted.replace(/^## (.*$)/gim, '<h3 class="text-xl font-bold text-espresso mt-4 mb-2">$1</h3>');
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-espresso">$1</strong>');
  formatted = formatted.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-6 mb-2 list-disc text-slate-700 leading-relaxed">$1</li>');
  formatted = formatted.replace(/\n/g, '<br />');
  return <div className="prose prose-slate max-w-none text-slate-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />;
};

const ChatCoach: React.FC<ChatCoachProps> = ({ logs, insights, language, onStartLiveSession }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: "### Clinical Analysis Engine Ready\nHello. I am **CHOPPER**, your bone health intelligence assistant. \n\nI've analyzed your recent DEXA scans and daily logs. Based on the current data, your spinal mineral density is in a critical maintenance phase. \n\nHow can I assist with your clinical routine today?", 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDeepThinking, setIsDeepThinking] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, showScanner]);

  const handleSend = async (customMessage?: string) => {
    const textToSend = customMessage || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customMessage) setInput('');
    setIsTyping(true);

    const lastLog = logs[0];
    const latestInsight = insights[0];
    const context = `
      User History: ${logs.length} entries.
      Last Pain Level: ${lastLog?.pain || 'unknown'}.
      Latest T-Score: ${latestInsight?.tScore || 'not provided'}.
      Precision Mode: ON
    `;

    try {
      const response = await chatWithAI(textToSend, context, language, isDeepThinking);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      
      if (textToSend.toLowerCase().includes('scan') || textToSend.toLowerCase().includes('report')) {
        setShowScanner(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          setIsTyping(true);
          try {
            const transcription = await transcribeAudio(base64Audio, 'audio/webm');
            setInput(transcription);
          } catch (e) { console.error(e); } finally { setIsTyping(false); }
        };
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) { console.error(err); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-screen md:h-[calc(100vh-64px)] bg-white">
      {/* Header - Minimalist */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 sticky top-0 z-30 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-2 group cursor-pointer">
          <span className="font-black text-xl tracking-tight text-espresso">Chopper 2.5</span>
          <ChevronDown size={16} className="text-slate-400 group-hover:text-espresso transition-colors" />
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setShowScanner(!showScanner)}
             className={`p-2 rounded-xl transition-all flex items-center gap-2 ${showScanner ? 'bg-slate-900 text-emerald-400' : 'text-slate-400 hover:text-espresso'}`}
           >
             <Target size={18} />
             <span className="text-xs font-bold hidden sm:inline">{showScanner ? 'Close Scan' : 'View Scan'}</span>
           </button>
           <button className="p-2 text-slate-400 hover:text-espresso transition-colors">
              <Share2 size={18} />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col items-center">
        <div 
          ref={scrollRef} 
          className="w-full max-w-3xl overflow-y-auto px-6 py-10 space-y-10 no-scrollbar pb-32"
        >
          <AnimatePresence>
            {showScanner && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.98, height: 0 }}
                className="mb-12"
              >
                <PathologyScanner />
              </motion.div>
            )}
          </AnimatePresence>

          {messages.map((msg) => (
            <div key={msg.id} className="w-full flex flex-col group">
              <div className="flex items-start gap-4 md:gap-6">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="font-black text-espresso text-sm">
                    {msg.sender === 'user' ? 'You' : 'CHOPPER'}
                  </div>
                  <div className="text-slate-700">
                    {msg.sender === 'ai' ? formatText(msg.text) : <p className="font-medium text-lg leading-relaxed">{msg.text}</p>}
                  </div>
                  
                  {msg.sender === 'ai' && (
                    <div className="flex items-center gap-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(msg.text, msg.id)}
                        className="p-1.5 text-slate-400 hover:text-espresso transition-colors"
                      >
                        {copiedId === msg.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-espresso transition-colors">
                        <RotateCcw size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-espresso transition-colors">
                        <ThumbsUp size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-espresso transition-colors">
                        <ThumbsDown size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-start gap-6">
              <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center">
                 <Bot size={20} className="animate-pulse" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                 <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Dock - Floating Style */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-white via-white/80 to-transparent">
          <div className="w-full max-w-3xl space-y-4">
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
               <button 
                 onClick={() => setIsDeepThinking(!isDeepThinking)}
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold whitespace-nowrap transition-all ${
                   isDeepThinking ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                 }`}
               >
                 <Brain size={14} />
                 Precision Reasoning
               </button>
               <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-500 border border-slate-200 text-[11px] font-bold whitespace-nowrap hover:border-slate-300">
                 <Activity size={14} />
                 Analyze DEXA
               </button>
               <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-slate-500 border border-slate-200 text-[11px] font-bold whitespace-nowrap hover:border-slate-300">
                 <Lightbulb size={14} />
                 Treatment Gaps
               </button>
            </div>

            {/* Input Box */}
            <div className="relative bg-slate-100 rounded-[1.5rem] border border-slate-200 p-2 shadow-sm focus-within:bg-white focus-within:border-slate-400 transition-all">
              <div className="flex items-end gap-2 px-2">
                <button className="p-2.5 text-slate-400 hover:text-espresso transition-colors">
                  <Plus size={20} />
                </button>
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about your bone health..."
                  className="flex-1 bg-transparent border-none py-3 px-2 focus:outline-none font-medium text-espresso placeholder:text-slate-400 resize-none min-h-[52px] max-h-48 overflow-y-auto"
                />
                
                <div className="flex items-center gap-1 pb-1">
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2.5 rounded-full transition-all ${
                      isRecording ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-indigo-600'
                    }`}
                  >
                    {isRecording ? <Square size={16} fill="white" /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isTyping}
                    className={`p-2.5 rounded-xl transition-all ${
                      input.trim() && !isTyping ? 'bg-espresso text-white shadow-lg' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-slate-400 font-bold">
              Chopper can make mistakes. Check important medical info.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCoach;
