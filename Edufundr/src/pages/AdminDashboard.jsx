// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useScholarship } from '../context/ScholarshipContext';

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  
  // Scholarship Management States
  const [newScholarship, setNewScholarship] = useState({
    title: '',
    description: '',
    amount: '',
    deadline: '',
    eligibility: '',
    provider: '',
    category: '',
    requirements: ''
  });
  const [editingScholarship, setEditingScholarship] = useState(null);
  
  const { 
    scholarships, 
    applications, 
    loading, 
    updateApplicationStatus,
    loadApplications,
    createScholarship,
    updateScholarship,
    deleteScholarship
  } = useScholarship();

  useEffect(() => {
    loadApplications();
  }, []);

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter(app => app.status === 'pending').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    rejectedApplications: applications.filter(app => app.status === 'rejected').length,
    totalScholarships: scholarships.length,
    activeScholarships: scholarships.filter(s => new Date(s.deadline) > new Date()).length
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status, user.name, reviewNotes);
      setSelectedApplication(null);
      setReviewNotes('');
      alert(`Application ${status} successfully!`);
    } catch (error) {
      alert('Failed to update application status');
    }
  };

  const getApplicationDetails = (application) => {
    const scholarship = scholarships.find(s => s.id === application.scholarshipId);
    return {
      ...application,
      scholarshipAmount: scholarship?.amount,
      scholarshipProvider: scholarship?.provider,
      scholarshipDeadline: scholarship?.deadline
    };
  };

  // Scholarship Management Functions
  const handleCreateScholarship = async (e) => {
    e.preventDefault();
    try {
      await createScholarship(newScholarship);
      setNewScholarship({
        title: '',
        description: '',
        amount: '',
        deadline: '',
        eligibility: '',
        provider: '',
        category: '',
        requirements: ''
      });
      alert('Scholarship created successfully!');
    } catch (error) {
      alert('Failed to create scholarship');
    }
  };

  const handleUpdateScholarship = async (e) => {
    e.preventDefault();
    try {
      await updateScholarship(editingScholarship.id, editingScholarship);
      setEditingScholarship(null);
      alert('Scholarship updated successfully!');
    } catch (error) {
      alert('Failed to update scholarship');
    }
  };

  const handleDeleteScholarship = async (scholarshipId) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await deleteScholarship(scholarshipId);
        alert('Scholarship deleted successfully!');
      } catch (error) {
        alert('Failed to delete scholarship');
      }
    }
  };

  const startEditing = (scholarship) => {
    setEditingScholarship({ ...scholarship });
  };

  const cancelEditing = () => {
    setEditingScholarship(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                ScholarTrack Admin
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm text-white bg-red-600 px-3 py-1 rounded-full font-medium">
                Admin Panel
              </span>
              <button
                onClick={onLogout}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex space-x-8 border-b">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'applications', label: 'Applications', icon: '📝' },
              { id: 'scholarships', label: 'Scholarships', icon: '🎓' },
              { id: 'analytics', label: 'Analytics', icon: '📈' }
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
        
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Applications</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalApplications}</p>
                <p className="text-sm text-gray-500 mt-2">All time applications</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Review</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingApplications}</p>
                <p className="text-sm text-gray-500 mt-2">Need attention</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Approved</h3>
                <p className="text-3xl font-bold text-green-600">{stats.approvedApplications}</p>
                <p className="text-sm text-gray-500 mt-2">Successful applications</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Scholarships</h3>
                <p className="text-3xl font-bold text-purple-600">{stats.totalScholarships}</p>
                <p className="text-sm text-gray-500 mt-2">Available programs</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Scholarships</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeScholarships}</p>
                <p className="text-sm text-gray-500 mt-2">Currently accepting applications</p>
              </div>
            </div>

            {/* Recent Applications Requiring Attention */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Applications Needing Review</h2>
              <div className="space-y-4">
                {applications.filter(app => app.status === 'pending').slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border border-yellow-200 rounded-xl bg-yellow-50">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{application.scholarshipName}</h3>
                      <p className="text-sm text-gray-600">Applicant: {application.studentName} ({application.studentEmail})</p>
                      <p className="text-xs text-gray-500">Applied: {new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
                {applications.filter(app => app.status === 'pending').length === 0 && (
                  <p className="text-gray-500 text-center py-4">No applications pending review. Great job! 🎉</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">All Applications</h2>
            
            {/* Applications Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-3">Applicant & Scholarship</div>
                  <div className="col-span-2">Applied Date</div>
                  <div className="col-span-2">Scholarship Details</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-3">Actions</div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {applications.map((application) => {
                  const appDetails = getApplicationDetails(application);
                  return (
                    <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-3">
                          <div className="font-semibold text-gray-900">{application.studentName}</div>
                          <div className="text-sm text-gray-500">{application.studentEmail}</div>
                          <div className="text-xs text-gray-400 mt-1">{application.scholarshipName}</div>
                        </div>
                        
                        <div className="col-span-2 text-sm text-gray-600">
                          {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        
                        <div className="col-span-2 text-sm">
                          <div className="font-semibold text-green-600">
                            ${appDetails.scholarshipAmount?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {appDetails.scholarshipProvider}
                          </div>
                        </div>
                        
                        <div className="col-span-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            application.status === 'approved' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status}
                          </span>
                        </div>
                        
                        <div className="col-span-3 flex space-x-2">
                          <button
                            onClick={() => setSelectedApplication(application)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View Details
                          </button>
                          {application.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'approved')}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(application.id, 'rejected')}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {applications.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-500">Student applications will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Scholarship Management Tab */}
        {activeTab === 'scholarships' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-gray-900">Manage Scholarships</h2>
              <div className="text-sm text-gray-500">
                {scholarships.length} total scholarships • {stats.activeScholarships} active
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create/Edit Scholarship Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {editingScholarship ? 'Edit Scholarship' : 'Create New Scholarship'}
                </h3>
                
                <form onSubmit={editingScholarship ? handleUpdateScholarship : handleCreateScholarship}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scholarship Title *</label>
                      <input
                        type="text"
                        required
                        value={editingScholarship ? editingScholarship.title : newScholarship.title}
                        onChange={(e) => editingScholarship 
                          ? setEditingScholarship({...editingScholarship, title: e.target.value})
                          : setNewScholarship({...newScholarship, title: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter scholarship title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Provider/Organization *</label>
                      <input
                        type="text"
                        required
                        value={editingScholarship ? editingScholarship.provider : newScholarship.provider}
                        onChange={(e) => editingScholarship 
                          ? setEditingScholarship({...editingScholarship, provider: e.target.value})
                          : setNewScholarship({...newScholarship, provider: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter provider name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($) *</label>
                        <input
                          type="number"
                          required
                          value={editingScholarship ? editingScholarship.amount : newScholarship.amount}
                          onChange={(e) => editingScholarship 
                            ? setEditingScholarship({...editingScholarship, amount: e.target.value})
                            : setNewScholarship({...newScholarship, amount: e.target.value})
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="5000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline *</label>
                        <input
                          type="date"
                          required
                          value={editingScholarship ? editingScholarship.deadline : newScholarship.deadline}
                          onChange={(e) => editingScholarship 
                            ? setEditingScholarship({...editingScholarship, deadline: e.target.value})
                            : setNewScholarship({...newScholarship, deadline: e.target.value})
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={editingScholarship ? editingScholarship.description : newScholarship.description}
                        onChange={(e) => editingScholarship 
                          ? setEditingScholarship({...editingScholarship, description: e.target.value})
                          : setNewScholarship({...newScholarship, description: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe the scholarship opportunity..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria *</label>
                      <textarea
                        required
                        rows={2}
                        value={editingScholarship ? editingScholarship.eligibility : newScholarship.eligibility}
                        onChange={(e) => editingScholarship 
                          ? setEditingScholarship({...editingScholarship, eligibility: e.target.value})
                          : setNewScholarship({...newScholarship, eligibility: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="List eligibility requirements..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                      <textarea
                        rows={2}
                        value={editingScholarship ? editingScholarship.requirements : newScholarship.requirements}
                        onChange={(e) => editingScholarship 
                          ? setEditingScholarship({...editingScholarship, requirements: e.target.value})
                          : setNewScholarship({...newScholarship, requirements: e.target.value})
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Application requirements..."
                      />
                    </div>

                    <div className="flex space-x-4 pt-4">
                      {editingScholarship ? (
                        <>
                          <button
                            type="submit"
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                          >
                            Update Scholarship
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="submit"
                          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                          Create Scholarship
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Scholarships List */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Existing Scholarships</h3>
                
                {scholarships.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎓</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scholarships Created</h3>
                    <p className="text-gray-500">Create your first scholarship to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {scholarships.map((scholarship) => (
                      <div key={scholarship.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-gray-900 text-lg">{scholarship.title}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(scholarship)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteScholarship(scholarship.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Provider:</span>
                            <span className="font-medium">{scholarship.provider}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-semibold text-green-600">${scholarship.amount?.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Deadline:</span>
                            <span className={`font-medium ${
                              new Date(scholarship.deadline) < new Date() ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {new Date(scholarship.deadline).toLocaleDateString()}
                              {new Date(scholarship.deadline) < new Date() && ' (Expired)'}
                            </span>
                          </div>
                          <div>
                            <span className="block mb-1">Eligibility:</span>
                            <p className="text-gray-700 text-xs bg-gray-50 p-2 rounded">{scholarship.eligibility}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Application Review
                  </h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  {selectedApplication.scholarshipName} • {selectedApplication.studentName}
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Applicant Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Applicant Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedApplication.studentName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-gray-900">{selectedApplication.studentEmail}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                        <p className="text-gray-900">{new Date(selectedApplication.appliedDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scholarship Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Scholarship</label>
                        <p className="text-gray-900">{selectedApplication.scholarshipName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Status</label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                          selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedApplication.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Application Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Statement</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.personalStatement || 'No personal statement provided.'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Records Summary</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedApplication.academicRecords || 'No academic records summary provided.'}
                      </p>
                    </div>
                  </div>

                  {selectedApplication.recommendationLetter && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendation Letter Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-gray-700">{selectedApplication.recommendationLetter}</p>
                      </div>
                    </div>
                  )}

                  {selectedApplication.additionalDocuments && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Documents</h3>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <p className="text-gray-700">{selectedApplication.additionalDocuments}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Actions */}
                {selectedApplication.status === 'pending' && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Actions</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review Notes (Optional)
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add any notes about this application..."
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Approve Application
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                          className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          Reject Application
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Review History */}
                {selectedApplication.reviewed && (
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Review History</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">Reviewed by:</span>
                          <span>{selectedApplication.reviewedBy}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Reviewed on:</span>
                          <span>{new Date(selectedApplication.reviewedDate).toLocaleDateString()}</span>
                        </div>
                        {selectedApplication.notes && (
                          <div>
                            <span className="font-medium">Notes:</span>
                            <p className="text-gray-700 mt-1">{selectedApplication.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Dashboard</h2>
            <p className="text-gray-500">Analytics features coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;