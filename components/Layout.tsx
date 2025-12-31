import React from 'react';
import { ViewState } from '../types';
import { ShieldCheck, FileText, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navClass = (view: ViewState) => 
    `text-sm font-medium transition-colors cursor-pointer ${
      currentView === view ? 'text-brand-600' : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div 
              className="flex items-center cursor-pointer gap-2" 
              onClick={() => onChangeView(ViewState.LANDING)}
            >
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                <FileText size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">PlainNow</span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a onClick={() => onChangeView(ViewState.LANDING)} className={navClass(ViewState.LANDING)}>Home</a>
            </nav>

            {/* CTA Button */}
            <div className="hidden md:flex items-center">
              <button 
                onClick={() => onChangeView(ViewState.INPUT)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-all"
              >
                Start for Free
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 py-4 px-4 space-y-4">
            <a onClick={() => { onChangeView(ViewState.LANDING); setIsMobileMenuOpen(false); }} className="block text-slate-600 font-medium">Home</a>
            <button 
              onClick={() => { onChangeView(ViewState.INPUT); setIsMobileMenuOpen(false); }}
              className="w-full bg-brand-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Start Explaining
            </button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-sm">Privacy-First: No Data Stored</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PlainNow. Not legal advice.
          </p>
        </div>
      </footer>
    </div>
  );
};