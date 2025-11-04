// src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import StudentsManagement from '../components/admin/StudentsManagement'
import ScholarshipsManagement from '../components/admin/ScholarshipsManagement'
import ApplicationsManagement from '../components/admin/ApplicationsManagement'
import ReportsDashboard from '../components/admin/ReportsDashboard'

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [students, setStudents] = useState([])
  const [scholarships, setScholarships] = useState([])
  const [applications, setApplications] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load students
    const savedUsers = JSON.parse(localStorage.getItem('scholartrack_users') || '[]')
    const studentUsers = savedUsers.filter(u => u.role === 'student')
    setStudents(studentUsers)

    // Load scholarships
    const savedScholarships = JSON.parse(localStorage.getItem('scholartrack_scholarships') || '[]')
    setScholarships(savedScholarships)

    // Load all applications
    const allApplications = []
    savedUsers.forEach(u => {
      if (u.role === 'student') {
        const userApps = JSON.parse(localStorage.getItem(`scholartrack_applications_${u.id}`) || '[]')
        allApplications.push(...userApps.map(app => ({ ...app, student: u })))
      }
    })
    setApplications(allApplications)
  }

  const stats = {
    totalStudents: students.length,
    totalScholarships: scholarships.length,
    totalApplications: applications.length,
    pendingReviews: applications.filter(app => app.status === 'submitted').length,
    approvedApplications: applications.filter(app => app.status === 'approved').length,
    totalAwarded: applications
      .filter(app => app.status === 'approved' && app.scholarshipAmount)
      .reduce((sum, app) => sum + app.scholarshipAmount, 0)
  }

  const handleCreateScholarship = (scholarshipData) => {
    const newScholarship = {
      id: Date.now(),
      ...scholarshipData,
      createdAt: new Date().toISOString(),
      status: 'active',
      applicants: 0
    }
    
    const updatedScholarships = [...scholarships, newScholarship]
    setScholarships(updatedScholarships)
    localStorage.setItem('scholartrack_scholarships', JSON.stringify(updatedScholarships))
  }

  const handleDeleteScholarship = (scholarshipId) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      const updatedScholarships = scholarships.filter(s => s.id !== scholarshipId)
      setScholarships(updatedScholarships)
      localStorage.setItem('scholartrack_scholarships', JSON.stringify(updatedScholarships))
    }
  }

  const handleUpdateApplication = (applicationId, status, notes = '') => {
    const application = applications.find(app => app.id === applicationId)
    if (!application) return

    // Update in student's local storage
    const studentApplications = JSON.parse(
      localStorage.getItem(`scholartrack_applications_${application.student.id}`) || '[]'
    )
    
    const updatedStudentApps = studentApplications.map(app =>
      app.id === applicationId ? { ...app, status, decisionNotes: notes } : app
    )
    
    localStorage.setItem(
      `scholartrack_applications_${application.student.id}`,
      JSON.stringify(updatedStudentApps)
    )

    // Update local state
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status, decisionNotes: notes } : app
    ))
  }

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
              <span className="text-sm text-gray-700 bg-green-100 px-3 py-1 rounded-full">
                Administrator
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
            {['dashboard', 'students', 'scholarships', 'applications', 'reports'].map((tab) => (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalStudents}</p>
                <p className="text-sm text-gray-500 mt-2">Registered students</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Scholarships</h3>
                <p className="text-3xl font-bold text-green-600">{stats.totalScholarships}</p>
                <p className="text-sm text-gray-500 mt-2">Active programs</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Reviews</h3>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingReviews}</p>
                <p className="text-sm text-gray-500 mt-2">Applications to review</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Awarded</h3>
                <p className="text-3xl font-bold text-purple-600">${stats.totalAwarded.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-2">Scholarship funds</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => setActiveTab('scholarships')}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-blue-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-700">Create Scholarship</h3>
                  <p className="text-sm text-gray-500 mt-2">Add new scholarship program</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('applications')}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-green-500 hover:bg-green-50 transition-colors"
                >
                  <div className="text-green-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-700">Review Applications</h3>
                  <p className="text-sm text-gray-500 mt-2">Process pending applications</p>
                </button>
                
                <button 
                  onClick={() => setActiveTab('reports')}
                  className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <div className="text-purple-600 mb-2">
                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-700">View Reports</h3>
                  <p className="text-sm text-gray-500 mt-2">Analytics and insights</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {applications.slice(0, 5).map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.student.name}</h3>
                      <p className="text-sm text-gray-500">Applied for {application.scholarshipName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(application.appliedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <StudentsManagement 
            students={students} 
            applications={applications}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsManagement 
            scholarships={scholarships}
            onCreateScholarship={handleCreateScholarship}
            onDeleteScholarship={handleDeleteScholarship}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsManagement 
            applications={applications}
            onUpdateApplication={handleUpdateApplication}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsDashboard 
            students={students}
            scholarships={scholarships}
            applications={applications}
            stats={stats}
          />
        )}
      </div>
    </div>
  )
}