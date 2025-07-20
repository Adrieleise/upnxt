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

export const useQueue = (doctorId?: string, isDragging?: boolean) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Query all patients and sort in memory to avoid Firestore index requirements
    let q = query(collection(db, 'patients'));
    
    if (doctorId) {
      q = query(collection(db, 'patients'), where('doctorId', '==', doctorId));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Skip updating patients state while dragging to prevent conflicts
      if (isDragging) {
        console.log("⏸️ Skipping Firestore update - drag in progress");
        return;
      }

      // Optional delay to prevent reactivity issues during drag operations
      const updatePatients = () => {
        let patientsData = snapshot.docs.map((doc) => {
          if (!doc.id) console.warn('Missing patient ID from Firestore doc:', doc);
          return {
            id: doc.id,
            ...doc.data(),
          };
        }) as Patient[];

        patientsData = patientsData.map((patient, index) => {
  if (!patient.id) console.warn('Missing ID', patient); // ← 👈 ADD THIS LINE

  return {
    ...patient,
    position: patient.position || index + 1
  };
}).sort((a, b) => a.position - b.position);

        // Add missing position fields and sort by position
        patientsData = patientsData.map((patient, index) => ({
          ...patient,
          position: patient.position || index + 1
        })).sort((a, b) => a.position - b.position);
        
        setPatients(patientsData);
        setLoading(false);
      };

      // Small delay to prevent conflicts with drag operations
      if (isDragging) {
        setTimeout(updatePatients, 100);
      } else {
        updatePatients();
      }
    });

    return unsubscribe;
  }, [doctorId, isDragging]);

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
      console.log("🔄 Starting Firestore batch update for reordering...");
      
      const batch = writeBatch(db);
      
      reorderedPatients.forEach((patient, index) => {
        const patientRef = doc(db, 'patients', patient.id);
        batch.update(patientRef, { position: index + 1 });
        console.log(`📝 Updating ${patient.name} to position ${index + 1}`);
      });

      await batch.commit();
      console.log("✅ Queue reordering saved to Firestore successfully!");
      toast.success('Queue reordered successfully');
    } catch (error) {
      console.error("❌ Error reordering queue:", error);
      toast.error('Error reordering queue');
      throw error;
    }
  };

  const movePatientUp = async (patientId: string) => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (!patient || patient.served) return;

      const activePatients = patients
        .filter(p => !p.served && p.doctorId === patient.doctorId)
        .sort((a, b) => a.position - b.position);

      const currentIndex = activePatients.findIndex(p => p.id === patientId);
      if (currentIndex <= 0) return; // Already at top or not found

      const previousPatient = activePatients[currentIndex - 1];
      
      // Swap positions using batch write
      const batch = writeBatch(db);
      batch.update(doc(db, 'patients', patient.id), { position: previousPatient.position });
      batch.update(doc(db, 'patients', previousPatient.id), { position: patient.position });

      await batch.commit();
      toast.success(`${patient.name} moved up in queue`);
    } catch (error) {
      console.error('Error moving patient up:', error);
      toast.error('Error moving patient up');
      throw error;
    }
  };

  const movePatientDown = async (patientId: string) => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (!patient || patient.served) return;
      
      const activePatients = patients
        .filter(p => !p.served && p.doctorId === patient.doctorId)
        .sort((a, b) => a.position - b.position);

      const currentIndex = activePatients.findIndex(p => p.id === patientId);
      if (currentIndex < 0 || currentIndex >= activePatients.length - 1) return; // Already at bottom or not found

      const nextPatient = activePatients[currentIndex + 1];
      
      // Swap positions using batch write
      const batch = writeBatch(db);
      batch.update(doc(db, 'patients', patient.id), { position: nextPatient.position });
      batch.update(doc(db, 'patients', nextPatient.id), { position: patient.position });
      
      await batch.commit();
      toast.success(`${patient.name} moved down in queue`);
    } catch (error) {
      console.error('Error moving patient down:', error);
      toast.error('Error moving patient down');
      throw error;
    }
  };

  const reorderQueue = async (doctorId: string, fromIndex: number, toIndex: number) => {
    try {
      const activePatients = patients
        .filter(p => !p.served && p.doctorId === doctorId)
        .sort((a, b) => a.position - b.position);

      if (fromIndex < 0 || fromIndex >= activePatients.length || 
          toIndex < 0 || toIndex >= activePatients.length || 
          fromIndex === toIndex) {
        return;
      }

      // Create new order array
      const reorderedPatients = Array.from(activePatients);
      const [movedPatient] = reorderedPatients.splice(fromIndex, 1);
      reorderedPatients.splice(toIndex, 0, movedPatient);

      // Update positions in batch
      const batch = writeBatch(db);
      reorderedPatients.forEach((patient, index) => {
        batch.update(doc(db, 'patients', patient.id), { position: index + 1 });
      });

      await batch.commit();
      toast.success('Queue reordered successfully');
    } catch (error) {
      console.error('Error reordering queue:', error);
      toast.error('Error reordering queue');
      throw error;
    }
  };

  const skipPatient = async (patientId: string, newPosition: number) => {
    try {
      const patient = patients.find(p => p.id === patientId);
      if (!patient || patient.served || patient.hasSkipped) {
        throw new Error('Invalid patient or already skipped');
      }

      const activePatients = patients
        .filter(p => !p.served && p.doctorId === patient.doctorId)
        .sort((a, b) => a.position - b.position);

      const currentIndex = activePatients.findIndex(p => p.id === patientId);
      if (currentIndex < 0 || newPosition <= currentIndex + 1) {
        throw new Error('Invalid position for skipping');
      }

      // Create new order with patient moved to new position
      const reorderedPatients = Array.from(activePatients);
      const [movedPatient] = reorderedPatients.splice(currentIndex, 1);
      reorderedPatients.splice(newPosition - 1, 0, movedPatient);

      // Update positions and mark as skipped
      const batch = writeBatch(db);
      reorderedPatients.forEach((p, index) => {
        const updates: any = { position: index + 1 };
        if (p.id === patientId) {
          updates.hasSkipped = true;
          updates.skippedAt = serverTimestamp();
        }
        batch.update(doc(db, 'patients', p.id), updates);
      });

      await batch.commit();
      
      const ordinalSuffix = getOrdinalSuffix(newPosition);
      toast.success(`You've been moved to ${newPosition}${ordinalSuffix} in line.`);
    } catch (error) {
      console.error('Error skipping patient:', error);
      toast.error('Error updating position');
      throw error;
    }
  };

  const getOrdinalSuffix = (num: number): string => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };
  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    removePatient,
    markAsServed,
    reorderPatients,
    movePatientUp,
    movePatientDown,
    reorderQueue,
    skipPatient,
    getOrdinalSuffix,
  };
};