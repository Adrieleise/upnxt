import React, { useState } from 'react';
import { UserPlus, Phone, User, Clock, RefreshCw } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';
import { useClinic } from '../hooks/useClinic';
import { validatePhilippinePhone, formatPhilippinePhone } from '../utils/phoneValidation';

interface PatientQueueProps {
  clinicId: string;
}

const PatientQueue: React.FC<PatientQueueProps> = ({ clinicId }) => {
  const { queuePatients, addPatient } = useQueue(clinicId);
  const { clinic, doctors } = useClinic();
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    doctor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phoneNumber || !formData.doctor) {
      return;
    }

    // Validate Philippine phone number
    if (!validatePhilippinePhone(formData.phoneNumber)) {
      setPhoneError('Please enter a valid Philippine phone number (e.g., 09123456789)');
      return;
    }

    setPhoneError('');
    setLoading(true);
    
    try {
      const formattedPhone = formatPhilippinePhone(formData.phoneNumber);
      
      await addPatient({
        name: formData.name,
        phoneNumber: formattedPhone,
        doctor: formData.doctor,
      });
      
      setFormData({ name: '', phoneNumber: '', doctor: '' });
    } catch (error) {
      console.error('Error adding patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    if (e.target.name === 'phoneNumber') {
      setPhoneError('');
    }
  };

  const myPosition = queuePatients.findIndex(p => 
    p.phoneNumber === formatPhilippinePhone(formData.phoneNumber) && 
    p.name === formData.name
  ) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center py-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary font-heading">{clinic?.name}</h1>
              <p className="text-sm text-gray-600 font-body">Patient Queue</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Join Queue Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <UserPlus className="h-8 w-8 text-accent mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Join the Queue</h2>
              <p className="text-gray-600 font-body">Enter your details to join the patient queue</p>
            </div>

            {doctors.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                <p className="text-gray-600 font-body">No doctors available at the moment</p>
                <p className="text-sm text-gray-500 mt-2 font-body">Please check back later</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors font-body"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
                        phoneError ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-accent'
                      } font-body`}
                      placeholder="09123456789"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-600 text-sm">{phoneError}</p>
                  )}
                  <p className="text-xs text-gray-500 font-body">
                    Enter your Philippine mobile number (e.g., 09123456789)
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                    Select Doctor
                  </label>
                  <select
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors appearance-none bg-white font-body"
                  >
                    <option value="">Choose a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor} value={doctor}>
                        {doctor}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-heading"
                >
                  {loading ? 'Joining Queue...' : 'Join Queue'}
                </button>
              </form>
            )}
          </div>

          {/* Current Queue Status */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Current Queue</h2>
              <p className="text-gray-600 font-body">{queuePatients.length} patients waiting</p>
            </div>

            {myPosition > 0 && (
              <div className="bg-accent/10 p-4 rounded-lg mb-6 text-center">
                <p className="text-accent font-semibold font-heading">Your Position: #{myPosition}</p>
                <p className="text-sm text-gray-600 font-body">You're in the queue!</p>
              </div>
            )}

            {queuePatients.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="font-body">No patients in queue</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {queuePatients.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-neutral rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 font-heading">{patient.name}</p>
                        <p className="text-sm text-gray-600 font-body">{patient.doctor}</p>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-body">
                      {patient.joinedAt?.toDate?.()?.toLocaleTimeString() || 'Just now'}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 mx-auto font-heading"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh Queue</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientQueue;