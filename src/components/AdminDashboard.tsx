import React, { useState } from 'react';
import { LogOut, Users, Clock, CheckCircle, Settings, BarChart3 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQueue } from '../hooks/useQueue';
import { useDoctors } from '../hooks/useDoctors';
import DoctorManagement from './DoctorManagement';
import DoctorQueueCard from './DoctorQueueCard';
import QRCodeGenerator from './QRCodeGenerator';
import { Patient } from '../types';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const { patients, loading, removePatient, updatePatient, markAsServed, reorderPatients } = useQueue(undefined, isDragging);
  const { doctors } = useDoctors();
  const [activeTab, setActiveTab] = useState<'queues' | 'doctors' | 'qr' | 'stats'>('queues');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const activePatients = patients.filter(p => !p.served);
  const servedPatients = patients.filter(p => p.served);
  const todayString = new Date().toISOString().split('T')[0];
  const todayPatients = patients.filter(p => p.dateAdded === todayString);

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleSaveEdit = async (updatedPatient: Patient) => {
    await updatePatient(updatedPatient.id, {
      name: updatedPatient.name,
      phone: updatedPatient.phone,
    });
    setEditingPatient(null);
  };

  const stats = [
    { title: 'Active Queues', value: activePatients.length, icon: Clock, color: 'text-blue-600' },
    { title: 'Served Today', value: servedPatients.filter(p => p.dateAdded === todayString).length, icon: CheckCircle, color: 'text-green-600' },
    { title: 'Total Today', value: todayPatients.length, icon: Users, color: 'text-purple-600' },
    { title: 'Active Doctors', value: doctors.filter(d => d.acceptingQueues).length, icon: BarChart3, color: 'text-orange-600' },
  ];

  const tabs = [
    { id: 'queues', label: 'Queue Management', icon: Clock },
    { id: 'doctors', label: 'Doctor Management', icon: Users },
    { id: 'qr', label: 'QR Code', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-heading">Admin Dashboard</h1>
              <p className="text-sm text-gray-600 font-body">Manage patient queues and clinic operations</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-heading"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600 font-body">{stat.title}</p>
                  <p className="text-3xl font-bold text-primary font-heading">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 font-heading ${
                      activeTab === tab.id
                        ? 'border-accent text-accent'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'queues' && (
              <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {doctors.map((doctor) => (
                  <DoctorQueueCard
                    key={doctor.id}
                    doctor={doctor}
                    patients={patients}
                    onReorder={reorderPatients}
                    onMarkServed={markAsServed}
                    onRemove={removePatient}
                    onEdit={handleEdit}
                    isDragging={isDragging}
                    setIsDragging={setIsDragging}
                  />
                ))}
                
                {doctors.length === 0 && (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg">
                    <Users className="h-12 w-12 text-primary/40 mx-auto mb-4" />
                    <p className="text-gray-600 font-body">No doctors added yet</p>
                    <p className="text-sm text-gray-500 mt-2 font-body">Add doctors in the Doctor Management tab</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'doctors' && <DoctorManagement />}
            {activeTab === 'qr' && <QRCodeGenerator />}
          </>
        )}
      </main>

      {/* Edit Modal */}
      {editingPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4 text-primary font-heading">Edit Patient</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit(editingPatient);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">Name</label>
                <input
                  type="text"
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({ ...editingPatient, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">Phone</label>
                <input
                  type="tel"
                  value={editingPatient.phone}
                  onChange={(e) => setEditingPatient({ ...editingPatient, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent focus:border-accent font-body"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-body">Patient Code</label>
                <input
                  type="text"
                  value={editingPatient.patientCode}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-neutral text-gray-500 font-body"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors font-heading"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPatient(null)}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors font-heading"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;