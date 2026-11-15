import React from 'react';
import { Shield, Bell, AlertTriangle, UserCheck, Stethoscope, HeartHandshake, PhoneCall, Bot, Lock } from 'lucide-react';
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

  const rolesConfig: { id: Role; label: string; icon: React.ReactNode; pinRequired: boolean }[] = [
    {
      id: 'elder',
      label: '👵 Elder View',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      pinRequired: false
    },
    {
      id: 'caretaker',
      label: '🩺 Caretaker',
      icon: <Stethoscope className="w-3.5 h-3.5" />,
      pinRequired: true
    },
    {
      id: 'family',
      label: '👨‍👩‍👧 Family',
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
      pinRequired: true
    }
  ];

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Left Header */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-serif mr-1">आर्यू</span> केयर
                  <span className="text-slate-400 font-light text-sm ml-1.5 hidden sm:inline">| AayuCare</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none">
                {isHindi ? 'स्मार्ट वरिष्ठ स्वास्थ्य एवं दवा हब' : 'Smart Elderly Health & Medication Hub'}
              </p>
            </div>
          </div>

          {/* Mobile Right: Assistant, SOS & Alert Bell */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => setAssistantModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold shadow-sm"
              title="AayuMitra AI Assistant"
              aria-label="Open AayuMitra AI Health Assistant"
            >
              <Bot className="w-4 h-4" />
            </button>

            <button
              onClick={triggerSos}
              className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm active:scale-95 animate-pulse"
              title="Emergency SOS"
              aria-label="Trigger Emergency SOS alert"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            <button
              onClick={() => setNotificationDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              title="View Alerts"
              aria-label="View notifications and carrier alerts"
            >
              <Bell className="w-4 h-4" />
              {activeNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                  {activeNotificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Center: Clean Role Switcher (Zero Scrollbars, No Overflow) */}
        <div className="w-full md:w-auto flex justify-center">
          <nav 
            aria-label="Role View Switcher" 
            className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner max-w-full overflow-x-hidden"
          >
            {rolesConfig.map((r) => {
              const isActive = role === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => requestRoleSwitch(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{r.label}</span>
                  {r.pinRequired && (
                    <Lock className={`w-3 h-3 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Desktop Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* AayuMitra Smart Assistant Trigger */}
          <button
            onClick={() => setAssistantModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-sm transition-transform active:scale-95"
            title="Open Context-Aware AI Health Assistant"
            aria-label="Open AayuMitra AI Health Assistant"
          >
            <Bot className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span>AayuMitra AI</span>
          </button>

          {/* Patient Quick Pill */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-emerald-200 dark:bg-emerald-800 flex items-center justify-center text-emerald-800 dark:text-emerald-200 font-bold text-[11px]">
              RP
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                {patient.fullName}
              </p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                {patient.age}y • {patient.bloodGroup}
              </p>
            </div>
          </div>

          {/* Live Notification Trigger Bell */}
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Open Automated Escalation Logs"
            aria-label="View automated family escalation logs"
          >
            <Bell className="w-4 h-4" />
            {activeNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow">
                {activeNotificationCount}
              </span>
            )}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={triggerSos}
            className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-transform active:scale-95 animate-pulse"
            title="Trigger Emergency SOS with Siren & GPS Escalation"
            aria-label="Trigger Emergency SOS siren and family broadcast"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>SOS</span>
          </button>
        </div>

      </div>
    </header>
  );
};
