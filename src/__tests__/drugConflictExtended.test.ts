import { describe, it, expect } from 'vitest';
import { checkDrugConflicts } from '../utils/conflictDetector';
import { INITIAL_MEDICATIONS } from '../data/dataset';

describe('AayuCare Advanced Polypharmacy Conflict Matrix', () => {
  it('should detect HIGH risk between Statin (Atorva) and Macrolide Antibiotic (Clarithromycin)', () => {
    const proposed = {
      name: 'Biaxin',
      activeIngredient: 'Clarithromycin'
    };

    const conflicts = checkDrugConflicts(proposed, INITIAL_MEDICATIONS);
    const statinConflict = conflicts.find(c => c.rule.id === 'rule-statin-macrolide');

    expect(statinConflict).toBeDefined();
    expect(statinConflict?.rule.severity).toBe('HIGH');
  });

  it('should detect HIGH risk between Metformin and Iodinated CT Contrast', () => {
    const proposed = {
      name: 'Omnipaque',
      activeIngredient: 'Iodinated Contrast'
    };

    const conflicts = checkDrugConflicts(proposed, INITIAL_MEDICATIONS);
    const contrastConflict = conflicts.find(c => c.rule.id === 'rule-metformin-contrast');

    expect(contrastConflict).toBeDefined();
    expect(contrastConflict?.rule.severity).toBe('HIGH');
  });

  it('should detect MODERATE risk between Levothyroxine and Calcium supplements', () => {
    // Patient already has Shelcal (Calcium Carbonate) in active inventory
    const proposed = {
      name: 'Thyronorm',
      activeIngredient: 'Levothyroxine'
    };

    const conflicts = checkDrugConflicts(proposed, INITIAL_MEDICATIONS);
    const thyroidConflict = conflicts.find(c => c.rule.id === 'rule-thyroid-calcium');

    expect(thyroidConflict).toBeDefined();
    expect(thyroidConflict?.rule.severity).toBe('MODERATE');
  });
});
