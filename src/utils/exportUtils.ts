import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { AnalyticsRecord } from '../hooks/useAnalytics';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (
  analytics: AnalyticsRecord[],
  doctorStats: any[],
  filename: string
) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('UpNxt Analytics Report', 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 20, 30);
  
  // Summary Stats
  doc.setFontSize(16);
  doc.text('Summary Statistics', 20, 50);
  
  const summaryData = [
    ['Total Patients', analytics.filter(r => r.status === 'served').length.toString()],
    ['Skipped/Canceled', analytics.filter(r => r.status !== 'served').length.toString()],
    ['Average Wait Time', `${Math.round(analytics.reduce((sum, r) => sum + (r.waitTimeMinutes || 0), 0) / analytics.length || 0)}m`]
  ];
  
  doc.autoTable({
    startY: 60,
    head: [['Metric', 'Value']],
    body: summaryData,
    theme: 'grid'
  });
  
  // Doctor Performance
  doc.setFontSize(16);
  doc.text('Doctor Performance', 20, doc.lastAutoTable.finalY + 20);
  
  const doctorData = doctorStats.map(doctor => [
    doctor.name,
    doctor.served.toString(),
    doctor.skipped.toString(),
    doctor.canceled.toString()
  ]);
  
  doc.autoTable({
    startY: doc.lastAutoTable.finalY + 30,
    head: [['Doctor', 'Served', 'Skipped', 'Canceled']],
    body: doctorData,
    theme: 'grid'
  });
  
  // Patient Log
  if (analytics.length > 0) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Patient Log', 20, 20);
    
    const patientData = analytics.map(record => [
      record.patientName,
      record.status,
      record.waitTimeMinutes ? `${record.waitTimeMinutes}m` : '-',
      format(new Date(record.joinedAt), 'MMM dd, HH:mm')
    ]);
    
    doc.autoTable({
      startY: 30,
      head: [['Patient Name', 'Status', 'Wait Time', 'Time Joined']],
      body: patientData,
      theme: 'grid'
    });
  }
  
  doc.save(`${filename}.pdf`);
};

export const exportToCSV = (analytics: AnalyticsRecord[], filename: string) => {
  const headers = ['Patient Name', 'Doctor ID', 'Status', 'Wait Time (minutes)', 'Joined At', 'Served At'];
  
  const csvContent = [
    headers.join(','),
    ...analytics.map(record => [
      `"${record.patientName}"`,
      record.doctorId,
      record.status,
      record.waitTimeMinutes || '',
      record.joinedAt,
      record.servedAt || ''
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};