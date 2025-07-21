export interface Patient {
  id: string;
  name: string;
  phoneNumber: string;
  doctor: string;
  joinedAt: any;
  status: 'waiting' | 'served' | 'skipped' | 'canceled';
  servedAt?: any;
}

export interface Clinic {
  id: string;
  name: string;
  adminEmail: string;
  createdAt: any;
  doctors: string[];
}

export interface DailyAnalytics {
  date: string;
  totalServed: number;
  totalSkipped: number;
  totalCanceled: number;
  averageWaitTime: number;
  shortestWaitTime: number;
  longestWaitTime: number;
  queueSize: number;
}

export interface QueueStats {
  totalWaiting: number;
  totalServed: number;
  totalSkipped: number;
  totalCanceled: number;
}