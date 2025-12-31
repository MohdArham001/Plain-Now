import React from 'react';
import { ArrowRight, Upload, BrainCircuit, FileCheck } from 'lucide-react';
import step1 from "../images/image1.png";
import step2 from "../images/image2.png";
import step3 from "../images/image3.png";

interface HowItWorksProps {
  onStart: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStart }) => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">How PlainNow Works</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          We turn confusion into clarity in three simple steps. No complicated setup, no hidden storage.
        </p>
      </div>

      <div className="space-y-24">
        {/* Step 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-6">
              <Upload size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Upload or Paste</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Take a photo of that confusing letter, upload a PDF, or simply copy and paste the text into our secure input box.
            </p>
            <ul className="mt-4 space-y-2 text-slate-500">
              <li className="flex items-center gap-2 text-sm">✓ Supports PDF, JPG, PNG</li>
              <li className="flex items-center gap-2 text-sm">✓ Drag and drop interface</li>
            </ul>
          </div>
          <div className="order-1 md:order-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <img 
              src="/images/image1.png" 
              alt="Stack of envelopes and documents" 
              className="rounded-xl w-full h-64 object-cover"
            />
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <img 
              src="/images/image2.png" 
              alt="Abstract AI and digital processing visualization" 
              className="rounded-xl w-full h-64 object-cover"
            />
          </div>
          <div className="order-2">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <BrainCircuit size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Select Your Style</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Choose how you want it explained. Need a quick 30-second summary? Or do you need it explained like you're 5 years old? Our AI adapts to you.
            </p>
            <ul className="mt-4 space-y-2 text-slate-500">
              <li className="flex items-center gap-2 text-sm">✓ "Explain like I'm 5" mode</li>
              <li className="flex items-center gap-2 text-sm">✓ Action-items only mode</li>
            </ul>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <FileCheck size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Get Clarity & Action</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Instantly get a plain English explanation, a checklist of what to do next, and a risk assessment.
            </p>
            <div className="mt-6 flex flex-col gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-sm border border-emerald-100">
                    <strong>Meaning:</strong> You owe $50 by Friday.
                </div>
                 <div className="p-3 bg-white text-slate-700 rounded-lg text-sm border border-slate-200 shadow-sm">
                    <strong>Action:</strong> Log in to portal and pay.
                </div>
            </div>
          </div>
          <div className="order-1 md:order-2 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
             <img 
              src="/images/image3.png" 
              alt="Person completing a checklist on a digital tablet" 
              className="rounded-xl w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-24 text-center bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Ready to understand that document?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of people who stopped worrying about confusing paperwork.
            </p>
            <button 
                onClick={onStart}
                className="bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
                Start Explaining Now <ArrowRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};