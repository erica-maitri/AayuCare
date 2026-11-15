import React, { useState } from 'react';
import { Mic, X, Play, Square, Volume2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../utils/speech';

export const ElderVoiceAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { patient, medications, accessibility } = useApp();
  const [speaking, setSpeaking] = useState(false);

  if (!isOpen) return null;

  const isHindi = accessibility.language === 'hi';

  const morningMeds = medications.filter(m => m.schedule.includes('Morning'));
  const afternoonMeds = medications.filter(m => m.schedule.includes('Afternoon'));
  const nightMeds = medications.filter(m => m.schedule.includes('Night'));

  const englishSummary = `Hello ${patient.fullName} ji! Here is your medication routine for today:

• Morning (08:30 AM): ${morningMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}
• Afternoon (01:30 PM): ${afternoonMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}
• Night (09:00 PM): ${nightMeds.map(m => `${m.name} (${m.dosage})`).join(', ')}

Please take all tablets with warm water as directed.`;

  const hindiSummary = `नमस्ते ${patient.fullName} जी! आज के लिए आपकी दवाएं इस प्रकार हैं:

• सुबह (08:30 AM): ${morningMeds.map(m => `${m.brandName || m.name} (${m.dosage})`).join(', ')}
• दोपहर (01:30 PM): ${afternoonMeds.map(m => `${m.brandName || m.name} (${m.dosage})`).join(', ')}
• रात (09:00 PM): ${nightMeds.map(m => `${m.brandName || m.name} (${m.dosage})`).join(', ')}

कृपया सभी दवाएं गुनगुने पानी के साथ समय पर लें।`;

  const handleSpeak = () => {
    setSpeaking(true);
    if (isHindi) {
      const speech = `नमस्ते ${patient.fullName} जी! आज के लिए आपकी दवाएं इस प्रकार हैं: सुबह के समय आपको ${morningMeds.map(m => m.brandName || m.name).join(', ')} लेनी है। दोपहर के भोजन के बाद ${afternoonMeds.map(m => m.brandName || m.name).join(', ')}। और रात को सोने से पहले ${nightMeds.map(m => m.brandName || m.name).join(', ')}। कृपया सभी दवाएं गुनगुने पानी के साथ समय पर लें।`;
      speechService.speak(speech, {
        lang: 'hi-IN',
        rate: 0.82,
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false)
      });
    } else {
      const speech = `Hello ${patient.fullName} ji! Here is your medication routine for today. In the morning, you have ${morningMeds.map(m => m.name).join(', ')}. In the afternoon after lunch, you have ${afternoonMeds.map(m => m.name).join(', ')}. And at night before bedtime, you have ${nightMeds.map(m => m.name).join(', ')}. Please take all medicines with warm water as directed.`;
      speechService.speak(speech, {
        lang: 'en-IN',
        rate: 0.85,
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false)
      });
    }
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

        {/* Clean Avatar (No weird pulsing dots) */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 mx-auto mb-3">
          <Mic className="w-10 h-10" />
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {isHindi ? 'आर्यू केयर वॉइस असिस्टेंट' : 'AayuCare Voice Prescription Assistant'}
        </h3>
        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
          {isHindi ? 'नमस्ते राम प्रसाद जी 🙏' : `Welcome, ${patient.fullName} ji 🙏`}
        </p>

        {/* Prescription Summary */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-left text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 shadow-inner max-h-56 overflow-y-auto whitespace-pre-line font-medium">
          {isHindi ? hindiSummary : englishSummary}
        </div>

        <div className="text-[11px] text-slate-500 mb-4 flex items-center justify-center gap-1.5 font-semibold">
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {isHindi ? 'ऑडियो भाषा: हिंदी (Hindi Voice)' : 'Voice Audio: English'}
          </span>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-3 justify-center">
          {!speaking ? (
            <button
              onClick={handleSpeak}
              className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isHindi ? 'पर्चा सुनें (हिंदी में)' : 'Listen Prescription (English)'}</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>{isHindi ? 'बंद करें (Stop)' : 'Stop Audio'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
