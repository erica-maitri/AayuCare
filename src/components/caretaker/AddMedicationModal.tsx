import React, { useState, useMemo } from 'react';
import { X, ShieldAlert, AlertTriangle, CheckCircle, Plus, Info, Pill, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { checkDrugConflicts } from '../../utils/conflictDetector';
import { TimeOfDay } from '../../types';

export const AddMedicationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { medications, addMedication, accessibility } = useApp();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [category, setCategory] = useState('Prescription Medicine');
  const [schedule, setSchedule] = useState<TimeOfDay[]>(['Morning']);
  const [morningTime, setMorningTime] = useState('08:30 AM');
  const [afternoonTime, setAfternoonTime] = useState('01:30 PM');
  const [nightTime, setNightTime] = useState('08:30 PM');
  const [instructions, setInstructions] = useState('Take with warm water after meals.');
  const [hindiInstructions, setHindiInstructions] = useState('भोजन के बाद गुनगुने पानी के साथ लें।');
  const [remainingPills, setRemainingPills] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(7);
  const [prescribedBy, setPrescribedBy] = useState('Dr. Ananya Sen');
  const [purpose, setPurpose] = useState('');

  // Drug Conflict Live Check
  const conflicts = useMemo(() => {
    if (!name.trim() && !activeIngredient.trim()) return [];
    return checkDrugConflicts(
      {
        name: name.trim(),
        activeIngredient: activeIngredient.trim() || name.trim()
      },
      medications
    );
  }, [name, activeIngredient, medications]);

  if (!isOpen) return null;

  const isHindi = accessibility.language === 'hi';
  const hasCriticalConflict = conflicts.some(c => c.rule.severity === 'CRITICAL');

  const toggleSchedule = (time: TimeOfDay) => {
    setSchedule(prev =>
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
  };

  const loadPreset = (presetName: string, ingredient: string, dose: string, purp: string) => {
    setName(presetName);
    setActiveIngredient(ingredient);
    setDosage(dose);
    setPurpose(purp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim()) return;

    if (hasCriticalConflict) {
      const confirmOverride = window.confirm(
        '⚠️ DANGEROUS DRUG CONFLICT DETECTED!\n\nThis medication severely conflicts with active patient medications. Are you sure you want to proceed with medical specialist authorization?'
      );
      if (!confirmOverride) return;
    }

    addMedication({
      name,
      dosage,
      unit: 'mg',
      activeIngredient: activeIngredient || name,
      category,
      schedule,
      scheduledTimes: {
        morning: schedule.includes('Morning') ? morningTime : undefined,
        afternoon: schedule.includes('Afternoon') ? afternoonTime : undefined,
        night: schedule.includes('Night') ? nightTime : undefined
      },
      instructions,
      hindiInstructions,
      foodRelation: 'after_food',
      shape: 'round',
      color: '#f8fafc',
      remainingPills: Number(remainingPills),
      totalPills: Number(remainingPills),
      refillThreshold: Number(refillThreshold),
      prescribedBy,
      purpose: purpose || 'Health maintenance',
      startDate: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close add medication modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'नई दवा जोड़ें (Prescription Entry)' : 'Add New Medication'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi
                ? 'स्वचालित ड्रग-ड्रग परस्पर विरोधी जांच के साथ'
                : 'With Real-Time Automated Drug-to-Drug Conflict Matrix'}
            </p>
          </div>
        </div>

        {/* Clinical Safety Validation Presets */}
        <div className="my-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Clinical Safety Validation Presets:</span>
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => loadPreset('Combiflam (Ibuprofen + Paracetamol)', 'Ibuprofen', '400 mg', 'Pain relief for knee pain')}
              className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800 hover:bg-rose-200"
            >
              ⚠️ Test Conflict: Combiflam (NSAID vs Ecosprin)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('Potklor (Potassium Chloride)', 'Potassium Supplement', '10 mEq', 'Potassium replenishment')}
              className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-800 hover:bg-amber-200"
            >
              ⚠️ Test Conflict: Potklor (vs Telmisartan)
            </button>
            <button
              type="button"
              onClick={() => loadPreset('Limcee (Vitamin C 500mg)', 'Ascorbic Acid', '500 mg', 'Immunity booster')}
              className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200"
            >
              ✓ Test Safe Drug: Vitamin C
            </button>
          </div>
        </div>

        {/* DRUG CONFLICT ALERT BANNER */}
        {conflicts.length > 0 && (
          <div className="mb-5 space-y-3">
            {conflicts.map((alert, idx) => {
              const isCrit = alert.rule.severity === 'CRITICAL';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border-2 text-xs transition-all ${
                    isCrit
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-500 text-rose-950 dark:text-rose-100 shadow-md ring-2 ring-rose-400'
                      : 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-950 dark:text-amber-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wide">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 animate-bounce" />
                    <span>
                      {alert.rule.severity} DRUG INTERACTION DETECTED
                    </span>
                  </div>
                  <h4 className="font-bold text-sm mt-1 text-rose-800 dark:text-rose-200">
                    {alert.rule.title}
                  </h4>
                  <p className="mt-1 font-medium leading-relaxed">
                    <strong>Conflict Mechanism:</strong> Proposed <em>{alert.proposedMedication.name}</em> conflicts directly with active prescription <strong>{alert.existingMedication.name} ({alert.existingMedication.activeIngredient})</strong>. {alert.rule.mechanism}
                  </p>
                  <div className="mt-2 p-2 rounded-xl bg-white/70 dark:bg-slate-900/70 border border-rose-300 dark:border-rose-800 font-semibold text-rose-900 dark:text-rose-200">
                    💡 <strong>Clinical Guidance:</strong> {alert.rule.recommendation}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medication Brand Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Glycomet, Combiflam, Telma..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Active Chemical Ingredient *
              </label>
              <input
                type="text"
                value={activeIngredient}
                onChange={e => setActiveIngredient(e.target.value)}
                placeholder="e.g. Metformin, Ibuprofen, Telmisartan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dosage & Unit *
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 500 mg, 40 mg, 1 drop..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prescribed For (Condition / Purpose)
              </label>
              <input
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="e.g. Blood Sugar control, Knee pain..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

          </div>

          {/* Schedule Selectors */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Daily Schedule (Select all that apply) *
            </label>
            <div className="flex flex-wrap gap-2">
              {(['Morning', 'Afternoon', 'Night'] as TimeOfDay[]).map(time => {
                const selected = schedule.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => toggleSchedule(time)}
                    className={`px-4 py-2 rounded-xl font-bold transition-all ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {time === 'Morning' && '🌅 '}
                    {time === 'Afternoon' && '☀️ '}
                    {time === 'Night' && '🌙 '}
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Instructions (English)
              </label>
              <input
                type="text"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="e.g. Take with warm water after breakfast"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                निर्देश (हिंदी - Hindi for Senior Audio)
              </label>
              <input
                type="text"
                value={hindiInstructions}
                onChange={e => setHindiInstructions(e.target.value)}
                placeholder="e.g. भोजन के बाद गुनगुने पानी के साथ लें"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Supply & Threshold */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Total Supply (Pills)
              </label>
              <input
                type="number"
                min="1"
                value={remainingPills}
                onChange={e => setRemainingPills(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Refill Alert Level
              </label>
              <input
                type="number"
                min="1"
                value={refillThreshold}
                onChange={e => setRefillThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prescribing Doctor
              </label>
              <input
                type="text"
                value={prescribedBy}
                onChange={e => setPrescribedBy(e.target.value)}
                placeholder="e.g. Dr. Ananya Sen"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-2xl font-black text-white flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                hasCriticalConflict
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>{hasCriticalConflict ? 'Save Despite Conflict Warning' : 'Save Prescription'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

