import React, { useState } from 'react';
import { Plus, Trash2, Building2, Stethoscope } from 'lucide-react';
import { useClinic } from '../hooks/useClinic';

const ClinicSettings: React.FC = () => {
  const { clinic, doctors, addDoctor, removeDoctor, updateClinicName } = useClinic();
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newClinicName, setNewClinicName] = useState(clinic?.name || '');
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctorName.trim()) return;
    
    try {
      await addDoctor(newDoctorName.trim());
      setNewDoctorName('');
      setShowAddDoctor(false);
    } catch (error) {
      console.error('Error adding doctor:', error);
    }
  };

  const handleUpdateClinicName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinicName.trim() || newClinicName === clinic?.name) return;
    
    try {
      await updateClinicName(newClinicName.trim());
    } catch (error) {
      console.error('Error updating clinic name:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Clinic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Building2 className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-primary font-heading">Clinic Information</h3>
        </div>
        
        <form onSubmit={handleUpdateClinicName} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body">
              Clinic Name
            </label>
            <input
              type="text"
              value={newClinicName}
              onChange={(e) => setNewClinicName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
              placeholder="Enter clinic name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-body">
              Admin Email
            </label>
            <input
              type="email"
              value={clinic?.adminEmail || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 font-body"
            />
          </div>
          
          <button
            type="submit"
            disabled={!newClinicName.trim() || newClinicName === clinic?.name}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-heading"
          >
            Update Clinic Name
          </button>
        </form>
      </div>

      {/* Doctor Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6 text-accent" />
            <h3 className="text-lg font-semibold text-primary font-heading">Doctors</h3>
          </div>
          <button
            onClick={() => setShowAddDoctor(!showAddDoctor)}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center space-x-2 font-heading"
          >
            <Plus className="h-4 w-4" />
            <span>Add Doctor</span>
          </button>
        </div>

        {showAddDoctor && (
          <form onSubmit={handleAddDoctor} className="mb-6 p-4 bg-neutral rounded-lg">
            <div className="flex space-x-4">
              <input
                type="text"
                value={newDoctorName}
                onChange={(e) => setNewDoctorName(e.target.value)}
                placeholder="Enter doctor name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                required
              />
              <button
                type="submit"
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors font-heading"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddDoctor(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors font-heading"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {doctors.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Stethoscope className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">No doctors added yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {doctors.map((doctor) => (
              <div key={doctor} className="flex items-center justify-between p-4 bg-neutral rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-accent/10 p-2 rounded-full">
                    <Stethoscope className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-medium text-gray-900 font-heading">{doctor}</span>
                </div>
                <button
                  onClick={() => {
                    if (confirm(`Are you sure you want to remove Dr. ${doctor}?`)) {
                      removeDoctor(doctor);
                    }
                  }}
                  className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicSettings;