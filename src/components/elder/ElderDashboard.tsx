import React, { useState } from 'react';
import { Sun, CloudSun, Moon, Mic, Calendar, PhoneCall, Heart, Droplet, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TimeOfDay } from '../../types';
import { BigPillCard } from './BigPillCard';
import { ElderVoiceAssistant } from './ElderVoiceAssistant';

export const ElderDashboard: React.FC = () => {
  const {
    patient,
    medications,
    appointments,
    triggerSos,
    accessibility
  } = useApp();

  const [activeTime, setActiveTime] = useState<TimeOfDay>('Morning');
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);

  const isHindi = accessibility.language === 'hi';

  const timeTabs: { id: TimeOfDay; label: string; icon: React.ReactNode; timeRange: string }[] = [
    {
      id: 'Morning',
      label: isHindi ? '🌅 सुबह (Morning)' : '🌅 Morning',
      icon: <Sun className="w-5 h-5" />,
      timeRange: '07:00 AM - 11:00 AM'
    },
    {
      id: 'Afternoon',
      label: isHindi ? '☀️ दोपहर (Afternoon)' : '☀️ Afternoon',
      icon: <CloudSun className="w-5 h-5" />,
      timeRange: '12:00 PM - 03:00 PM'
    },
    {
      id: 'Night',
      label: isHindi ? '🌙 रात (Night)' : '🌙 Night',
      icon: <Moon className="w-5 h-5" />,
      timeRange: '08:00 PM - 10:30 PM'
    }
  ];

  const filteredMeds = medications.filter(m => m.schedule.includes(activeTime));
  const nextAppt = appointments[0];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Friendly Welcome & Voice Assistant Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-emerald-500/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{isHindi ? 'नमस्ते राम प्रसाद जी' : 'Welcome, Ram Prasad ji'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {isHindi ? 'आज आप कैसा महसूस कर रहे हैं?' : 'How are you feeling today?'}
            </h2>
            <p className="text-emerald-100 text-base sm:text-lg max-w-xl font-medium">
              {isHindi
                ? 'आपकी सभी दवाएं सुरक्षित रूप से निर्धारित हैं। नीचे दी गई दवा की जांच करें और लेने के बाद हरा बटन दबाएं।'
                : 'Your daily health routine is safe and tracked. Check your doses below and tap the green button once taken.'}
            </p>
          </div>

          {/* Big Voice Assistant Trigger Button */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="flex-shrink-0 bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-6 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-3 shadow-xl shadow-yellow-500/20 transition-transform active:scale-95 border-2 border-yellow-200"
          >
            <Mic className="w-6 h-6 text-slate-900 animate-bounce" />
            <span>{isHindi ? 'बोलकर पर्चा सुनें' : 'Read My Prescriptions'}</span>
          </button>
        </div>
      </div>

      {/* Time of Day Navigation Tabs (Massive Buttons) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {timeTabs.map((tab) => {
          const isSelected = activeTime === tab.id;
          const count = medications.filter(m => m.schedule.includes(tab.id)).length;
          const takenCount = medications.filter(
            m => m.schedule.includes(tab.id) && m.takenToday?.[tab.id]
          ).length;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTime(tab.id)}
              className={`p-6 rounded-3xl text-left border-4 transition-all shadow-md ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30 ring-4 ring-emerald-100 dark:ring-emerald-950 scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-slate-300 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2.5 rounded-2xl ${isSelected ? 'bg-emerald-700 text-yellow-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  {tab.icon}
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    takenCount === count && count > 0
                      ? 'bg-emerald-200 text-emerald-900'
                      : isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {takenCount}/{count} {isHindi ? 'ली गई' : 'Done'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">{tab.label}</h3>
              <p className={`text-xs mt-1 font-semibold ${isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'}`}>
                {tab.timeRange}
              </p>
            </button>
          );
        })}
      </div>

      {/* Medication List for Selected Time */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{activeTime} {isHindi ? 'की दवाएं' : 'Prescription Routine'}</span>
            <span className="text-sm font-bold bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-700 dark:text-slate-300">
              {filteredMeds.length} {isHindi ? 'दवाएं' : 'Pills'}
            </span>
          </h3>
        </div>

        {filteredMeds.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 text-center border-4 border-dashed border-slate-300 dark:border-slate-700">
            <CheckCircle2 className="w-16 h-16 mx-auto text-emerald-500 mb-3" />
            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
              {isHindi ? 'इस समय के लिए कोई दवा निर्धारित नहीं है।' : 'No medications scheduled for this time slot.'}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              {isHindi ? 'आराम करें और पर्याप्त पानी पिएं।' : 'Rest well and stay hydrated.'}
            </p>
          </div>
        ) : (
          filteredMeds.map(med => (
            <BigPillCard
              key={med.id}
              medication={med}
              currentTimeFilter={activeTime}
            />
          ))
        )}
      </div>

      {/* Upcoming Doctor Visit Reminder Card */}
      {nextAppt && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-4 border-sky-300 dark:border-sky-800/80 shadow-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-xs font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-1 rounded-md border border-sky-200 dark:border-sky-800">
                  {isHindi ? 'अगली डॉक्टर मुलाकात' : 'Upcoming Doctor Visit'} • {nextAppt.countdownDays} {isHindi ? 'दिन शेष' : 'Days Away'}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {nextAppt.doctorName} ({nextAppt.specialty})
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  🏥 {nextAppt.hospitalName} • {new Date(nextAppt.appointmentDateTime).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-sm">
              💡 <strong>{isHindi ? 'तैयारी निर्देश:' : 'Prep Note:'}</strong> {nextAppt.preparationNotes[0]}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Assistance Quick Call Bar */}
      <div className="bg-rose-50 dark:bg-rose-950/30 rounded-3xl p-6 border-4 border-rose-300 dark:border-rose-900 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-lg font-black text-rose-900 dark:text-rose-200">
              {isHindi ? 'मदद चाहिए? तुरंत संपर्क करें' : 'Need Immediate Help?'}
            </h4>
            <p className="text-xs text-rose-700 dark:text-rose-300 font-medium">
              {isHindi ? 'बेटी प्रिया: +91 98765 43210 • देखभालकर्ता रमेश: +91 98111 22334' : 'Daughter Priya (+91 98765 43210) & Ambulance 108'}
            </p>
          </div>
        </div>

        <button
          onClick={triggerSos}
          className="w-full sm:w-auto px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-base shadow-lg shadow-rose-600/30 transition-transform active:scale-95 animate-pulse"
        >
          {isHindi ? '🚨 आपातकालीन SOS दबाएं' : '🚨 Trigger Emergency SOS'}
        </button>
      </div>

      {/* Voice Assistant Modal */}
      <ElderVoiceAssistant
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />

    </div>
  );
};

