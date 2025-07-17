export interface Patient {
  id: string;
  name: string;
  phone: string;
  doctorId: string;
  timestamp: any;
  served: boolean;
  position: number;
  queueNumber: number;
  patientCode: string;
  dateAdded: string; // YYYY-MM-DD format
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  acceptingQueues: boolean;
  createdAt: any;
}

export interface QueueStats {
  totalPatients: number;
  servedToday: number;
  waitingPatients: number;
}