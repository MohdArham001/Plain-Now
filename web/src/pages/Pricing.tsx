
import { useNavigate } from 'react-router-dom';
import { Check, X, Zap, FileText } from 'lucide-react';

export default function Pricing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-gray-500 hover:text-indigo-600 font-medium flex items-center gap-1">
                            &larr; Back
                        </span>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-gray-900">PlainNow</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/auth')} className="text-sm font-semibold text-gray-600 hover:text-gray-900">Login</button>
                        <button
                            onClick={() => navigate('/auth')}
                            className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Simple Pricing
                    </h1>
                    <p className="text-xl text-gray-500 max-w-xl mx-auto">
                        Start for free, upgrade for power. No hidden fees.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="border border-gray-200 rounded-3xl p-8 hover:shadow-xl transition-shadow relative">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Basic</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900">$0</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <p className="text-gray-500 mb-8 h-12">Perfect for occasional checks.</p>

                        <button
                            onClick={() => navigate('/auth')}
                            className="w-full bg-gray-50 text-gray-900 font-bold py-3 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors mb-8"
                        >
                            Get Started Free
                        </button>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>5 Document Analyses / day</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                <span>Standard Processing Speed</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <X className="w-5 h-5 shrink-0" />
                                <span>Document History</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400">
                                <X className="w-5 h-5 shrink-0" />
                                <span>Priority Support</span>
                            </div>
                        </div>
                    </div>

                    {/* Pro Plan */}
                    <div className="border-2 border-indigo-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Recommended
                        </div>
                        <h3 className="text-xl font-bold text-indigo-600 mb-2 flex items-center gap-2">
                            <Zap className="w-5 h-5" /> Pro
                        </h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-4xl font-extrabold text-gray-900">$9</span>
                            <span className="text-gray-500">/month</span>
                        </div>
                        <p className="text-gray-500 mb-8 h-12">For power users who need clarity instantly.</p>

                        <button
                            onClick={() => alert("Payment integration coming soon!")}
                            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all hover:shadow-lg shadow-indigo-200 mb-8"
                        >
                            Upgrade to Pro
                        </button>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-900">
                                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span><strong>Unlimited</strong> Analysis</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-900">
                                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span><strong>Fastest</strong> AI Model (Gemini 2.5)</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-900">
                                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>Document History & Search</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-900">
                                <Check className="w-5 h-5 text-indigo-600 shrink-0" />
                                <span>Priority Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
