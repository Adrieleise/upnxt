import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCheck, UserX, Stethoscope } from 'lucide-react';
import { useDoctors } from '../hooks/useDoctors';
import { Doctor } from '../types';

const DoctorManagement: React.FC = () => {
  const { doctors, loading, addDoctor, updateDoctor, deleteDoctor, toggleAcceptingQueues } = useDoctors();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    acceptingQueues: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, formData);
        setEditingDoctor(null);
      } else {
        await addDoctor(formData);
        setShowAddForm(false);
      }
      
      setFormData({ name: '', specialty: '', acceptingQueues: true });
    } catch (error) {
      console.error('Error saving doctor:', error);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      acceptingQueues: doctor.acceptingQueues,
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingDoctor(null);
    setFormData({ name: '', specialty: '', acceptingQueues: true });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Doctor Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Doctor</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Dr. Juan Dela Cruz"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="General Medicine"
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptingQueues"
                checked={formData.acceptingQueues}
                onChange={(e) => setFormData({ ...formData, acceptingQueues: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptingQueues" className="ml-2 block text-sm text-gray-900">
                Currently accepting patients
              </label>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="grid gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Stethoscope className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-gray-600">{doctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    {doctor.acceptingQueues ? (
                      <div className="flex items-center text-green-600">
                        <UserCheck className="h-4 w-4 mr-1" />
                        <span className="text-sm">Accepting Patients</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <UserX className="h-4 w-4 mr-1" />
                        <span className="text-sm">Not Accepting</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleAcceptingQueues(doctor.id, !doctor.acceptingQueues)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    doctor.acceptingQueues
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {doctor.acceptingQueues ? 'Close Queue' : 'Open Queue'}
                </button>
                
                <button
                  onClick={() => handleEdit(doctor)}
                  className="bg-blue-100 text-blue-700 p-2 rounded-md hover:bg-blue-200 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this doctor?')) {
                      deleteDoctor(doctor.id);
                    }
                  }}
                  className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {doctors.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Stethoscope className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No doctors added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;