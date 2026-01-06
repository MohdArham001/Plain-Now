import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { API_BASE_URL } from '../config';

const API_URL = API_BASE_URL + '/auth';


export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Auto-redirect if already logged in
    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleAuth = async () => {
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const endpoint = isLogin ? '/login' : '/register';
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            let data;
            const textResponse = await response.text();
            try {
                data = JSON.parse(textResponse);
            } catch (e) {
                console.error("Failed to parse response:", textResponse);
                throw new Error("Server returned non-JSON response: " + response.status);
            }

            if (!response.ok) {
                toast.error(data.error || 'Authentication failed');
            } else {
                localStorage.setItem('user_email', data.user.email);
                localStorage.setItem('token', data.token);
                localStorage.setItem('credits', (data.user.credits ?? 0).toString());
                toast.success(`Welcome ${data.user.email}`);
                navigate('/dashboard');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Network Error: Ensure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <motion.h1
                        className="text-4xl font-extrabold text-white mb-2 tracking-tighter"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        PlainNow
                    </motion.h1>
                    <p className="text-base font-medium text-indigo-100 opacity-90">
                        Make Documents Simple Again
                    </p>
                </div>

                <motion.div
                    layout
                    className="bg-white/90 rounded-2xl p-1 mb-6 flex relative"
                >
                    <motion.div
                        className="absolute h-full w-1/2 bg-indigo-600 rounded-xl top-0 left-0"
                        animate={{ x: isLogin ? 0 : '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-500'}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${!isLogin ? 'text-white' : 'text-gray-500'}`}
                    >
                        Sign Up
                    </button>
                </motion.div>

                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/80 border border-white/20 p-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/80 border border-white/20 p-4 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAuth}
                        disabled={loading}
                        className={`w-full p-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 ${loading
                            ? 'bg-indigo-400 text-white cursor-not-allowed'
                            : 'bg-white text-indigo-600 hover:bg-gray-50'
                            }`}
                    >
                        {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                        {loading ? 'Processing...' : isLogin ? 'Login To Dashboard' : 'Create Account'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
