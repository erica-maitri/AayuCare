import { PatientProfile, Medication, VitalSign, DoctorAppointment, AdherenceDayLog, EscalationLog, CaretakerNote } from '../types';

export const INITIAL_PATIENT: PatientProfile = {
  id: 'patient-ram-prasad',
  fullName: 'Ram Prasad Sharma',
  age: 76,
  gender: 'Male',
  photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=300&auto=format&fit=crop&q=80',
  bloodGroup: 'B+ Positive',
  conditions: ['Type-2 Diabetes Mellitus', 'Hypertension (High BP)', 'Mild Osteoarthritis'],
  allergies: ['Penicillin', 'Sulfa Drugs'],
  primaryLanguage: 'Hindi / English',
  emergencyContact: {
    name: 'Priya Sharma (Daughter)',
    relationship: 'Daughter / Legal Guardian',
    phone: '+91 98765 43210'
  },
  caretakerContact: {
    name: 'Ramesh Yadav',
    phone: '+91 98111 22334'
  },
  doctorContact: {
    name: 'Dr. Ananya Sen (Endocrinologist)',
    phone: '+91 11 4055 3300',
    clinic: 'Max Super Speciality Hospital, Saket'
  },
  currentLocation: {
    city: 'New Delhi',
    area: 'C-Block, Greater Kailash-I',
    landmark: 'Near M-Block Market'
  }
};

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-metformin-500',
    name: 'Glycomet (Metformin)',
    brandName: 'Glycomet 500 SR',
    dosage: '500 mg',
    unit: 'mg',
    activeIngredient: 'Metformin',
    category: 'Oral Antidiabetic',
    schedule: ['Morning', 'Night'],
    scheduledTimes: {
      morning: '08:30 AM',
      night: '08:30 PM'
    },
    instructions: 'Take with warm water immediately after meals.',
    hindiInstructions: 'भोजन के तुरंत बाद गुनगुने पानी के साथ लें।',
    foodRelation: 'after_food',
    shape: 'oval',
    color: '#ffffff',
    remainingPills: 28,
    totalPills: 60,
    refillThreshold: 10,
    prescribedBy: 'Dr. Ananya Sen',
    purpose: 'Controls blood glucose levels in Type-2 Diabetes',
    startDate: '2023-04-10',
    takenToday: {
      Morning: true,
      Night: false
    }
  },
  {
    id: 'med-telmisartan-40',
    name: 'Telma (Telmisartan)',
    brandName: 'Telma 40',
    dosage: '40 mg',
    unit: 'mg',
    activeIngredient: 'Telmisartan',
    category: 'Angiotensin Receptor Blocker (ARB)',
    schedule: ['Morning'],
    scheduledTimes: {
      morning: '09:00 AM'
    },
    instructions: 'Take 30 minutes after breakfast. Do not crush tablet.',
    hindiInstructions: 'नाश्ते के 30 मिनट बाद लें। गोली को चबाएं नहीं।',
    foodRelation: 'after_food',
    shape: 'round',
    color: '#fed7aa',
    remainingPills: 14,
    totalPills: 30,
    refillThreshold: 7,
    prescribedBy: 'Dr. Rajesh Gupta',
    purpose: 'Lowers blood pressure and protects kidney function',
    startDate: '2022-11-15',
    takenToday: {
      Morning: true
    }
  },
  {
    id: 'med-ecosprin-75',
    name: 'Ecosprin (Aspirin)',
    brandName: 'Ecosprin 75',
    dosage: '75 mg',
    unit: 'mg',
    activeIngredient: 'Aspirin',
    category: 'Antiplatelet (Blood Thinner)',
    schedule: ['Afternoon'],
    scheduledTimes: {
      afternoon: '01:30 PM'
    },
    instructions: 'Take strictly after a full lunch with a whole glass of water.',
    hindiInstructions: 'दोपहर के पूरे भोजन के बाद एक गिलास पानी से लें।',
    foodRelation: 'after_food',
    shape: 'round',
    color: '#bae6fd',
    remainingPills: 6, // Low supply trigger!
    totalPills: 30,
    refillThreshold: 8,
    prescribedBy: 'Dr. Rajesh Gupta',
    purpose: 'Prevents cardiovascular blood clot formation',
    startDate: '2021-08-20',
    takenToday: {
      Afternoon: false
    }
  },
  {
    id: 'med-atorva-20',
    name: 'Atorva (Atorvastatin)',
    brandName: 'Atorva 20',
    dosage: '20 mg',
    unit: 'mg',
    activeIngredient: 'Atorvastatin',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    schedule: ['Night'],
    scheduledTimes: {
      night: '09:30 PM'
    },
    instructions: 'Take at bedtime after light dinner. Avoid grapefruit.',
    hindiInstructions: 'रात को सोने से पहले लें। अंगूर का सेवन न करें।',
    foodRelation: 'after_food',
    shape: 'oval',
    color: '#e2e8f0',
    remainingPills: 22,
    totalPills: 30,
    refillThreshold: 7,
    prescribedBy: 'Dr. Rajesh Gupta',
    purpose: 'Maintains optimal LDL cholesterol & plaque stabilization',
    startDate: '2022-03-01',
    takenToday: {
      Night: false
    }
  },
  {
    id: 'med-pantoprazole-40',
    name: 'Pan-40 (Pantoprazole)',
    brandName: 'Pan 40',
    dosage: '40 mg',
    unit: 'mg',
    activeIngredient: 'Pantoprazole',
    category: 'Proton Pump Inhibitor (PPI)',
    schedule: ['Morning'],
    scheduledTimes: {
      morning: '07:30 AM'
    },
    instructions: 'Take 30 minutes before first morning tea or breakfast on an empty stomach.',
    hindiInstructions: 'सुबह खाली पेट, चाय या नाश्ते से 30 मिनट पहले लें।',
    foodRelation: 'empty_stomach',
    shape: 'capsule',
    color: '#fef08a',
    remainingPills: 19,
    totalPills: 30,
    refillThreshold: 5,
    prescribedBy: 'Dr. Ananya Sen',
    purpose: 'Prevents gastric acidity and protects stomach lining from Aspirin',
    startDate: '2023-01-10',
    takenToday: {
      Morning: true
    }
  },
  {
    id: 'med-shelcal-500',
    name: 'Shelcal-500 (Calcium + D3)',
    brandName: 'Shelcal 500',
    dosage: '500 mg',
    unit: 'mg',
    activeIngredient: 'Calcium Carbonate + Vit D3',
    category: 'Nutritional Supplement',
    schedule: ['Afternoon'],
    scheduledTimes: {
      afternoon: '02:00 PM'
    },
    instructions: 'Take after lunch. Do not take within 4 hours of thyroid medicine.',
    hindiInstructions: 'दोपहर के भोजन के बाद लें। हड्डियों को मजबूती देता है।',
    foodRelation: 'after_food',
    shape: 'oval',
    color: '#f1f5f9',
    remainingPills: 18,
    totalPills: 30,
    refillThreshold: 7,
    prescribedBy: 'Dr. Meenakshi Roy',
    purpose: 'Bone mineral density support for osteoarthritis',
    startDate: '2023-09-05',
    takenToday: {
      Afternoon: false
    }
  }
];

