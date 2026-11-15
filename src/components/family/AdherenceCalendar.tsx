import React from 'react';
import { Calendar, CheckCircle2, XCircle, Clock, Award, ShieldAlert, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateAdherenceMetrics } from '../../utils/adherenceCalculator';

export const AdherenceCalendar: React.FC = () => {
  const { adherenceLogs } = useApp();
  const metrics = calculateAdherenceMetrics(adherenceLogs);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 flex items-center justify-center font-bold">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              7-Day Medication Compliance & Adherence History
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified daily logs with missed dose escalation tracking
            </p>
          </div>
        </div>

        {/* Adherence Grade Pill */}
        <div className={`px-4 py-2 rounded-2xl border font-black text-xs sm:text-sm flex items-center gap-2 ${metrics.riskColor}`}>
          <Award className="w-4 h-4" />
          <span>Compliance Grade: {metrics.grade} ({metrics.percentage}%)</span>
        </div>
      </div>

      {/* 7-Day Visual Day Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {adherenceLogs.map((log) => {
          const isFull = log.missed === 0 && log.snoozed === 0;
          const hasMissed = log.missed > 0;
          const complianceDayPct = Math.round((log.taken / (log.totalScheduled || 1)) * 100);

          return (
            <div
              key={log.date}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                hasMissed
                  ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900'
                  : isFull
                  ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1">
                {log.dayOfWeek}
              </div>
              <div className="text-xs font-mono text-slate-400 mb-2">
                {log.date.split('-').slice(1).join('/')}
              </div>

              {/* Progress Icon */}
              <div className="my-2 flex justify-center">
                {hasMissed ? (
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    <XCircle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="text-sm font-black text-slate-800 dark:text-slate-100">
                {log.taken}/{log.totalScheduled}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                {complianceDayPct}% Taken
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Metric Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.totalTaken} / {metrics.totalScheduled}
            </div>
            <div className="text-xs text-slate-500">Total Doses Administered</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.totalMissed} Doses
            </div>
            <div className="text-xs text-slate-500">Total Missed (All Escalated)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {metrics.streakDays} Days
            </div>
            <div className="text-xs text-slate-500">Active Medication Streak</div>
          </div>
        </div>
      </div>

    </div>
  );
};
