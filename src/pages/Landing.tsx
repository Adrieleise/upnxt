import React from 'react';
import { ArrowUp, Clock, Users, Smartphone, CheckCircle, Star, ChevronDown, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Eliminate physical waiting rooms and reduce patient wait times with smart queue management."
    },
    {
      icon: Smartphone,
      title: "Mobile-Friendly",
      description: "Patients can join queues and check status from any device, anywhere."
    },
    {
      icon: Users,
      title: "Real-Time Updates",
      description: "Live queue status updates keep everyone informed and reduce anxiety."
    },
    {
      icon: CheckCircle,
      title: "Easy Admin Controls",
      description: "Intuitive dashboard for staff to manage queues, patients, and appointments."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Join",
      description: "Scan QR code or visit the website to join the queue instantly."
    },
    {
      number: "02",
      title: "Wait",
      description: "Receive real-time updates on your position and estimated wait time."
    },
    {
      number: "03",
      title: "Serve",
      description: "Get notified when it's your turn and proceed to your appointment."
    }
  ];

  const faqs = [
    {
      question: "How does UpNxt work?",
      answer: "UpNxt is a digital queue management system. Patients scan a QR code or visit your clinic's queue page to join the line. They receive real-time updates on their position and can wait comfortably anywhere."
    },
    {
      question: "Is it suitable for small clinics?",
      answer: "Absolutely! UpNxt is designed to scale from single-doctor practices to large medical facilities. Our simple setup process gets you running in minutes."
    },
    {
      question: "Do patients need to download an app?",
      answer: "No app required! UpNxt works through any web browser on smartphones, tablets, or computers. This ensures maximum accessibility for all patients."
    },
    {
      question: "How much does it cost?",
      answer: "We offer flexible pricing plans based on your clinic size and needs. Contact us for a personalized quote and free trial."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Maria Santos",
      role: "Family Medicine",
      content: "UpNxt transformed our clinic operations. Patients love the convenience and our staff can focus on care instead of managing queues.",
      rating: 5
    },
    {
      name: "James Rodriguez",
      role: "Clinic Manager",
      content: "The real-time updates reduced patient complaints by 80%. Setup was incredibly easy and the support team is fantastic.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <ArrowUp className="h-6 w-6 text-accent" />
              </div>
              <span className="text-2xl font-bold text-primary font-heading">pNxt</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary transition-colors font-medium">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary transition-colors font-medium">How It Works</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition-colors font-medium">Contact</a>
              <Link 
                to="/admin" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Admin Login
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 font-heading">
              Making Every Minute Count.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Smarter queuing for clinics and beyond. Eliminate waiting rooms, reduce stress, and improve patient experience with our intelligent queue management system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/"
                className="bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg font-heading"
              >
                Join the Queue
              </Link>
              <a 
                href="#how-it-works"
                className="bg-white text-primary px-8 py-4 rounded-lg text-lg font-semibold border-2 border-primary hover:bg-primary hover:text-white transition-all font-heading"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your queue management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="bg-highlight/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                  <span className="text-2xl font-bold text-primary font-heading">{step.number}</span>
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-4 font-heading">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Why Choose UpNxt?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern healthcare with patient experience at the center
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="bg-accent/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3 font-heading">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">See UpNxt in Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Intuitive interfaces designed for both patients and healthcare providers
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-xl p-8 text-center">
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <Smartphone className="h-16 w-16 text-accent mx-auto mb-4" />
                <h4 className="font-semibold text-primary font-heading">Patient Queue View</h4>
              </div>
              <p className="text-gray-600">Clean, simple interface for patients to join and track their position</p>
            </div>
            
            <div className="bg-gradient-to-br from-accent/5 to-highlight/20 rounded-xl p-8 text-center">
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <Users className="h-16 w-16 text-primary mx-auto mb-4" />
                <h4 className="font-semibold text-primary font-heading">Admin Dashboard</h4>
              </div>
              <p className="text-gray-600">Comprehensive tools for managing queues, doctors, and patient flow</p>
            </div>
            
            <div className="bg-gradient-to-br from-highlight/10 to-primary/5 rounded-xl p-8 text-center">
              <div className="bg-white rounded-lg p-6 mb-4 shadow-sm">
                <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
                <h4 className="font-semibold text-primary font-heading">QR Check-in</h4>
              </div>
              <p className="text-gray-600">Contactless check-in system for enhanced safety and convenience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by healthcare providers across the country
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-primary font-heading">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about UpNxt
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-primary font-heading">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4 font-heading">Get Started Today</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to transform your clinic's queue management? Contact us for a demo.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-semibold text-primary mb-6 font-heading">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-accent" />
                  <span className="text-gray-600">hello@upnxt.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="text-gray-600">+63 917 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-accent" />
                  <span className="text-gray-600">Manila, Philippines</span>
                </div>
              </div>
            </div>
            
            <div>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                    placeholder="Tell us about your clinic's needs..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent/90 transition-colors font-heading"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="bg-accent p-2 rounded-lg">
                <ArrowUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold font-heading">pNxt</span>
            </div>
            
            <div className="flex space-x-8 mb-4 md:mb-0">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">About</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy</a>
            </div>
            
            <p className="text-gray-300 text-sm">
              © 2024 UpNxt. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;