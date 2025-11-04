// src/components/ApplicationTracker.jsx
import React from 'react'

export default function ApplicationTracker({ applications, onStatusUpdate, onWithdraw, onSubmitApplication, showAll = false }) {
  const displayedApplications = showAll ? applications : applications.slice(0, 3)

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {displayedApplications.map((application) => (
        <div key={application.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{application.scholarshipName}</h3>
              <p className="text-sm text-gray-500">
                Applied: {new Date(application.appliedDate).toLocaleDateString()}
              </p>
              {application.scholarshipAmount && (
                <p className="text-sm text-green-600">
                  Amount: ${application.scholarshipAmount.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(application.status)}`}>
                {application.status.replace('_', ' ')}
              </span>
              {application.status === 'in_progress' && (
                <button
                  onClick={() => onSubmitApplication(application.id)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Submit
                </button>
              )}
              <button
                onClick={() => onWithdraw(application.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Withdraw
              </button>
            </div>
          </div>
        </div>
      ))}
      {applications.length === 0 && (
        <p className="text-gray-500 text-center py-4">No applications yet.</p>
      )}
    </div>
  )
}