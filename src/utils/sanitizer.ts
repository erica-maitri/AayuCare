/**
 * Input sanitization and XSS prevention utility for patient inputs and clinical notes
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Strip angle brackets to prevent script injection
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Validates clinical ranges for geriatric vitals
 */
export function classifyVitals(
  systolic: number,
  diastolic: number,
  sugar: number
): 'normal' | 'warning' | 'critical' {
  if (systolic >= 160 || diastolic >= 100 || sugar >= 220 || systolic < 90) {
    return 'critical';
  }
  if (systolic >= 140 || diastolic >= 90 || sugar >= 150) {
    return 'warning';
  }
  return 'normal';
}
