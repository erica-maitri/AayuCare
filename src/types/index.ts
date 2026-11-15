export type Role = 'elder' | 'caretaker' | 'family';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type DoseStatus = 'taken' | 'missed' | 'snoozed' | 'pending';

export interface Medication {
  id: string;
  name: string;
  brandName?: string;
  dosage: string;
  unit: string;
  activeIngredient: string;
  category: string;
  schedule: TimeOfDay[];
  scheduledTimes: {
    morning?: string;
    afternoon?: string;
    evening?: string;
    night?: string;
  };
  instructions: string;
  hindiInstructions?: string;
  foodRelation: 'before_food' | 'after_food' | 'with_food' | 'empty_stomach';
  shape: 'round' | 'oval' | 'capsule' | 'drop';
  color: string;
  remainingPills: number;
  totalPills: number;
  refillThreshold: number;
  prescribedBy: string;
  purpose: string;
  startDate: string;
  takenToday: {
    Morning?: boolean;
    Afternoon?: boolean;
    Evening?: boolean;
    Night?: boolean;
  };
}

export interface DrugConflictRule {
  id: string;
  drugA: string; // active ingredient or drug category
  drugB: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE';
  title: string;
  description: string;
  mechanism: string;
  recommendation: string;
}

export interface DrugConflictAlert {
  rule: DrugConflictRule;
  existingMedication: Medication;
  proposedMedication: {
    name: string;
    activeIngredient: string;
  };
}

export interface VitalSign {
  id: string;
  timestamp: string;
  systolicBP: number;
  diastolicBP: number;
  pulseRate: number;
  bloodSugarMgDl: number;
  sugarContext: 'fasting' | 'post_prandial' | 'random';
  weightKg?: number;
  notes?: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface DoctorAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  hospitalName: string;
  locationAddress: string;
  contactNumber: string;
  appointmentDateTime: string; // ISO string
  countdownDays?: number;
  preparationNotes: string[];
  purpose: string;
  status: 'upcoming' | 'completed' | 'rescheduled';
}

export interface AdherenceDayLog {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  totalScheduled: number;
  taken: number;
  missed: number;
  snoozed: number;
  doses: {
    medicationId: string;
    medicationName: string;
    timeOfDay: TimeOfDay;
    status: DoseStatus;
    timestamp?: string;
  }[];
}

export interface EscalationLog {
  id: string;
  timestamp: string;
  type: 'MISSED_DOSE' | 'CRITICAL_VITAL' | 'EMERGENCY_SOS' | 'REFILL_ALERT' | 'DRUG_CONFLICT_BLOCKED';
  recipientRole: 'family' | 'caretaker' | 'doctor';
  recipientName: string;
  recipientContact: string;
  channel: 'SMS' | 'WHATSAPP' | 'AUTOMATED_CALL';
  message: string;
  status: 'SENT' | 'DELIVERED' | 'ACKNOWLEDGED';
}

export interface CaretakerNote {
  id: string;
  date: string;
  author: string;
  mood: 'Energetic' | 'Calm' | 'Fatigued' | 'Irritable' | 'Confused';
  sleepHours: number;
  dietIntake: 'Full Meal' | 'Partial' | 'Poor';
  observations: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'huge';
  speechEnabled: boolean;
  language: 'en' | 'hi';
}

export interface PatientProfile {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  photoUrl: string;
  bloodGroup: string;
  conditions: string[];
  allergies: string[];
  primaryLanguage: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  caretakerContact: {
    name: string;
    phone: string;
  };
  doctorContact: {
    name: string;
    phone: string;
    clinic: string;
  };
  currentLocation: {
    city: string;
    area: string;
    landmark: string;
  };
}
