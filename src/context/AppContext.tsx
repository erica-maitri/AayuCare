import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Role,
  PatientProfile,
  Medication,
  VitalSign,
  DoctorAppointment,
  AdherenceDayLog,
  EscalationLog,
  CaretakerNote,
  AccessibilitySettings,
  TimeOfDay
} from '../types';
import {
  INITIAL_PATIENT,
  INITIAL_MEDICATIONS,
  INITIAL_VITALS,
  INITIAL_APPOINTMENTS,
  INITIAL_ADHERENCE_LOGS,
  INITIAL_ESCALATIONS,
  INITIAL_CARETAKER_NOTES
} from '../data/dataset';
import { soundEffects } from '../utils/sound';
import { speechService } from '../utils/speech';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  pinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
  targetRoleForPin: Role | null;
  requestRoleSwitch: (role: Role) => void;
  confirmRoleSwitch: (pin: string) => boolean;

  patient: PatientProfile;
  medications: Medication[];
  markDoseTaken: (medicationId: string, timeOfDay: TimeOfDay) => void;
  addMedication: (medication: Omit<Medication, 'id' | 'takenToday'>) => void;
  deleteMedication: (id: string) => void;

  vitals: VitalSign[];
  addVital: (vital: Omit<VitalSign, 'id' | 'timestamp' | 'status'>) => void;

  appointments: DoctorAppointment[];
  addAppointment: (appt: Omit<DoctorAppointment, 'id' | 'status'>) => void;

  adherenceLogs: AdherenceDayLog[];
  escalations: EscalationLog[];
  addEscalation: (esc: Omit<EscalationLog, 'id' | 'timestamp'>) => void;

  caretakerNotes: CaretakerNote[];
  addCaretakerNote: (note: Omit<CaretakerNote, 'id' | 'date'>) => void;

  accessibility: AccessibilitySettings;
  toggleHighContrast: () => void;
  setFontSize: (size: 'normal' | 'large' | 'huge') => void;
  toggleSpeech: () => void;
  toggleLanguage: () => void;

  isSosActive: boolean;
  triggerSos: () => void;
  cancelSos: () => void;

  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  activeNotificationCount: number;

  assistantModalOpen: boolean;
  setAssistantModalOpen: (open: boolean) => void;

  readAloud: (text: string, hindiText?: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MASTER_PIN = '1234';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('elder');
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [targetRoleForPin, setTargetRoleForPin] = useState<Role | null>(null);

  const [patient] = useState<PatientProfile>(INITIAL_PATIENT);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [vitals, setVitals] = useState<VitalSign[]>(INITIAL_VITALS);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>(INITIAL_APPOINTMENTS);
  const [adherenceLogs, setAdherenceLogs] = useState<AdherenceDayLog[]>(INITIAL_ADHERENCE_LOGS);
  const [escalations, setEscalations] = useState<EscalationLog[]>(INITIAL_ESCALATIONS);
  const [caretakerNotes, setCaretakerNotes] = useState<CaretakerNote[]>(INITIAL_CARETAKER_NOTES);

  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState<boolean>(false);
  const [assistantModalOpen, setAssistantModalOpen] = useState<boolean>(false);

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    speechEnabled: true,
    language: 'en'
  });

  // Apply high-contrast class to root body
  useEffect(() => {
    if (accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [accessibility.highContrast]);

  const requestRoleSwitch = (newRole: Role) => {
    if (newRole === role) return;
    if (newRole === 'elder') {
      // Switching to elder view requires no barrier for elderly user ease
      setRole('elder');
    } else {
      // Caretaker or Family views require simple 4-digit PIN (1234)
      setTargetRoleForPin(newRole);
      setPinModalOpen(true);
    }
  };

  const confirmRoleSwitch = (pin: string): boolean => {
    if (pin === MASTER_PIN && targetRoleForPin) {
      setRole(targetRoleForPin);
      setPinModalOpen(false);
      setTargetRoleForPin(null);
      soundEffects.playSuccessChime();
      return true;
    }
    soundEffects.playWarningBuzz();
    return false;
  };

  const readAloud = (text: string, hindiText?: string) => {
    if (!accessibility.speechEnabled) return;
    const content = accessibility.language === 'hi' && hindiText ? hindiText : text;
    speechService.speak(content, {
      lang: accessibility.language === 'hi' ? 'hi-IN' : 'en-IN'
    });
  };

  const markDoseTaken = (medicationId: string, timeOfDay: TimeOfDay) => {
    // 1. Play auditory chime and visual confetti
    soundEffects.playSuccessChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#16a34a', '#22c55e', '#86efac', '#eab308']
      });
    } catch {
      // fallback safe
    }

    // 2. Update medication takenToday state & remaining pill count
    let updatedMedName = '';
    setMedications(prev =>
      prev.map(med => {
        if (med.id === medicationId) {
          updatedMedName = med.name;
          const currentTaken = med.takenToday?.[timeOfDay];
          const newRemaining = Math.max(0, med.remainingPills - (currentTaken ? 0 : 1));
          return {
            ...med,
            remainingPills: newRemaining,
            takenToday: {
              ...med.takenToday,
              [timeOfDay]: true
            }
          };
        }
        return med;
      })
    );

    // 3. Update adherence logs
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAdherenceLogs(prev => {
      const today = prev[0];
      if (!today) return prev;
      const updatedDoses = today.doses.map(d =>
        d.medicationId === medicationId && d.timeOfDay === timeOfDay
          ? { ...d, status: 'taken' as const, timestamp: nowTime }
          : d
      );
      const takenCount = updatedDoses.filter(d => d.status === 'taken').length;
      return [
        {
          ...today,
          taken: takenCount,
          doses: updatedDoses
        },
        ...prev.slice(1)
      ];
    });

    // 4. Voice confirmation
    if (accessibility.speechEnabled) {
      const msg = accessibility.language === 'hi'
        ? `शाबाश! आपने ${updatedMedName} ले ली है।`
        : `Well done! You have marked ${updatedMedName} as taken.`;
      readAloud(msg, msg);
    }
  };

  const addMedication = (newMed: Omit<Medication, 'id' | 'takenToday'>) => {
    const id = `med-${Date.now()}`;
    const completeMed: Medication = {
      ...newMed,
      id,
      takenToday: {}
    };

    setMedications(prev => [completeMed, ...prev]);
    soundEffects.playSuccessChime();

    // Auto-generate notification
    addEscalation({
      type: 'REFILL_ALERT',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Update] New prescription added for Ram Prasad: ${newMed.name} (${newMed.dosage}). Schedule: ${newMed.schedule.join(', ')}.`,
      status: 'SENT'
    });
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const addVital = (vitalData: Omit<VitalSign, 'id' | 'timestamp' | 'status'>) => {
    const isWarning =
      vitalData.systolicBP > 140 ||
      vitalData.diastolicBP > 90 ||
      vitalData.bloodSugarMgDl > 180;

    const isCritical =
      vitalData.systolicBP > 160 ||
      vitalData.diastolicBP > 105 ||
      vitalData.bloodSugarMgDl > 250;

    const status: VitalSign['status'] = isCritical ? 'critical' : isWarning ? 'warning' : 'normal';

    const newVital: VitalSign = {
      ...vitalData,
      id: `vital-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status
    };

    setVitals(prev => [newVital, ...prev]);

    if (isCritical || isWarning) {
      soundEffects.playWarningBuzz();
      // Auto escalate to Family & Caregiver
      addEscalation({
        type: 'CRITICAL_VITAL',
        recipientRole: 'family',
        recipientName: 'Priya Sharma (Daughter)',
        recipientContact: '+91 98765 43210',
        channel: 'WHATSAPP',
        message: `[AayuCare Vitals Alert] Elevated vitals recorded for Ram Prasad: BP ${vitalData.systolicBP}/${vitalData.diastolicBP} mmHg, Blood Sugar ${vitalData.bloodSugarMgDl} mg/dL. Immediate caregiver check advised.`,
        status: 'DELIVERED'
      });
    } else {
      soundEffects.playSuccessChime();
    }
  };

  const addAppointment = (apptData: Omit<DoctorAppointment, 'id' | 'status'>) => {
    const apptDate = new Date(apptData.appointmentDateTime);
    const now = new Date();
    const diffDays = Math.max(0, Math.ceil((apptDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));

    const newAppt: DoctorAppointment = {
      ...apptData,
      id: `appt-${Date.now()}`,
      countdownDays: diffDays,
      status: 'upcoming'
    };

    setAppointments(prev => [...prev, newAppt]);
    soundEffects.playSuccessChime();

    // Auto escalation to family
    addEscalation({
      type: 'MISSED_DOSE',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Appointment] Confirmed appointment with ${apptData.doctorName} (${apptData.specialty}) at ${apptData.hospitalName} on ${apptDate.toLocaleDateString()}.`,
      status: 'SENT'
    });
  };

  const addEscalation = (escData: Omit<EscalationLog, 'id' | 'timestamp'>) => {
    const newEsc: EscalationLog = {
      ...escData,
      id: `esc-${Date.now()}`,
      timestamp: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    };
    setEscalations(prev => [newEsc, ...prev]);
  };

  const addCaretakerNote = (noteData: Omit<CaretakerNote, 'id' | 'date'>) => {
    const newNote: CaretakerNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setCaretakerNotes(prev => [newNote, ...prev]);
    soundEffects.playSuccessChime();
  };

  const toggleHighContrast = () => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (fontSize: 'normal' | 'large' | 'huge') => {
    setAccessibility(prev => ({ ...prev, fontSize }));
  };

  const toggleSpeech = () => {
    setAccessibility(prev => {
      const next = !prev.speechEnabled;
      if (!next) speechService.stop();
      return { ...prev, speechEnabled: next };
    });
  };

  const toggleLanguage = () => {
    setAccessibility(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en'
    }));
  };

  const triggerSos = () => {
    setIsSosActive(true);
    soundEffects.startEmergencySiren();
    addEscalation({
      type: 'EMERGENCY_SOS',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'AUTOMATED_CALL',
      message: `[AAYUCARE EMERGENCY SOS TRIGGERED] Ram Prasad Sharma pressed the SOS button at C-Block, Greater Kailash-I, New Delhi. Ambulance service (108) and nearby caretaker alerted.`,
      status: 'SENT'
    });
    if (accessibility.speechEnabled) {
      const alertMsg = accessibility.language === 'hi'
        ? 'आपातकालीन सहायता सक्रिय कर दी गई है। परिवार और देखभालकर्ता को सूचित कर दिया गया है।'
        : 'Emergency SOS activated. Family and medical assistance are being contacted immediately.';
      readAloud(alertMsg, alertMsg);
    }
  };

  const cancelSos = () => {
    setIsSosActive(false);
    soundEffects.stopEmergencySiren();
  };

  const activeNotificationCount = escalations.length;

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        pinModalOpen,
        setPinModalOpen,
        targetRoleForPin,
        requestRoleSwitch,
        confirmRoleSwitch,
        patient,
        medications,
        markDoseTaken,
        addMedication,
        deleteMedication,
        vitals,
        addVital,
        appointments,
        addAppointment,
        adherenceLogs,
        escalations,
        addEscalation,
        caretakerNotes,
        addCaretakerNote,
        accessibility,
        toggleHighContrast,
        setFontSize,
        toggleSpeech,
        toggleLanguage,
        isSosActive,
        triggerSos,
        cancelSos,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        activeNotificationCount,
        assistantModalOpen,
        setAssistantModalOpen,
        readAloud
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

