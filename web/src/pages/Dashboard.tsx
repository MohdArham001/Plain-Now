import React, { useState } from 'react';
import { FileText, Upload, CheckCircle, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const API_URL = '/api'; // Proxy configured

interface AnalysisResult {
    riskLevel: 'High' | 'Medium' | 'Low';
    meaning: string;
    actions: string[];
}

export default function Dashboard() {
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [fileStats, setFileStats] = useState<{ name: string, size: string, preview: string, file: File } | null>(null);
    const [credits, setCredits] = useState(parseInt(localStorage.getItem('credits') || '0'));
    const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
    const [textInput, setTextInput] = useState('');

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);
        setFileStats({
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            preview: previewUrl,
            file: file
        });
    };

    const handleAnalyze = async (e: any) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to analyze documents.");
            setTimeout(() => window.location.href = '/', 2000);
            return;
        }

        if (inputMode === 'file' && !fileStats) return;
        if (inputMode === 'text' && !textInput.trim()) return;

        setLoading(true);
        const loadingToast = toast.loading("Analyzing...");

        try {
            let body: any = {};

            if (inputMode === 'file' && fileStats?.file) {
                const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => {
                        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
                        if ((reader.result as string).includes('base64,')) {
                            encoded = (reader.result as string).split('base64,')[1];
                        }
                        resolve(encoded);
                    };
                    reader.onerror = error => reject(error);
                });
                const fileBase64 = await toBase64(fileStats.file);
                body = {
                    fileContent: fileBase64,
                    fileType: fileStats.file.type || 'application/pdf' // Default fallback
                };
            } else {
                body = {
                    text: textInput
                };
            }

            const response = await fetch(`${API_URL}/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await response.json();
            toast.dismiss(loadingToast);

            if (response.ok) {
                setResult(data.document.analysis);
                if (data.credits !== undefined) {
                    setCredits(data.credits);
                    localStorage.setItem('credits', data.credits.toString());
                }
                toast.success("Analysis Complete!", {
                    description: `Risk Level: ${data.document.analysis.riskLevel}`
                });
            } else {
                if (response.status === 403) {
                    toast.error("Daily Limit Reached!", {
                        description: "You've used your 5 free credits for today.",
                        action: {
                            label: "Upgrade",
                            onClick: () => window.location.href = '/pricing'
                        },
                        duration: 5000,
                    });
                } else {
                    toast.error(data.error || "Analysis Failed");
                }
            }
        } catch (err) {
            console.error(err);
            toast.dismiss(loadingToast);
            toast.error("Analysis failed", { description: "Please check network." });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setFileStats(null);
        setResult(null);
    };

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'High': return 'text-red-500 bg-red-50 border-red-100';
            case 'Medium': return 'text-orange-500 bg-orange-50 border-orange-100';
            case 'Low': return 'text-green-500 bg-green-50 border-green-100';
            default: return 'text-gray-500 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-gradient-to-r from-indigo-700 to-purple-800 pt-8 pb-16 px-6 shadow-2xl rounded-b-[3rem]"
            >
                <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors"
                    >
                        <AlertTriangle className="w-5 h-5 rotate-180" /> {/* Back icon hack or use Lucide ArrowLeft if imported */}
                        <span className="font-semibold">Back to Home</span>
                    </button>
                    <div className="flex items-center gap-6">
                        <div className="bg-white/10 px-4 py-2 rounded-xl text-indigo-100 font-medium border border-white/10">
                            {credits} Credits Left
                        </div>
                        <button
                            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-all font-semibold"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">PlainNow</h1>
                    <p className="text-indigo-200 mt-2 text-lg font-medium">AI-Powered Legal Document Assistant</p>
                </div>
            </motion.div>

            <div className="flex-1 max-w-4xl mx-auto w-full p-6 -mt-12 space-y-8">
                {/* Upload Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 text-center relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                    {!result && (
                        <div className="flex justify-center mb-8 bg-gray-100 p-1 rounded-xl w-fit mx-auto">
                            <button
                                onClick={() => setInputMode('file')}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${inputMode === 'file' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => setInputMode('text')}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${inputMode === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Paste Text
                            </button>
                        </div>
                    )}

                    {inputMode === 'file' ? (
                        /* File Upload UI */
                        <>
                            {fileStats ? (
                                <div className="max-w-md mx-auto relative group-preview">
                                    <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-sm mb-6">
                                        <img src={fileStats.preview} alt="Upload Preview" className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-preview-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={handleRemoveFile}
                                                className="bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                                            >
                                                <AlertTriangle className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-left mb-6 px-2">
                                        <div>
                                            <p className="font-bold text-gray-900 truncate max-w-[200px]">{fileStats.name}</p>
                                            <p className="text-sm text-gray-500">{fileStats.size}</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveFile}
                                            className="text-red-500 hover:text-red-600 text-sm font-bold underline"
                                        >
                                            Change File
                                        </button>
                                    </div>
                                    {!result && (
                                        <button
                                            onClick={() => handleAnalyze(null)}
                                            disabled={loading}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : "Analyze File"}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                !result && (
                                    <>
                                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="w-12 h-12 text-indigo-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Document</h2>
                                        <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">
                                            Upload contracts, letters, or agreements.
                                        </p>
                                        <div className="relative inline-block w-full max-w-xs">
                                            <input
                                                type="file"
                                                onChange={handleFileUpload}
                                                disabled={loading}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-3">
                                                <Upload className="w-6 h-6" /> Select File
                                            </button>
                                        </div>
                                    </>
                                )
                            )}
                        </>
                    ) : (
                        /* Text Input UI */
                        !result && (
                            <div className="max-w-xl mx-auto">
                                <textarea
                                    className="w-full h-64 p-4 rounded-2xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all resize-none text-lg"
                                    placeholder="Paste your legal text here..."
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                ></textarea>
                                <button
                                    onClick={() => handleAnalyze(null)}
                                    disabled={loading || !textInput.trim()}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : "Analyze Text"}
                                </button>
                            </div>
                        )
                    )}

                    {/* Result Actions */}
                    {result && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => { setResult(null); setFileStats(null); setTextInput(''); }}
                                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl"
                            >
                                Analyze New Document
                            </button>
                        </div>
                    )}

                </motion.div>

                {/* Results Card ... (rest is the same) */}

                {/* Results Card */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-10 shadow-2xl border border-gray-100/50"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3 pb-6 border-b border-gray-100">
                                <ShieldCheck className="w-8 h-8 text-indigo-600" />
                                Analysis Report
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8 mb-10">
                                <div className={`col-span-1 p-6 rounded-2xl border ${getRiskColor(result.riskLevel)}`}>
                                    <p className="text-current text-sm font-bold uppercase mb-2">Overall Risk</p>
                                    <p className="text-4xl font-extrabold text-current flex items-center gap-2">
                                        {result.riskLevel}
                                        {result.riskLevel === 'High' && <AlertTriangle className="w-8 h-8" />}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-400 text-xs font-bold uppercase mb-3 px-1">Summary</p>
                                    <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                        {result.meaning}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-gray-400 text-xs font-bold uppercase mb-6 px-1">Recommended Actions</p>
                                <div className="grid gap-4">
                                    {result.actions.map((action, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-start gap-4 bg-indigo-50/50 hover:bg-indigo-50 p-5 rounded-2xl border border-indigo-100 transition-colors"
                                        >
                                            <div className="bg-white p-2 rounded-full shadow-sm mt-0.5">
                                                <CheckCircle className="w-5 h-5 text-indigo-600" />
                                            </div>
                                            <span className="text-gray-800 font-medium text-lg">{action}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
