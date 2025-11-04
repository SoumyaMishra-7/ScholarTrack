// src/components/ApplicationBuilder.jsx
import React, { useState } from 'react'

export default function ApplicationBuilder({ 
  scholarship, 
  application, 
  onSave, 
  onSubmit, 
  onCancel 
}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    academicDetails: application?.academicDetails || {
      gpa: '',
      major: '',
      yearLevel: '',
      university: '',
      expectedGraduation: ''
    },
    essayQuestions: application?.essayQuestions || [],
    documents: application?.documents || [],
    personalStatement: application?.personalStatement || ''
  })
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  const scholarshipQuestions = scholarship?.essayQuestions || [
    {
      id: 1,
      question: "What are your academic and career goals, and how will this scholarship help you achieve them?",
      required: true,
      maxLength: 1000
    },
    {
      id: 2,
      question: "Describe a challenge you've overcome and what you learned from the experience.",
      required: true,
      maxLength: 800
    },
    {
      id: 3,
      question: "How have you contributed to your community or demonstrated leadership?",
      required: false,
      maxLength: 600
    }
  ]

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const handleEssayChange = (questionId, answer) => {
    setFormData(prev => {
      const existingEssay = prev.essayQuestions.find(e => e.id === questionId)
      if (existingEssay) {
        return {
          ...prev,
          essayQuestions: prev.essayQuestions.map(e => 
            e.id === questionId ? { ...e, answer } : e
          )
        }
      } else {
        const question = scholarshipQuestions.find(q => q.id === questionId)
        return {
          ...prev,
          essayQuestions: [
            ...prev.essayQuestions,
            {
              id: questionId,
              question: question?.question,
              answer,
              required: question?.required
            }
          ]
        }
      }
    })
  }

  const handleFileUpload = (fileType, file) => {
    if (!file) return
    
    // Simulate file upload
    const newDocument = {
      id: Date.now(),
      type: fileType,
      name: file.name,
      uploadedAt: new Date().toISOString(),
      status: 'uploaded',
      size: file.size
    }
    
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, newDocument]
    }))
  }

  const removeDocument = (documentId) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== documentId)
    }))
  }

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return formData.academicDetails.gpa && 
               formData.academicDetails.major && 
               formData.academicDetails.yearLevel
      case 2:
        const requiredEssays = scholarshipQuestions.filter(q => q.required)
        return requiredEssays.every(reqEssay => {
          const essay = formData.essayQuestions.find(e => e.id === reqEssay.id)
          return essay && essay.answer && essay.answer.trim().length > 0
        })
      case 3:
        return formData.documents.length >= 1 // At least one document
      case 4:
        return isStepValid(1) && isStepValid(2) && isStepValid(3)
      default:
        return true
    }
  }

  const handleSaveDraft = () => {
    const updatedApplication = {
      ...application,
      ...formData,
      status: 'in_progress',
      lastSaved: new Date().toISOString(),
      progress: calculateProgress()
    }
    
    onSave(updatedApplication)
    setShowSaveConfirm(false)
  }

  const handleSubmitApplication = () => {
    const updatedApplication = {
      ...application,
      ...formData,
      status: 'submitted',
      submittedDate: new Date().toISOString(),
      progress: 100
    }
    
    onSubmit(updatedApplication)
    setShowSubmitConfirm(false)
  }

  const calculateProgress = () => {
    let progress = 0
    if (isStepValid(1)) progress += 25
    if (isStepValid(2)) progress += 25
    if (isStepValid(3)) progress += 25
    if (isStepValid(4)) progress += 25
    return progress
  }

  const steps = [
    { number: 1, title: 'Academic Info', completed: isStepValid(1) },
    { number: 2, title: 'Essay Questions', completed: isStepValid(2) },
    { number: 3, title: 'Documents', completed: isStepValid(3) },
    { number: 4, title: 'Review & Submit', completed: isStepValid(4) }
  ]

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Confirmation Modal Component
  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText }) => {
    if (!isOpen) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{scholarship.name} - Application</h2>
            <p className="text-gray-600 mt-1">Provider: {scholarship.provider}</p>
            <p className="text-gray-600">Amount: ${scholarship.amount.toLocaleString()}</p>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-500 mt-2 text-right">
          {calculateProgress()}% Complete
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                currentStep === step.number 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : step.completed 
                  ? 'border-green-500 bg-green-500 text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}>
                {step.completed ? '✓' : step.number}
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${
                currentStep === step.number ? 'text-blue-600' : 
                step.completed ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="mb-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current GPA *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4.0"
                  value={formData.academicDetails.gpa}
                  onChange={(e) => handleInputChange('academicDetails', 'gpa', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter your GPA (e.g., 3.75)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Major/Field of Study *
                </label>
                <input
                  type="text"
                  value={formData.academicDetails.major}
                  onChange={(e) => handleInputChange('academicDetails', 'major', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Your major"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Year Level *
                </label>
                <select
                  value={formData.academicDetails.yearLevel}
                  onChange={(e) => handleInputChange('academicDetails', 'yearLevel', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-300"
                >
                  <option value="">Select year level</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  University/College
                </label>
                <input
                  type="text"
                  value={formData.academicDetails.university}
                  onChange={(e) => handleInputChange('academicDetails', 'university', e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                  placeholder="Your institution"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Essay Questions</h3>
            {scholarshipQuestions.map((q) => {
              const essayAnswer = formData.essayQuestions.find(e => e.id === q.id)?.answer || ''
              return (
                <div key={q.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all duration-300">
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    {q.question} {q.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <textarea
                    value={essayAnswer}
                    onChange={(e) => handleEssayChange(q.id, e.target.value)}
                    rows={6}
                    maxLength={q.maxLength}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-all duration-300"
                    placeholder={`Type your response here (maximum ${q.maxLength} characters)...`}
                  />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">
                      {essayAnswer.length} / {q.maxLength} characters
                    </span>
                    {q.required && !essayAnswer.trim() && (
                      <span className="text-sm text-red-500 font-medium">This question is required</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Supporting Documents</h3>
            <p className="text-gray-600">Please upload the required documents for your application.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CV/Resume Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-semibold text-gray-900 mb-2">Upload CV/Resume</h4>
                <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX (Max 5MB)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('CV/Resume', e.target.files[0])}
                  className="hidden"
                  id="cv-upload"
                />
                <label
                  htmlFor="cv-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-all duration-300 font-medium"
                >
                  Choose File
                </label>
              </div>

              {/* Transcript Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-all duration-300">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="font-semibold text-gray-900 mb-2">Upload Transcript</h4>
                <p className="text-sm text-gray-500 mb-4">PDF only (Max 5MB)</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFileUpload('Transcript', e.target.files[0])}
                  className="hidden"
                  id="transcript-upload"
                />
                <label
                  htmlFor="transcript-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-all duration-300 font-medium"
                >
                  Choose File
                </label>
              </div>
            </div>

            {/* Uploaded Documents */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h4>
              {formData.documents.length > 0 ? (
                <div className="space-y-3">
                  {formData.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.type} • {(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-xl">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-gray-500">No documents uploaded yet</p>
                  <p className="text-gray-400 text-sm mt-1">Upload at least one document to continue</p>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Review Your Application</h3>
            
            {/* Application Summary */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Application Summary</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold text-gray-700 mb-3">Academic Information</h5>
                  <div className="space-y-2 text-sm bg-white p-4 rounded-lg">
                    <p><strong>GPA:</strong> {formData.academicDetails.gpa || 'Not provided'}</p>
                    <p><strong>Major:</strong> {formData.academicDetails.major || 'Not provided'}</p>
                    <p><strong>Year Level:</strong> {formData.academicDetails.yearLevel || 'Not provided'}</p>
                    <p><strong>University:</strong> {formData.academicDetails.university || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-700 mb-3">Documents</h5>
                  <div className="space-y-2 text-sm bg-white p-4 rounded-lg">
                    {formData.documents.length > 0 ? (
                      formData.documents.map((doc, index) => (
                        <p key={index}>• {doc.type} - {doc.name}</p>
                      ))
                    ) : (
                      <p className="text-red-500">No documents uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Essay Previews */}
              <div className="mt-6">
                <h5 className="font-semibold text-gray-700 mb-3">Essay Responses</h5>
                <div className="space-y-4">
                  {formData.essayQuestions.map((essay, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 bg-white p-4 rounded-lg">
                      <p className="font-medium text-gray-900 text-sm mb-2">{essay.question}</p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {essay.answer || <span className="text-red-500">Not answered</span>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Final Check Alert */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-yellow-600 mt-0.5 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-bold text-yellow-800 text-lg mb-2">Important: Before Submitting</p>
                  <ul className="text-yellow-700 text-sm space-y-1 list-disc list-inside">
                    <li>Verify all information is accurate and complete</li>
                    <li>Check that all required documents are uploaded</li>
                    <li>Review your essay responses for any errors or typos</li>
                    <li><strong className="text-red-600">Once submitted, you cannot edit your application</strong></li>
                    <li>Ensure you meet all eligibility requirements</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Completion Checklist */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h5 className="font-semibold text-green-800 mb-3">Application Checklist</h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    isStepValid(1) ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                    {isStepValid(1) ? '✓' : ''}
                  </div>
                  <span className={isStepValid(1) ? 'text-green-700' : 'text-gray-500'}>
                    Academic Information Complete
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    isStepValid(2) ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                    {isStepValid(2) ? '✓' : ''}
                  </div>
                  <span className={isStepValid(2) ? 'text-green-700' : 'text-gray-500'}>
                    Essay Questions Complete
                  </span>
                </div>
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    isStepValid(3) ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}>
                    {isStepValid(3) ? '✓' : ''}
                  </div>
                  <span className={isStepValid(3) ? 'text-green-700' : 'text-gray-500'}>
                    Documents Uploaded
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <div>
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              ← Previous
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setShowSaveConfirm(true)}
            className="px-8 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 font-medium"
          >
            Save Draft
          </button>

          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!isStepValid(currentStep)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                isStepValid(currentStep)
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={!isStepValid(4)}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                isStepValid(4)
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit Application
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        onConfirm={handleSaveDraft}
        title="Save as Draft?"
        message="Your application progress will be saved. You can come back later to complete and submit it."
        confirmText="Save Draft"
        cancelText="Continue Editing"
      />

      <ConfirmationModal
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmitApplication}
        title="Submit Application?"
        message="Are you sure you want to submit your application? Once submitted, you cannot make any changes. Please review all information carefully before submitting."
        confirmText="Yes, Submit"
        cancelText="Review Again"
      />
    </div>
  )
}