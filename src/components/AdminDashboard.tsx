import React, { useState } from 'react';
import { LogOut, Users, Clock, CheckCircle, Settings, BarChart3, RefreshCw, Building2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useQueue } from '../hooks/useQueue';
import { useClinic } from '../hooks/useClinic';
import QueueManagement from './QueueManagement';
import ClinicSettings from './ClinicSettings';
import AnalyticsDashboard from './AnalyticsDashboard';
import QRCodeGenerator from './QRCodeGenerator';

const AdminDashboard: React.FC = () => {
  const { logout, clinic } = useAuth();
  const { queuePatients, servedPatients, resetQueue } = useQueue(clinic?.id || '');
  const [activeTab, setActiveTab] = useState<'queue' | 'settings' | 'analytics' | 'qr'>('queue');

  if (!clinic) return null;

  const todayString = new Date().toISOString().split('T')[0];
  const todayServed = servedPatients.filter(p => {
    const servedDate = p.servedAt?.toDate?.()?.toISOString().split('T')[0];
    return servedDate === todayString;
  });

  const stats = [
    { 
      title: 'Current Queue', 
      value: queuePatients.length, 
      icon: Clock, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Served Today', 
      value: todayServed.filter(p => p.status === 'served').length, 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      title: 'Skipped Today', 
      value: todayServed.filter(p => p.status === 'skipped').length, 
      icon: Users, 
      color: 'text-yellow-600' 
    },
    { 
      title: 'Canceled Today', 
      value: todayServed.filter(p => p.status === 'canceled').length, 
      icon: RefreshCw, 
      color: 'text-red-600' 
    },
  ];

  const tabs = [
    { id: 'queue', label: 'Queue Management', icon: Clock },
    { id: 'settings', label: 'Clinic Settings', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'qr', label: 'QR Code', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-primary font-heading">{clinic.name}</h1>
              <p className="text-sm text-gray-600 font-body">Admin Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={resetQueue}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 font-heading"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reset Queue</span>
              </button>
              <button
                onClick={logout}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 font-heading"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-body">{stat.title}</p>
                    <p className="text-3xl font-bold text-primary font-heading">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
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
        {activeTab === 'queue' && <QueueManagement clinicId={clinic.id} />}
        {activeTab === 'settings' && <ClinicSettings />}
        {activeTab === 'analytics' && <AnalyticsDashboard clinicId={clinic.id} />}
        {activeTab === 'qr' && <QRCodeGenerator clinicId={clinic.id} />}
      </main>
    </div>
  );
};

export default AdminDashboard;