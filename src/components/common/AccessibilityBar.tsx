import React from 'react';
import { Volume2, VolumeX, Languages, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AccessibilityBar: React.FC = () => {
  const { accessibility, setFontSize, toggleSpeech, toggleLanguage } = useApp();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-2 border-b border-slate-700/60 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-sm">
        
        {/* Left: Senior Accessibility Helper Label (No pulsing dot) */}
        <div className="flex items-center gap-2 font-medium">
          <span className="text-slate-300">
            {accessibility.language === 'hi' ? 'वरिष्ठ सुगमता नियंत्रण (Accessibility)' : 'Senior Accessibility Bar'}
          </span>
          <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800/80 font-semibold hidden sm:inline-flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> WCAG AAA Ready
          </span>
        </div>

        {/* Right: Quick Accessibility Controls */}
        <div className="flex items-center flex-wrap gap-2">
          
          {/* Font Scaling Buttons */}
          <div className="flex items-center bg-slate-700/80 rounded-md p-0.5 border border-slate-600">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                accessibility.fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Normal Text Size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
                accessibility.fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Large Text Size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-colors ${
                accessibility.fontSize === 'huge' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Extra Large Text Size"
            >
              A++
            </button>
          </div>

          {/* Speech Audio Narration */}
          <button
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              accessibility.speechEnabled
                ? 'bg-teal-700 text-teal-100 border border-teal-500'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-400'
            }`}
            title="Toggle Voice Assistant Speech"
          >
            {accessibility.speechEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-teal-300" />
                <span>Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Audio Muted</span>
              </>
            )}
          </button>

          {/* Bilingual Toggle (English / Hindi) */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
            title="Switch Language (English / हिंदी)"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{accessibility.language === 'en' ? 'हिंदी में देखें' : 'View in English'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
