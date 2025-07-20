import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  Clock, 
  Users, 
  SkipForward,
  FileText,
  BarChart3
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, parseISO } from 'date-fns';
import { useAnalytics } from '../hooks/useAnalytics';
import { useDoctors } from '../hooks/useDoctors';
import { exportToPDF, exportToCSV } from '../utils/exportUtils';

const Analytics: React.FC = () => {
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'custom'>('today');
  const [customDateRange, setCustomDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  });
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('all');
  
  const { doctors } = useDoctors();
  const { 
    analytics, 
    loading, 
    getAnalyticsByDateRange,
    getCurrentQueueSizes 
  } = useAnalytics();

  const [currentQueueSizes, setCurrentQueueSizes] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCurrentQueues = async () => {
      const sizes = await getCurrentQueueSizes();
      setCurrentQueueSizes(sizes);
    };
    fetchCurrentQueues();
    const interval = setInterval(fetchCurrentQueues, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [getCurrentQueueSizes]);

  useEffect(() => {
    let startDate: Date;
    let endDate: Date;

    switch (dateFilter) {
      case 'today':
        startDate = new Date();
        endDate = new Date();
        break;
      case 'week':
        startDate = startOfWeek(new Date());
        endDate = endOfWeek(new Date());
        break;
      case 'custom':
        startDate = parseISO(customDateRange.start);
        endDate = parseISO(customDateRange.end);
        break;
    }

    getAnalyticsByDateRange(startDate, endDate, selectedDoctorId);
  }, [dateFilter, customDateRange, selectedDoctorId, getAnalyticsByDateRange]);

  const filteredDoctors = selectedDoctorId === 'all' 
    ? doctors 
    : doctors.filter(d => d.id === selectedDoctorId);

  // Calculate summary stats
  const totalPatientsToday = analytics.reduce((sum, record) => sum + (record.status === 'served' ? 1 : 0), 0);
  const totalSkippedCanceled = analytics.reduce((sum, record) => 
    sum + (record.status === 'skipped' || record.status === 'canceled' ? 1 : 0), 0);
  const averageWaitTime = analytics.length > 0 
    ? Math.round(analytics.reduce((sum, record) => sum + (record.waitTimeMinutes || 0), 0) / analytics.length)
    : 0;
  const activeQueues = Object.values(currentQueueSizes).reduce((sum, size) => sum + size, 0);

  // Prepare chart data
  const dailyTrends = analytics.reduce((acc, record) => {
    const date = format(parseISO(record.joinedAt), 'MMM dd');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.served += record.status === 'served' ? 1 : 0;
      existing.skipped += record.status === 'skipped' ? 1 : 0;
      existing.canceled += record.status === 'canceled' ? 1 : 0;
    } else {
      acc.push({
        date,
        served: record.status === 'served' ? 1 : 0,
        skipped: record.status === 'skipped' ? 1 : 0,
        canceled: record.status === 'canceled' ? 1 : 0
      });
    }
    return acc;
  }, [] as any[]);

  const doctorStats = filteredDoctors.map(doctor => {
    const doctorRecords = analytics.filter(record => record.doctorId === doctor.id);
    return {
      name: doctor.name,
      served: doctorRecords.filter(r => r.status === 'served').length,
      skipped: doctorRecords.filter(r => r.status === 'skipped').length,
      canceled: doctorRecords.filter(r => r.status === 'canceled').length,
      currentQueue: currentQueueSizes[doctor.id] || 0
    };
  });

  const statusDistribution = [
    { name: 'Served', value: analytics.filter(r => r.status === 'served').length, color: '#52AB98' },
    { name: 'Skipped', value: analytics.filter(r => r.status === 'skipped').length, color: '#F59E0B' },
    { name: 'Canceled', value: analytics.filter(r => r.status === 'canceled').length, color: '#EF4444' }
  ];

  const handleExportPDF = () => {
    const filename = `upnxt-analytics-${selectedDoctorId === 'all' ? 'all-doctors' : doctors.find(d => d.id === selectedDoctorId)?.name}-${format(new Date(), 'yyyy-MM-dd')}`;
    exportToPDF(analytics, doctorStats, filename);
  };

  const handleExportCSV = () => {
    const filename = `upnxt-analytics-${selectedDoctorId === 'all' ? 'all-doctors' : doctors.find(d => d.id === selectedDoctorId)?.name}-${format(new Date(), 'yyyy-MM-dd')}`;
    exportToCSV(analytics, filename);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary font-heading">Filters</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent font-body"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateFilter === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent font-body"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent font-body"
                />
              </div>
            )}

            {/* Doctor Filter */}
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-accent font-body"
            >
              <option value="all">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>

            {/* Export Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={handleExportCSV}
                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors flex items-center space-x-2 text-sm font-heading"
              >
                <FileText className="h-4 w-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2 text-sm font-heading"
              >
                <Download className="h-4 w-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-body">Total Patients Today</p>
              <p className="text-3xl font-bold text-primary font-heading">{totalPatientsToday}</p>
            </div>
            <Users className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-body">Average Wait Time</p>
              <p className="text-3xl font-bold text-primary font-heading">{averageWaitTime}m</p>
            </div>
            <Clock className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-body">Skipped / Canceled</p>
              <p className="text-3xl font-bold text-primary font-heading">{totalSkippedCanceled}</p>
            </div>
            <SkipForward className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-body">Active Queues</p>
              <p className="text-3xl font-bold text-primary font-heading">{activeQueues}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-accent" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Trends Line Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary mb-4 font-heading">Daily Patient Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" className="font-body" />
              <YAxis className="font-body" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="served" stroke="#52AB98" strokeWidth={2} />
              <Line type="monotone" dataKey="skipped" stroke="#F59E0B" strokeWidth={2} />
              <Line type="monotone" dataKey="canceled" stroke="#EF4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Doctor Performance Bar Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary mb-4 font-heading">Doctor Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={doctorStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" className="font-body" />
              <YAxis className="font-body" />
              <Tooltip />
              <Legend />
              <Bar dataKey="served" fill="#52AB98" />
              <Bar dataKey="skipped" fill="#F59E0B" />
              <Bar dataKey="canceled" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary mb-4 font-heading">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Current Queue Sizes */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-primary mb-4 font-heading">Current Queue Sizes</h3>
          <div className="space-y-3">
            {doctorStats.map((doctor) => (
              <div key={doctor.name} className="flex items-center justify-between p-3 bg-neutral rounded-lg">
                <span className="font-medium text-gray-900 font-body">{doctor.name}</span>
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-heading">
                  {doctor.currentQueue} patients
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Log Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary font-heading">Patient Log</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                  Patient Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                  Wait Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                  Time Joined
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.map((record, index) => {
                const doctor = doctors.find(d => d.id === record.doctorId);
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-body">
                      {record.patientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-body">
                      {doctor?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-heading ${
                        record.status === 'served' 
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'skipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-body">
                      {record.waitTimeMinutes ? `${record.waitTimeMinutes}m` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-body">
                      {format(parseISO(record.joinedAt), 'MMM dd, HH:mm')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {analytics.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-body">No analytics data available for the selected period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;