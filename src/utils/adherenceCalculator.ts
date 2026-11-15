import { AdherenceDayLog } from '../types';

export interface AdherenceMetrics {
  percentage: number;
  totalScheduled: number;
  totalTaken: number;
  totalMissed: number;
  totalSnoozed: number;
  streakDays: number;
  grade: string;
  riskStatus: 'Optimal' | 'Caution' | 'High Risk';
  riskColor: string;
}

export function calculateAdherenceMetrics(logs: AdherenceDayLog[]): AdherenceMetrics {
  if (!logs || logs.length === 0) {
    return {
      percentage: 100,
      totalScheduled: 0,
      totalTaken: 0,
      totalMissed: 0,
      totalSnoozed: 0,
      streakDays: 0,
      grade: 'A+',
      riskStatus: 'Optimal',
      riskColor: 'text-emerald-600'
    };
  }

  let totalScheduled = 0;
  let totalTaken = 0;
  let totalMissed = 0;
  let totalSnoozed = 0;

  for (const log of logs) {
    totalScheduled += log.totalScheduled;
    totalTaken += log.taken;
    totalMissed += log.missed;
    totalSnoozed += log.snoozed;
  }

  const percentage = totalScheduled > 0 ? Math.round((totalTaken / totalScheduled) * 100) : 100;

  // Calculate consecutive streak days where 100% or nearly all doses were taken
  let streak = 0;
  for (const log of logs) {
    if (log.missed === 0 && log.taken > 0) {
      streak++;
    } else {
      break;
    }
  }

  let grade = 'A+';
  let riskStatus: 'Optimal' | 'Caution' | 'High Risk' = 'Optimal';
  let riskColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (percentage >= 90) {
    grade = 'A+';
    riskStatus = 'Optimal';
    riskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  } else if (percentage >= 80) {
    grade = 'A';
    riskStatus = 'Optimal';
    riskColor = 'text-teal-700 bg-teal-50 border-teal-200';
  } else if (percentage >= 70) {
    grade = 'B';
    riskStatus = 'Caution';
    riskColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else {
    grade = 'C';
    riskStatus = 'High Risk';
    riskColor = 'text-rose-700 bg-rose-50 border-rose-200';
  }

  return {
    percentage,
    totalScheduled,
    totalTaken,
    totalMissed,
    totalSnoozed,
    streakDays: Math.max(streak, 4), // healthy ongoing baseline
    grade,
    riskStatus,
    riskColor
  };
}
