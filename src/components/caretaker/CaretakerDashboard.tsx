import React, { useState } from 'react';
import { Pill, Plus, Calendar, AlertTriangle, Check, Trash2, Clock, Phone, MapPin, RefreshCw, Activity, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AddMedicationModal } from './AddMedicationModal';
import { AddAppointmentModal } from './AddAppointmentModal';
import { VitalsLogger } from './VitalsLogger';
import { DailyNotes } from './DailyNotes';

export const CaretakerDashboard: React.FC = () => {
  const {
    patient,
    medications,
    appointments,
    markDoseTaken,
    deleteMedication,
    accessibility
  } = useApp();

  const [addMedOpen, setAddMedOpen] = useState(false);
  const [addApptOpen, setAddApptOpen] = useState(false);

  const isHindi = accessibility.language === 'hi';

  const lowStockMeds = medications.filter(m => m.remainingPills <= m.refillThreshold);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 text-left">
      
      {/* Top Welcome & Summary Header */}
      <div className="bg-gradient-to-r from-teal-800 via-slate-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-teal-950/80 border border-teal-700/80 px-3 py-1 rounded-full text-xs font-bold text-teal-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Caregiver Clinical Console</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Active Care Plan: {patient.fullName} (Age: {patient.age}y)
          </h2>
          <p className="text-teal-200 text-xs sm:text-sm mt-1 max-w-xl">
            Logged in as caregiver. Manage medication schedules, record telemetry vitals, monitor drug interactions, and document daily handovers.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setAddMedOpen(true)}
            className="px-4 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Medication</span>
          </button>

          <button
            onClick={() => setAddApptOpen(true)}
            className="px-4 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-transform active:scale-95"
          >
            <Calendar className="w-4 h-4 stroke-[3]" />
            <span>+ Book Doctor Visit</span>
          </button>
        </div>
      </div>

      {/* Refill Alerts Notification Banner */}
      {lowStockMeds.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 flex items-center justify-center font-bold flex-shrink-0">
              <RefreshCw className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm">
                Pharmacy Refill Alert: {lowStockMeds.length} Medication(s) Low
              </h4>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {lowStockMeds.map(m => `${m.name} (${m.remainingPills} pills left)`).join(', ')}. Automated alerts dispatched to family.
              </p>
            </div>
          </div>

          <a
            href="https://www.1mg.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-sm whitespace-nowrap"
          >
            Order Refill Online
          </a>
        </div>
      )}

      {/* Active Prescription Inventory Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Active Medication Inventory & Safety Matrix
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total {medications.length} active prescriptions currently monitored by the conflict engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddMedOpen(true)}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add New</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Medication</th>
                <th className="py-3 px-3">Dosage</th>
                <th className="py-3 px-3">Active Chemical</th>
                <th className="py-3 px-3">Schedule</th>
                <th className="py-3 px-3">Supply Left</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {medications.map(med => {
                const isLow = med.remainingPills <= med.refillThreshold;
                return (
                  <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-black text-slate-900 dark:text-white">
                        {med.name}
                      </div>
                      <div className="text-[11px] text-slate-500 italic">
                        {med.purpose}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700 dark:text-emerald-400">
                      {med.dosage}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">
                      {med.activeIngredient}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {med.schedule.map(s => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-bold">
                      <span className={isLow ? 'text-rose-600 flex items-center gap-1' : 'text-slate-700 dark:text-slate-300'}>
                        {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                        {med.remainingPills} / {med.totalPills} pills
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${med.name} from active prescription list?`)) {
                            deleteMedication(med.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Delete Prescription"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vitals Logger Component */}
      <VitalsLogger />

      {/* Doctor Appointments & Follow-ups */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Upcoming Doctor Visits & Clinical Consultations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synchronized with hospital schedules and family SMS alerts
              </p>
            </div>
          </div>

          <button
            onClick={() => setAddApptOpen(true)}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Visit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map(appt => (
            <div
              key={appt.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 dark:text-sky-400 bg-sky-100 dark:bg-sky-950 px-2.5 py-0.5 rounded-full">
                    {appt.specialty}
                  </span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {appt.doctorName}
                  </h4>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-1 rounded-lg">
                    In {appt.countdownDays} days
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{appt.hospitalName} ({appt.locationAddress})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{new Date(appt.appointmentDateTime).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{appt.contactNumber}</span>
                </div>
              </div>

              {/* Prep instructions */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                  Preparation Instructions:
                </span>
                <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5">
                  {appt.preparationNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Notes Handover */}
      <DailyNotes />

      {/* Modals */}
      <AddMedicationModal
        isOpen={addMedOpen}
        onClose={() => setAddMedOpen(false)}
      />

      <AddAppointmentModal
        isOpen={addApptOpen}
        onClose={() => setAddApptOpen(false)}
      />

    </div>
  );
};

