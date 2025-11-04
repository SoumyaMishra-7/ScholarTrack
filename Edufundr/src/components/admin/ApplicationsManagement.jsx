// src/components/admin/ApplicationsManagement.jsx
import React, { useState, useRef, useEffect } from 'react'

export default function ApplicationsManagement({ applications, onUpdateApplication }) {
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [filter, setFilter] = useState('all')
  const [quickAction, setQuickAction] = useState(null)
  const textareaRef = useRef(null)

  const pendingApplications = applications.filter(app => app.status === 'submitted')
  const approvedApplications = applications.filter(app => app.status === 'approved')
  const rejectedApplications = applications.filter(app => app.status === 'rejected')

  const filteredApplications = {
    all: applications,
    pending: pendingApplications,
    approved: approvedApplications,
    rejected: rejectedApplications
  }[filter]

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [reviewNotes])

  const handleApprove = (application) => {
    if (!reviewNotes.trim() && !quickAction) {
      alert('Please provide approval remarks before approving.')
      return
    }
    
    const finalNotes = quickAction ? `${quickAction.label}\n\n${reviewNotes}`.trim() : reviewNotes
    onUpdateApplication(application.id, 'approved', finalNotes)
    setSelectedApplication(null)
    setReviewNotes('')
    setQuickAction(null)
  }

  const handleReject = (application) => {
    if (!reviewNotes.trim() && !quickAction) {
      alert('Please provide rejection remarks before rejecting.')
      return
    }
    
    const finalNotes = quickAction ? `${quickAction.label}\n\n${reviewNotes}`.trim() : reviewNotes
    onUpdateApplication(application.id, 'rejected', finalNotes)
    setSelectedApplication(null)
    setReviewNotes('')
    setQuickAction(null)
  }

  const quickActions = {
    approve: [
      {
        id: 1,
        label: "Application meets all criteria and demonstrates exceptional qualifications.",
        type: "approve"
      },
      {
        id: 2,
        label: "Strong academic record and compelling personal statement.",
        type: "approve"
      },
      {
        id: 3,
        label: "Excellent match with scholarship requirements and clear career goals.",
        type: "approve"
      }
    ],
    reject: [
      {
        id: 1,
        label: "Application does not meet the minimum eligibility requirements.",
        type: "reject"
      },
      {
        id: 2,
        label: "Incomplete application or missing required documents.",
        type: "reject"
      },
      {
        id: 3,
        label: "Strong candidate but limited scholarship funds available.",
        type: "reject"
      }
    ]
  }

  const handleQuickActionSelect = (action) => {
    setQuickAction(action)
    setReviewNotes(prev => prev ? `${prev}\n\n` : '' + action.label)
  }

  const ApplicationDetailModal = ({ application, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-white sticky top-0 z-10">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Application Review</h3>
            <p className="text-gray-600 mt-1">
              {application.scholarshipName} • {application.student.name}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Application Details - 2/3 width */}
              <div className="xl:col-span-2 space-y-6">
                {/* Student Information */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong className="text-gray-700">Name:</strong> {application.student.name}</p>
                      <p><strong className="text-gray-700">Email:</strong> {application.student.email}</p>
                      <p><strong className="text-gray-700">Student ID:</strong> {application.student.studentId}</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-700">Major:</strong> {application.student.major}</p>
                      <p><strong className="text-gray-700">GPA:</strong> {application.student.gpa}</p>
                      <p><strong className="text-gray-700">Grade Level:</strong> {application.student.grade}</p>
                    </div>
                  </div>
                </div>

                {/* Scholarship Information */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Scholarship Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><strong className="text-gray-700">Scholarship:</strong> {application.scholarshipName}</p>
                      <p><strong className="text-gray-700">Amount:</strong> ${application.scholarshipAmount?.toLocaleString()}</p>
                      <p><strong className="text-gray-700">Provider:</strong> {application.provider}</p>
                    </div>
                    <div>
                      <p><strong className="text-gray-700">Applied Date:</strong> {new Date(application.appliedDate).toLocaleDateString()}</p>
                      <p><strong className="text-gray-700">Deadline:</strong> {new Date(application.deadline).toLocaleDateString()}</p>
                      <p><strong className="text-gray-700">Status:</strong> 
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                          application.status === 'approved' ? 'bg-green-100 text-green-800' :
                          application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {application.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academic Details */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Academic Information</h4>
                  {application.academicDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p><strong className="text-gray-700">Current GPA:</strong> {application.academicDetails.gpa}</p>
                        <p><strong className="text-gray-700">Major:</strong> {application.academicDetails.major}</p>
                      </div>
                      <div>
                        <p><strong className="text-gray-700">Year Level:</strong> {application.academicDetails.yearLevel}</p>
                        <p><strong className="text-gray-700">University:</strong> {application.academicDetails.university}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No academic details provided</p>
                  )}
                </div>

                {/* Essay Questions */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Essay Responses</h4>
                  {application.essayQuestions && application.essayQuestions.length > 0 ? (
                    <div className="space-y-6">
                      {application.essayQuestions.map((essay, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 py-3">
                          <p className="font-medium text-gray-700 mb-3 text-sm">{essay.question}</p>
                          <p className="text-gray-600 bg-white p-4 rounded-lg border text-sm leading-relaxed">
                            {essay.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No essay responses provided</p>
                  )}
                </div>

                {/* Documents */}
                <div className="border rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Supporting Documents</h4>
                  <div className="flex flex-wrap gap-3">
                    {application.documents && application.documents.map((doc, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center space-x-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{doc.type}</p>
                          <p className="text-gray-500 text-xs">{doc.name}</p>
                        </div>
                      </div>
                    ))}
                    {(!application.documents || application.documents.length === 0) && (
                      <p className="text-gray-500 text-center py-4 w-full">No documents uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Review Section - 1/3 width */}
              <div className="xl:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-4">
                  <h4 className="font-semibold text-gray-900 mb-4 text-lg">Review & Decision</h4>
                  
                  {/* Quick Actions */}
                  <div className="mb-6">
                    <h5 className="font-medium text-gray-700 mb-3">Quick Actions</h5>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium text-green-700 mb-2">Approve Templates:</p>
                        <div className="space-y-2">
                          {quickActions.approve.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleQuickActionSelect(action)}
                              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                                quickAction?.id === action.id 
                                  ? 'border-green-500 bg-green-50 text-green-700' 
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700 mb-2">Reject Templates:</p>
                        <div className="space-y-2">
                          {quickActions.reject.map((action) => (
                            <button
                              key={action.id}
                              onClick={() => handleQuickActionSelect(action)}
                              className={`w-full text-left p-3 rounded-lg border text-sm transition-colors ${
                                quickAction?.id === action.id 
                                  ? 'border-red-500 bg-red-50 text-red-700' 
                                  : 'border-gray-200 bg-white text-gray-600 hover:border-red-300'
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes Textarea */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Review Comments & Remarks *
                    </label>
                    <textarea
                      ref={textareaRef}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Enter your detailed review comments, feedback, or decision remarks here. You can use the quick action templates above or write your own custom remarks."
                      className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
                      style={{ minHeight: '200px' }}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {reviewNotes.length} characters
                      </span>
                      {!reviewNotes.trim() && !quickAction && (
                        <span className="text-sm text-red-500 font-medium">
                          Remarks required for decision
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Decision Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleReject(application)}
                      disabled={!reviewNotes.trim() && !quickAction}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        !reviewNotes.trim() && !quickAction
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Reject Application
                    </button>
                    <button
                      onClick={() => handleApprove(application)}
                      disabled={!reviewNotes.trim() && !quickAction}
                      className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                        !reviewNotes.trim() && !quickAction
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      Approve Application
                    </button>
                  </div>

                  {/* Quick Decision Buttons */}
                  {application.status === 'submitted' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-3 text-center">Quick Decisions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setQuickAction(quickActions.reject[0])
                            setReviewNotes(quickActions.reject[0].label)
                            setTimeout(() => handleReject(application), 100)
                          }}
                          className="py-2 px-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                        >
                          Quick Reject
                        </button>
                        <button
                          onClick={() => {
                            setQuickAction(quickActions.approve[0])
                            setReviewNotes(quickActions.approve[0].label)
                            setTimeout(() => handleApprove(application), 100)
                          }}
                          className="py-2 px-3 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
                        >
                          Quick Approve
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Applications Management</h2>
        <div className="flex space-x-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="all">All Applications ({applications.length})</option>
            <option value="pending">Pending Review ({pendingApplications.length})</option>
            <option value="approved">Approved ({approvedApplications.length})</option>
            <option value="rejected">Rejected ({rejectedApplications.length})</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-800">Pending Review</h3>
          <p className="text-2xl font-bold text-yellow-600">{pendingApplications.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="font-semibold text-green-800">Approved</h3>
          <p className="text-2xl font-bold text-green-600">{approvedApplications.length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h3 className="font-semibold text-red-800">Rejected</h3>
          <p className="text-2xl font-bold text-red-600">{rejectedApplications.length}</p>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scholarship
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{application.student.name}</div>
                      <div className="text-sm text-gray-500">{application.student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{application.scholarshipName}</div>
                    <div className="text-sm text-gray-500">
                      ${application.scholarshipAmount?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedApplication(application)
                        setReviewNotes(application.decisionNotes || '')
                        setQuickAction(null)
                      }}
                      className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                    >
                      Review
                    </button>
                    {application.status === 'submitted' && (
                      <div className="inline-flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(application)
                            setQuickAction(quickActions.approve[0])
                            setReviewNotes(quickActions.approve[0].label)
                          }}
                          className="text-green-600 hover:text-green-900 text-xs font-medium"
                        >
                          Quick Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedApplication(application)
                            setQuickAction(quickActions.reject[0])
                            setReviewNotes(quickActions.reject[0].label)
                          }}
                          className="text-red-600 hover:text-red-900 text-xs font-medium"
                        >
                          Quick Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No applications found.</p>
            <p className="text-gray-400 mt-2">Try selecting a different filter</p>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => {
            setSelectedApplication(null)
            setReviewNotes('')
            setQuickAction(null)
          }}
        />
      )}
    </div>
  )
}