import React, { useState } from 'react';
import { Lock, X, Check, KeyRound, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PinModal: React.FC = () => {
  const { pinModalOpen, setPinModalOpen, targetRoleForPin, confirmRoleSwitch, isLockedOut, accessibility } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!pinModalOpen || !targetRoleForPin) return null;

  const isHindi = accessibility.language === 'hi';
  const roleTitle = targetRoleForPin === 'caretaker'
    ? (isHindi ? '🩺 देखभालकर्ता मोड (Caretaker View)' : '🩺 Caretaker Mode')
    : (isHindi ? '👨‍👩‍👧 परिवार मोड (Family Member View)' : '👨‍👩‍👧 Family Member Mode');

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next.length === 4) {
        verify(next);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const verify = (inputPin: string) => {
    const success = confirmRoleSwitch(inputPin);
    if (!success) {
      setError(true);
      setTimeout(() => {
        setPin('');
      }, 700);
    } else {
      setPin('');
      setError(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setPinModalOpen(false);
            setPin('');
            setError(false);
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Close PIN security modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 mx-auto flex items-center justify-center mb-4 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          {isHindi ? 'सुरक्षित प्रमाणीकरण' : 'Role Security PIN'}
        </h3>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
          {roleTitle}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isHindi
            ? 'गलत दवा बदलाव से बुजुर्गों की सुरक्षा के लिए 4 अंकों का पिन दर्ज करें।'
            : 'Enter 4-digit security PIN to prevent accidental modifications.'}
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center items-center gap-3 my-6">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > idx
                  ? error
                    ? 'bg-rose-500 scale-125'
                    : 'bg-emerald-600 scale-125 ring-4 ring-emerald-100 dark:ring-emerald-950'
                  : 'bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {isLockedOut && (
          <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-800 dark:text-rose-200 text-xs font-bold mb-4 animate-pulse">
            🔒 Security Lockout Active: Too many failed PIN attempts. Please wait 30 seconds.
          </div>
        )}

        {error && !isLockedOut && (
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 mb-4 animate-bounce">
            <AlertCircle className="w-4 h-4" />
            <span>{isHindi ? 'गलत पिन! पुनः प्रयास करें।' : 'Incorrect PIN! Try default PIN 1234.'}</span>
          </div>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="py-3.5 text-lg font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
              aria-label={`Digit ${num}`}
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => {
              setPin('1234');
              verify('1234');
            }}
            className="py-3 text-xs font-bold rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-all"
            title="Auto-fill default demo PIN"
            aria-label="Auto fill default master PIN 1234"
          >
            Auto 1234
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="py-3.5 text-lg font-bold rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-sm"
            aria-label="Digit 0"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="py-3 text-sm font-bold rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            aria-label="Delete last digit"
          >
            ⌫
          </button>
        </div>

        {/* Master Security PIN Note */}
        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-xl p-2.5 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2">
          <KeyRound className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Master PIN: <strong className="text-slate-900 dark:text-white font-mono">1234</strong> (or tap Auto 1234)</span>
        </div>

      </div>
    </div>
  );
};

