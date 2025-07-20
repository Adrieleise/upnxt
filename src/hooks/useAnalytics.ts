import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export interface AnalyticsRecord {
  id?: string;
  doctorId: string;
  patientName: string;
  joinedAt: string;
  servedAt?: string;
  status: 'served' | 'skipped' | 'canceled';
  waitTimeMinutes?: number;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const logPatientEvent = async (
    doctorId: string,
    patientName: string,
    joinedAt: Date,
    status: 'served' | 'skipped' | 'canceled',
    servedAt?: Date
  ) => {
    try {
      const dateString = format(joinedAt, 'yyyy-MM-dd');
      const waitTimeMinutes = servedAt 
        ? Math.round((servedAt.getTime() - joinedAt.getTime()) / (1000 * 60))
        : undefined;

      const record: Omit<AnalyticsRecord, 'id'> = {
        doctorId,
        patientName,
        joinedAt: joinedAt.toISOString(),
        servedAt: servedAt?.toISOString(),
        status,
        waitTimeMinutes
      };

      // Store in analytics collection with nested structure
      const analyticsPath = `analytics/${doctorId}/${dateString}`;
      await addDoc(collection(db, analyticsPath), {
        ...record,
        timestamp: serverTimestamp()
      });

      console.log('Analytics logged:', record);
    } catch (error) {
      console.error('Error logging analytics:', error);
      toast.error('Failed to log analytics data');
    }
  };

  const getAnalyticsByDateRange = useCallback(async (
    startDate: Date,
    endDate: Date,
    doctorId?: string
  ) => {
    setLoading(true);
    try {
      const records: AnalyticsRecord[] = [];
      
      // Generate date range
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        
        if (doctorId && doctorId !== 'all') {
          // Query specific doctor
          const analyticsPath = `analytics/${doctorId}/${dateString}`;
          const q = query(collection(db, analyticsPath), orderBy('timestamp', 'desc'));
          const snapshot = await getDocs(q);
          
          snapshot.docs.forEach(doc => {
            records.push({ id: doc.id, ...doc.data() } as AnalyticsRecord);
          });
        } else {
          // Query all doctors - we need to get all doctor IDs first
          // This is a simplified approach; in production, you might want to maintain a separate index
          const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
          
          for (const doctorDoc of doctorsSnapshot.docs) {
            const analyticsPath = `analytics/${doctorDoc.id}/${dateString}`;
            const q = query(collection(db, analyticsPath), orderBy('timestamp', 'desc'));
            const snapshot = await getDocs(q);
            
            snapshot.docs.forEach(doc => {
              records.push({ id: doc.id, ...doc.data() } as AnalyticsRecord);
            });
          }
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Sort by joinedAt descending
      records.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
      
      setAnalytics(records);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentQueueSizes = useCallback(async (): Promise<Record<string, number>> => {
    try {
      const q = query(
        collection(db, 'patients'),
        where('served', '==', false)
      );
      const snapshot = await getDocs(q);
      
      const queueSizes: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const patient = doc.data();
        queueSizes[patient.doctorId] = (queueSizes[patient.doctorId] || 0) + 1;
      });
      
      return queueSizes;
    } catch (error) {
      console.error('Error fetching current queue sizes:', error);
      return {};
    }
  }, []);

  return {
    analytics,
    loading,
    logPatientEvent,
    getAnalyticsByDateRange,
    getCurrentQueueSizes
  };
};