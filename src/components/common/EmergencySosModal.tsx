import React, { useState, useEffect } from 'react';
import { AlertOctagon, PhoneCall, MapPin, Heart, ShieldAlert, CheckCircle2, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const EmergencySosModal: React.FC = () => {
  const { isSosActive, cancelSos, patient, accessibility } = useApp();
  const [countdown, setCountdown] = useState<number>(5);
  const [dispatched, setDispatched] = useState<boolean>(false);

  useEffect(() => {
    let timer: any = null;
    if (isSosActive) {
      setCountdown(5);
      setDispatched(false);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setDispatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(5);
      setDispatched(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSosActive]);

  if (!isSosActive) return null;

  const isHindi = accessibility.language === 'hi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border-4 border-rose-600 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-center">
        
        {/* Pulsing Siren Icon */}
        <div className="w-24 h-24 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-rose-200 dark:ring-rose-900/50 animate-pulse">
          <AlertOctagon className="w-14 h-14" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-rose-600 uppercase tracking-tight">
          {isHindi ? 'आपातकालीन सहायता सक्रिय' : 'EMERGENCY SOS ACTIVE'}
        </h2>

        {!dispatched ? (
          <div className="my-5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {isHindi ? 'परिवार व एम्बुलेंस को कॉल जा रही है...' : 'Broadcasting distress alert to family & ambulance in...'}
            </p>
            <div className="text-5xl font-black text-rose-600 my-2 font-mono">
              0{countdown}
            </div>
            <p className="text-xs text-slate-500">
              {isHindi ? 'गलती से दबा? तुरंत नीचे बटन दबाकर रद्द करें।' : 'Pressed by mistake? Tap cancel below before countdown completes.'}
            </p>
          </div>
        ) : (
          <div className="my-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-full text-xs font-bold mb-3 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isHindi ? 'अलर्ट सफलतापूर्वक भेजा गया' : 'SOS Broadcasted to Emergency Network'}</span>
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {isHindi
                ? 'बेटी प्रिया और एम्बुलेंस को जीपीएस लोकेशन और मेडिकल प्रोफाइल भेज दी गई है।'
                : 'Daughter Priya & Emergency Services dispatched with GPS location and critical medical history.'}
            </p>
          </div>
        )}

        {/* First Responder Medical Card Preview */}
        <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 text-left border border-slate-200 dark:border-slate-700 mb-6 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-600" />
              {patient.fullName} (Age: {patient.age}y)
            </span>
            <span className="bg-rose-100 text-rose-800 font-extrabold px-2 py-0.5 rounded">
              Blood: {patient.bloodGroup}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Location:</strong> {patient.currentLocation.area}, {patient.currentLocation.landmark}, {patient.currentLocation.city}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Critical Allergies:</strong> {patient.allergies.join(', ')}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
            <Heart className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Primary Contact:</strong> {patient.emergencyContact.name} ({patient.emergencyContact.phone})
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`tel:${patient.emergencyContact.phone}`}
            className="flex-1 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{isHindi ? 'बेटी प्रिया को कॉल करें' : 'Call Daughter Priya'}</span>
          </a>

          <button
            onClick={cancelSos}
            className="flex-1 py-3.5 px-4 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-2xl font-bold text-sm transition-all"
          >
            {isHindi ? 'मैं सुरक्षित हूँ (रद्द करें)' : 'I Am Safe (Cancel SOS)'}
          </button>
        </div>

      </div>
    </div>
  );
};
