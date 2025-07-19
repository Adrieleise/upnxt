import React, { useState, useEffect } from 'react';
import { UserPlus, Phone, User, Stethoscope, CheckCircle, RefreshCw } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';
import { useDoctors } from '../hooks/useDoctors';
import { validatePhilippinePhone, formatPhilippinePhone } from '../utils/phoneValidation';

const PatientForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    doctorId: '',
  });
  const [loading, setLoading] = useState(false);
  const [patientCode, setPatientCode] = useState<string | null>(null);
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');
  
  const { addPatient, patients } = useQueue();
  const { doctors } = useDoctors();

  // Filter doctors that are accepting queues
  const availableDoctors = doctors.filter(doctor => doctor.acceptingQueues);

  // Check if user has an existing queue entry
  useEffect(() => {
    const savedPatientCode = localStorage.getItem('patientCode');
    if (savedPatientCode) {
      const patient = patients.find(p => p.patientCode === savedPatientCode && !p.served);
      if (patient) {
        setPatientCode(savedPatientCode);
        setQueuePosition(patient.position);
      } else {
        localStorage.removeItem('patientCode');
      }
    }
  }, [patients]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.doctorId) {
      return;
    }

    // Validate Philippine phone number
    if (!validatePhilippinePhone(formData.phone)) {
      setPhoneError('Please enter a valid Philippine phone number (e.g., 09123456789)');
      return;
    }

    setPhoneError('');
    setLoading(true);
    
    try {
      const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
      if (!selectedDoctor) return;

      const formattedPhone = formatPhilippinePhone(formData.phone);
      
      const code = await addPatient({
        name: formData.name,
        phone: formattedPhone,
        doctorId: formData.doctorId,
      }, selectedDoctor.name);

      if (code) {
        setPatientCode(code);
        localStorage.setItem('patientCode', code);
        
        // Get queue position
        const doctorPatients = patients.filter(p => p.doctorId === formData.doctorId && !p.served);
        setQueuePosition(doctorPatients.length + 1);
      }
      
      setFormData({ name: '', phone: '', doctorId: '' });
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
    
    if (e.target.name === 'phone') {
      setPhoneError('');
    }
  };

  const refreshStatus = () => {
    if (patientCode) {
      const patient = patients.find(p => p.patientCode === patientCode && !p.served);
      if (patient) {
        setQueuePosition(patient.position);
      } else {
        setPatientCode(null);
        setQueuePosition(null);
        localStorage.removeItem('patientCode');
      }
    }
  };

  const resetForm = () => {
    setPatientCode(null);
    setQueuePosition(null);
    localStorage.removeItem('patientCode');
  };

  // If patient already has a queue entry, show status
  if (patientCode && queuePosition) {
    const patient = patients.find(p => p.patientCode === patientCode);
    const doctor = doctors.find(d => d.id === patient?.doctorId);

    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You're in the Queue!</h2>
          <p className="text-gray-600">Your current status</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-primary/5 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-primary mb-1 font-heading">#{queuePosition}</div>
            <div className="text-sm text-gray-600 font-body">Position in line</div>
          </div>
          
          <div className="bg-accent/10 p-4 rounded-lg text-center">
            <div className="text-lg font-bold text-accent mb-1 font-heading">{patientCode}</div>
            <div className="text-sm text-gray-600 font-body">Your patient code</div>
          </div>
          
          <div className="bg-neutral p-4 rounded-lg text-center">
            <div className="font-medium text-primary font-heading">{doctor?.name}</div>
            <div className="text-sm text-gray-600 font-body">{doctor?.specialty}</div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={refreshStatus}
            className="w-full bg-accent text-white py-3 px-6 rounded-lg font-medium hover:bg-accent/90 focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2 font-heading"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Status</span>
          </button>
          
          <button
            onClick={resetForm}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors font-heading"
          >
            Join Another Queue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto border border-gray-100">
      <div className="text-center mb-8">
        <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4">
          <UserPlus className="h-8 w-8 text-accent mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2 font-heading">Join the Queue</h2>
        <p className="text-gray-600 font-body">Select a doctor and enter your details</p>
      </div>

      {availableDoctors.length === 0 ? (
        <div className="text-center py-8">
          <Stethoscope className="h-12 w-12 text-primary/40 mx-auto mb-4" />
          <p className="text-gray-600 font-body">No doctors are currently accepting patients</p>
          <p className="text-sm text-gray-500 mt-2 font-body">Please check back later</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
              Select Doctor
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <select
                id="doctorId"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors appearance-none bg-white font-body"
              >
                <option value="">Choose a doctor</option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
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
  );
};

export default PatientForm;