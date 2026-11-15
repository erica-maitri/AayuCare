import { DrugConflictRule } from '../types';

export const DRUG_CONFLICT_RULES: DrugConflictRule[] = [
  {
    id: 'rule-nsaid-bloodthinner',
    drugA: 'blood thinner',
    drugB: 'nsaid',
    severity: 'CRITICAL',
    title: 'Severe Bleeding & Hemorrhage Risk',
    description: 'Combining blood thinners (Anticoagulants/Antiplatelets) with NSAIDs significantly amplifies internal bleeding and severe gastrointestinal hemorrhage risk.',
    mechanism: 'NSAIDs inhibit platelet cyclooxygenase (COX-1) and impair mucosal protection in the stomach, while blood thinners reduce clotting cascade efficiency.',
    recommendation: 'DO NOT ADMINISTER. Use Paracetamol (Acetaminophen) for analgesia instead under medical guidance.'
  },
  {
    id: 'rule-acei-potassium',
    drugA: 'ace inhibitor',
    drugB: 'potassium supplement',
    severity: 'CRITICAL',
    title: 'Fatal Hyperkalemia & Cardiac Arrhythmia Risk',
    description: 'Concomitant use of ACE inhibitors or ARBs with potassium supplements or potassium-sparing diuretics may cause toxic serum potassium build-up.',
    mechanism: 'ACE inhibitors decrease aldosterone production, causing renal potassium retention. Exogenous potassium can push levels above 6.0 mEq/L, triggering cardiac arrest.',
    recommendation: 'AVOID COMBINATION. If potassium supplementation is clinically required, monitor serum electrolytes weekly.'
  },
  {
    id: 'rule-metformin-contrast',
    drugA: 'metformin',
    drugB: 'iodinated contrast',
    severity: 'HIGH',
    title: 'Contrast-Induced Nephropathy & Lactic Acidosis',
    description: 'Administration of iodinated radiocontrast agents during CT scans while on Metformin can induce acute kidney injury, precipitating life-threatening lactic acidosis.',
    mechanism: 'Contrast can transiently impair renal clearance, leading to accumulation of Metformin and toxic intracellular lactate spikes.',
    recommendation: 'Withhold Metformin 48 hours prior to contrast imaging and re-evaluate renal eGFR before restarting.'
  },
  {
    id: 'rule-betablocker-ccb',
    drugA: 'beta blocker',
    drugB: 'calcium channel blocker (non-dihydropyridine)',
    severity: 'HIGH',
    title: 'Severe Bradycardia & AV Heart Block',
    description: 'Combining Beta Blockers (e.g. Metoprolol, Atenolol) with non-dihydropyridine CCBs (Verapamil, Diltiazem) causes synergistic myocardial depression.',
    mechanism: 'Dual negative chronotropic and dromotropic actions suppress sinoatrial and atrioventricular nodal conduction.',
    recommendation: 'Requires cardiologist clearance. Monitor ECG and resting heart rate closely; avoid co-administration.'
  },
  {
    id: 'rule-statin-macrolide',
    drugA: 'statin',
    drugB: 'macrolide antibiotic',
    severity: 'HIGH',
    title: 'Rhabdomyolysis & Acute Kidney Injury',
    description: 'Macrolide antibiotics (Clarithromycin, Erythromycin) strongly inhibit CYP3A4, leading to dangerously elevated plasma concentrations of Statins.',
    mechanism: 'Metabolic blockage leads to skeletal muscle tissue breakdown (rhabdomyolysis), myoglobinuria, and renal tubular necrosis.',
    recommendation: 'Temporarily pause Statin therapy for the duration of the antibiotic course or choose Azithromycin.'
  },
  {
    id: 'rule-aspirin-ibuprofen',
    drugA: 'aspirin',
    drugB: 'ibuprofen',
    severity: 'HIGH',
    title: 'Cardioprotective Attenuation & Gastric Ulceration',
    description: 'Ibuprofen interferes with the antiplatelet effect of low-dose cardioprotective Aspirin, while increasing gastric mucosal erosion.',
    mechanism: 'Ibuprofen competitively blocks the access of Aspirin to the COX-1 binding site in platelets.',
    recommendation: 'Avoid simultaneous use. Take Aspirin at least 2 hours before Ibuprofen or use alternative pain relief.'
  },
  {
    id: 'rule-diuretic-digoxin',
    drugA: 'loop diuretic',
    drugB: 'digoxin',
    severity: 'HIGH',
    title: 'Hypokalemia-Induced Digoxin Toxicity',
    description: 'Loop or Thiazide diuretics waste potassium, and low serum potassium drastically increases sensitivity to Digoxin, triggering fatal arrhythmias.',
    mechanism: 'Hypokalemia promotes Digoxin binding to Na+/K+-ATPase in myocardial cells.',
    recommendation: 'Strictly monitor potassium levels and ECG. Ensure potassium sparing or dietary replacement.'
  },
  {
    id: 'rule-thyroid-calcium',
    drugA: 'levothyroxine',
    drugB: 'calcium supplement',
    severity: 'MODERATE',
    title: 'Reduced Thyroid Hormone Bioavailability',
    description: 'Calcium supplements bind to Levothyroxine in the gastrointestinal tract, significantly reducing thyroid absorption.',
    mechanism: 'Insoluble chelate formation in the stomach.',
    recommendation: 'Space administration by at least 4 hours (take Levothyroxine on empty stomach upon waking, Calcium at lunch).'
  }
];

