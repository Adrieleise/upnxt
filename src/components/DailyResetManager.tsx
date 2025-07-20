import React, { useState } from 'react';
import { RefreshCw, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDailyReset } from '../hooks/useDailyReset';
import { useDoctors } from '../hooks/useDoctors';

const DailyResetManager: React.FC = () => {
  const [isResetting, setIsResetting] = useState(false);
  const { manualReset, getLastResetDate, getCurrentDateString } = useDailyReset();
  const { doctors, toggleAcceptingQueues } = useDoctors();

  const lastResetDate = getLastResetDate();
  const currentDate = getCurrentDateString();
  const isResetToday = lastResetDate === currentDate;

  const activeDoctors = doctors.filter(d => d.acceptingQueues);
  const inactiveDoctors = doctors.filter(d => !d.acceptingQueues);

  const handleManualReset = async () => {
    setIsResetting(true);
    try {
      await manualReset();
    } catch (error) {
      console.error('Manual reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleToggleDoctor = async (doctorId: string, accepting: boolean) => {
    await toggleAcceptingQueues(doctorId, accepting);
  };

  return (
    <div className="space-y-6">
      {/* Reset Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${isResetToday ? 'bg-green-100' : 'bg-yellow-100'}`}>
              {isResetToday ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary font-heading">Daily Reset Status</h3>
              <p className="text-sm text-gray-600 font-body">
                {isResetToday 
                  ? `Queues reset today (${lastResetDate})`
                  : `Last reset: ${lastResetDate || 'Never'}`
                }
              </p>
            </div>
          </div>
          
          <button
            onClick={handleManualReset}
            disabled={isResetting}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-heading"
          >
            <RefreshCw className={`h-4 w-4 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Manual Reset'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-neutral p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-700 font-heading">Current Date</span>
            </div>
            <p className="text-lg font-bold text-primary font-heading">{currentDate}</p>
          </div>
          
          <div className="bg-neutral p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-gray-700 font-heading">Next Reset</span>
            </div>
            <p className="text-lg font-bold text-accent font-heading">
              {isResetToday ? 'Tomorrow 12:00 AM' : 'Today 12:00 AM'}
            </p>
          </div>
          
          <div className="bg-neutral p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700 font-heading">Status</span>
            </div>
            <p className={`text-lg font-bold font-heading ${isResetToday ? 'text-green-600' : 'text-yellow-600'}`}>
              {isResetToday ? 'Up to Date' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Doctor Queue Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-4 font-heading">Daily Doctor Availability</h3>
        <p className="text-sm text-gray-600 mb-6 font-body">
          Enable doctors to accept patients for today. Doctors are automatically disabled after daily reset.
        </p>

        <div className="space-y-4">
          {/* Active Doctors */}
          {activeDoctors.length > 0 && (
            <div>
              <h4 className="font-medium text-green-700 mb-3 font-heading">
                Active Today ({activeDoctors.length})
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {activeDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 font-heading">{doctor.name}</h5>
                        <p className="text-sm text-gray-600 font-body">{doctor.specialty}</p>
                      </div>
                      <button
                        onClick={() => handleToggleDoctor(doctor.id, false)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors font-heading"
                      >
                        Disable
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inactive Doctors */}
          {inactiveDoctors.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-3 font-heading">
                Available to Enable ({inactiveDoctors.length})
              </h4>
              <div className="grid gap-3 md:grid-cols-2">
                {inactiveDoctors.map((doctor) => (
                  <div key={doctor.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 font-heading">{doctor.name}</h5>
                        <p className="text-sm text-gray-600 font-body">{doctor.specialty}</p>
                      </div>
                      <button
                        onClick={() => handleToggleDoctor(doctor.id, true)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm hover:bg-green-200 transition-colors font-heading"
                      >
                        Enable
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doctors.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-body">No doctors available. Add doctors in the Doctor Management tab.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reset Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2 font-heading">How Daily Reset Works</h4>
        <ul className="text-sm text-blue-800 space-y-1 font-body">
          <li>• Queues automatically reset at midnight (local time)</li>
          <li>• All active patients are archived to analytics before clearing</li>
          <li>• Doctors are set to "not accepting" and must be re-enabled daily</li>
          <li>• Historical analytics data is preserved</li>
          <li>• Manual reset is available for testing or emergency situations</li>
        </ul>
      </div>
    </div>
  );
};

export default DailyResetManager;