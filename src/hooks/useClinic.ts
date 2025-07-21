import { useState, useEffect } from 'react';
import { 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

export const useClinic = () => {
  const { clinic } = useAuth();
  const [doctors, setDoctors] = useState<string[]>([]);

  useEffect(() => {
    if (clinic) {
      setDoctors(clinic.doctors || []);
    }
  }, [clinic]);

  const addDoctor = async (doctorName: string) => {
    if (!clinic) return;
    
    try {
      await updateDoc(doc(db, 'clinics', clinic.id), {
        doctors: arrayUnion(doctorName)
      });
      
      setDoctors(prev => [...prev, doctorName]);
      toast.success('Doctor added successfully');
    } catch (error) {
      toast.error('Error adding doctor');
      throw error;
    }
  };

  const removeDoctor = async (doctorName: string) => {
    if (!clinic) return;
    
    try {
      await updateDoc(doc(db, 'clinics', clinic.id), {
        doctors: arrayRemove(doctorName)
      });
      
      setDoctors(prev => prev.filter(d => d !== doctorName));
      toast.success('Doctor removed successfully');
    } catch (error) {
      toast.error('Error removing doctor');
      throw error;
    }
  };

  const updateClinicName = async (newName: string) => {
    if (!clinic) return;
    
    try {
      await updateDoc(doc(db, 'clinics', clinic.id), {
        name: newName
      });
      
      toast.success('Clinic name updated successfully');
    } catch (error) {
      toast.error('Error updating clinic name');
      throw error;
    }
  };

  return {
    clinic,
    doctors,
    addDoctor,
    removeDoctor,
    updateClinicName,
  };
};