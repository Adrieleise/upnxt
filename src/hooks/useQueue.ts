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
  where,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Patient } from '../types';
import toast from 'react-hot-toast';

const generatePatientCode = (queueNumber: number, doctorName: string): string => {
  const doctorCode = doctorName.replace(/[^A-Z]/g, '').substring(0, 6);
  return `P${queueNumber}${doctorCode}`;
};

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const useQueue = (doctorId?: string) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query all patients and sort in memory to avoid Firestore index requirements
    let q = query(collection(db, 'patients'));
    
    if (doctorId) {
      q = query(collection(db, 'patients'), where('doctorId', '==', doctorId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let patientsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Patient[];
      
      // Add missing position fields and sort by position
      patientsData = patientsData.map((patient, index) => ({
        ...patient,
        position: patient.position || index + 1
      })).sort((a, b) => a.position - b.position);
      
      setPatients(patientsData);
      setLoading(false);
    });

    return unsubscribe;
  }, [doctorId]);

  const getNextQueueNumber = async (doctorId: string): Promise<number> => {
    const today = getTodayString();
    const q = query(
      collection(db, 'patients'),
      where('doctorId', '==', doctorId),
      where('dateAdded', '==', today)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  };

  const getNextPosition = async (doctorId: string): Promise<number> => {
    const q = query(
      collection(db, 'patients'),
      where('doctorId', '==', doctorId),
      where('served', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  };

  const addPatient = async (
    patientData: Omit<Patient, 'id' | 'timestamp' | 'served' | 'position' | 'queueNumber' | 'patientCode' | 'dateAdded'>,
    doctorName: string
  ) => {
    try {
      const queueNumber = await getNextQueueNumber(patientData.doctorId);
      const position = await getNextPosition(patientData.doctorId);
      const patientCode = generatePatientCode(queueNumber, doctorName);
      const today = getTodayString();

      const newPatient = {
        ...patientData,
        timestamp: serverTimestamp(),
        served: false,
        position,
        queueNumber,
        patientCode,
        dateAdded: today,
      };

      await addDoc(collection(db, 'patients'), newPatient);
      toast.success(`Successfully joined queue! Your code: ${patientCode}`);
      return patientCode;
    } catch (error) {
      toast.error('Error joining queue');
      throw error;
    }
  };

  const updatePatient = async (id: string, updates: Partial<Patient>) => {
    try {
      await updateDoc(doc(db, 'patients', id), updates);
      toast.success('Patient updated successfully');
    } catch (error) {
      toast.error('Error updating patient');
      throw error;
    }
  };

  const removePatient = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'patients', id));
      toast.success('Patient removed from queue');
    } catch (error) {
      toast.error('Error removing patient');
      throw error;
    }
  };

  const markAsServed = async (id: string) => {
    try {
      await updateDoc(doc(db, 'patients', id), { served: true });
      toast.success('Patient marked as served');
    } catch (error) {
      toast.error('Error updating patient status');
      throw error;
    }
  };

  const reorderPatients = async (doctorId: string, reorderedPatients: Patient[]) => {
    try {
      const batch = writeBatch(db);
      
      reorderedPatients.forEach((patient, index) => {
        const patientRef = doc(db, 'patients', patient.id);
        batch.update(patientRef, { position: index + 1 });
      });

      await batch.commit();
    } catch (error) {
      toast.error('Error reordering queue');
      throw error;
    }
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    removePatient,
    markAsServed,
    reorderPatients,
  };
};