export const INITIAL_VITALS: VitalSign[] = [
  {
    id: 'vital-1',
    timestamp: 'Today, 08:00 AM',
    systolicBP: 128,
    diastolicBP: 82,
    pulseRate: 72,
    bloodSugarMgDl: 114,
    sugarContext: 'fasting',
    weightKg: 68.4,
    notes: 'Well rested. Morning walk 20 minutes in society park.',
    status: 'normal'
  },
  {
    id: 'vital-2',
    timestamp: 'Yesterday, 07:45 PM',
    systolicBP: 134,
    diastolicBP: 86,
    pulseRate: 75,
    bloodSugarMgDl: 152,
    sugarContext: 'post_prandial',
    weightKg: 68.5,
    notes: 'Dinner post 2 hours. Mild knee stiffness reported.',
    status: 'normal'
  },
  {
    id: 'vital-3',
    timestamp: 'Yesterday, 08:15 AM',
    systolicBP: 130,
    diastolicBP: 84,
    pulseRate: 70,
    bloodSugarMgDl: 118,
    sugarContext: 'fasting',
    weightKg: 68.6,
    notes: 'Fasting glucose within ideal geriatric target (100-125).',
    status: 'normal'
  },
  {
    id: 'vital-4',
    timestamp: '3 days ago, 08:00 AM',
    systolicBP: 142,
    diastolicBP: 92,
    pulseRate: 78,
    bloodSugarMgDl: 138,
    sugarContext: 'fasting',
    weightKg: 68.8,
    notes: 'Slightly elevated BP due to disturbed sleep the previous night.',
    status: 'warning'
  },
  {
    id: 'vital-5',
    timestamp: '4 days ago, 08:30 AM',
    systolicBP: 126,
    diastolicBP: 80,
    pulseRate: 68,
    bloodSugarMgDl: 110,
    sugarContext: 'fasting',
    weightKg: 68.5,
    notes: 'Optimal vitals. Patient in cheerful mood.',
    status: 'normal'
  }
];

