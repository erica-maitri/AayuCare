import React from 'react';
import { Check, Volume2, Clock, Droplets } from 'lucide-react';
import { Medication, TimeOfDay } from '../../types';
import { speechService } from '../../utils/speech';
import { useApp } from '../../context/AppContext';

interface BigPillCardProps {
  medication: Medication;
  currentTimeFilter: TimeOfDay;
}

export const BigPillCard: React.FC<BigPillCardProps> = ({ medication, currentTimeFilter }) => {
  const { markDoseTaken } = useApp();
  const isTaken = medication.takenToday?.[currentTimeFilter];

  const scheduledTime =
    currentTimeFilter === 'Morning'
      ? medication.scheduledTimes.morning || '08:30 AM'
      : currentTimeFilter === 'Afternoon'
      ? medication.scheduledTimes.afternoon || '01:30 PM'
      : currentTimeFilter === 'Evening'
      ? medication.scheduledTimes.evening || '06:00 PM'
      : medication.scheduledTimes.night || '09:00 PM';

  const timeHindi =
    currentTimeFilter === 'Morning'
      ? 'सुबह'
      : currentTimeFilter === 'Afternoon'
      ? 'दोपहर'
      : currentTimeFilter === 'Evening'
      ? 'शाम'
      : 'रात';

  // Always speaks prescription out loud in fluent Hindi for elderly comprehension
  const handleReadAloudInHindi = () => {
    const spokenName = medication.brandName || medication.name;
    const hindiInstruction = medication.hindiInstructions || medication.instructions;
    const hindiSpeech = `दवा का नाम ${spokenName} है। खुराक ${medication.dosage}। समय ${timeHindi}। निर्देश: ${hindiInstruction}।`;
    
    speechService.speak(hindiSpeech, {
      lang: 'hi-IN',
      rate: 0.82
    });
  };

  return (
    <div
      className={`rounded-3xl p-6 sm:p-7 transition-all border-4 shadow-lg ${
        isTaken
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/80 opacity-90'
          : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:shadow-xl'
      }`}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Clean English Prescription Details */}
        <div className="flex items-start gap-4 sm:gap-5 flex-1 text-left">
          {/* Large Pill Icon with dynamic shape & color */}
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex-shrink-0 flex items-center justify-center border-4 border-slate-300 dark:border-slate-600 shadow-md"
            style={{ backgroundColor: medication.color || '#ffffff' }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-slate-400 bg-white/60 flex items-center justify-center font-black text-slate-800 text-xs shadow-inner">
              Rx
            </div>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                <Clock className="w-3.5 h-3.5" />
                {currentTimeFilter} Routine • {scheduledTime}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                {medication.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {medication.name}
            </h3>

            <div className="flex items-center gap-2 text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400">
              <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-sm">
                Dosage: {medication.dosage}
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
                {medication.purpose}
              </span>
            </div>

            {/* Clear English Directions Box */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-900/60 rounded-2xl p-3.5 sm:p-4 text-slate-800 dark:text-slate-200 mt-2">
              <div className="flex items-start gap-2.5 font-bold text-sm sm:text-base text-amber-950 dark:text-amber-200">
                <Droplets className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <span>Directions: {medication.instructions}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions (Read Aloud in Hindi & Big Green I Took My Medicine Button) */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-64 flex-shrink-0">
          
          {/* Read Aloud in Hindi Button */}
          <button
            onClick={handleReadAloudInHindi}
            className="w-full py-3.5 px-4 rounded-2xl bg-sky-100 dark:bg-sky-950/70 hover:bg-sky-200 dark:hover:bg-sky-900 text-sky-950 dark:text-sky-200 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 border-2 border-sky-300 dark:border-sky-800 transition-all active:scale-98 shadow-sm"
            title="Read prescription instructions out loud in Hindi"
          >
            <Volume2 className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-pulse" />
            <span>Read in Hindi (हिंदी में सुनें)</span>
          </button>

          {/* Big Green "I Took My Medicine" Button */}
          {isTaken ? (
            <div className="w-full py-4 px-4 rounded-2xl bg-emerald-600 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
              <span>Taken Successfully ✓</span>
            </div>
          ) : (
            <button
              onClick={() => markDoseTaken(medication.id, currentTimeFilter)}
              className="w-full py-4 sm:py-5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-black text-base sm:text-lg flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-600/30 border-4 border-emerald-400/80 transition-transform active:scale-95"
            >
              <Check className="w-6 h-6 stroke-[3]" />
              <span>I TOOK MY MEDICINE</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
