
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, ChevronRight, BarChart3, Activity } from 'lucide-react';
import { analyzeMedicalReport } from '../services/geminiService';
import { ReportInsight } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface ReportAnalyzerProps {
  onInsightAnalyzed: (insight: ReportInsight) => void;
}

const ReportAnalyzer: React.FC<ReportAnalyzerProps> = ({ onInsightAnalyzed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [reportText, setReportText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReportInsight | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Mocking text extraction from file for the demo
      setReportText("Patient DEXA Results: Date 2024-05-20. Type: DEXA. L1-L4 T-Score: -2.7. Femoral Neck T-Score: -2.2. Interpretation: Osteoporosis level bone density detected in spinal region. Recommend high calcium diet and weight bearing exercise.");
    }
  };

  const startAnalysis = async () => {
    if (!reportText) return;
    setIsAnalyzing(true);
    try {
      const insight = await analyzeMedicalReport(reportText);
      setResult(insight);
      onInsightAnalyzed(insight);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please check your API key or connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const tScoreData = result?.tScore !== undefined ? [
    { name: 'Your T-Score', value: result.tScore }
  ] : [];

  const regionData = result?.regions?.map(r => ({
    name: r.name,
    value: r.severity === 'critical' ? 3 : r.severity === 'low' ? 2 : 1,
    severity: r.severity
  })) || [];

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Bone Insight AI</h2>
        <p className="text-slate-500 font-medium">Upload your DEXA scans or lab results for a plain-English summary.</p>
      </header>

      {!result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border-4 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-4"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-inner">
            <Upload size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">Drag your report here</h3>
            <p className="text-slate-400 text-sm">PDF, JPG, or PNG supported (Max 5MB)</p>
          </div>
          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={handleFileUpload} 
            accept=".pdf,.png,.jpg,.jpeg"
          />
          <label 
            htmlFor="file-upload"
            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-2xl shadow-[0_4px_0_#1d4ed8] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
          >
            {file ? file.name : 'Select File'}
          </label>

          {file && (
            <button 
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="mt-4 px-6 py-2 bg-green-500 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              {isAnalyzing ? 'Analyzing...' : 'Start Bone Insight Analysis'}
            </button>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Analysis Result Header */}
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-slate-800">{result.type} Summary</h3>
                    <p className="text-slate-400 text-sm font-bold uppercase">{result.date}</p>
                  </div>
                </div>
                {result.tScore !== undefined && (
                  <div className={`px-4 py-2 rounded-2xl font-bold border-b-4 ${
                    result.tScore <= -2.5 ? 'bg-red-100 text-red-600 border-red-200' : 'bg-yellow-100 text-yellow-600 border-yellow-200'
                  }`}>
                    T-Score: {result.tScore}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2"><BarChart3 size={18} /> Density Visualization</h4>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={tScoreData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[-4, 1]} hide />
                        <YAxis dataKey="name" type="category" hide />
                        <Tooltip />
                        <ReferenceLine x={-2.5} stroke="#ef4444" label={{ position: 'top', value: 'Osteoporosis', fill: '#ef4444', fontSize: 10 }} />
                        <ReferenceLine x={-1.0} stroke="#f59e0b" label={{ position: 'top', value: 'Osteopenia', fill: '#f59e0b', fontSize: 10 }} />
                        <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                          {tScoreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.value <= -2.5 ? '#ef4444' : entry.value <= -1.0 ? '#f59e0b' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2"><Activity size={18} /> Regional Severity</h4>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={regionData}>
                        <XAxis dataKey="name" fontSize={10} />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {regionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.severity === 'critical' ? '#ef4444' : entry.severity === 'low' ? '#f59e0b' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-700 mb-2">AI Executive Summary:</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                    {result.summary}
                  </p>
                </div>

                {result.solutions && result.solutions.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2">Clinical Solutions & Daily Necessities:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.solutions.map((sol, i) => (
                        <div key={i} className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 p-3 rounded-xl shadow-sm">
                          <CheckCircle className="text-emerald-500 mt-1 shrink-0" size={16} />
                          <span className="text-emerald-800 text-xs font-medium">{sol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-bold text-slate-700 mb-2">Health Suggestions:</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                        <ChevronRight className="text-blue-500 mt-1 shrink-0" size={16} />
                        <span className="text-slate-600 text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Warning Box */}
            <div className="bg-orange-50 border-2 border-orange-100 p-4 rounded-2xl flex gap-3">
              <AlertCircle className="text-orange-500 shrink-0" size={20} />
              <p className="text-xs text-orange-700 font-medium">
                <strong>Bone Insight Disclaimer:</strong> This is an AI-generated summary intended for informational purposes only. It is not a medical diagnosis. Please share these insights with your physician before making any changes to your treatment plan.
              </p>
            </div>

            <button 
              onClick={() => setResult(null)}
              className="w-full py-4 border-2 border-slate-200 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
            >
              Analyze Another Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportAnalyzer;
