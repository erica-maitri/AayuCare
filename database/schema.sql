-- ==============================================================================
-- AAYUCARE ENTERPRISE HEALTHCARE PLATFORM: RELATIONAL DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Target Platform: Elderly Care & Medication Management Platform
-- Optimized for high-throughput telemetry, drug-conflict indexing, and zero-latency lookups.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PATIENTS ENTITY
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    age INT NOT NULL CHECK (age >= 0 AND age <= 130),
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    emergency_contact_name VARCHAR(120) NOT NULL,
    emergency_contact_phone VARCHAR(25) NOT NULL,
    emergency_contact_relation VARCHAR(50) NOT NULL,
    current_area VARCHAR(100),
    current_city VARCHAR(100),
    allergies TEXT[] DEFAULT '{}',
    primary_conditions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for emergency lookup by phone
CREATE INDEX IF NOT EXISTS idx_patients_emergency_phone ON patients(emergency_contact_phone);

-- 2. MEDICATIONS & PRESCRIPTION ENTITY
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    brand_name VARCHAR(150),
    active_ingredient VARCHAR(150) NOT NULL,
    dosage VARCHAR(50) NOT NULL,
    unit VARCHAR(20) DEFAULT 'mg',
    category VARCHAR(80) NOT NULL,
    schedule TEXT[] NOT NULL, -- e.g. ['Morning', 'Night']
    scheduled_morning TIME,
    scheduled_afternoon TIME,
    scheduled_evening TIME,
    scheduled_night TIME,
    instructions TEXT NOT NULL,
    hindi_instructions TEXT,
    food_relation VARCHAR(50) DEFAULT 'after_food',
    color_hex VARCHAR(20) DEFAULT '#ffffff',
    remaining_pills INT NOT NULL DEFAULT 30 CHECK (remaining_pills >= 0),
    total_pills INT NOT NULL DEFAULT 30,
    refill_threshold INT NOT NULL DEFAULT 7,
    prescribed_by VARCHAR(120),
    purpose VARCHAR(255),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup index for live drug-to-drug conflict resolution
CREATE INDEX IF NOT EXISTS idx_meds_patient_ingredient ON medications(patient_id, LOWER(active_ingredient)) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_meds_schedule ON medications(patient_id, is_active);

-- 3. CLINICAL TELEMETRY & VITALS ENTITY
CREATE TABLE IF NOT EXISTS vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    systolic_bp INT NOT NULL CHECK (systolic_bp BETWEEN 50 AND 300),
    diastolic_bp INT NOT NULL CHECK (diastolic_bp BETWEEN 30 AND 200),
    pulse_rate INT NOT NULL CHECK (pulse_rate BETWEEN 30 AND 250),
    blood_sugar_mg_dl INT NOT NULL CHECK (blood_sugar_mg_dl BETWEEN 20 AND 800),
    sugar_context VARCHAR(30) NOT NULL DEFAULT 'fasting', -- fasting, post_prandial, random
    weight_kg NUMERIC(5,2),
    status VARCHAR(20) NOT NULL DEFAULT 'normal', -- normal, warning, critical
    notes TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Time-series telemetry index for fast dashboard trends
CREATE INDEX IF NOT EXISTS idx_vitals_patient_timeline ON vitals(patient_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_critical_alerts ON vitals(patient_id, status) WHERE status = 'critical';

-- 4. 7-DAY COMPLIANCE & ADHERENCE LOGS
CREATE TABLE IF NOT EXISTS adherence_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    medication_id UUID NOT NULL REFERENCES medications(id) ON DELETE CASCADE,
    scheduled_time_of_day VARCHAR(20) NOT NULL, -- Morning, Afternoon, Evening, Night
    status VARCHAR(20) NOT NULL DEFAULT 'TAKEN', -- TAKEN, MISSED, SNOOZED
    taken_at TIMESTAMPTZ,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index for compliance percentage queries
CREATE INDEX IF NOT EXISTS idx_adherence_patient_date ON adherence_logs(patient_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_adherence_status ON adherence_logs(patient_id, status);

-- 5. DRUG INTERACTION CONFLICT KNOWLEDGE BASE
CREATE TABLE IF NOT EXISTS drug_conflict_rules (
    id VARCHAR(80) PRIMARY KEY,
    drug_a VARCHAR(120) NOT NULL,
    drug_b VARCHAR(120) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('CRITICAL', 'HIGH', 'MODERATE', 'LOW')),
    mechanism TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bi-directional interaction index
CREATE INDEX IF NOT EXISTS idx_conflict_drugs ON drug_conflict_rules(LOWER(drug_a), LOWER(drug_b));

-- 6. AUTOMATED TELEMETRY ESCALATION LOGS
CREATE TABLE IF NOT EXISTS escalation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- MISSED_DOSE, CRITICAL_VITAL, EMERGENCY_SOS, REFILL_ALERT
    recipient_role VARCHAR(30) NOT NULL DEFAULT 'family',
    recipient_name VARCHAR(120) NOT NULL,
    recipient_contact VARCHAR(25) NOT NULL,
    channel VARCHAR(20) NOT NULL, -- SMS, WHATSAPP, VOICE_CALL
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SENT', -- QUEUED, SENT, DELIVERED, FAILED
    carrier_status_code VARCHAR(50) DEFAULT '200_OK',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_escalations_patient ON escalation_logs(patient_id, created_at DESC);

-- 7. APPOINTMENTS ENTITY
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_name VARCHAR(120) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    hospital_name VARCHAR(150) NOT NULL,
    location_address VARCHAR(255),
    contact_number VARCHAR(25),
    appointment_time TIMESTAMPTZ NOT NULL,
    purpose VARCHAR(255),
    preparation_notes TEXT[] DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'UPCOMING',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_time ON appointments(patient_id, appointment_time ASC);
