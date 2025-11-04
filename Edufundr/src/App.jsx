// src/App.jsx
import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Auth from './components/Auth'
import LandingPage from './components/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('scholartrack_currentUser')
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    localStorage.setItem('scholartrack_currentUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('scholartrack_currentUser')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/" 
            element={<LandingPage />} 
          />
          
          <Route 
            path="/auth" 
            element={
              !currentUser ? 
                <Auth onLogin={handleLogin} /> : 
                <Navigate to={currentUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} />
            } 
          />
          
          {/* Protected routes */}
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
  )
}

export default App