import React from 'react';
import { Clock, User, Phone, Stethoscope, SkipForward, Trash2, Edit, CheckCircle } from 'lucide-react';
import { Patient } from '../types';

interface QueueListProps {
  patients: Patient[];
  loading: boolean;
  onSkip?: (id: string) => void;
  onRemove?: (id: string) => void;
  onEdit?: (patient: Patient) => void;
  onMarkServed?: (id: string) => void;
  showActions?: boolean;
}

const QueueList: React.FC<QueueListProps> = ({
  patients,
  loading,
  onSkip,
  onRemove,
  onEdit,
  onMarkServed,
  showActions = false,
}) => {
  const activePatients = patients.filter(p => !p.served);
  const servedPatients = patients.filter(p => p.served);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const PatientCard: React.FC<{ patient: Patient; showPosition?: boolean }> = ({ patient, showPosition = true }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        {showPosition && (
          <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            #{patient.position}
          </div>
        )}
        <div className="text-xs text-gray-500">
          {patient.timestamp?.toDate?.()?.toLocaleTimeString() || 'Just now'}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <User className="h-5 w-5 text-gray-400" />
          <span className="font-medium text-gray-900">{patient.name}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Phone className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">{patient.phone}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <Stethoscope className="h-5 w-5 text-gray-400" />
          <span className="text-gray-700">{patient.doctor}</span>
        </div>
      </div>

      {showActions && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => onMarkServed?.(patient.id)}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Served</span>
          </button>
          
          <button
            onClick={() => onSkip?.(patient.id)}
            className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-700 transition-colors flex items-center space-x-1"
          >
            <SkipForward className="h-4 w-4" />
            <span>Skip</span>
          </button>
          
          <button
            onClick={() => onEdit?.(patient)}
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onRemove?.(patient.id)}
            className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Remove</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Current Queue ({activePatients.length} patients)
          </h2>
        </div>
        
        {activePatients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No patients in queue</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activePatients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>

      {servedPatients.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Served Patients ({servedPatients.length})
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {servedPatients.map((patient) => (
              <div key={patient.id} className="opacity-75">
                <PatientCard patient={patient} showPosition={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QueueList;