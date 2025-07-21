import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthForm from '../components/AuthForm';
import AdminDashboard from '../components/AdminDashboard';

const Admin: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  return user ? <AdminDashboard /> : <AuthForm />;
};

export default Admin;