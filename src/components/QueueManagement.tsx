import React, { useState } from 'react';
import { Plus, User, Phone, Clock, CheckCircle, SkipForward, Trash2, Edit } from 'lucide-react';
import { useQueue } from '../hooks/useQueue';
import { useClinic } from '../hooks/useClinic';
import { Patient } from '../types';

interface QueueManagementProps {
  clinicId: string;
}

const QueueManagement: React.FC<QueueManagementProps> = ({ clinicId }) => {
  const { queuePatients, servedPatients, loading, addPatient, servePatient, skipPatient, removePatient } = useQueue(clinicId);
  const { doctors } = useClinic();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    doctor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addPatient(formData);
      setFormData({ name: '', phoneNumber: '', doctor: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const PatientCard: React.FC<{ patient: Patient; isServed?: boolean }> = ({ patient, isServed = false }) => (
    <div className={`rounded-lg shadow-sm border p-4 ${isServed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <h4 className="font-medium text-gray-900 font-heading">{patient.name}</h4>
            <p className="text-sm text-gray-600 font-body">{patient.doctor}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 font-body">
          {patient.joinedAt?.toDate?.()?.toLocaleTimeString() || 'Just now'}
        </div>
      </div>
      
      <div className="flex items-center space-x-3 mb-3">
        <Phone className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-700 font-body">{patient.phoneNumber}</span>
      </div>

      {!isServed && (
        <div className="flex space-x-2">
          <button
            onClick={() => servePatient(patient.id)}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center space-x-1 font-heading"
          >
            <CheckCircle className="h-3 w-3" />
            <span>Serve</span>
          </button>
          
          <button
            onClick={() => skipPatient(patient.id)}
            className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700 transition-colors flex items-center space-x-1 font-heading"
          >
            <SkipForward className="h-3 w-3" />
            <span>Skip</span>
          </button>
          
          <button
            onClick={() => removePatient(patient.id)}
            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center space-x-1 font-heading"
          >
            <Trash2 className="h-3 w-3" />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Add Patient Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-primary font-heading">Add Patient to Queue</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2 font-heading"
          >
            <Plus className="h-4 w-4" />
            <span>Add Patient</span>
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                  placeholder="Enter patient name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                  placeholder="09xxxxxxxxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">
                  Doctor
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                >
                  <option value="">Select a doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors font-heading"
              >
                Add to Queue
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-heading"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Current Queue */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="h-6 w-6 text-accent" />
          <h3 className="text-lg font-semibold text-primary font-heading">
            Current Queue ({queuePatients.length} patients)
          </h3>
        </div>
        
        {queuePatients.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">No patients in queue</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {queuePatients.map((patient, index) => (
              <div key={patient.id} className="relative">
                <div className="absolute -top-2 -left-2 bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <PatientCard patient={patient} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Served Patients Today */}
      {servedPatients.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-primary font-heading">
              Served Today ({servedPatients.length} patients)
            </h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
            {servedPatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} isServed />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueManagement;