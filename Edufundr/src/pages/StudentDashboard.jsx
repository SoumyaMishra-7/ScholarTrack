// src/components/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [availableScholarships, setAvailableScholarships] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load user's applications
    const userApplications = JSON.parse(localStorage.getItem(`scholartrack_applications_${user.id}`) || '[]');
    setApplications(userApplications);

    // Load available scholarships
    const scholarships = JSON.parse(localStorage.getItem('scholartrack_scholarships') || '[]');
    setAvailableScholarships(scholarships);
  };

  const stats = {
    totalApplied: applications.length,
    pending: applications.filter(app => app.status === 'submitted').length,
    approved: applications.filter(app => app.status === 'approved').length,
    scholarshipsAvailable: availableScholarships.length
  };

  const handleApply = (scholarship) => {
    navigate('/application-form', { state: { scholarship } });
  };

  const handleWithdraw = (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      const updatedApplications = applications.filter(app => app.id !== applicationId);
      setApplications(updatedApplications);
      localStorage.setItem(`scholartrack_applications_${user.id}`, JSON.stringify(updatedApplications));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo and Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              {/* Logo */}
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
              <span className="text-sm text-gray-700 bg-blue-100 px-3 py-1 rounded-full">
                Student
              </span>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {['dashboard', 'scholarships', 'applications', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Applications Submitted</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalApplied}</p>
                <p className="text-sm text-gray-500 mt-2">Total applications</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Review</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-500 mt-2">Under consideration</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-gray-500 mt-2">Successful applications</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Available</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.scholarshipsAvailable}</p>
                <p className="text-sm text-gray-500 mt-2">Scholarships to apply</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Applications</h2>
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.scholarshipName}</h3>
                      <p className="text-sm text-gray-500">Applied on {new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                      {application.status === 'submitted' && (
                        <button
                          onClick={() => handleWithdraw(application.id)}
                          className="ml-2 text-xs text-red-600 hover:text-red-800"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No applications yet. Start applying to scholarships!</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scholarships' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Scholarships</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableScholarships.map((scholarship) => (
                <div key={scholarship.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{scholarship.title}</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      ${scholarship.amount?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{scholarship.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                    <span>{scholarship.applicants || 0} applicants</span>
                  </div>
                  <button
                    onClick={() => handleApply(scholarship)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scholarship
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((application) => (
                    <tr key={application.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{application.scholarshipName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.status === 'submitted' && (
                          <button
                            onClick={() => handleWithdraw(application.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Withdraw
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {applications.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applications found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Role</label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Applications:</span>
                    <span className="font-semibold">{stats.totalApplied}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Pending Review:</span>
                    <span className="font-semibold text-yellow-600">{stats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Approved:</span>
                    <span className="font-semibold text-green-600">{stats.approved}</span>
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