export const INITIAL_APPOINTMENTS: DoctorAppointment[] = [
  {
    id: 'appt-1',
    doctorName: 'Dr. Ananya Sen',
    specialty: 'Senior Endocrinologist & Diabetologist',
    hospitalName: 'Max Super Speciality Hospital',
    locationAddress: '1, Press Enclave Road, Saket, New Delhi',
    contactNumber: '+91 11 4055 3300',
    appointmentDateTime: '2026-11-20T10:30:00',
    countdownDays: 5,
    preparationNotes: [
      'Overnight fasting of 10-12 hours required before blood draw',
      'Carry past 30 days blood sugar log chart and glucometer',
      'Bring all current prescription strips & pill containers',
      'Wear loose-sleeved shirt for effortless venous blood sampling'
    ],
    purpose: 'Routine 3-month HbA1c review and diabetic foot examination',
    status: 'upcoming'
  },
  {
    id: 'appt-2',
    doctorName: 'Dr. Rajesh K. Gupta',
    specialty: 'Senior Consultant Cardiologist',
    hospitalName: 'Fortis Escorts Heart Institute',
    locationAddress: 'Okhla Road, New Friends Colony, New Delhi',
    contactNumber: '+91 11 4713 5000',
    appointmentDateTime: '2026-11-28T16:00:00',
    countdownDays: 13,
    preparationNotes: [
      'Bring 7-day morning & evening Blood Pressure record sheet',
      'Carry previous ECG and Echo reports (from June)',
      'Take regular morning blood pressure tablet (Telma 40) as usual'
    ],
    purpose: 'Semi-annual cardiac status check and echocardiogram review',
    status: 'upcoming'
  },
  {
    id: 'appt-3',
    doctorName: 'Dr. Meenakshi Roy',
    specialty: 'Orthopedic & Joint Specialist',
    hospitalName: 'Apollo Cradle & Ortho Clinic',
    locationAddress: 'Defence Colony, Flyover Market, New Delhi',
    contactNumber: '+91 11 2433 8989',
    appointmentDateTime: '2026-12-05T11:15:00',
    countdownDays: 20,
    preparationNotes: [
      'Carry latest bilateral knee X-rays (Standing AP & Lateral views)',
      'Inform doctor regarding current physical therapy exercises'
    ],
    purpose: 'Knee osteoarthritis pain management and mobility assessment',
    status: 'upcoming'
  }
];

