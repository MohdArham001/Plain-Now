
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowRight, Shield, Lock, Trash2, PlayCircle } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    const handleStart = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
            {/* Header */}
            <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-auto md:h-20 flex flex-col md:flex-row items-center justify-between py-4 md:py-0">
                    <div className="w-full md:w-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <div className="bg-indigo-600 p-2 rounded-lg">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-gray-900">PlainNow</span>
                        </div>
                        {/* Mobile Menu Button can go here if needed, for now we stack simpler */}
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => navigate('/')}>Home</a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => navigate('/how-it-works')}>How it Works</a>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600" onClick={() => navigate('/pricing')}>Pricing</a>
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={handleStart}
                            className="bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all hover:shadow-lg"
                        >
                            {isLoggedIn ? 'Go to Dashboard' : 'Start for Free'}
                        </button>
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all"
                            >
                                Logout
                            </button>
                        )}
                        {!isLoggedIn && (
                            <button
                                onClick={() => navigate('/auth')}
                                className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 transition-all"
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="pt-32 pb-16 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mb-8 shadow-sm"
                    >
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold tracking-wide text-indigo-600 uppercase">AI-Powered Clarity</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8"
                    >
                        Understand confusing <br className="hidden md:block" />
                        documents in <span className="text-indigo-600 bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">seconds.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-base md:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
                    >
                        We translate complex bank, college, insurance, and government letters into simple language and clear next steps.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 px-4"
                    >
                        <button
                            onClick={handleStart}
                            className="w-full sm:w-auto bg-indigo-600 text-white h-12 md:h-14 px-8 rounded-full font-bold text-base md:text-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                        >
                            <span>Explain a Document</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => navigate('/how-it-works')}
                            className="w-full sm:w-auto bg-white text-gray-700 h-12 md:h-14 px-8 rounded-full font-bold text-base md:text-lg hover:bg-gray-50 border border-gray-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-sm group">
                            <span>See How It Works</span>
                            <PlayCircle className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </button>
                    </motion.div>

                    {/* Trust Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 md:gap-16 border-t border-gray-100 pt-10"
                    >
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Shield className="w-5 h-5 text-green-500" />
                            <span>Privacy-first</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Lock className="w-5 h-5 text-green-500" />
                            <span>Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 font-medium">
                            <Trash2 className="w-5 h-5 text-green-500" />
                            <span>Auto-deleted</span>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
