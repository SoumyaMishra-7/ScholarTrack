// src/components/ScholarshipCard.jsx
import React from 'react'

export default function ScholarshipCard({ scholarship, onApply, userType, showFullDetails = false }) {
  const daysLeft = Math.ceil((new Date(scholarship.deadline) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{scholarship.name}</h3>
          <p className="text-gray-600">{scholarship.provider}</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-green-600">${scholarship.amount.toLocaleString()}</p>
          <p className={`text-sm ${daysLeft <= 7 ? 'text-red-600' : 'text-gray-500'}`}>
            {daysLeft} days left
          </p>
        </div>
      </div>

      {showFullDetails && (
        <div className="mb-3">
          <p className="text-gray-700 text-sm">{scholarship.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {scholarship.tags.map((tag, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Match: {scholarship.matchScore}% • {scholarship.applicants} applicants
        </div>
        {userType === 'student' && (
          <button
            onClick={() => onApply(scholarship)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  )
}