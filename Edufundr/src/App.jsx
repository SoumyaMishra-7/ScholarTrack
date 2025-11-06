// src/App.jsx
import React, { useState, useEffect } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom' // Changed to HashRouter
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { ScholarshipProvider } from './context/ScholarshipContext'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('scholartrack_currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (user) => {
    const userData = {
      ...user,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    setCurrentUser(userData)
    localStorage.setItem('scholartrack_currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('scholartrack_currentUser')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">ST</span>
          </div>
          <div className="text-lg text-gray-600">Loading ScholarTrack...</div>
        </div>
      </div>
    )
  }

  return (
    <ScholarshipProvider>
      <Router> {/* Now using HashRouter */}
        <div className="App min-h-screen bg-gray-50">
          <Routes>
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
            
            <Route 
              path="/student/dashboard" 
              element={
                currentUser && currentUser.role === 'student' ? 
                  <StudentDashboard user={currentUser} onLogout={handleLogout} /> : 
                  <Navigate to="/auth" />
              } 
            />
            
            <Route 
              path="/admin/dashboard" 
              element={
                currentUser && currentUser.role === 'admin' ? 
                  <AdminDashboard user={currentUser} onLogout={handleLogout} /> : 
                  <Navigate to="/auth" />
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </ScholarshipProvider>
  )
}

export default App