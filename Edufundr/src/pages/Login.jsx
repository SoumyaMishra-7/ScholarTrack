import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Determine user role based on email
    const isAdmin = formData.email.includes('admin')
    
    const userData = {
      id: isAdmin ? 1 : 2,
      name: isAdmin ? 'Admin User' : 'Student User',
      email: formData.email,
      role: isAdmin ? 'admin' : 'student',
      // Sample student data
      ...(isAdmin ? {} : {
        studentId: 'STU2024001',
        grade: '12th Grade',
        major: 'Computer Science'
      })
    }
    
    onLogin(userData)
    
    // Redirect based on role
    if (isAdmin) {
      navigate('/admin/dashboard')
    } else {
      navigate('/student/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-blue-600 text-white p-3 rounded-lg">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Sign in to ScholarTrack
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="student@example.com or admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter any password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Test Credentials:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Student:</strong> student@example.com / any password</p>
                <p><strong>Admin:</strong> admin@example.com / any password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}