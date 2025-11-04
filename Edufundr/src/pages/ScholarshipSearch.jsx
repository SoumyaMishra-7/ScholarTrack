import React, { useState, useEffect } from 'react'
import ScholarshipCard from '../components/ScholarshipCard'

export default function ScholarshipSearch() {
  const [scholarships, setScholarships] = useState([])
  const [filters, setFilters] = useState({
    gpa: '',
    major: '',
    amount: ''
  })

  useEffect(() => {
    setScholarships([
      {
        id: 1,
        name: 'Tech Innovation Scholarship',
        provider: 'Google Inc.',
        amount: '$10,000',
        deadline: '2024-02-15',
        requirements: { gpa: 3.5, major: 'STEM' },
        tags: ['Technology', 'STEM'],
        applicants: 45
      },
      {
        id: 2,
        name: 'Academic Excellence Award',
        provider: 'University Foundation',
        amount: '$5,000',
        deadline: '2024-03-01',
        requirements: { gpa: 3.7, major: 'Any' },
        tags: ['Academic', 'Merit-based'],
        applicants: 32
      }
    ])
  }, [])

  const handleApply = (scholarship) => {
    alert(`Application started for: ${scholarship.name}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Scholarship Search</h1>
      <p className="text-gray-600 mb-8">Find scholarships that match your profile</p>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum GPA</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any GPA</option>
              <option value="3.0">3.0+</option>
              <option value="3.5">3.5+</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Major</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Major</option>
              <option value="STEM">STEM</option>
              <option value="Business">Business</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Any Amount</option>
              <option value="1000">$1,000+</option>
              <option value="5000">$5,000+</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
        <p className="text-gray-600">
          Based on your profile, we found {scholarships.length} matching scholarships.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {scholarships.map((scholarship) => (
          <ScholarshipCard
            key={scholarship.id}
            scholarship={scholarship}
            onApply={handleApply}
            userType="student"
          />
        ))}
      </div>
    </div>
  )
}