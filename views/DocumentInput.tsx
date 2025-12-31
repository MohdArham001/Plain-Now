import React, { useCallback, useState } from 'react';
import { UploadCloud, FileType, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { ExplanationStyle, DocumentInputState } from '../types';

interface DocumentInputProps {
  isLoading: boolean;
  onSubmit: (input: DocumentInputState) => void;
  error?: string | null;
}

export const DocumentInput: React.FC<DocumentInputProps> = ({ isLoading, onSubmit, error }) => {
  const [state, setState] = useState<DocumentInputState>({
    text: '',
    file: null,
    fileBase64: null,
    style: ExplanationStyle.SIMPLE_30_SEC
  });
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = (file: File) => {
    // Basic validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("File is too large. Max 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Get pure base64 without prefix for API
      const base64 = result.split(',')[1]; 
      setState(prev => ({ ...prev, file: file, fileBase64: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setState(prev => ({ ...prev, file: null, fileBase64: null }));
  };

  const handleSubmit = () => {
    if (!state.text.trim() && !state.file) return;
    onSubmit(state);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-900">What needs explaining?</h2>
        <p className="text-slate-500 mt-2">Paste text or upload an image/PDF.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Document Area */}
        <div className="p-6">
          {!state.file ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none text-slate-700 placeholder:text-slate-400 transition-all"
                placeholder="Paste the confusing text here..."
                value={state.text}
                onChange={(e) => setState(prev => ({ ...prev, text: e.target.value }))}
                disabled={isLoading}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Or upload file</span>
                </div>
              </div>

              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  dragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <UploadCloud size={24} />
                  <p className="text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-600 shadow-sm">
                  <FileType size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-900 truncate max-w-[200px] sm:max-w-md">
                    {state.file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(state.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                disabled={isLoading}
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Settings Area */}
        <div className="bg-slate-50 p-6 border-t border-slate-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            Explanation Style
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              { id: ExplanationStyle.SIMPLE_30_SEC, label: '30 Second Summary' },
              { id: ExplanationStyle.ELI5, label: 'Explain like I\'m 15' },
              { id: ExplanationStyle.ACTION_ONLY, label: 'Action Items Only' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setState(prev => ({ ...prev, style: option.id }))}
                className={`
                  px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left flex items-center justify-between group
                  ${state.style === option.id 
                    ? 'bg-white border-brand-500 text-brand-700 shadow-sm ring-1 ring-brand-500' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }
                `}
                disabled={isLoading}
              >
                {option.label}
                {state.style === option.id && <Check size={16} className="text-brand-500" />}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={(!state.text && !state.file) || isLoading}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              (!state.text && !state.file) || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20 transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing...
              </>
            ) : (
              'Explain Now'
            )}
          </button>
          
          <p className="text-center text-xs text-slate-400 mt-4">
            Documents are processed securely and deleted immediately.
          </p>
        </div>
      </div>
    </div>
  );
};