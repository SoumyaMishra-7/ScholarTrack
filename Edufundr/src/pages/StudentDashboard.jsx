// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScholarship } from '../context/ScholarshipContext';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [applicationData, setApplicationData] = useState({
    personalStatement: '',
    academicRecords: '',
    recommendationLetter: '',
    additionalDocuments: ''
  });

  const { 
    scholarships, 
    applications, 
    loading, 
    error,
    applyForScholarship,
    loadScholarships,
    loadApplications
  } = useScholarship();

  // Filter applications for current student
  const studentApplications = applications.filter(app => app.studentEmail === user.email);

  useEffect(() => {
    // Reload data when component mounts
    loadScholarships();
    loadApplications();
  }, []);

  const stats = {
    totalApplied: studentApplications.length,
    pending: studentApplications.filter(app => app.status === 'pending').length,
    approved: studentApplications.filter(app => app.status === 'approved').length,
    rejected: studentApplications.filter(app => app.status === 'rejected').length,
    scholarshipsAvailable: scholarships.filter(s => s.status === 'active').length
  };

  const handleApplyClick = (scholarship) => {
    setSelectedScholarship(scholarship);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await applyForScholarship({
        scholarshipId: selectedScholarship.id,
        scholarshipName: selectedScholarship.title,
        studentName: user.name,
        studentEmail: user.email,
        studentId: user.id,
        personalStatement: applicationData.personalStatement,
        academicRecords: applicationData.academicRecords,
        recommendationLetter: applicationData.recommendationLetter,
        additionalDocuments: applicationData.additionalDocuments
      });

      // Reset form and close modal
      setApplicationData({
        personalStatement: '',
        academicRecords: '',
        recommendationLetter: '',
        additionalDocuments: ''
      });
      setShowApplicationForm(false);
      setSelectedScholarship(null);

      // Show success message
      alert('Application submitted successfully!');
      
    } catch (error) {
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Under Review' },
      approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', label: 'Not Selected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getDaysUntilDeadline = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading && scholarships.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">ST</span>
          </div>
          <div className="text-lg text-gray-600 font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Application Form Modal */}
      {showApplicationForm && selectedScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  Apply for {selectedScholarship.title}
                </h2>
                <button
                  onClick={() => setShowApplicationForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">
                ${selectedScholarship.amount.toLocaleString()} • {selectedScholarship.provider}
              </p>
            </div>

            <form onSubmit={handleApplicationSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Statement *
                </label>
                <textarea
                  name="personalStatement"
                  value={applicationData.personalStatement}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us why you deserve this scholarship..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Records Summary *
                </label>
                <textarea
                  name="academicRecords"
                  value={applicationData.academicRecords}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Briefly describe your academic achievements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommendation Letter Details
                </label>
                <input
                  type="text"
                  name="recommendationLetter"
                  value={applicationData.recommendationLetter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Professor/Teacher name and contact..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Documents
                </label>
                <input
                  type="text"
                  name="additionalDocuments"
                  value={applicationData.additionalDocuments}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any other supporting documents..."
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header with Logo and Navigation */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3L1 9L12 15L23 9L12 3Z" fill="currentColor" />
                  <path d="M5 13V16C5 16 7 18 12 18C17 18 19 16 19 16V13" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M2 7L1 9L2 11" stroke="white" strokeWidth="1.5" />
                  <path d="M22 7L23 9L22 11" stroke="white" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ScholarTrack
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Welcome back, {user.name}!</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <span className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full font-medium">
                Student Portal
              </span>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'scholarships', label: 'Scholarships', icon: '🎓' },
              { id: 'applications', label: 'My Applications', icon: '📝' },
              { id: 'profile', label: 'Profile', icon: '👤' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white">
              <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard, {user.name}!</h1>
              <p className="text-blue-100 text-lg">
                Track your scholarship applications and discover new opportunities.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications Submitted</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalApplied}</p>
                  </div>
                  <div className="text-2xl">📨</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Total applications</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Under Review</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                  <div className="text-2xl">⏳</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Pending decisions</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                  </div>
                  <div className="text-2xl">✅</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Successful applications</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.scholarshipsAvailable}</p>
                  </div>
                  <div className="text-2xl">🎯</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Scholarships to apply</p>
              </div>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Applications */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📋</span>
                  Recent Applications
                </h2>
                <div className="space-y-4">
                  {studentApplications.slice(0, 5).map((application) => (
                    <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{application.scholarshipName}</h3>
                        <p className="text-xs text-gray-500">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(application.status)}
                      </div>
                    </div>
                  ))}
                  {studentApplications.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-gray-500 font-medium">No applications yet</p>
                      <p className="text-sm text-gray-400 mt-1">Start applying to scholarships!</p>
                      <button
                        onClick={() => setActiveTab('scholarships')}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Browse Scholarships
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">⚡</span>
                  Quick Actions
                </h2>
                <div className="space-y-4">
                  <button
                    onClick={() => setActiveTab('scholarships')}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">Browse Scholarships</h3>
                        <p className="text-sm text-gray-500">Discover new opportunities</p>
                      </div>
                      <div className="text-2xl">🔍</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('applications')}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-green-600">View Applications</h3>
                        <p className="text-sm text-gray-500">Check your application status</p>
                      </div>
                      <div className="text-2xl">📊</div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full text-left p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600">Update Profile</h3>
                        <p className="text-sm text-gray-500">Manage your information</p>
                      </div>
                      <div className="text-2xl">👤</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">🎓</span>
                Available Scholarships
              </h2>
              <div className="text-sm text-gray-500">
                {scholarships.filter(s => s.status === 'active').length} scholarships available
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.filter(s => s.status === 'active').map((scholarship) => {
                const daysLeft = getDaysUntilDeadline(scholarship.deadline);
                const hasApplied = studentApplications.some(app => app.scholarshipId === scholarship.id);
                
                return (
                  <div key={scholarship.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{scholarship.title}</h3>
                        <p className="text-sm text-blue-600 font-medium">{scholarship.provider}</p>
                      </div>
                      <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm px-3 py-1 rounded-full font-semibold">
                        ${scholarship.amount.toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{scholarship.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>📅 Deadline</span>
                        <span className={daysLeft < 7 ? 'text-red-600 font-semibold' : ''}>
                          {new Date(scholarship.deadline).toLocaleDateString()} ({daysLeft} days left)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>👥 Applicants</span>
                        <span>{scholarship.applicants || 0} applied</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>🎯 Category</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">{scholarship.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplyClick(scholarship)}
                      disabled={hasApplied}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${
                        hasApplied
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transform'
                      }`}
                    >
                      {hasApplied ? '✓ Already Applied' : 'Apply Now'}
                    </button>

                    {hasApplied && (
                      <p className="text-xs text-green-600 text-center mt-2">
                        You've applied for this scholarship
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {scholarships.filter(s => s.status === 'active').length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Scholarships Available</h3>
                <p className="text-gray-500">Check back later for new scholarship opportunities.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                <span className="mr-3">📝</span>
                My Applications
              </h2>
              <div className="text-sm text-gray-500">
                {studentApplications.length} total applications
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Scholarship</div>
                  <div className="col-span-2">Applied Date</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {studentApplications.map((application) => {
                  const scholarship = scholarships.find(s => s.id === application.scholarshipId);
                  return (
                    <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5">
                          <div className="font-semibold text-gray-900 text-sm">
                            {application.scholarshipName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {scholarship?.provider || 'Unknown Provider'}
                          </div>
                        </div>
                        
                        <div className="col-span-2 text-sm text-gray-600">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        
                        <div className="col-span-2 text-sm font-semibold text-green-600">
                          ${scholarship?.amount.toLocaleString() || 'N/A'}
                        </div>
                        
                        <div className="col-span-2">
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="col-span-1">
                          {application.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to withdraw this application?')) {
                                  // Withdraw logic would go here
                                  alert('Withdrawal feature coming soon!');
                                }
                              }}
                              className="text-red-600 hover:text-red-800 text-xs font-medium"
                            >
                              Withdraw
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {studentApplications.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-500 mb-4">Start applying to scholarships to see them here.</p>
                  <button
                    onClick={() => setActiveTab('scholarships')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Scholarships
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center">
              <span className="mr-3">👤</span>
              My Profile
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📋</span>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="text-gray-900 font-semibold">{user.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="text-gray-900 font-semibold">{user.email}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <div className="text-gray-900 font-semibold capitalize">{user.role}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                    <div className="text-gray-900 font-semibold">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Application Statistics */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📊</span>
                  Application Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Total Applications:</span>
                    <span className="font-bold text-blue-600 text-lg">{stats.totalApplied}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Under Review:</span>
                    <span className="font-bold text-yellow-600 text-lg">{stats.pending}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Approved:</span>
                    <span className="font-bold text-green-600 text-lg">{stats.approved}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Not Selected:</span>
                    <span className="font-bold text-red-600 text-lg">{stats.rejected}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Tips for Success
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">🎯</span>
                  <div>
                    <div className="font-medium text-gray-900">Apply Early</div>
                    <div className="text-gray-600">Submit applications well before deadlines</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">📝</span>
                  <div>
                    <div className="font-medium text-gray-900">Personalize Essays</div>
                    <div className="text-gray-600">Tailor your responses to each scholarship</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">🔍</span>
                  <div>
                    <div className="font-medium text-gray-900">Research Thoroughly</div>
                    <div className="text-gray-600">Understand each scholarship's requirements</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-lg">⏰</span>
                  <div>
                    <div className="font-medium text-gray-900">Track Deadlines</div>
                    <div className="text-gray-600">Use our dashboard to stay organized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;