import { useEffect, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  writeBatch, 
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAnalytics } from './useAnalytics';
import toast from 'react-hot-toast';

const LAST_RESET_KEY = 'upnxt_last_reset_date';

export const useDailyReset = () => {
  const { logPatientEvent } = useAnalytics();

  const getCurrentDateString = (): string => {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const getLastResetDate = (): string | null => {
    return localStorage.getItem(LAST_RESET_KEY);
  };

  const setLastResetDate = (date: string): void => {
    localStorage.setItem(LAST_RESET_KEY, date);
  };

  const archiveActivePatients = async (): Promise<void> => {
    try {
      console.log('🗄️ Archiving active patients to analytics...');
      
      // Get all active patients
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      
      // Log each unserved patient as "canceled" in analytics
      const archivePromises = patientsSnapshot.docs.map(async (patientDoc) => {
        const patient = patientDoc.data();
        
        if (!patient.served) {
          await logPatientEvent(
            patient.doctorId,
            patient.name,
            patient.timestamp?.toDate() || new Date(),
            'canceled'
          );
        }
      });

      await Promise.all(archivePromises);
      console.log('✅ Patient archiving completed');
    } catch (error) {
      console.error('❌ Error archiving patients:', error);
      throw error;
    }
  };

  const clearPatientsCollection = async (): Promise<void> => {
    try {
      console.log('🧹 Clearing patients collection...');
      
      const patientsSnapshot = await getDocs(collection(db, 'patients'));
      
      if (patientsSnapshot.empty) {
        console.log('📭 No patients to clear');
        return;
      }

      // Use batch to delete all patients
      const batch = writeBatch(db);
      
      patientsSnapshot.docs.forEach((patientDoc) => {
        batch.delete(doc(db, 'patients', patientDoc.id));
      });

      await batch.commit();
      console.log(`✅ Cleared ${patientsSnapshot.size} patients from collection`);
    } catch (error) {
      console.error('❌ Error clearing patients collection:', error);
      throw error;
    }
  };

  const resetDoctorQueues = async (): Promise<void> => {
    try {
      console.log('👨‍⚕️ Resetting doctor queue status...');
      
      const doctorsSnapshot = await getDocs(collection(db, 'doctors'));
      
      if (doctorsSnapshot.empty) {
        console.log('📭 No doctors to reset');
        return;
      }

      // Reset all doctors to not accepting queues
      const batch = writeBatch(db);
      
      doctorsSnapshot.docs.forEach((doctorDoc) => {
        batch.update(doc(db, 'doctors', doctorDoc.id), {
          acceptingQueues: false
        });
      });

      await batch.commit();
      console.log(`✅ Reset ${doctorsSnapshot.size} doctors to not accepting queues`);
    } catch (error) {
      console.error('❌ Error resetting doctor queues:', error);
      throw error;
    }
  };

  const performDailyReset = useCallback(async (): Promise<void> => {
    try {
      console.log('🌅 Starting daily queue reset...');
      
      // Step 1: Archive unserved patients to analytics
      await archiveActivePatients();
      
      // Step 2: Clear the patients collection
      await clearPatientsCollection();
      
      // Step 3: Reset doctor queue acceptance status
      await resetDoctorQueues();
      
      // Step 4: Update last reset date
      const today = getCurrentDateString();
      setLastResetDate(today);
      
      console.log('✅ Daily queue reset completed successfully');
      toast.success('Daily queue reset completed');
      
    } catch (error) {
      console.error('❌ Daily reset failed:', error);
      toast.error('Daily reset failed - please contact support');
      throw error;
    }
  }, [logPatientEvent]);

  const checkAndPerformReset = useCallback(async (): Promise<void> => {
    const today = getCurrentDateString();
    const lastReset = getLastResetDate();
    
    console.log(`📅 Checking reset status - Today: ${today}, Last Reset: ${lastReset}`);
    
    if (lastReset !== today) {
      console.log('🔄 Reset needed - performing daily reset...');
      await performDailyReset();
    } else {
      console.log('✅ Reset already performed today');
    }
  }, [performDailyReset]);

  const manualReset = useCallback(async (): Promise<void> => {
    if (confirm('Are you sure you want to manually reset all queues? This will clear all active patients and reset doctor availability.')) {
      await performDailyReset();
    }
  }, [performDailyReset]);

  // Check for reset on component mount and every hour
  useEffect(() => {
    checkAndPerformReset();
    
    // Check every hour for reset (in case app is running at midnight)
    const interval = setInterval(checkAndPerformReset, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAndPerformReset]);

  // Additional check at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      checkAndPerformReset();
      
      // Set up daily interval after first midnight trigger
      const dailyInterval = setInterval(checkAndPerformReset, 24 * 60 * 60 * 1000);
      
      return () => clearInterval(dailyInterval);
    }, msUntilMidnight);
    
    return () => clearTimeout(midnightTimeout);
  }, [checkAndPerformReset]);

  return {
    performDailyReset,
    checkAndPerformReset,
    manualReset,
    getCurrentDateString,
    getLastResetDate
  };
};