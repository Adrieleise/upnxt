import React from 'react';
import { useParams } from 'react-router-dom';
import PatientQueue from '../components/PatientQueue';

const Queue: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();

  if (!clinicId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4 font-heading">Invalid Clinic</h1>
          <p className="text-gray-600 font-body">The clinic link you're trying to access is invalid.</p>
        </div>
      </div>
    );
  }

  return <PatientQueue clinicId={clinicId} />;
};

export default Queue;