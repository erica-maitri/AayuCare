import { describe, it, expect } from 'vitest';
import { checkDrugConflicts } from '../utils/conflictDetector';
import { INITIAL_MEDICATIONS } from '../data/dataset';

describe('AayuCare Drug-to-Drug Conflict Detection Engine', () => {
  it('should detect CRITICAL conflict between proposed NSAID (Ibuprofen) and active blood thinner (Ecosprin / Aspirin)', () => {
    const proposed = {
      name: 'Combiflam',
      activeIngredient: 'Ibuprofen'
    };

    const conflicts = checkDrugConflicts(proposed, INITIAL_MEDICATIONS);

    expect(conflicts.length).toBeGreaterThan(0);
    const nsaidConflict = conflicts.find(c => c.rule.drugB === 'nsaid' || c.rule.drugA === 'nsaid' || c.rule.id.includes('nsaid') || c.rule.id.includes('aspirin-ibuprofen'));
    expect(nsaidConflict).toBeDefined();
    expect(nsaidConflict?.existingMedication.activeIngredient.toLowerCase()).toContain('aspirin');
    expect(nsaidConflict?.rule.severity).toBe('CRITICAL');
  });

  it('should detect CRITICAL conflict between proposed Potassium supplement and active ARB (Telmisartan)', () => {
    const proposed = {
      name: 'Potklor Syrup',
      activeIngredient: 'Potassium Chloride'
    };

    const conflicts = checkDrugConflicts(proposed, INITIAL_MEDICATIONS);

    expect(conflicts.length).toBeGreaterThan(0);
    const potassiumConflict = conflicts.find(c => c.rule.id === 'rule-acei-potassium');
    expect(potassiumConflict).toBeDefined();
    expect(potassiumConflict?.rule.severity).toBe('CRITICAL');
    expect(potassiumConflict?.existingMedication.name).toContain('Telma');
  });

  it('should allow safe non-conflicting supplements like Vitamin C without false positives', () => {
    const safeDrug = {
      name: 'Limcee Chewable',
      activeIngredient: 'Ascorbic Acid (Vitamin C)'
    };

    const conflicts = checkDrugConflicts(safeDrug, INITIAL_MEDICATIONS);
    expect(conflicts.length).toBe(0);
  });
});

