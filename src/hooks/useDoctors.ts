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
  query 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Doctor } from '../types';
import toast from 'react-hot-toast';

export const useDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'doctors'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const doctorsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Doctor[];
      
      setDoctors(doctorsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const addDoctor = async (doctorData: Omit<Doctor, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'doctors'), {
        ...doctorData,
        createdAt: serverTimestamp(),
      });
      toast.success('Doctor added successfully!');
    } catch (error) {
      toast.error('Error adding doctor');
      throw error;
    }
  };

  const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
    try {
      await updateDoc(doc(db, 'doctors', id), updates);
      toast.success('Doctor updated successfully');
    } catch (error) {
      toast.error('Error updating doctor');
      throw error;
    }
  };

  const deleteDoctor = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'doctors', id));
      toast.success('Doctor removed successfully');
    } catch (error) {
      toast.error('Error removing doctor');
      throw error;
    }
  };

  const toggleAcceptingQueues = async (id: string, accepting: boolean) => {
    try {
      await updateDoc(doc(db, 'doctors', id), { acceptingQueues: accepting });
      const message = accepting ? 'Doctor enabled for today' : 'Doctor disabled for today';
      toast.success(message);
    } catch (error) {
      toast.error('Error updating doctor status');
      throw error;
    }
  };

  return {
    doctors,
    loading,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    toggleAcceptingQueues,
  };
};