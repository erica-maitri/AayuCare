import React, { useState } from 'react';
import { X, Calendar, Plus, Clock, MapPin, Stethoscope, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AddAppointmentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { addAppointment, accessibility } = useApp();

  const [doctorName, setDoctorName] = useState('');
  const [specialty, setSpecialty] = useState('Geriatric Medicine');
  const [hospitalName, setHospitalName] = useState('');
  const [locationAddress, setLocationAddress] = useState('New Delhi');
  const [contactNumber, setContactNumber] = useState('+91 11 4055 3300');
  const [appointmentDateTime, setAppointmentDateTime] = useState('');
  const [purpose, setPurpose] = useState('Routine Checkup & Prescription Review');
  const [prepNotes, setPrepNotes] = useState('Carry recent blood test reports and medication strips');

  if (!isOpen) return null;

  const isHindi = accessibility.language === 'hi';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName || !hospitalName || !appointmentDateTime) return;

    addAppointment({
      doctorName,
      specialty,
      hospitalName,
      locationAddress,
      contactNumber,
      appointmentDateTime,
      purpose,
      preparationNotes: prepNotes.split(',').map(s => s.trim()).filter(Boolean)
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {isHindi ? 'डॉक्टर अपॉइंटमेंट जोड़ें' : 'Schedule Doctor Visit'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHindi ? 'तैयारी निर्देश व एसएमएस सूचना के साथ' : 'With automated preparation alerts & countdown'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Doctor Name *
              </label>
              <input
                type="text"
                required
                value={doctorName}
                onChange={e => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Ananya Sen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Medical Specialty *
              </label>
              <select
                value={specialty}
                onChange={e => setSpecialty(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                <option value="Endocrinologist & Diabetologist">Endocrinologist & Diabetologist</option>
                <option value="Senior Cardiologist">Senior Cardiologist</option>
                <option value="Orthopedic & Joint Surgeon">Orthopedic & Joint Surgeon</option>
                <option value="Geriatric Specialist">Geriatric Specialist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="General Physician">General Physician</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hospital / Clinic Name *
              </label>
              <input
                type="text"
                required
                value={hospitalName}
                onChange={e => setHospitalName(e.target.value)}
                placeholder="e.g. Max Super Speciality Hospital, Saket"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Location / City Area
              </label>
              <input
                type="text"
                value={locationAddress}
                onChange={e => setLocationAddress(e.target.value)}
                placeholder="e.g. Saket, New Delhi"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hospital Phone Contact
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="e.g. +91 11 4055 3300"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={appointmentDateTime}
                onChange={e => setAppointmentDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Appointment Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                placeholder="e.g. Routine HbA1c review, Cardiac 2D Echo"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Preparation Instructions (Comma-separated)
              </label>
              <input
                type="text"
                value={prepNotes}
                onChange={e => setPrepNotes(e.target.value)}
                placeholder="e.g. 10-hour fasting required, Carry glucometer, Bring past ECG"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              />
            </div>

          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Schedule Appointment</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
