import { describe, it, expect } from 'vitest';
import { classifyVitals, sanitizeInput } from '../utils/sanitizer';

describe('AayuCare Clinical Telemetry & Security Utilities', () => {
  it('should classify critical hypertension correctly', () => {
    expect(classifyVitals(165, 102, 110)).toBe('critical');
    expect(classifyVitals(120, 80, 240)).toBe('critical');
  });

  it('should classify warning stage hypertension correctly', () => {
    expect(classifyVitals(145, 92, 115)).toBe('warning');
    expect(classifyVitals(125, 80, 165)).toBe('warning');
  });

  it('should classify standard healthy geriatric vitals as normal', () => {
    expect(classifyVitals(122, 78, 110)).toBe('normal');
  });

  it('should strip dangerous XSS scripts and angle brackets from input strings', () => {
    const malicious = '<script>alert("hacked")</script>Ram Prasad';
    const cleaned = sanitizeInput(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('</script>');
    expect(cleaned).toContain('Ram Prasad');
  });
});
