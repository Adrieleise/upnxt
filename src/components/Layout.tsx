import React from 'react';
import { ArrowUp } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'UpNext' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary p-2 rounded-lg">
                <ArrowUp className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-heading">UpNxt</h1>
                <p className="text-sm text-gray-600 font-body">Patient Queue Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;