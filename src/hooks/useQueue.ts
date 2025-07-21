import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  orderBy, 
  query,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Patient } from '../types';
import toast from 'react-hot-toast';

export const useQueue = (clinicId: string) => {
  const [queuePatients, setQueuePatients] = useState<Patient[]>([]);
  const [servedPatients, setServedPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) return;

    // Listen to queue collection
    const queueQuery = query(
      collection(db, 'clinics', clinicId, 'queue'),
      orderBy('joinedAt', 'asc')
    );
    
    const unsubscribeQueue = onSnapshot(queueQuery, (snapshot) => {
      const patients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
      
      setQueuePatients(patients);
      setLoading(false);
    });

    // Listen to served collection
    const servedQuery = query(
      collection(db, 'clinics', clinicId, 'served'),
      orderBy('servedAt', 'desc')
    );
    
    const unsubscribeServed = onSnapshot(servedQuery, (snapshot) => {
      const patients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
      
      setServedPatients(patients);
    });

    return () => {
      unsubscribeQueue();
      unsubscribeServed();
    };
  }, [clinicId]);

  const addPatient = async (patientData: Omit<Patient, 'id' | 'joinedAt' | 'status'>) => {
    try {
      await addDoc(collection(db, 'clinics', clinicId, 'queue'), {
        ...patientData,
        joinedAt: serverTimestamp(),
        status: 'waiting',
      });
      toast.success('Successfully joined queue!');
    } catch (error) {
      toast.error('Error joining queue');
      throw error;
    }
  };

  const servePatient = async (patientId: string) => {
    try {
      const patient = queuePatients.find(p => p.id === patientId);
      if (!patient) return;

      const batch = writeBatch(db);
      
      // Add to served collection
      const servedRef = doc(collection(db, 'clinics', clinicId, 'served'));
      batch.set(servedRef, {
        ...patient,
        status: 'served',
        servedAt: serverTimestamp(),
      });
      
      // Remove from queue
      const queueRef = doc(db, 'clinics', clinicId, 'queue', patientId);
      batch.delete(queueRef);
      
      await batch.commit();
      toast.success('Patient marked as served');
    } catch (error) {
      toast.error('Error serving patient');
      throw error;
    }
  };

  const skipPatient = async (patientId: string) => {
    try {
      const patient = queuePatients.find(p => p.id === patientId);
      if (!patient) return;

      const batch = writeBatch(db);
      
      // Add to served collection with skipped status
      const servedRef = doc(collection(db, 'clinics', clinicId, 'served'));
      batch.set(servedRef, {
        ...patient,
        status: 'skipped',
        servedAt: serverTimestamp(),
      });
      
      // Remove from queue
      const queueRef = doc(db, 'clinics', clinicId, 'queue', patientId);
      batch.delete(queueRef);
      
      await batch.commit();
      toast.success('Patient skipped');
    } catch (error) {
      toast.error('Error skipping patient');
      throw error;
    }
  };

  const removePatient = async (patientId: string) => {
    try {
      const patient = queuePatients.find(p => p.id === patientId);
      if (!patient) return;

      const batch = writeBatch(db);
      
      // Add to served collection with canceled status
      const servedRef = doc(collection(db, 'clinics', clinicId, 'served'));
      batch.set(servedRef, {
        ...patient,
        status: 'canceled',
        servedAt: serverTimestamp(),
      });
      
      // Remove from queue
      const queueRef = doc(db, 'clinics', clinicId, 'queue', patientId);
      batch.delete(queueRef);
      
      await batch.commit();
      toast.success('Patient removed from queue');
    } catch (error) {
      toast.error('Error removing patient');
      throw error;
    }
  };

  const resetQueue = async () => {
    try {
      if (!confirm('Are you sure you want to reset the queue? All remaining patients will be marked as canceled.')) {
        return;
      }

      const batch = writeBatch(db);
      
      // Move all queue patients to served with canceled status
      queuePatients.forEach((patient) => {
        const servedRef = doc(collection(db, 'clinics', clinicId, 'served'));
        batch.set(servedRef, {
          ...patient,
          status: 'canceled',
          servedAt: serverTimestamp(),
        });
        
        const queueRef = doc(db, 'clinics', clinicId, 'queue', patient.id);
        batch.delete(queueRef);
      });
      
      await batch.commit();
      
      // Calculate and store daily analytics
      await calculateDailyAnalytics();
      
      toast.success('Queue reset successfully');
    } catch (error) {
      toast.error('Error resetting queue');
      throw error;
    }
  };

  const calculateDailyAnalytics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const todayServed = servedPatients.filter(p => {
        const servedDate = p.servedAt?.toDate?.()?.toISOString().split('T')[0];
        return servedDate === today;
      });

      const served = todayServed.filter(p => p.status === 'served');
      const skipped = todayServed.filter(p => p.status === 'skipped');
      const canceled = todayServed.filter(p => p.status === 'canceled');

      const waitTimes = served
        .filter(p => p.joinedAt && p.servedAt)
        .map(p => {
          const joined = p.joinedAt.toDate();
          const servedAt = p.servedAt.toDate();
          return Math.round((servedAt.getTime() - joined.getTime()) / (1000 * 60));
        });

      const analytics = {
        totalServed: served.length,
        totalSkipped: skipped.length,
        totalCanceled: canceled.length,
        averageWaitTime: waitTimes.length > 0 ? Math.round(waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length) : 0,
        shortestWaitTime: waitTimes.length > 0 ? Math.min(...waitTimes) : 0,
        longestWaitTime: waitTimes.length > 0 ? Math.max(...waitTimes) : 0,
        queueSize: queuePatients.length,
      };

      await updateDoc(doc(db, 'clinics', clinicId, 'analytics', today), analytics);
    } catch (error) {
      console.error('Error calculating analytics:', error);
    }
  };

  return {
    queuePatients,
    servedPatients,
    loading,
    addPatient,
    servePatient,
    skipPatient,
    removePatient,
    resetQueue,
  };
};