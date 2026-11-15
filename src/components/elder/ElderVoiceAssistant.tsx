import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, Sparkles, X, Play, Square } from 'lucide-react';
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

  const generateFullSummary = () => {
    const morningMeds = medications.filter(m => m.schedule.includes('Morning'));
    const afternoonMeds = medications.filter(m => m.schedule.includes('Afternoon'));
    const nightMeds = medications.filter(m => m.schedule.includes('Night'));

    if (isHindi) {
      return `नमस्ते ${patient.fullName} जी! आज के लिए आपकी दवाएं इस प्रकार हैं: सुबह के समय आपको ${morningMeds.map(m => m.name).join(' और ')} लेनी है। दोपहर के भोजन के बाद ${afternoonMeds.map(m => m.name).join(' और ')}। और रात को सोने से पहले ${nightMeds.map(m => m.name).join(' और ')}। कृपया सभी दवाएं गुनगुने पानी के साथ समय पर लें।`;
    }

    return `Hello ${patient.fullName} ji! Here is your medication overview for today. In the morning, you have ${morningMeds.map(m => m.name).join(' and ')}. In the afternoon after lunch, you have ${afternoonMeds.map(m => m.name).join(' and ')}. And at night before bedtime, you have ${nightMeds.map(m => m.name).join(' and ')}. Remember to take your medicines with warm water.`;
  };

  const handleSpeak = () => {
    const speechText = generateFullSummary();
    setSpeaking(true);
    speechService.speak(speechText, {
      lang: isHindi ? 'hi-IN' : 'en-IN',
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
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-green-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30">
            <Mic className="w-12 h-12 animate-pulse" />
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

        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
          {isHindi ? 'आर्यू केयर वॉइस असिस्टेंट' : 'AayuCare Voice Assistant'}
        </h3>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
          {isHindi ? 'नमस्ते राम प्रसाद जी 🙏' : 'Namaste Ram Prasad ji 🙏'}
        </p>

        {/* Speech Bubble */}
        <div className="my-5 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-left text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 shadow-inner max-h-60 overflow-y-auto">
          <p className="font-medium">
            {generateFullSummary()}
          </p>
        </div>

        {/* Voice Controls */}
        <div className="flex gap-3 justify-center">
          {!speaking ? (
            <button
              onClick={handleSpeak}
              className="py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{isHindi ? 'आवाज़ में सुनें (Play Audio)' : 'Listen Prescription Audio'}</span>
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="py-4 px-6 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Square className="w-5 h-5 fill-current" />
              <span>{isHindi ? 'आवाज़ बंद करें (Stop)' : 'Stop Audio'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
