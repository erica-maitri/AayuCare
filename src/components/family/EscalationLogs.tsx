import React, { useState } from 'react';
import { Bell, MessageSquare, AlertTriangle, ShieldCheck, CheckCheck, RefreshCw, Send, PhoneCall } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EscalationLog } from '../../types';

export const EscalationLogs: React.FC = () => {
  const { escalations, setNotificationDrawerOpen } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'MISSED_DOSE' | 'CRITICAL_VITAL' | 'EMERGENCY_SOS' | 'REFILL_ALERT'>('ALL');

  const filtered = escalations.filter(e => (filter === 'ALL' ? true : e.type === filter));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 flex items-center justify-center font-bold">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Automated Family Alert & Escalation Feed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Audit trail of simulated SMS & WhatsApp transmissions dispatched to family members
            </p>
          </div>
        </div>

        <button
          onClick={() => setNotificationDrawerOpen(true)}
          className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
        >
          Open Live Simulation Tool
        </button>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2 text-xs font-bold">
        {[
          { id: 'ALL', label: 'All Alerts' },
          { id: 'MISSED_DOSE', label: '⚠️ Missed Doses' },
          { id: 'CRITICAL_VITAL', label: '🩺 Critical Vitals' },
          { id: 'EMERGENCY_SOS', label: '🚨 Emergency SOS' },
          { id: 'REFILL_ALERT', label: '💊 Pharmacy Refills' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs Table / Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-50" />
            <p className="text-sm font-semibold">No logs found under this filter category.</p>
          </div>
        ) : (
          filtered.map(esc => {
            const isEmergency = esc.type === 'EMERGENCY_SOS';
            const isMissed = esc.type === 'MISSED_DOSE';
            const isVital = esc.type === 'CRITICAL_VITAL';

            return (
              <div
                key={esc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isEmergency
                    ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-sm'
                    : isMissed
                    ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
                    : isVital
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {esc.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      To: {esc.recipientName} ({esc.recipientContact})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200">
                      via {esc.channel}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {esc.timestamp}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {esc.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Carrier Network: Airtel / Jio Enterprise SMS Gateway</span>
                  <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{esc.status}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

