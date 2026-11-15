import React, { useState } from 'react';
import { Mic, X, Play, Square, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../utils/speech';

export const ElderVoiceAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { patient, medications } = useApp();
  const [speaking, setSpeaking] = useState(false);

  if (!isOpen) return null;

  const morningMeds = medications.filter(m => m.schedule.includes('Morning'));
  const afternoonMeds = medications.filter(m => m.schedule.includes('Afternoon'));
  const nightMeds = medications.filter(m => m.schedule.includes('Night'));

  // On-screen text is in clean, professional English
  const englishDisplaySummary = `Hello ${patient.fullName} ji! Here is your medication routine for today:

• Morning (08:30 AM): ${morningMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}
• Afternoon (01:30 PM): ${afternoonMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}
• Night (09:00 PM): ${nightMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}

Please take all tablets with warm water as directed.`;

  // Spoken voice is always in natural Hindi for senior citizen comprehension
  const hindiVoiceSpeech = `नमस्ते ${patient.fullName} जी! आज के लिए आपकी दवाएं इस प्रकार हैं: सुबह के समय आपको ${morningMeds.map(m => m.brandName || m.name).join(', ')} लेनी है। दोपहर के भोजन के बाद ${afternoonMeds.map(m => m.brandName || m.name).join(', ')}। और रात को सोने से पहले ${nightMeds.map(m => m.brandName || m.name).join(', ')}। कृपया सभी दवाएं गुनगुने पानी के साथ समय पर लें।`;

  const handleSpeak = () => {
    setSpeaking(true);
    speechService.speak(hindiVoiceSpeech, {
      lang: 'hi-IN',
      rate: 0.82,
      onEnd: () => setSpeaking(false),
      onError: () => setSpeaking(false)
    });
  };

  const handleStop = () => {
    speechService.stop();
    setSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-4 border-emerald-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={() => {
            handleStop();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Animated Assistant Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-3">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <Mic className="w-10 h-10 animate-pulse" />
          </div>
          {speaking && (
            <span className="absolute -top-1 -right-1 flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-emerald-600 items-center justify-center text-[10px] text-white font-bold">
                🔊
              </span>
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          AayuCare Voice Prescription Assistant
        </h3>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
          नमस्ते राम प्रसाद जी 🙏 • Reads Prescription Aloud in Hindi
        </p>

        {/* English Prescription Overview Card */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-left text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 shadow-inner max-h-56 overflow-y-auto whitespace-pre-line font-medium">
          {englishDisplaySummary}
        </div>

        <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-center gap-1.5 font-semibold">
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>English Prescription • Spoken Voice in Hindi (हिंदी ऑडियो)</span>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-3 justify-center">
          {!speaking ? (
            <button
              onClick={handleSpeak}
              className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Listen in Hindi (हिंदी में सुनें)</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>Stop Audio (बंद करें)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
