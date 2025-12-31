import React from 'react';
import { Shield, Lock, Trash2, ArrowRight, FileCheck, BrainCircuit } from 'lucide-react';
import { ViewState } from '../types';

interface LandingProps {
  onStart: () => void;
  onHowItWorks: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onHowItWorks }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-6 py-20 md:py-32 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold uppercase tracking-wider mb-6 border border-brand-100">
          <BrainCircuit size={14} />
          AI-Powered Clarity
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
          Understand confusing <br className="hidden md:block"/> documents in <span className="text-brand-600">seconds.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          We translate complex bank, college, insurance, and government letters into simple language and clear next steps.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto h-12 px-8 rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            Explain a Document <ArrowRight size={18} />
          </button>
          <button 
             onClick={onHowItWorks}
             className="w-full sm:w-auto h-12 px-8 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-all"
          >
            See How It Works
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-600">Privacy-first</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={18} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-600">Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <Trash2 size={18} className="text-emerald-500" />
            <span className="text-sm font-medium text-slate-600">Auto-deleted</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-2">
                <FileCheck />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Instant Summary</h3>
              <p className="text-slate-600 leading-relaxed">
                Stop reading the same paragraph 5 times. Get the core meaning in plain English instantly.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-2">
                <Shield />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Risk Detection</h3>
              <p className="text-slate-600 leading-relaxed">
                We highlight hidden fees, penalties, and urgent deadlines so you don't get caught off guard.
              </p>
            </div>
             <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-2">
                <ArrowRight />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Clear Action Steps</h3>
              <p className="text-slate-600 leading-relaxed">
                Know exactly what to do next. "Pay by Friday," "Call this number," or "Ignore safely."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};