export const INITIAL_ADHERENCE_LOGS: AdherenceDayLog[] = [
  {
    date: '2026-11-15',
    dayOfWeek: 'Today',
    totalScheduled: 5,
    taken: 3,
    missed: 0,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken', timestamp: '07:35 AM' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken', timestamp: '08:40 AM' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken', timestamp: '09:05 AM' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'pending' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'pending' }
    ]
  },
  {
    date: '2026-11-14',
    dayOfWeek: 'Saturday',
    totalScheduled: 6,
    taken: 5,
    missed: 1,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken', timestamp: '07:40 AM' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken', timestamp: '08:45 AM' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken', timestamp: '09:10 AM' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'missed', timestamp: '02:30 PM (Slept early)' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken', timestamp: '03:15 PM' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'taken', timestamp: '09:45 PM' }
    ]
  },
  {
    date: '2026-11-13',
    dayOfWeek: 'Friday',
    totalScheduled: 6,
    taken: 6,
    missed: 0,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken', timestamp: '07:30 AM' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken', timestamp: '08:35 AM' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken', timestamp: '09:00 AM' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'taken', timestamp: '01:45 PM' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken', timestamp: '02:10 PM' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'taken', timestamp: '09:30 PM' }
    ]
  },
  {
    date: '2026-11-12',
    dayOfWeek: 'Thursday',
    totalScheduled: 6,
    taken: 5,
    missed: 0,
    snoozed: 1,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken', timestamp: '07:30 AM' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken', timestamp: '08:30 AM' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken', timestamp: '09:00 AM' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'snoozed', timestamp: 'Postponed 45m' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken', timestamp: '02:00 PM' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'taken', timestamp: '09:30 PM' }
    ]
  },
  {
    date: '2026-11-11',
    dayOfWeek: 'Wednesday',
    totalScheduled: 6,
    taken: 6,
    missed: 0,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'taken' }
    ]
  },
  {
    date: '2026-11-10',
    dayOfWeek: 'Tuesday',
    totalScheduled: 6,
    taken: 6,
    missed: 0,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'taken' }
    ]
  },
  {
    date: '2026-11-09',
    dayOfWeek: 'Monday',
    totalScheduled: 6,
    taken: 5,
    missed: 1,
    snoozed: 0,
    doses: [
      { medicationId: 'med-pantoprazole-40', medicationName: 'Pan-40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-metformin-500', medicationName: 'Glycomet 500', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-telmisartan-40', medicationName: 'Telma 40', timeOfDay: 'Morning', status: 'taken' },
      { medicationId: 'med-ecosprin-75', medicationName: 'Ecosprin 75', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-shelcal-500', medicationName: 'Shelcal-500', timeOfDay: 'Afternoon', status: 'taken' },
      { medicationId: 'med-atorva-20', medicationName: 'Atorva 20', timeOfDay: 'Night', status: 'missed', timestamp: 'Forgot before bed' }
    ]
  }
];

export const INITIAL_ESCALATIONS: EscalationLog[] = [
  {
    id: 'esc-1',
    timestamp: 'Today, 09:15 AM',
    type: 'MISSED_DOSE',
    recipientRole: 'family',
    recipientName: 'Priya Sharma (Daughter)',
    recipientContact: '+91 98765 43210',
    channel: 'SMS',
    message: '[AayuCare Escalation] Ram Prasad ji successfully logged Morning doses (Pan-40, Glycomet, Telma). Adherence verified by caretaker Ramesh.',
    status: 'DELIVERED'
  },
  {
    id: 'esc-2',
    timestamp: 'Yesterday, 02:45 PM',
    type: 'MISSED_DOSE',
    recipientRole: 'family',
    recipientName: 'Priya Sharma (Daughter)',
    recipientContact: '+91 98765 43210',
    channel: 'WHATSAPP',
    message: '[AayuCare Alert] Afternoon dose (Ecosprin 75mg) not taken by 02:30 PM. Automated escalation dispatched to Caretaker Ramesh (+91 98111 22334).',
    status: 'ACKNOWLEDGED'
  },
  {
    id: 'esc-3',
    timestamp: '3 days ago, 08:45 AM',
    type: 'CRITICAL_VITAL',
    recipientRole: 'caretaker',
    recipientName: 'Ramesh Yadav (Caretaker)',
    recipientContact: '+91 98111 22334',
    channel: 'SMS',
    message: '[AayuCare Health Monitor] BP reading 142/92 mmHg logged. Exceeds standard target. Advised 15-minute rest and re-measurement.',
    status: 'DELIVERED'
  },
  {
    id: 'esc-4',
    timestamp: '5 days ago, 11:00 AM',
    type: 'REFILL_ALERT',
    recipientRole: 'family',
    recipientName: 'Priya Sharma (Daughter)',
    recipientContact: '+91 98765 43210',
    channel: 'SMS',
    message: '[AayuCare Pharmacy Alert] Ecosprin 75mg has only 6 pills remaining (Below threshold of 8). Auto-refill prompt created on 1mg/Apollo Pharmacy.',
    status: 'SENT'
  }
];

export const INITIAL_CARETAKER_NOTES: CaretakerNote[] = [
  {
    id: 'note-1',
    date: 'Today, 09:30 AM',
    author: 'Ramesh Yadav (Day Caregiver)',
    mood: 'Energetic',
    sleepHours: 7.5,
    dietIntake: 'Full Meal',
    observations: 'Ram Prasad ji enjoyed morning tea with roasted chana and took all morning tablets without hesitation. BP is stable at 128/82. Practiced 10 deep breathing exercises.'
  },
  {
    id: 'note-2',
    date: 'Yesterday, 08:00 PM',
    author: 'Ramesh Yadav (Day Caregiver)',
    mood: 'Calm',
    sleepHours: 6.5,
    dietIntake: 'Full Meal',
    observations: 'Mild right knee ache in the afternoon after walking in the market; applied Ayurvedic warm gel. Afternoon tablet was taken slightly late after his afternoon rest.'
  },
  {
    id: 'note-3',
    date: '3 days ago, 07:00 PM',
    author: 'Ramesh Yadav (Day Caregiver)',
    mood: 'Fatigued',
    sleepHours: 5.5,
    dietIntake: 'Partial',
    observations: 'Complained of sleeplessness due to festival crackers outside. Monitored BP closely. Gave warm turmeric milk before sleep.'
  }
];

