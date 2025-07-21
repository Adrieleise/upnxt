import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  orderBy, 
  query 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { DailyAnalytics } from '../types';

export const useAnalytics = (clinicId: string) => {
  const [analytics, setAnalytics] = useState<DailyAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) return;

    const analyticsQuery = query(
      collection(db, 'clinics', clinicId, 'analytics'),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(analyticsQuery, (snapshot) => {
      const analyticsData = snapshot.docs.map((doc) => ({
        date: doc.id,
        ...doc.data(),
      })) as DailyAnalytics[];
      
      setAnalytics(analyticsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [clinicId]);

  return { analytics, loading };
};