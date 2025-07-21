import React from 'react';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useQueue } from '../hooks/useQueue';

interface AnalyticsDashboardProps {
  clinicId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ clinicId }) => {
  const { analytics, loading } = useAnalytics(clinicId);
  const { servedPatients } = useQueue(clinicId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  const todayString = new Date().toISOString().split('T')[0];
  const todayAnalytics = analytics.find(a => a.date === todayString);
  const todayServed = servedPatients.filter(p => {
    const servedDate = p.servedAt?.toDate?.()?.toISOString().split('T')[0];
    return servedDate === todayString;
  });

  const stats = [
    {
      title: 'Total Served Today',
      value: todayAnalytics?.totalServed || 0,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Average Wait Time',
      value: `${todayAnalytics?.averageWaitTime || 0}m`,
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      title: 'Skipped Today',
      value: todayAnalytics?.totalSkipped || 0,
      icon: TrendingUp,
      color: 'text-yellow-600'
    },
    {
      title: 'Canceled Today',
      value: todayAnalytics?.totalCanceled || 0,
      icon: BarChart3,
      color: 'text-red-600'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Historical Analytics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 font-heading">Historical Performance</h3>
        
        {analytics.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">No analytics data available yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Served
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Skipped
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Canceled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Avg Wait Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-heading">
                    Queue Range
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.map((day) => (
                  <tr key={day.date} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 font-body">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-body">
                      {day.totalServed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-body">
                      {day.totalSkipped}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-body">
                      {day.totalCanceled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                      {day.averageWaitTime}m
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-body">
                      {day.shortestWaitTime}m - {day.longestWaitTime}m
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-primary mb-6 font-heading">Recent Activity</h3>
        
        {todayServed.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-body">No activity today</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {todayServed.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-neutral rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 font-heading">{patient.name}</p>
                  <p className="text-sm text-gray-600 font-body">{patient.doctor}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-heading ${
                    patient.status === 'served' 
                      ? 'bg-green-100 text-green-800'
                      : patient.status === 'skipped'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {patient.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 font-body">
                    {patient.servedAt?.toDate?.()?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;