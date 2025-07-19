import React from 'react';
import Layout from '../components/Layout';
import PatientForm from '../components/PatientForm';
import { useDoctors } from '../hooks/useDoctors';

const Queue: React.FC = () => {
  const { doctors, loading } = useDoctors();
  const availableDoctors = doctors.filter(doctor => doctor.acceptingQueues);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4 font-heading">
            Welcome to UpNxt
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-body">
            Join the patient queue and wait comfortably for your turn
          </p>
          
          {!loading && availableDoctors.length > 0 && (
            <div className="bg-accent/10 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-primary mb-2 font-heading">Available Doctors Today</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {availableDoctors.map((doctor) => (
                  <span
                    key={doctor.id}
                    className="bg-accent/20 text-primary px-3 py-1 rounded-full text-sm font-body"
                  >
                    {doctor.name} - {doctor.specialty}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <PatientForm />
        </div>
      </div>
    </Layout>
  );
};

export default Queue;