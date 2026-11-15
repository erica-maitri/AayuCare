import React from 'react';
import { X, MessageSquare, PhoneCall, AlertTriangle, Pill, ShieldCheck, CheckCheck, RefreshCw, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { soundEffects } from '../../utils/sound';

export const NotificationCenter: React.FC = () => {
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    escalations,
    addEscalation,
    patient,
    accessibility
  } = useApp();

  if (!notificationDrawerOpen) return null;

  const isHindi = accessibility.language === 'hi';

  const simulateMissedDose = () => {
    soundEffects.playWarningBuzz();
    addEscalation({
      type: 'MISSED_DOSE',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Missed Dose Escalation] ⚠️ Ram Prasad Sharma missed scheduled Afternoon dose (Ecosprin 75mg) at 01:30 PM. Caregiver Ramesh pinged.`,
      status: 'SENT'
    });
  };

  const simulateCriticalBP = () => {
    soundEffects.playWarningBuzz();
    addEscalation({
      type: 'CRITICAL_VITAL',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'WHATSAPP',
      message: `[AayuCare Urgent Vitals] High Blood Pressure detected: 156/98 mmHg. Resting posture advised. Caregiver dispatched to monitor.`,
      status: 'DELIVERED'
    });
  };

  const simulateRefillAlert = () => {
    soundEffects.playReminderChime();
    addEscalation({
      type: 'REFILL_ALERT',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Pharmacy Sync] Telma 40 supply low (4 days left). One-click refill initiated on Apollo 24/7 / Tata 1mg.`,
      status: 'SENT'
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isHindi ? 'स्वचालित सूचना केंद्र (Escalations)' : 'Automated Alert & Escalation Hub'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isHindi ? 'परिवार व देखभालकर्ता को भेजे गए लाइव संदेश' : 'Real-time SMS & WhatsApp alerts dispatched to family'}
              </p>
            </div>
            <button
              onClick={() => setNotificationDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Simulation Bar for Hackathon Judges */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/60">
            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5" />
              <span>Simulate Real-Time Engine Triggers:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={simulateMissedDose}
                className="text-xs font-semibold px-2.5 py-1.5 bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-lg shadow-sm hover:bg-rose-50"
              >
                + Missed Dose SMS
              </button>
              <button
                onClick={simulateCriticalBP}
                className="text-xs font-semibold px-2.5 py-1.5 bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-lg shadow-sm hover:bg-amber-50"
              >
                + High BP WhatsApp
              </button>
              <button
                onClick={simulateRefillAlert}
                className="text-xs font-semibold px-2.5 py-1.5 bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-900 rounded-lg shadow-sm hover:bg-teal-50"
              >
                + Pharmacy Refill
              </button>
            </div>
          </div>

          {/* Alert Stream List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {escalations.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500 mb-2 opacity-50" />
                <p className="text-sm font-semibold">No active escalations logged.</p>
              </div>
            ) : (
              escalations.map((esc) => {
                const isEmergency = esc.type === 'EMERGENCY_SOS';
                const isMissed = esc.type === 'MISSED_DOSE';
                const isVital = esc.type === 'CRITICAL_VITAL';
                const isRefill = esc.type === 'REFILL_ALERT';

                return (
                  <div
                    key={esc.id}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isEmergency
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 shadow-md ring-2 ring-rose-400'
                        : isMissed
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900'
                        : isVital
                        ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                        : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {isEmergency && <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />}
                        {isMissed && <Pill className="w-4 h-4 text-amber-600" />}
                        {isVital && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                        {isRefill && <RefreshCw className="w-4 h-4 text-teal-600" />}
                        <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
                          {esc.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                        {esc.timestamp}
                      </span>
                    </div>

                    {/* Content Message */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-2.5">
                      {esc.message}
                    </p>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">To:</span>
                        <span>{esc.recipientName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800">
                          {esc.channel}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px]">
                          <CheckCheck className="w-3.5 h-3.5" /> {esc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500 text-center">
            Automated family loop active for <strong>{patient.fullName}</strong>.
          </div>

        </div>
      </div>
    </div>
  );
};
