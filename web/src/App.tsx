import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Landing from './pages/Landing';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';

function App() {
    return (
        <BrowserRouter>
            <Toaster position="top-center" richColors />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/pricing" element={<Pricing />} />
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
