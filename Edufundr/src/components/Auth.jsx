// src/components/Auth.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Mock user database (in real app, this would be an API)
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('scholartrack_users')
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: 1,
        name: 'Admin User',
        email: 'admin@scholartrack.com',
        password: 'admin123',
        role: 'admin',
        studentId: null,
        grade: null,
        major: null,
        gpa: null
      }
    ]
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login logic
        const user = users.find(u => 
          u.email === formData.email && u.password === formData.password
        )
        
        if (user) {
          onLogin(user)
          navigate(user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
        } else {
          alert('Invalid email or password')
        }
      } else {
        // Signup logic
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match')
          return
        }

        if (users.find(u => u.email === formData.email)) {
          alert('Email already exists')
          return
        }

        const newUser = {
          id: users.length + 1,
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          studentId: formData.role === 'student' ? `STU${Date.now()}` : null,
          grade: formData.role === 'student' ? '12th Grade' : null,
          major: formData.role === 'student' ? 'Computer Science' : null,
          gpa: formData.role === 'student' ? 3.8 : null,
          createdAt: new Date().toISOString()
        }

        const updatedUsers = [...users, newUser]
        setUsers(updatedUsers)
        localStorage.setItem('scholartrack_users', JSON.stringify(updatedUsers))
        
        onLogin(newUser)
        navigate(newUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white p-3 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          {isLogin ? 'Sign in to ScholarTrack' : 'Create your account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="student">Student</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder={isLogin ? "Enter your password" : "Create a password"}
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign in' : 'Create account')}
              </button>
            </div>
          </form>

          {/* Demo Accounts Info */}
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Demo Accounts:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Admin:</strong> admin@scholartrack.com / admin123</p>
                <p><strong>Student:</strong> Create a new account or use any email</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}