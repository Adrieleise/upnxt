import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Clock, Users, Smartphone, Shield, Zap } from 'lucide-react';

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
                pNxt
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
              <Link 
                to="/admin" 
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/90 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-heading">
            Making Every Minute Count.
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Smarter queuing for clinics and beyond. Reduce wait times, improve patient experience, 
            and streamline your operations with UpNxt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/queue"
              className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg font-heading"
            >
              Join the Queue
            </Link>
            <a 
              href="#how-it-works"
              className="bg-white/10 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/20 transition-all border border-white/20 font-heading"
            >
              How It Works
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
              Simple, efficient, and designed for everyone
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">1. Join</h3>
              <p className="text-gray-600">
                Scan the QR code or visit the link to join the queue instantly. No app downloads required.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-highlight/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">2. Wait</h3>
              <p className="text-gray-600">
                Get real-time updates on your position and estimated wait time. Stay informed, stay relaxed.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">3. Serve</h3>
              <p className="text-gray-600">
                Get notified when it's your turn. Smooth, efficient service for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Why Choose UpNxt?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern healthcare and service businesses
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Save Time</h3>
              <p className="text-gray-600">
                Eliminate physical waiting rooms and reduce perceived wait times with real-time updates.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Real-time Updates</h3>
              <p className="text-gray-600">
                Live queue status, position tracking, and estimated wait times keep everyone informed.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Mobile-First</h3>
              <p className="text-gray-600">
                Works perfectly on any device. No app downloads, no complicated setup required.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Easy Management</h3>
              <p className="text-gray-600">
                Simple admin dashboard to manage queues, track metrics, and optimize operations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Secure & Private</h3>
              <p className="text-gray-600">
                HIPAA-compliant data handling with enterprise-grade security for healthcare environments.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="bg-highlight/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <ArrowUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-4 font-heading">Scalable</h3>
              <p className="text-gray-600">
                From single practitioners to large clinics, UpNxt grows with your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots/Mockups */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">See UpNxt in Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intuitive interfaces designed for both patients and staff
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-primary to-primary/80 h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <Smartphone className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Patient Queue View</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2 font-heading">Queue Status</h3>
                <p className="text-gray-600">Real-time position tracking and wait time estimates</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-accent to-accent/80 h-48 flex items-center justify-center">
                <div className="text-white text-center">
                  <Users className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg font-semibold">Admin Dashboard</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2 font-heading">Management Console</h3>
                <p className="text-gray-600">Complete queue management and analytics</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-highlight to-highlight/80 h-48 flex items-center justify-center">
                <div className="text-primary text-center">
                  <div className="w-24 h-24 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary rounded grid grid-cols-3 gap-1 p-2">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="bg-white rounded-sm"></div>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg font-semibold">QR Check-in</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-primary mb-2 font-heading">QR Code Access</h3>
                <p className="text-gray-600">Instant queue joining with QR code scanning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">What Our Users Say</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-neutral rounded-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold">
                  Dr
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">Dr. Sarah Chen</h4>
                  <p className="text-gray-600 text-sm">Family Medicine</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "UpNxt has transformed our clinic operations. Patients love the transparency, and we've reduced wait room congestion by 70%."
              </p>
            </div>
            
            <div className="bg-neutral rounded-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">Maria Rodriguez</h4>
                  <p className="text-gray-600 text-sm">Clinic Manager</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "The admin dashboard gives us insights we never had before. We can optimize scheduling and improve patient satisfaction."
              </p>
            </div>
            
            <div className="bg-neutral rounded-xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-highlight rounded-full flex items-center justify-center text-primary font-bold">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-primary">James Wilson</h4>
                  <p className="text-gray-600 text-sm">Patient</p>
                </div>
              </div>
              <p className="text-gray-700 italic">
                "No more sitting in crowded waiting rooms! I can run errands and get notified when it's my turn. Brilliant!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3 font-heading">How does UpNxt work?</h3>
              <p className="text-gray-600">
                Patients scan a QR code or visit a link to join your queue. They receive real-time updates on their position and estimated wait time, while you manage the queue through our admin dashboard.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3 font-heading">Is it HIPAA compliant?</h3>
              <p className="text-gray-600">
                Yes, UpNxt is designed with healthcare privacy requirements in mind. We collect minimal patient information and implement enterprise-grade security measures.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3 font-heading">Do patients need to download an app?</h3>
              <p className="text-gray-600">
                No! UpNxt works entirely through web browsers. Patients simply scan a QR code or visit a link to join the queue instantly.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-primary mb-3 font-heading">Can I customize the system for my practice?</h3>
              <p className="text-gray-600">
                Absolutely! UpNxt offers customization options for branding, messaging, and workflow to match your practice's specific needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Get Started Today</h2>
            <p className="text-xl text-gray-600">
              Ready to transform your queue management? Contact us for a demo.
            </p>
          </div>
          
          <div className="bg-neutral rounded-2xl p-8 md:p-12">
            <form className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  placeholder="Tell us about your practice and how we can help..."
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <button 
                  type="submit"
                  className="w-full bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-colors font-heading"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
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
              <span className="text-2xl font-bold text-primary font-heading">pNxt</span>
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