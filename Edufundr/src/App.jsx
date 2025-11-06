// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { ScholarshipProvider } from './context/ScholarshipContext'
import { scholarshipService } from './services/scholarshipService'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize mock data and check authentication
    const initializeApp = async () => {
      try {
        // Initialize scholarship data
        scholarshipService.initializeData()
        
        // Check if user is logged in on app start
        const savedUser = localStorage.getItem('scholartrack_currentUser')
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error initializing app:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleLogin = (user) => {
    const userData = {
      ...user,
      id: Date.now(), // Generate unique ID
      createdAt: new Date().toISOString()
    }
    setCurrentUser(userData)
    localStorage.setItem('scholartrack_currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('scholartrack_currentUser')
  }

  // Navigation component for authenticated users
  const NavigationBar = () => {
    if (!currentUser) return null

    return (
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ScholarTrack</h1>
                <p className="text-sm text-gray-500">
                  {currentUser.role === 'admin' ? 'Admin Dashboard' : 'Student Portal'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Welcome, {currentUser.name}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {currentUser.role} • {currentUser.email}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {currentUser.role === 'student' && (
                  <button
                    onClick={() => window.location.href = '/student/dashboard'}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    🎓 My Dashboard
                  </button>
                )}
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => window.location.href = '/admin/dashboard'}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ⚡ Admin Panel
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">ST</span>
          </div>
          <div className="text-lg text-gray-600 font-medium">Loading ScholarTrack...</div>
          <div className="text-sm text-gray-500 mt-2">Preparing your experience</div>
        </div>
      </div>
    )
  }

  return (
    <ScholarshipProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <NavigationBar />
          
          <Routes>
            {/* Public routes */}
            <Route 
              path="/" 
              element={
                currentUser ? (
                  <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />
                ) : (
                  <LandingPage />
                )
              } 
            />
            
            <Route 
              path="/auth" 
              element={
                !currentUser ? 
                  <Auth onLogin={handleLogin} /> : 
                  <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />
              } 
            />
            
            {/* Protected student routes */}
            <Route 
              path="/student/dashboard" 
              element={
                currentUser && currentUser.role === 'student' ? 
                  <StudentDashboard user={currentUser} onLogout={handleLogout} /> : 
                  <Navigate to="/auth" />
              } 
            />
            
            <Route 
              path="/student/applications" 
              element={
                currentUser && currentUser.role === 'student' ? 
                  <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">My Applications</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <p className="text-gray-600">Applications feature coming soon...</p>
                    </div>
                  </div> : 
                  <Navigate to="/auth" />
              } 
            />
            
            {/* Protected admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                currentUser && currentUser.role === 'admin' ? 
                  <AdminDashboard user={currentUser} onLogout={handleLogout} /> : 
                  <Navigate to="/auth" />
              } 
            />
            
            <Route 
              path="/admin/scholarships" 
              element={
                currentUser && currentUser.role === 'admin' ? 
                  <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Manage Scholarships</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <p className="text-gray-600">Scholarship management feature coming soon...</p>
                    </div>
                  </div> : 
                  <Navigate to="/auth" />
              } 
            />
            
            <Route 
              path="/admin/applications" 
              element={
                currentUser && currentUser.role === 'admin' ? 
                  <div className="p-6">
                    <h1 className="text-3xl font-bold mb-6">Review Applications</h1>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <p className="text-gray-600">Application review feature coming soon...</p>
                    </div>
                  </div> : 
                  <Navigate to="/auth" />
              } 
            />
            
            {/* 404 Page */}
            <Route 
              path="/404" 
              element={
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                  <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Return Home
                    </button>
                  </div>
                </div>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>

          {/* Global Footer for authenticated pages */}
          {currentUser && (
            <footer className="bg-white border-t mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">ST</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">ScholarTrack</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    © 2024 ScholarTrack. Making education accessible.
                  </div>
                </div>
              </div>
            </footer>
          )}
        </div>
      </Router>
    </ScholarshipProvider>
  )
}

export default App