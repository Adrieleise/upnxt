import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, User, Phone, Clock, CheckCircle, SkipForward, Trash2, Edit, UserPlus } from 'lucide-react';
import { Patient, Doctor } from '../types';
import { useQueue } from '../hooks/useQueue';

interface DoctorQueueCardProps {
  doctor: Doctor;
  patients: Patient[];
  onReorder: (doctorId: string, reorderedPatients: Patient[]) => void;
  onMarkServed: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (patient: Patient) => void;
}

const DoctorQueueCard: React.FC<DoctorQueueCardProps> = ({
  doctor,
  patients,
  onReorder,
  onMarkServed,
  onRemove,
  onEdit,
}) => {
  const { addPatient } = useQueue();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  const activePatients = patients.filter(p => !p.served && p.doctorId === doctor.id);
  const servedPatients = patients.filter(p => p.served && p.doctorId === doctor.id);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedPatients = Array.from(activePatients);
    const [reorderedItem] = reorderedPatients.splice(result.source.index, 1);
    reorderedPatients.splice(result.destination.index, 0, reorderedItem);

    // Update positions to match new array indices
    const updatedPatients = reorderedPatients.map((patient, index) => ({
      ...patient,
      position: index + 1
    }));
    onReorder(doctor.id, updatedPatients);
  };

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addPatient({
        name: formData.name,
        phone: formData.phone,
        doctorId: doctor.id,
      }, doctor.name);
      
      setFormData({ name: '', phone: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-600">{doctor.specialty}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              doctor.acceptingQueues 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {doctor.acceptingQueues ? 'Open' : 'Closed'}
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{activePatients.length}</div>
            <div className="text-xs text-gray-600">Waiting</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{servedPatients.length}</div>
            <div className="text-xs text-gray-600">Served</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{patients.length}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </div>
      </div>

      {/* Add Patient Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleAddPatient} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Patient Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
              >
                Add Patient
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-3 py-1 rounded-md text-sm hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Queue */}
      <div className="p-4">
        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          Current Queue ({activePatients.length})
        </h4>

        {activePatients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No patients in queue</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={`doctor-${doctor.id}`}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {activePatients.map((patient, index) => (
                    <Draggable key={patient.id} draggableId={patient.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-gray-50 rounded-lg p-3 border ${
                            snapshot.isDragging ? 'shadow-lg border-blue-300' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                  #{patient.position}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                  {patient.patientCode}
                                </span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                              <div className="text-xs text-gray-600 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {patient.phone}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => onMarkServed(patient.id)}
                                className="bg-green-600 text-white p-1 rounded text-xs hover:bg-green-700 transition-colors"
                                title="Mark as served"
                              >
                                <CheckCircle className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onEdit(patient)}
                                className="bg-blue-600 text-white p-1 rounded text-xs hover:bg-blue-700 transition-colors"
                                title="Edit patient"
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => onRemove(patient.id)}
                                className="bg-red-600 text-white p-1 rounded text-xs hover:bg-red-700 transition-colors"
                                title="Remove patient"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Served Patients */}
        {servedPatients.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Served Today ({servedPatients.length})
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {servedPatients.map((patient) => (
                <div key={patient.id} className="bg-green-50 rounded-lg p-2 border border-green-200 opacity-75">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                      <div className="text-xs text-gray-600">{patient.patientCode}</div>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorQueueCard;