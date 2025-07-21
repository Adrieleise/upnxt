import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Clock, Users, Smartphone, Shield, Zap, Building2 } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-primary rounded-lg p-2 mr-3">
                <ArrowUp className="h-6 w-6 text-accent" />
              </div>
              <span className="text-2xl font-bold text-primary font-heading">
                UpNxt
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                Contact
              </a>
              <div className="flex space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/admin" 
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading">
            Smart Queue Management for Clinics
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Streamline your clinic operations with our multi-clinic queue management system. 
            Each clinic gets their own dashboard, analytics, and patient queue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/admin"
              className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg font-heading"
            >
              Start Your Clinic
            </Link>
            <a 
              href="#how-it-works"
              className="bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 font-heading"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple setup for multi-clinic management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">1. Register</h3>
              <p className="text-gray-600">
                Create your clinic account and get your own isolated dashboard with unique QR code.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-highlight/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">2. Manage</h3>
              <p className="text-gray-600">
                Add doctors, manage queues, and track analytics all from your personalized admin panel.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">3. Serve</h3>
              <p className="text-gray-600">
                Patients scan your QR code to join your specific clinic queue. Real-time updates for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Multi-Clinic Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need for professional clinic management
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Isolated Clinics</h3>
              <p className="text-gray-600">
                Each clinic gets their own secure dashboard, queue, and analytics. Complete data isolation.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Real-time Updates</h3>
              <p className="text-gray-600">
                Live queue status, position tracking, and instant notifications across all devices.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Unique QR Codes</h3>
              <p className="text-gray-600">
                Each clinic gets a unique QR code that patients scan to join that specific clinic's queue.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibent text-primary mb-4 font-heading">Smart Reset</h3>
              <p className="text-gray-600">
                Manual queue reset with analytics preservation. Start fresh when needed while keeping history.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Secure & Private</h3>
              <p className="text-gray-600">
                Firebase Authentication ensures only authorized admins can access their clinic data.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Analytics Dashboard</h3>
              <p className="text-gray-600">
                Track performance, wait times, and patient flow with detailed analytics and historical data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 font-heading">Ready to Transform Your Clinic?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join hundreds of clinics already using UpNxt for better patient management.
          </p>
          <Link 
            to="/admin"
            className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg font-heading inline-block"
          >
            Register Your Clinic Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-primary rounded-lg p-2 mr-3">
                <ArrowUp className="h-6 w-6 text-accent" />
              </div>
              <span className="text-2xl font-bold text-primary font-heading">UpNxt</span>
            </div>
            
            <div className="flex space-x-8 mb-4 md:mb-0">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors">Contact</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy</a>
            </div>
            
            <p className="text-gray-500 text-sm">
              © 2024 UpNxt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;