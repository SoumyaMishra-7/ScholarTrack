import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">ScholarTrack</span>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Dashboard</Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium">Search</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">Admin</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={onLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}