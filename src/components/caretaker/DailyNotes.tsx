import React, { useState } from 'react';
import { ClipboardList, Plus, Smile, Moon, Utensils, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CaretakerNote } from '../../types';

export const DailyNotes: React.FC = () => {
  const { caretakerNotes, addCaretakerNote, accessibility } = useApp();

  const [mood, setMood] = useState<CaretakerNote['mood']>('Calm');
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [dietIntake, setDietIntake] = useState<CaretakerNote['dietIntake']>('Full Meal');
  const [observations, setObservations] = useState('');
  const [showForm, setShowForm] = useState(false);

  const isHindi = accessibility.language === 'hi';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!observations.trim()) return;

    addCaretakerNote({
      author: 'Ramesh Yadav (Day Caregiver)',
      mood,
      sleepHours: Number(sleepHours),
      dietIntake,
      observations
    });

    setObservations('');
    setShowForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'दैनिक देखभाल अवलोकन (Handover Notes)' : 'Daily Caregiver Handover Notes'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'मरीज का मूड, नींद, भोजन और दैनिक टिप्पणियाँ' : 'Mood, sleep duration, meal intake & clinical observations'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-600/20 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : '+ Add Daily Observation'}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900/60 space-y-4 text-xs sm:text-sm animate-fadeIn">
          <h4 className="font-bold text-amber-900 dark:text-amber-200">
            Record Today&apos;s Senior Status Report
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Patient Mood
              </label>
              <select
                value={mood}
                onChange={e => setMood(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                <option value="Energetic">Energetic 😊</option>
                <option value="Calm">Calm & Peaceful 😌</option>
                <option value="Fatigued">Fatigued / Tired 🥱</option>
                <option value="Irritable">Irritable / Restless 😣</option>
                <option value="Confused">Confused / Memory Fog 😕</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sleep Duration (Hours)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max="24"
                value={sleepHours}
                onChange={e => setSleepHours(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Dietary Intake
              </label>
              <select
                value={dietIntake}
                onChange={e => setDietIntake(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
              >
                <option value="Full Meal">Full Meal (Good Appetite)</option>
                <option value="Partial">Partial (Ate lightly)</option>
                <option value="Poor">Poor (Loss of appetite)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Observations & Handover Details *
            </label>
            <textarea
              required
              rows={3}
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="e.g. Ram Prasad ji walked 20 mins, took afternoon tea on time. Complained of slight knee ache. Applied warm compress."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl shadow-md transition-all active:scale-98"
          >
            Save Note & Notify Family
          </button>
        </form>
      )}

      {/* List of Notes */}
      <div className="space-y-3">
        {caretakerNotes.map(n => (
          <div
            key={n.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left space-y-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {n.author}
                </span>
                <span className="text-[11px] text-slate-500">
                  • {n.date}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                  <Smile className="w-3 h-3" /> {n.mood}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 flex items-center gap-1">
                  <Moon className="w-3 h-3" /> {n.sleepHours} hrs sleep
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <Utensils className="w-3 h-3" /> {n.dietIntake}
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {n.observations}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

