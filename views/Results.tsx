import React from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { CheckCircle2, AlertTriangle, AlertOctagon, ArrowLeft, RefreshCw, Copy, Check } from 'lucide-react';

interface ResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const Results: React.FC<ResultsProps> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const copySummary = () => {
    navigator.clipboard.writeText(result.meaning);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRiskStyles = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          icon: <CheckCircle2 className="text-emerald-600" size={24} />,
          label: 'Low Risk'
        };
      case RiskLevel.MEDIUM:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertTriangle className="text-amber-600" size={24} />,
          label: 'Medium Risk'
        };
      case RiskLevel.HIGH:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-800',
          icon: <AlertOctagon className="text-rose-600" size={24} />,
          label: 'High Risk'
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          icon: <CheckCircle2 className="text-slate-600" size={24} />,
          label: 'Unknown'
        };
    }
  };

  const riskStyle = getRiskStyles(result.riskLevel as RiskLevel);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <button 
        onClick={onReset}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Analyze another document
      </button>

      <div className="grid gap-6">
        
        {/* Header - Risk Level */}
        <div className={`p-6 rounded-2xl border ${riskStyle.bg} ${riskStyle.border} flex flex-col md:flex-row md:items-center gap-4`}>
          <div className="shrink-0">{riskStyle.icon}</div>
          <div className="flex-grow">
            <h3 className={`font-bold text-lg ${riskStyle.text}`}>{riskStyle.label} Detected</h3>
            <p className={`text-sm ${riskStyle.text} opacity-90`}>{result.riskReason}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Main Content - Meaning */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900">What This Means</h2>
              <button onClick={copySummary} className="text-slate-400 hover:text-brand-600 transition-colors">
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-slate-700 leading-relaxed text-lg">
              {result.meaning}
            </p>
          </div>

          {/* Sidebar - Action Items */}
          <div className="bg-brand-50 rounded-2xl p-8 border border-brand-100 h-full">
            <h2 className="text-xl font-bold text-brand-900 mb-6">What You Should Do</h2>
            <ul className="space-y-4">
              {result.actions.map((action, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <div className="mt-1 w-5 h-5 rounded-full bg-brand-200 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-brand-900 font-medium leading-snug">{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
          <p className="text-slate-500 text-xs leading-relaxed max-w-2xl mx-auto">
            <span className="font-bold block mb-1 uppercase tracking-wide">Disclaimer</span>
            PlainNow uses artificial intelligence to simplify text. We are not lawyers, doctors, or financial advisors. 
            The information provided above is for clarity purposes only and does NOT constitute professional advice. 
            Always consult a qualified professional for critical decisions.
          </p>
        </div>

        <div className="flex justify-center mt-4">
           <button 
            onClick={onReset}
            className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors"
          >
            <RefreshCw size={18} /> Analyze Another
          </button>
        </div>
      </div>
    </div>
  );
};