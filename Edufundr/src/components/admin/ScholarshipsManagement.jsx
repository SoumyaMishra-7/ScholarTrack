// src/components/admin/ScholarshipsManagement.jsx
import React, { useState } from 'react'

export default function ScholarshipsManagement({ scholarships, onCreateScholarship, onDeleteScholarship }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newScholarship, setNewScholarship] = useState({
    name: '',
    provider: '',
    amount: '',
    deadline: '',
    requirements: { gpa: '', major: '' },
    description: '',
    eligibility: '',
    documentsRequired: ['']
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreateScholarship({
      ...newScholarship,
      amount: parseInt(newScholarship.amount),
      tags: [],
      applicants: 0,
      matchScore: 0
    })
    setShowCreateForm(false)
    setNewScholarship({
      name: '',
      provider: '',
      amount: '',
      deadline: '',
      requirements: { gpa: '', major: '' },
      description: '',
      eligibility: '',
      documentsRequired: ['']
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Scholarship Management</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Scholarship
        </button>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Create New Scholarship</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Scholarship Name</label>
                  <input
                    type="text"
                    required
                    value={newScholarship.name}
                    onChange={(e) => setNewScholarship({...newScholarship, name: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Provider</label>
                  <input
                    type="text"
                    required
                    value={newScholarship.provider}
                    onChange={(e) => setNewScholarship({...newScholarship, provider: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <input
                    type="number"
                    required
                    value={newScholarship.amount}
                    onChange={(e) => setNewScholarship({...newScholarship, amount: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Deadline</label>
                  <input
                    type="date"
                    required
                    value={newScholarship.deadline}
                    onChange={(e) => setNewScholarship({...newScholarship, deadline: e.target.value})}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Minimum GPA</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newScholarship.requirements.gpa}
                    onChange={(e) => setNewScholarship({
                      ...newScholarship, 
                      requirements: {...newScholarship.requirements, gpa: e.target.value}
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Major</label>
                  <input
                    type="text"
                    value={newScholarship.requirements.major}
                    onChange={(e) => setNewScholarship({
                      ...newScholarship, 
                      requirements: {...newScholarship.requirements, major: e.target.value}
                    })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  value={newScholarship.description}
                  onChange={(e) => setNewScholarship({...newScholarship, description: e.target.value})}
                  rows="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Scholarship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {scholarships.map((scholarship) => (
          <div key={scholarship.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{scholarship.name}</h3>
                <p className="text-gray-600">{scholarship.provider}</p>
                <p className="text-gray-500">Amount: ${scholarship.amount.toLocaleString()}</p>
                <p className="text-gray-500">Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                <button 
                  onClick={() => onDeleteScholarship(scholarship.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}