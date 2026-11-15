import React from 'react';
import { Heart, ShieldCheck, AlertCircle, PhoneCall, Calendar, Activity, User, Bell, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AdherenceCalendar } from './AdherenceCalendar';
import { EscalationLogs } from './EscalationLogs';
import { calculateAdherenceMetrics } from '../../utils/adherenceCalculator';

export const FamilyDashboard: React.FC = () => {
  const {
    patient,
    vitals,
    appointments,
    adherenceLogs,
    caretakerNotes,
    setNotificationDrawerOpen
  } = useApp();

  const metrics = calculateAdherenceMetrics(adherenceLogs);
  const latestVital = vitals[0];
  const latestNote = caretakerNotes[0];
  const nextAppt = appointments[0];

  const hasHighRisk = metrics.riskStatus === 'High Risk' || latestVital?.status === 'critical';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-left">
      
      {/* Hero Family Oversight Card */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-950 border border-indigo-700 px-3 py-1 rounded-full text-xs font-bold text-indigo-300 mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Family Caregiver Portal • Daughter Priya Sharma</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Health Status: {patient.fullName} (Father, 76y)
          </h2>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
            Real-time remote monitoring dashboard with automated missed dose escalation, vitals telemetry, and direct caregiver communication.
          </p>
        </div>

        {/* Big Health Status Badge */}
        <div className="flex-shrink-0 bg-white/10 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-center min-w-[200px]">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-1">
            Current Overall Status
          </div>
          <div className="flex items-center justify-center gap-2 text-2xl font-black text-emerald-400">
            {!hasHighRisk ? (
              <>
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                <span>Doing Great</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-7 h-7 text-rose-400" />
                <span className="text-rose-400">Needs Attention</span>
              </>
            )}
          </div>
          <div className="text-xs text-indigo-200 font-semibold mt-1">
            {metrics.percentage}% Medication Adherence
          </div>
        </div>
      </div>

      {/* Quick Contacts Bar for Family */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Day Caregiver Contact */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">Primary Caregiver</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {patient.caretakerContact.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {patient.caretakerContact.phone}
              </div>
            </div>
          </div>
          <a
            href={`tel:${patient.caretakerContact.phone}`}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            title="Call Caregiver"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        {/* Primary Doctor */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">Treating Physician</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {patient.doctorContact.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                {patient.doctorContact.phone}
              </div>
            </div>
          </div>
          <a
            href={`tel:${patient.doctorContact.phone}`}
            className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm"
            title="Call Doctor"
          >
            <PhoneCall className="w-4 h-4" />
          </a>
        </div>

        {/* Automated Escalation Drawer Trigger */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-bold">Escalation Engine</div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                Live Alert Engine
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                SMS & WhatsApp loop
              </div>
            </div>
          </div>
          <button
            onClick={() => setNotificationDrawerOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
          >
            View Feed
          </button>
        </div>

      </div>

      {/* Latest Vitals & Caregiver Handover Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Caregiver Latest Handover Observation */}
        {latestNote && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>Caregiver Handover Note</span>
              </h4>
              <span className="text-xs text-slate-500 font-mono">{latestNote.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Mood: {latestNote.mood}
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                Sleep: {latestNote.sleepHours} hrs
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                Meals: {latestNote.dietIntake}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
              &quot;{latestNote.observations}&quot;
            </p>
          </div>
        )}

        {/* Next Doctor Visit Countdown Card */}
        {nextAppt && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-black text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Next Scheduled Doctor Visit</span>
              </h4>
              <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-black">
                {nextAppt.countdownDays} Days Countdown
              </span>
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-white">
                {nextAppt.doctorName}
              </div>
              <div className="text-xs text-slate-500 font-bold">
                {nextAppt.specialty} • {nextAppt.hospitalName}
              </div>
              <div className="text-xs text-sky-700 dark:text-sky-400 mt-1 font-semibold">
                📅 {new Date(nextAppt.appointmentDateTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div className="text-xs bg-sky-50 dark:bg-sky-950/40 p-3 rounded-2xl border border-sky-200 dark:border-sky-900 text-slate-700 dark:text-slate-300">
              <strong>Checklist:</strong> {nextAppt.preparationNotes[0]}
            </div>
          </div>
        )}

      </div>

      {/* 7-Day Adherence Calendar */}
      <AdherenceCalendar />

      {/* Real-time Automated Escalation Audit Trail */}
      <EscalationLogs />

    </div>
  );
};

