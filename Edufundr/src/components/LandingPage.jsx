// src/components/LandingPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingTour from './OnboardingTour';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: '🎯',
      title: 'Personalized Matches',
      description: 'Get scholarships that fit your background, interests, and achievements perfectly.'
    },
    {
      icon: '⚡',
      title: 'Deadline Reminders',
      description: 'Never miss an application deadline with smart notifications and alerts.'
    },
    {
      icon: '🔒',
      title: 'Verified Sources',
      description: 'All opportunities are verified and updated regularly for your safety.'
    },
    {
      icon: '💬',
      title: 'Smart Guidance',
      description: 'Get expert tips and support to create compelling scholarship applications.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Manage all your applications and track your progress in one dashboard.'
    },
    {
      icon: '🚀',
      title: 'Quick Applications',
      description: 'Apply to multiple scholarships with pre-filled information and templates.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Profile',
      description: 'Tell us about your academics, interests, and achievements to get personalized matches.',
      icon: '👤'
    },
    {
      number: '02',
      title: 'Discover Scholarships',
      description: 'Get matched with verified scholarships that align with your profile and goals.',
      icon: '🔍'
    },
    {
      number: '03',
      title: 'Apply Easily',
      description: 'Follow guided steps with pre-filled information and document management.',
      icon: '📝'
    },
    {
      number: '04',
      title: 'Track Progress',
      description: 'Monitor your applications, deadlines, and results all in one place.',
      icon: '📈'
    }
  ];

  const testimonials = [
    {
      quote: "ScholarTrack helped me discover 8 scholarships I never knew existed! I've already won two of them.",
      author: "Riya Sharma",
      role: "Computer Science Student",
      college: "IIT Delhi"
    },
    {
      quote: "The deadline reminders saved me multiple times. I never missed an application thanks to ScholarTrack!",
      author: "Aarav Patel",
      role: "Mechanical Engineering",
      college: "NIT Surat"
    },
    {
      quote: "As a first-generation student, ScholarTrack made the scholarship process so much less overwhelming.",
      author: "Priya Verma",
      role: "Medical Student",
      college: "AIIMS Delhi"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              {/* Updated Logo - Option 1 */}
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Graduation Cap Base */}
                  <path d="M12 3L1 9L12 15L23 9L12 3Z" fill="currentColor" />
                  {/* Cap Tassel */}
                  <path d="M5 13V16C5 16 7 18 12 18C17 18 19 16 19 16V13" stroke="currentColor" strokeWidth="1.5" />
                  {/* Progress Arrow */}
                  <path d="M2 7L1 9L2 11" stroke="white" strokeWidth="1.5" />
                  <path d="M22 7L23 9L22 11" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ScholarTrack
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                Testimonials
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Find the Right{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Scholarship
                  </span>{' '}
                  for You
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Track, apply, and win scholarships with ease. ScholarTrack simplifies your scholarship journey with intelligent matching and comprehensive management tools.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  Get Started Free
                </button>
                <button 
                  onClick={() => setShowTour(true)}
                  className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 group relative overflow-hidden"
                >
                  <span className="relative z-10">Take a Quick Tour</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
              </div>

              <div className="flex items-center space-x-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-gray-600">Students Helped</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">$5M+</div>
                  <div className="text-gray-600">Scholarships Awarded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Active Scholarships</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">$10,000</div>
                        <div className="text-gray-500">Scholarship</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Tech Innovation Scholarship</h3>
                    <p className="text-gray-600">For students pursuing innovation in technology fields</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Google Inc.</span>
                      <span>15 days left</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                What is <span className="text-blue-600">ScholarTrack</span>?
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                ScholarTrack is an intelligent platform designed to simplify your scholarship journey. We connect students with verified scholarships that match their profile, interests, and achievements — saving time and increasing opportunities.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our mission is to make quality education accessible to every student by removing the barriers and complexities of finding and applying for scholarships.
              </p>
              <div className="space-y-4">
                {[
                  'Personalized scholarship matching',
                  'Deadline tracking and reminders',
                  'Application progress monitoring',
                  'Document management system',
                  'Verified scholarship opportunities'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Smart Dashboard</h3>
                        <p className="text-gray-600">Everything you need in one place</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">12</div>
                        <div className="text-sm text-blue-700">Active Applications</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">5</div>
                        <div className="text-sm text-green-700">Approved</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Application Completion</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">ScholarTrack</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed in your scholarship journey, all in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 group cursor-pointer"
                onClick={() => setShowTour(true)}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-4 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more in tour →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 4 simple steps and unlock thousands of scholarship opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div 
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 h-full border border-blue-100 hover:border-blue-300 transition-all duration-300 cursor-pointer group"
                  onClick={() => setShowTour(true)}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                  <div className="text-blue-600 text-sm font-semibold mb-2">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  <div className="mt-4 text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    See demo →
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-blue-200 transform -translate-y-1/2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full absolute -top-1.5 -right-2"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Success <span className="text-blue-600">Stories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who transformed their educational journey with ScholarTrack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 text-lg italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-100 pt-6">
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  <div className="text-blue-600 text-sm font-medium">{testimonial.college}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Scholarship Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already discovering and winning scholarships with ScholarTrack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-2xl transform hover:scale-105"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => setShowTour(true)}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 group"
            >
              <span className="group-hover:scale-105 transition-transform duration-300">
                🎬 Why we?
              </span>
            </button>
          </div>
          <p className="text-blue-100 mt-6">
            No credit card required • Setup in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3L1 9L12 15L23 9L12 3Z" fill="currentColor" />
                    <path d="M5 13V16C5 16 7 18 12 18C17 18 19 16 19 16V13" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M2 7L1 9L2 11" stroke="white" strokeWidth="1.5" />
                    <path d="M22 7L23 9L22 11" stroke="white" strokeWidth="1.5" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">ScholarTrack</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Making quality education accessible through smart scholarship management.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white transition-colors">Testimonials</button></li>
                <li><button onClick={handleGetStarted} className="text-gray-400 hover:text-white transition-colors">Get Started</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">soumyamishra788@gmail.com</li>
                <li className="text-gray-400">799XXXXXXX</li>
                <li className="text-gray-400">https://www.linkedin.com/in/soumya-mishra-0828a529a/</li>
                <li className="text-gray-400">Crafted With Love❤️</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 ScholarTrack. All rights reserved. Making education accessible to all.
            </p>
          </div>
        </div>
      </footer>

      {/* Onboarding Tour */}
      {showTour && <OnboardingTour onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default LandingPage;