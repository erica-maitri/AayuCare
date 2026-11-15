import { Medication, DrugConflictAlert, DrugConflictRule } from '../types';
import { DRUG_CONFLICT_RULES, DRUG_CLASSIFICATION_MAP } from '../data/drugConflictMatrix';

/**
 * Normalizes drug names and resolves them against classification maps.
 */
function resolveDrugClasses(drugNameOrIngredient: string): string[] {
  const query = drugNameOrIngredient.toLowerCase().trim();
  const classes: Set<string> = new Set();

  // Direct match to classification map
  for (const [className, synonyms] of Object.entries(DRUG_CLASSIFICATION_MAP)) {
    if (className.toLowerCase() === query) {
      classes.add(className);
    }
    for (const syn of synonyms) {
      if (query.includes(syn) || syn.includes(query)) {
        classes.add(className);
      }
    }
  }

  // Also add the query itself
  classes.add(query);
  return Array.from(classes);
}

/**
 * Evaluates whether a proposed medication conflicts with existing active patient medications.
 */
export function checkDrugConflicts(
  proposed: { name: string; activeIngredient: string },
  existingMedications: Medication[]
): DrugConflictAlert[] {
  const alerts: DrugConflictAlert[] = [];
  const proposedClasses = [
    ...resolveDrugClasses(proposed.name),
    ...resolveDrugClasses(proposed.activeIngredient)
  ];

  for (const existing of existingMedications) {
    const existingClasses = [
      ...resolveDrugClasses(existing.name),
      ...resolveDrugClasses(existing.activeIngredient),
      ...resolveDrugClasses(existing.category)
    ];

    for (const rule of DRUG_CONFLICT_RULES) {
      const ruleA = rule.drugA.toLowerCase();
      const ruleB = rule.drugB.toLowerCase();

      // Check if proposed is drugA and existing is drugB, or vice-versa
      const proposedMatchesA = proposedClasses.some(c => c === ruleA || c.includes(ruleA));
      const existingMatchesB = existingClasses.some(c => c === ruleB || c.includes(ruleB));

      const proposedMatchesB = proposedClasses.some(c => c === ruleB || c.includes(ruleB));
      const existingMatchesA = existingClasses.some(c => c === ruleA || c.includes(ruleA));

      if ((proposedMatchesA && existingMatchesB) || (proposedMatchesB && existingMatchesA)) {
        // Avoid duplicate alerts for the same rule & medication
        const exists = alerts.some(
          a => a.rule.id === rule.id && a.existingMedication.id === existing.id
        );
        if (!exists) {
          alerts.push({
            rule,
            existingMedication: existing,
            proposedMedication: proposed
          });
        }
      }
    }
  }

  // Sort by severity (CRITICAL first, then HIGH, then MODERATE)
  const severityRank: Record<string, number> = { CRITICAL: 1, HIGH: 2, MODERATE: 3 };
  return alerts.sort((a, b) => (severityRank[a.rule.severity] || 99) - (severityRank[b.rule.severity] || 99));
}

