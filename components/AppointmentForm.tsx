import React, { useState } from 'react';
import { Calendar, User, Mail, Beaker, CheckCircle } from 'lucide-react';
import { LabTest, Appointment } from '../types';

interface AppointmentFormProps {
  tests: LabTest[];
  preSelectedTestId?: string;
  onSuccess: () => void;
  onSubmit: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({ tests, preSelectedTestId, onSuccess, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    time: '',
    testId: preSelectedTestId || '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      patientName: formData.name,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      testId: formData.testId,
      testName: tests.find(t => t.id === formData.testId)?.name || 'Unknown Test',
      notes: formData.notes
    });

    setSubmitted(true);
    setTimeout(() => {
      onSuccess();
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
          <p className="text-slate-500 mb-6">
            We have received your appointment request. A confirmation email has been sent to {formData.email}.
          </p>
          <button 
            onClick={onSuccess}
            className="w-full bg-medical-600 text-white rounded-md py-2 font-medium hover:bg-medical-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-medical-700 py-6 px-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Calendar className="mr-2" />
              Schedule Lab Visit
            </h2>
            <p className="text-medical-100 mt-2">Fill out the form below to book your appointment.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    className="focus:ring-medical-500 focus:border-medical-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="focus:ring-medical-500 focus:border-medical-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">Preferred Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="focus:ring-medical-500 focus:border-medical-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 border px-3"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-1">Preferred Time</label>
                <select
                  name="time"
                  required
                  className="focus:ring-medical-500 focus:border-medical-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 border px-3 bg-white"
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="">Select a time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="testId" className="block text-sm font-medium text-slate-700 mb-1">Primary Test</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Beaker className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  name="testId"
                  required
                  className="focus:ring-medical-500 focus:border-medical-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border bg-white"
                  value={formData.testId}
                  onChange={handleChange}
                >
                  <option value="">Select a test</option>
                  {tests.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
              <textarea
                name="notes"
                rows={3}
                className="focus:ring-medical-500 focus:border-medical-500 block w-full sm:text-sm border-slate-300 rounded-md border p-3"
                placeholder="Any specific concerns, doctor referrals, or special requests..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-medical-600 hover:bg-medical-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-medical-500 transition-colors"
              >
                Confirm Appointment
              </button>
            </div>

            <p className="text-xs text-center text-slate-400 mt-4">
              By booking, you agree to our terms of service. Payment is collected at the facility.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};