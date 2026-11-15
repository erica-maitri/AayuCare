import React from 'react';
import { Shield, Bell, AlertTriangle, UserCheck, Stethoscope, HeartHandshake, PhoneCall, Bot, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role } from '../../types';

export const Header: React.FC = () => {
  const {
    role,
    requestRoleSwitch,
    patient,
    activeNotificationCount,
    setNotificationDrawerOpen,
    setAssistantModalOpen,
    triggerSos,
    accessibility
  } = useApp();

  const isHindi = accessibility.language === 'hi';

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode; badge: string; pinRequired: boolean }[] = [
    {
      id: 'elder',
      label: isHindi ? '👵 बुजुर्ग मोड (Elder)' : '👵 Elder Mode',
      icon: <UserCheck className="w-4 h-4" />,
      badge: 'Zero Barriers',
      pinRequired: false
    },
    {
      id: 'caretaker',
      label: isHindi ? '🩺 देखभालकर्ता (Caretaker)' : '🩺 Caretaker Mode',
      icon: <Stethoscope className="w-4 h-4" />,
      badge: 'PIN: 1234',
      pinRequired: true
    },
    {
      id: 'family',
      label: isHindi ? '👨‍👩‍👧 परिवार (Family)' : '👨‍👩‍👧 Family Mode',
      icon: <HeartHandshake className="w-4 h-4" />,
      badge: 'PIN: 1234',
      pinRequired: true
    }
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Patient Header */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span className="text-emerald-600 dark:text-emerald-400 font-serif">आर्यू</span> केयर
                  <span className="text-slate-400 font-light text-base hidden sm:inline">| AayuCare</span>
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {isHindi ? 'स्मार्ट वरिष्ठ स्वास्थ्य एवं दवा प्रबंधन हब' : 'Smart Elderly Health & Medication Hub'}
              </p>
            </div>
          </div>

          {/* Mobile Right: Assistant, SOS & Notification Quick Buttons */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setAssistantModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-lg text-xs font-bold flex items-center shadow-sm"
              title="AayuMitra AI Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>

            <button
              onClick={triggerSos}
              className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 animate-pulse"
              title="Emergency SOS"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              title="View Alerts"
            >
              <Bell className="w-5 h-5" />
              {activeNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {activeNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Interactive Role Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner w-full md:w-auto justify-center overflow-x-auto">
          {rolesConfig.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => requestRoleSwitch(r.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-md ring-1 ring-slate-200 dark:ring-slate-600'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{r.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Desktop: Assistant, Patient Pill, Notification Bell & SOS */}
        <div className="hidden md:flex items-center gap-3">
          {/* AayuMitra Smart Assistant Trigger */}
          <button
            onClick={() => setAssistantModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-600/20 transition-transform active:scale-95"
            title="Open Context-Aware AI Health Assistant"
          >
            <Bot className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>{isHindi ? 'आर्यू मित्र AI' : 'AayuMitra AI'}</span>
          </button>

          {/* Patient Quick Pill */}
          <div className="flex items-center gap-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-bold text-xs">
              RP
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {patient.fullName}
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                {patient.age} yrs • {patient.bloodGroup} • T2D / BP
              </p>
            </div>
          </div>

          {/* Live Notification Trigger Bell */}
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Open Automated Escalation Logs"
          >
            <Bell className="w-5 h-5" />
            {activeNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                {activeNotificationCount}
              </span>
            )}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={triggerSos}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95 animate-pulse"
            title="Trigger Emergency SOS with Siren & GPS Escalation"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{isHindi ? 'आपातकालीन SOS' : 'EMERGENCY SOS'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};

