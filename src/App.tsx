import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AccessibilityBar } from './components/common/AccessibilityBar';
import { Header } from './components/common/Header';
import { PinModal } from './components/common/PinModal';
import { NotificationCenter } from './components/common/NotificationCenter';
import { EmergencySosModal } from './components/common/EmergencySosModal';
import { ElderDashboard } from './components/elder/ElderDashboard';
import { CaretakerDashboard } from './components/caretaker/CaretakerDashboard';
import { FamilyDashboard } from './components/family/FamilyDashboard';
import { ShieldCheck, Heart, Sparkles, AlertCircle } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { role, accessibility } = useApp();

  const fontSizeClass =
    accessibility.fontSize === 'huge'
      ? 'text-lg sm:text-xl [&_h1]:text-4xl [&_h2]:text-3xl [&_h3]:text-2xl [&_button]:text-lg'
      : accessibility.fontSize === 'large'
      ? 'text-base sm:text-lg [&_h1]:text-3xl [&_h2]:text-2xl [&_h3]:text-xl'
      : 'text-sm sm:text-base';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all ${fontSizeClass}`}>
      
      {/* Top Senior Accessibility Control Bar */}
      <AccessibilityBar />

      {/* Main Brand & Role Header */}
      <Header />

      {/* Dynamic Content by Role */}
      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
        {role === 'elder' && <ElderDashboard />}
        {role === 'caretaker' && <CaretakerDashboard />}
        {role === 'family' && <FamilyDashboard />}
      </main>

      {/* Modern Hackathon Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-emerald-600 dark:text-emerald-400 text-base">आर्यू</span>
            <span className="font-black text-slate-800 dark:text-slate-200 text-sm">केयर (AayuCare)</span>
            <span className="text-slate-400">• Smart Elderly Health & Medication Hub</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Built-in Drug Conflict Matrix
            </span>
            <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
              <Heart className="w-3.5 h-3.5" /> 3-Role Care Ecosystem
            </span>
            <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
              <Sparkles className="w-3.5 h-3.5" /> WCAG AAA Accessible
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Hackathon Submission: Elderly Care & Medication Management Platform
          </div>
        </div>
      </footer>

      {/* Global Modals & Overlay Drawers */}
      <PinModal />
      <NotificationCenter />
      <EmergencySosModal />

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
