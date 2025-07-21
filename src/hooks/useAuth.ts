import { useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { Clinic } from '../types';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Fetch clinic data
        try {
          const clinicDoc = await getDoc(doc(db, 'clinics', user.uid));
          if (clinicDoc.exists()) {
            setClinic({ id: user.uid, ...clinicDoc.data() } as Clinic);
          }
        } catch (error) {
          console.error('Error fetching clinic data:', error);
        }
      } else {
        setClinic(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, clinicName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create clinic document
      const clinicData: Omit<Clinic, 'id'> = {
        name: clinicName,
        adminEmail: email,
        createdAt: new Date(),
        doctors: []
      };
      
      await setDoc(doc(db, 'clinics', user.uid), clinicData);
      
      setClinic({ id: user.uid, ...clinicData });
      toast.success('Clinic registered successfully!');
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully logged in!');
    } catch (error: any) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setClinic(null);
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out');
      throw error;
    }
  };

  return { user, clinic, loading, register, login, logout };
};