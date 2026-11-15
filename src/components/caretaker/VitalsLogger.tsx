import React, { useState } from 'react';
import { Activity, Heart, Droplet, Plus, AlertCircle, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const VitalsLogger: React.FC = () => {
  const { vitals, addVital, accessibility } = useApp();

  const [systolic, setSystolic] = useState<number>(128);
  const [diastolic, setDiastolic] = useState<number>(82);
  const [pulse, setPulse] = useState<number>(72);
  const [sugar, setSugar] = useState<number>(115);
  const [context, setContext] = useState<'fasting' | 'post_prandial' | 'random'>('fasting');
  const [weight, setWeight] = useState<number>(68.4);
  const [notes, setNotes] = useState<string>('');
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);

  const isHindi = accessibility.language === 'hi';

  const isWarning = systolic >= 140 || diastolic >= 90 || sugar >= 160;
  const isCritical = systolic >= 160 || diastolic >= 100 || sugar >= 220;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVital({
      systolicBP: Number(systolic),
      diastolicBP: Number(diastolic),
      pulseRate: Number(pulse),
      bloodSugarMgDl: Number(sugar),
      sugarContext: context,
      weightKg: Number(weight),
      notes: notes || 'Routine caregiver morning checkup.'
    });
    setNotes('');
    setIsOpenForm(false);
  };

  const latestVital = vitals[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 flex items-center justify-center font-bold">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'महत्वपूर्ण स्वास्थ्य संकेत (Vital Signs)' : 'Patient Vital Signs Tracker'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'रक्तचाप और ब्लड शुगर की दैनिक निगरानी' : 'Blood Pressure (BP) & Blood Sugar telemetry logs'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-rose-600/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{isOpenForm ? 'Close Entry Form' : '+ Record New Vitals'}</span>
        </button>
      </div>

      {/* Latest Vitals Overview Cards */}
      {latestVital && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* BP Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
              <span>Blood Pressure</span>
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestVital.systolicBP}/{latestVital.diastolicBP}
              <span className="text-xs font-medium text-slate-500 ml-1">mmHg</span>
            </div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Target: &lt;130/85 mmHg</span>
            </div>
          </div>

          {/* Blood Sugar Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
              <span>Blood Sugar ({latestVital.sugarContext})</span>
              <Droplet className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestVital.bloodSugarMgDl}
              <span className="text-xs font-medium text-slate-500 ml-1">mg/dL</span>
            </div>
            <div className="mt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Target: 90-130 Fasting</span>
            </div>
          </div>

          {/* Pulse Rate */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
              <span>Resting Pulse</span>
              <Activity className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestVital.pulseRate}
              <span className="text-xs font-medium text-slate-500 ml-1">bpm</span>
            </div>
            <div className="mt-2 text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <span>Normal 60-90 bpm</span>
            </div>
          </div>

          {/* Body Weight */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold mb-1">
              <span>Body Weight</span>
              <TrendingUp className="w-4 h-4 text-teal-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {latestVital.weightKg || 68.4}
              <span className="text-xs font-medium text-slate-500 ml-1">kg</span>
            </div>
            <div className="mt-2 text-[11px] font-bold text-teal-600 flex items-center gap-1">
              <span>Stable BMI</span>
            </div>
          </div>

        </div>
      )}

      {/* Record Vitals Expandable Form */}
      {isOpenForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/60 space-y-4 text-xs sm:text-sm animate-fadeIn">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-rose-950 dark:text-rose-200 text-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-rose-600" />
              <span>Record New Clinical Measurement</span>
            </h4>
            {isCritical ? (
              <span className="px-2.5 py-1 bg-rose-600 text-white font-black rounded-lg text-xs animate-pulse">
                CRITICAL VALUE (Auto-escalation will fire)
              </span>
            ) : isWarning ? (
              <span className="px-2.5 py-1 bg-amber-500 text-white font-black rounded-lg text-xs">
                WARNING VALUE
              </span>
            ) : (
              <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                NORMAL RANGE
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Systolic BP (mmHg)
              </label>
              <input
                type="number"
                min="70"
                max="240"
                required
                value={systolic}
                onChange={e => setSystolic(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Diastolic BP (mmHg)
              </label>
              <input
                type="number"
                min="40"
                max="140"
                required
                value={diastolic}
                onChange={e => setDiastolic(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Blood Sugar (mg/dL)
              </label>
              <input
                type="number"
                min="40"
                max="600"
                required
                value={sugar}
                onChange={e => setSugar(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sugar Context
              </label>
              <select
                value={context}
                onChange={e => setContext(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                <option value="fasting">Fasting (Morning)</option>
                <option value="post_prandial">Post-Prandial (2h after meal)</option>
                <option value="random">Random</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pulse (bpm)
              </label>
              <input
                type="number"
                min="40"
                max="180"
                value={pulse}
                onChange={e => setPulse(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Caretaker Clinical Note
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Well rested, post morning walk, no dizziness."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl shadow-md transition-all active:scale-98"
          >
            Save Vitals & Sync to Family Dashboard
          </button>
        </form>
      )}

      {/* Historical Readings Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <th className="py-2.5 px-3">Date & Time</th>
              <th className="py-2.5 px-3">Blood Pressure</th>
              <th className="py-2.5 px-3">Blood Sugar</th>
              <th className="py-2.5 px-3">Pulse</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Observations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vitals.map(v => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-300">
                  {v.timestamp}
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                  {v.systolicBP}/{v.diastolicBP} mmHg
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                  {v.bloodSugarMgDl} mg/dL <span className="text-[10px] text-slate-400 font-normal">({v.sugarContext})</span>
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                  {v.pulseRate} bpm
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      v.status === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : v.status === 'warning'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 text-xs italic">
                  {v.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
