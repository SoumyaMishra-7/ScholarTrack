// src/components/OnboardingTour.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OnboardingTour = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to ScholarTrack!",
      description: "Your journey to finding the perfect scholarships starts here. Let us show you around in just 30 seconds.",
      illustration: "🎓",
      background: "from-blue-500 via-blue-400 to-cyan-400",
      position: "center",
      visual: "welcome"
    },
    {
      title: "Create Your Smart Profile",
      description: "Set up your profile once and let our AI do the matching. We'll find scholarships that actually fit you.",
      illustration: "👤",
      background: "from-blue-600 via-blue-500 to-cyan-500",
      position: "top",
      visual: "profile",
      highlight: "profile"
    },
    {
      title: "Discover Perfect Matches",
      description: "Get personalized scholarship recommendations based on your background, interests, and achievements.",
      illustration: "🎯",
      background: "from-purple-600 via-blue-600 to-cyan-600",
      position: "center",
      visual: "matches",
      highlight: "matches"
    },
    {
      title: "Track Everything, Miss Nothing",
      description: "Never miss a deadline again. Track applications, get reminders, and monitor your progress effortlessly.",
      illustration: "📊",
      background: "from-blue-700 via-cyan-600 to-teal-500",
      position: "center",
      visual: "dashboard",
      highlight: "dashboard"
    },
    {
      title: "For Education Administrators",
      description: "Manage scholarships, verify applications, and help students succeed with powerful admin tools.",
      illustration: "⚡",
      background: "from-blue-800 via-cyan-700 to-teal-600",
      position: "center",
      visual: "admin",
      highlight: "admin"
    },
    {
      title: "Ready to Begin Your Journey?",
      description: "Join 10,000+ students who've found their perfect scholarships with ScholarTrack!",
      illustration: "🚀",
      background: "from-blue-600 via-cyan-500 to-teal-400",
      position: "center",
      visual: "cta",
      highlight: "cta"
    }
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' && !isAnimating) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isAnimating) {
        handlePrevious();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, isAnimating]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep + 1);
      setIsAnimating(false);
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = async () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(currentStep - 1);
      setIsAnimating(false);
    }
  };

  const handleGetStarted = () => {
    onClose();
    navigate('/auth');
  };

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => onClose(), 200);
  };

  const handleStepClick = async (index) => {
    if (index !== currentStep && !isAnimating) {
      setIsAnimating(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setCurrentStep(index);
      setIsAnimating(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-all duration-500"
        style={{
          opacity: isAnimating ? 0.8 : 1
        }}
        onClick={handleClose}
      />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-float-medium"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-teal-400/20 rounded-full blur-xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-purple-400/20 rounded-full blur-xl animate-float-fast"></div>
      </div>

      {/* Main Tour Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4">
        <div 
          className={`bg-gradient-to-br ${currentStepData.background} rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 ${
            isAnimating ? 'scale-95 opacity-90' : 'scale-100 opacity-100'
          }`}
        >
          
          {/* Enhanced Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/20 bg-white/5">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-sm">{currentStep + 1}</span>
                </div>
                <div className="absolute -inset-1 bg-white/10 rounded-xl blur-sm"></div>
              </div>
              <div>
                <span className="text-white/90 text-sm font-semibold block">
                  Step {currentStep + 1} of {steps.length}
                </span>
                <span className="text-white/60 text-xs">
                  {currentStepData.title.split(' ').slice(0, 3).join(' ')}...
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Step Indicators */}
              <div className="flex space-x-1 mr-4">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleStepClick(index)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-white scale-125' 
                        : index < currentStep
                        ? 'bg-white/60 hover:bg-white/80'
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-200 group backdrop-blur-sm"
              >
                <span className="text-white/70 group-hover:text-white text-lg font-semibold transition-colors">
                  ✕
                </span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-8">
            {/* Animated Illustration */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="text-7xl mb-6 transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                  {currentStepData.illustration}
                </div>
                <div className="absolute inset-0 bg-white/10 rounded-full blur-md transform scale-150"></div>
              </div>
              
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                {currentStepData.title}
              </h2>
              <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-light">
                {currentStepData.description}
              </p>
            </div>

            {/* Enhanced Step Visualizations */}
            <div className="mb-8 min-h-[200px] flex items-center justify-center">
              {renderEnhancedVisualization(currentStepData, currentStep, isAnimating)}
            </div>

            {/* Progress Bar */}
            <div className="mb-8 px-4">
              <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-white/30"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Enhanced Navigation */}
            <div className="flex justify-between items-center px-2">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 backdrop-blur-sm ${
                  currentStep === 0 
                    ? 'text-white/30 cursor-not-allowed' 
                    : 'text-white hover:bg-white/10 hover:scale-105 active:scale-95'
                }`}
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-white/70 hover:text-white font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleNext}
                  className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>
                      {currentStep === steps.length - 1 ? 'Get Started Free' : 'Continue'}
                    </span>
                    {currentStep !== steps.length - 1 && <span>→</span>}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-4 bg-black/30 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/10">
            <div className="flex items-center space-x-1 text-white/60 text-sm">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">←</kbd>
              <span>Previous</span>
            </div>
            <div className="flex items-center space-x-1 text-white/60 text-sm">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">→</kbd>
              <span>Next</span>
            </div>
            <div className="flex items-center space-x-1 text-white/60 text-sm">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
              <span>Close</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Visualization Components
const renderEnhancedVisualization = (step, stepIndex, isAnimating) => {
  const baseClass = `transition-all duration-500 transform ${
    isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
  }`;

  switch (stepIndex) {
    case 0: // Welcome
      return (
        <div className={`${baseClass} text-center`}>
          <div className="inline-flex space-x-4 mb-6">
            {['🎓', '⭐', '🚀'].map((emoji, i) => (
              <div 
                key={i}
                className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm transform hover:scale-110 transition-all duration-300 animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {emoji}
              </div>
            ))}
          </div>
          <div className="text-white/70 text-lg">
            Let's begin your scholarship journey!
          </div>
        </div>
      );

    case 1: // Profile Creation
      return (
        <div className={`${baseClass} max-w-md mx-auto`}>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-lg">
                👤
              </div>
              <div className="flex-1">
                <div className="h-4 bg-white/30 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-3 bg-white/20 rounded w-24"></div>
              </div>
            </div>
            
            <div className="space-y-4">
              {['Name & Education', 'Interests & Skills', 'Achievements'].map((field, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex-1 h-10 bg-white/10 rounded-lg flex items-center px-4 group-hover:bg-white/15 transition-colors">
                    <span className="text-white/80 text-sm">{field}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 h-12 bg-white/20 rounded-lg flex items-center justify-center text-white/80 text-sm hover:bg-white/25 transition-colors cursor-pointer">
              Complete Your Profile →
            </div>
          </div>
        </div>
      );

    case 2: // Scholarship Matches
      return (
        <div className={`${baseClass} max-w-2xl mx-auto`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { amount: "$5,000", title: "Tech Innovation", match: "95%", color: "from-blue-400 to-cyan-400" },
              { amount: "$10,000", title: "STEM Leadership", match: "88%", color: "from-purple-400 to-pink-400" },
              { amount: "$7,500", title: "Community Service", match: "92%", color: "from-green-400 to-teal-400" }
            ].map((scholarship, i) => (
              <div 
                key={i}
                className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-float group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white text-sm">
                    🎯
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{scholarship.amount}</div>
                    <div className="text-white/60 text-xs">Match: {scholarship.match}</div>
                  </div>
                </div>
                <div className="h-8 bg-white/10 rounded-lg flex items-center px-2 mb-2 group-hover:bg-white/15 transition-colors">
                  <span className="text-white text-sm font-medium truncate">{scholarship.title}</span>
                </div>
                <div className={`h-1 bg-gradient-to-r ${scholarship.color} rounded-full`}></div>
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
              <span className="text-green-400 text-lg">✨</span>
              <span className="text-white/80 text-sm">3 perfect matches found!</span>
            </div>
          </div>
        </div>
      );

    case 3: // Application Tracking
      return (
        <div className={`${baseClass} max-w-md mx-auto`}>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">Application Dashboard</h3>
              <div className="text-green-400 text-sm">📈 78% Complete</div>
            </div>
            
            <div className="space-y-5">
              {[
                { label: "Submitted", value: 85, count: 5, color: "bg-green-400" },
                { label: "In Review", value: 60, count: 3, color: "bg-yellow-400" },
                { label: "Drafts", value: 30, count: 2, color: "bg-blue-400" }
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/60 text-xs">{item.count} apps</span>
                      <span className="text-white text-sm font-medium">{item.value}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out shadow-lg`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-3 gap-3 mt-6 text-center text-white/70 text-xs">
              <div className="bg-white/5 rounded-lg p-2">📅 5 Deadlines</div>
              <div className="bg-white/5 rounded-lg p-2">✅ 2 Approved</div>
              <div className="bg-white/5 rounded-lg p-2">⏳ 3 Pending</div>
            </div>
          </div>
        </div>
      );

    case 4: // Admin Features
      return (
        <div className={`${baseClass} max-w-md mx-auto`}>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
                ⚡
              </div>
              <div>
                <h3 className="text-white font-semibold">Admin Dashboard</h3>
                <p className="text-white/60 text-sm">Manage everything in one place</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/15 transition-colors">
                <div className="text-white font-bold text-xl">150+</div>
                <div className="text-white/60 text-xs">Students</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/15 transition-colors">
                <div className="text-white font-bold text-xl">98%</div>
                <div className="text-white/60 text-xs">Verified</div>
              </div>
            </div>
            
            <div className="space-y-3">
              {['Scholarship Management', 'Application Review', 'Analytics & Reports', 'Student Communication'].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3 group">
                  <div className="w-5 h-5 bg-green-400/20 rounded-full flex items-center justify-center group-hover:bg-green-400/30 transition-colors">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-white/80 text-sm group-hover:text-white transition-colors">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 5: // CTA
      return (
        <div className={`${baseClass} text-center`}>
          <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 transform hover:scale-105 transition-all duration-300 animate-pulse-slow max-w-sm mx-auto">
            <div className="text-5xl mb-4">🎉</div>
            <div className="text-white font-bold text-xl mb-2">You're All Set!</div>
            <div className="text-white/70 text-sm mb-4">
              Start your scholarship journey today
            </div>
            <div className="grid grid-cols-3 gap-2 text-white/60 text-xs">
              <div>✅ Easy Setup</div>
              <div>🚀 Quick Results</div>
              <div>💸 More Scholarships</div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default OnboardingTour;