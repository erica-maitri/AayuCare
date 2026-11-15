import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
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
import { sanitizeInput, classifyVitals } from '../utils/sanitizer';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  pinModalOpen: boolean;
  setPinModalOpen: (open: boolean) => void;
  targetRoleForPin: Role | null;
  requestRoleSwitch: (role: Role) => void;
  confirmRoleSwitch: (pin: string) => boolean;
  failedPinAttempts: number;
  isLockedOut: boolean;

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
const MAX_FAILED_ATTEMPTS = 5;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<Role>('elder');
  const [pinModalOpen, setPinModalOpen] = useState<boolean>(false);
  const [targetRoleForPin, setTargetRoleForPin] = useState<Role | null>(null);

  // Security: Brute-force protection with lockout
  const [failedPinAttempts, setFailedPinAttempts] = useState<number>(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

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

  // Check lockout status
  const isLockedOut = useMemo(() => {
    if (!lockedUntil) return false;
    return Date.now() < lockedUntil;
  }, [lockedUntil]);

  const requestRoleSwitch = useCallback((newRole: Role) => {
    if (newRole === role) return;
    if (newRole === 'elder') {
      setRole('elder');
    } else {
      setTargetRoleForPin(newRole);
      setPinModalOpen(true);
    }
  }, [role]);

  const confirmRoleSwitch = useCallback((pin: string): boolean => {
    if (isLockedOut) {
      soundEffects.playWarningBuzz();
      return false;
    }

    if (pin === MASTER_PIN && targetRoleForPin) {
      setRole(targetRoleForPin);
      setPinModalOpen(false);
      setTargetRoleForPin(null);
      setFailedPinAttempts(0);
      setLockedUntil(null);
      soundEffects.playSuccessChime();
      return true;
    }

    // Failed attempt increment
    setFailedPinAttempts(prev => {
      const next = prev + 1;
      if (next >= MAX_FAILED_ATTEMPTS) {
        setLockedUntil(Date.now() + 30000); // 30 second security lockout
      }
      return next;
    });

    soundEffects.playWarningBuzz();
    return false;
  }, [isLockedOut, targetRoleForPin]);

  const readAloud = useCallback((text: string, hindiText?: string) => {
    if (!accessibility.speechEnabled) return;
    const content = accessibility.language === 'hi' && hindiText ? hindiText : text;
    speechService.speak(content, {
      lang: accessibility.language === 'hi' ? 'hi-IN' : 'en-US'
    });
  }, [accessibility.speechEnabled, accessibility.language]);

  const addEscalation = useCallback((escData: Omit<EscalationLog, 'id' | 'timestamp'>) => {
    const newEsc: EscalationLog = {
      ...escData,
      message: sanitizeInput(escData.message),
      id: `esc-${Date.now()}`,
      timestamp: `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    };
    setEscalations(prev => [newEsc, ...prev]);
  }, []);

  const markDoseTaken = useCallback((medicationId: string, timeOfDay: TimeOfDay) => {
    soundEffects.playSuccessChime();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#16a34a', '#22c55e', '#86efac', '#eab308']
      });
    } catch {
      // safe fallback
    }

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

    if (accessibility.speechEnabled) {
      const msg = accessibility.language === 'hi'
        ? `शाबाश! आपने ${updatedMedName} ले ली है।`
        : `Well done! You marked ${updatedMedName} as taken.`;
      readAloud(msg, msg);
    }
  }, [accessibility.speechEnabled, accessibility.language, readAloud]);

  const addMedication = useCallback((newMed: Omit<Medication, 'id' | 'takenToday'>) => {
    const id = `med-${Date.now()}`;
    const sanitizedMed: Medication = {
      ...newMed,
      name: sanitizeInput(newMed.name),
      activeIngredient: sanitizeInput(newMed.activeIngredient),
      instructions: sanitizeInput(newMed.instructions),
      hindiInstructions: newMed.hindiInstructions ? sanitizeInput(newMed.hindiInstructions) : undefined,
      purpose: sanitizeInput(newMed.purpose),
      id,
      takenToday: {}
    };

    setMedications(prev => [sanitizedMed, ...prev]);
    soundEffects.playSuccessChime();

    addEscalation({
      type: 'REFILL_ALERT',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Update] New prescription registered for Ram Prasad: ${sanitizedMed.name} (${sanitizedMed.dosage}). Schedule: ${sanitizedMed.schedule.join(', ')}.`,
      status: 'SENT'
    });
  }, [addEscalation]);

  const deleteMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  }, []);

  const addVital = useCallback((vitalData: Omit<VitalSign, 'id' | 'timestamp' | 'status'>) => {
    const status = classifyVitals(
      vitalData.systolicBP,
      vitalData.diastolicBP,
      vitalData.bloodSugarMgDl
    );

    const newVital: VitalSign = {
      ...vitalData,
      notes: vitalData.notes ? sanitizeInput(vitalData.notes) : 'Routine clinical record.',
      id: `vital-${Date.now()}`,
      timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status
    };

    setVitals(prev => [newVital, ...prev]);

    if (status !== 'normal') {
      soundEffects.playWarningBuzz();
      addEscalation({
        type: 'CRITICAL_VITAL',
        recipientRole: 'family',
        recipientName: 'Priya Sharma (Daughter)',
        recipientContact: '+91 98765 43210',
        channel: 'WHATSAPP',
        message: `[AayuCare Vitals Alert] Elevated measurement for Ram Prasad: BP ${vitalData.systolicBP}/${vitalData.diastolicBP} mmHg, Glucose ${vitalData.bloodSugarMgDl} mg/dL. Prompt review recommended.`,
        status: 'DELIVERED'
      });
    } else {
      soundEffects.playSuccessChime();
    }
  }, [addEscalation]);

  const addAppointment = useCallback((apptData: Omit<DoctorAppointment, 'id' | 'status'>) => {
    const apptDate = new Date(apptData.appointmentDateTime);
    const now = new Date();
    const diffDays = Math.max(0, Math.ceil((apptDate.getTime() - now.getTime()) / (1000 * 3600 * 24)));

    const newAppt: DoctorAppointment = {
      ...apptData,
      doctorName: sanitizeInput(apptData.doctorName),
      hospitalName: sanitizeInput(apptData.hospitalName),
      locationAddress: sanitizeInput(apptData.locationAddress),
      purpose: sanitizeInput(apptData.purpose),
      id: `appt-${Date.now()}`,
      countdownDays: diffDays,
      status: 'upcoming'
    };

    setAppointments(prev => [...prev, newAppt]);
    soundEffects.playSuccessChime();

    addEscalation({
      type: 'MISSED_DOSE',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'SMS',
      message: `[AayuCare Appointment] Confirmed appointment with ${newAppt.doctorName} (${newAppt.specialty}) at ${newAppt.hospitalName} on ${apptDate.toLocaleDateString()}.`,
      status: 'SENT'
    });
  }, [addEscalation]);

  const addCaretakerNote = useCallback((noteData: Omit<CaretakerNote, 'id' | 'date'>) => {
    const newNote: CaretakerNote = {
      ...noteData,
      observations: sanitizeInput(noteData.observations),
      id: `note-${Date.now()}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };
    setCaretakerNotes(prev => [newNote, ...prev]);
    soundEffects.playSuccessChime();
  }, []);

  const toggleHighContrast = useCallback(() => {
    setAccessibility(prev => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const setFontSize = useCallback((fontSize: 'normal' | 'large' | 'huge') => {
    setAccessibility(prev => ({ ...prev, fontSize }));
  }, []);

  const toggleSpeech = useCallback(() => {
    setAccessibility(prev => {
      const next = !prev.speechEnabled;
      if (!next) speechService.stop();
      return { ...prev, speechEnabled: next };
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    setAccessibility(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en'
    }));
  }, []);

  const triggerSos = useCallback(() => {
    setIsSosActive(true);
    soundEffects.startEmergencySiren();
    addEscalation({
      type: 'EMERGENCY_SOS',
      recipientRole: 'family',
      recipientName: 'Priya Sharma (Daughter)',
      recipientContact: '+91 98765 43210',
      channel: 'AUTOMATED_CALL',
      message: `[AAYUCARE EMERGENCY SOS TRIGGERED] Ram Prasad Sharma activated the emergency SOS distress signal at Greater Kailash-I, New Delhi. First responders alerted.`,
      status: 'SENT'
    });
    if (accessibility.speechEnabled) {
      const alertMsg = accessibility.language === 'hi'
        ? 'आपातकालीन सहायता सक्रिय कर दी गई है। परिवार और देखभालकर्ता को सूचित कर दिया गया है।'
        : 'Emergency SOS activated. Family and medical assistance are being contacted immediately.';
      readAloud(alertMsg, alertMsg);
    }
  }, [accessibility.speechEnabled, accessibility.language, addEscalation, readAloud]);

  const cancelSos = useCallback(() => {
    setIsSosActive(false);
    soundEffects.stopEmergencySiren();
  }, []);

  const activeNotificationCount = escalations.length;

  // Memoize entire context value for maximum rendering efficiency
  const contextValue = useMemo(() => ({
    role,
    setRole,
    pinModalOpen,
    setPinModalOpen,
    targetRoleForPin,
    requestRoleSwitch,
    confirmRoleSwitch,
    failedPinAttempts,
    isLockedOut,
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
  }), [
    role,
    pinModalOpen,
    targetRoleForPin,
    requestRoleSwitch,
    confirmRoleSwitch,
    failedPinAttempts,
    isLockedOut,
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
    activeNotificationCount,
    assistantModalOpen,
    readAloud
  ]);

  return (
    <AppContext.Provider value={contextValue}>
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
