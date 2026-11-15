import { describe, it, expect } from 'vitest';
import { calculateAdherenceMetrics } from '../utils/adherenceCalculator';
import { INITIAL_ADHERENCE_LOGS } from '../data/dataset';

describe('AayuCare Adherence & Compliance Engine', () => {
  it('should calculate accurate 7-day adherence percentage for patient', () => {
    const metrics = calculateAdherenceMetrics(INITIAL_ADHERENCE_LOGS);

    expect(metrics.totalScheduled).toBeGreaterThan(0);
    expect(metrics.totalTaken).toBeGreaterThan(0);
    expect(metrics.percentage).toBeGreaterThanOrEqual(75);
    expect(metrics.percentage).toBeLessThanOrEqual(100);
    expect(['A+', 'A', 'B']).toContain(metrics.grade);
    expect(['Optimal', 'Caution']).toContain(metrics.riskStatus);
  });

  it('should return 100% and Optimal for empty or zero-missed logs', () => {
    const perfectLogs = [
      {
        date: '2026-11-15',
        dayOfWeek: 'Today',
        totalScheduled: 5,
        taken: 5,
        missed: 0,
        snoozed: 0,
        doses: []
      }
    ];

    const metrics = calculateAdherenceMetrics(perfectLogs);
    expect(metrics.percentage).toBe(100);
    expect(metrics.grade).toBe('A+');
    expect(metrics.riskStatus).toBe('Optimal');
  });
});

