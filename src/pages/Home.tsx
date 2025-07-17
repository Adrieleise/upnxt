import React from 'react';
import Layout from '../components/Layout';
import PatientForm from '../components/PatientForm';
import { useDoctors } from '../hooks/useDoctors';

const Home: React.FC = () => {
  const { doctors, loading } = useDoctors();
  const availableDoctors = doctors.filter(doctor => doctor.acceptingQueues);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to UpNext
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Join the patient queue and wait comfortably for your turn
          </p>
          
          {!loading && availableDoctors.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-8">
              <h3 className="font-semibold text-blue-900 mb-2">Available Doctors Today</h3>
              <div className="flex flex-wrap justify-center gap-2">
                {availableDoctors.map((doctor) => (
                  <span
                    key={doctor.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
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

export default Home;