// Helper classification map for matching active ingredients to clinical drug classes
export const DRUG_CLASSIFICATION_MAP: Record<string, string[]> = {
  // Blood thinners / Antiplatelets / Anticoagulants
  'blood thinner': ['aspirin', 'clopidogrel', 'warfarin', 'apixaban', 'rivaroxaban', 'heparin', 'ecosprin', 'plavix'],
  // NSAIDs
  'nsaid': ['ibuprofen', 'naproxen', 'diclofenac', 'celecoxib', 'combiflam', 'brufen', 'voveran', 'ketorolac', 'mefenamic acid'],
  // ACE inhibitors / ARBs
  'ace inhibitor': ['ramipril', 'enalapril', 'lisinopril', 'telmisartan', 'losartan', 'olmesartan', 'cardace', 'telma'],
  // Potassium supplements
  'potassium supplement': ['potassium chloride', 'potklor', 'potassium citrate', 'spironolactone', 'aldactone'],
  // Metformin
  'metformin': ['metformin', 'glycomet', 'glucophage', 'janumet'],
  // Contrast
  'iodinated contrast': ['iohexol', 'iopamidol', 'contrast dye', 'ct contrast'],
  // Beta blockers
  'beta blocker': ['metoprolol', 'atenolol', 'bisoprolol', 'carvedilol', 'propranolol', 'betaloc'],
  // Calcium Channel Blockers (non-dihydropyridine)
  'calcium channel blocker (non-dihydropyridine)': ['verapamil', 'diltiazem', 'calaptin', 'dilzem'],
  // Statins
  'statin': ['atorvastatin', 'rosuvastatin', 'simvastatin', 'atorva', 'rosuvas', 'lipitor'],
  // Macrolides
  'macrolide antibiotic': ['clarithromycin', 'erythromycin', 'biaxin'],
  // Aspirin specific
  'aspirin': ['aspirin', 'ecosprin', 'disprin', 'acetylsalicylic acid'],
  // Ibuprofen specific
  'ibuprofen': ['ibuprofen', 'brufen', 'combiflam'],
  // Diuretics
  'loop diuretic': ['furosemide', 'torsemide', 'hydrochlorothiazide', 'lasix', 'dytor'],
  // Digoxin
  'digoxin': ['digoxin', 'lanoxin'],
  // Levothyroxine
  'levothyroxine': ['levothyroxine', 'thyronorm', 'eltroxin', 'synthroid'],
  // Calcium
  'calcium supplement': ['calcium carbonate', 'calcium citrate', 'shelcal', 'cipcal']
};

