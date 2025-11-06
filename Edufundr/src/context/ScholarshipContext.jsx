// src/context/ScholarshipContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { scholarshipService } from '../services/scholarshipService';

const ScholarshipContext = createContext();

export const useScholarship = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error('useScholarship must be used within a ScholarshipProvider');
  }
  return context;
};

export const ScholarshipProvider = ({ children }) => {
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize data on app start
  useEffect(() => {
    scholarshipService.initializeData();
    loadScholarships();
    loadApplications();
  }, []);

  const loadScholarships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scholarshipService.getAllScholarships();
      setScholarships(data);
    } catch (err) {
      setError('Failed to load scholarships');
      console.error('Error loading scholarships:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await scholarshipService.getAllApplications();
      setApplications(data);
    } catch (err) {
      setError('Failed to load applications');
      console.error('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyForScholarship = async (applicationData) => {
    setLoading(true);
    setError(null);
    try {
      const newApplication = await scholarshipService.applyForScholarship(applicationData);
      await loadApplications(); // Reload applications to include the new one
      await loadScholarships(); // Reload scholarships to update applicant count
      return newApplication;
    } catch (err) {
      setError('Failed to apply for scholarship');
      console.error('Error applying for scholarship:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createScholarship = async (scholarshipData) => {
    setLoading(true);
    setError(null);
    try {
      const newScholarship = await scholarshipService.createScholarship(scholarshipData);
      await loadScholarships(); // Reload scholarships to include the new one
      return newScholarship;
    } catch (err) {
      setError('Failed to create scholarship');
      console.error('Error creating scholarship:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, adminName, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      const updatedApplication = await scholarshipService.updateApplicationStatus(
        applicationId, 
        status, 
        adminName, 
        notes
      );
      await loadApplications(); // Reload applications to reflect status changes
      return updatedApplication;
    } catch (err) {
      setError('Failed to update application status');
      console.error('Error updating application status:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getScholarshipById = async (scholarshipId) => {
    setLoading(true);
    setError(null);
    try {
      const scholarship = await scholarshipService.getScholarshipById(scholarshipId);
      return scholarship;
    } catch (err) {
      setError('Failed to load scholarship details');
      console.error('Error loading scholarship:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getApplicationsByScholarship = async (scholarshipId) => {
    setLoading(true);
    setError(null);
    try {
      const scholarshipApplications = await scholarshipService.getApplicationsByScholarship(scholarshipId);
      return scholarshipApplications;
    } catch (err) {
      setError('Failed to load scholarship applications');
      console.error('Error loading scholarship applications:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentApplications = (studentEmail) => {
    // Filter applications for a specific student
    return applications.filter(app => app.studentEmail === studentEmail);
  };

  const getPendingApplications = () => {
    return applications.filter(app => app.status === 'pending');
  };

  const getApprovedApplications = () => {
    return applications.filter(app => app.status === 'approved');
  };

  const getRejectedApplications = () => {
    return applications.filter(app => app.status === 'rejected');
  };

  const getActiveScholarships = () => {
    return scholarships.filter(scholarship => scholarship.status === 'active');
  };

  const getScholarshipStats = () => {
    const totalScholarships = scholarships.length;
    const activeScholarships = getActiveScholarships().length;
    const totalApplications = applications.length;
    const pendingApplications = getPendingApplications().length;
    const approvedApplications = getApprovedApplications().length;
    const rejectedApplications = getRejectedApplications().length;

    return {
      totalScholarships,
      activeScholarships,
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications
    };
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    // State
    scholarships,
    applications,
    loading,
    error,

    // Data loading functions
    loadScholarships,
    loadApplications,

    // Student functions
    applyForScholarship,
    getStudentApplications,

    // Admin functions
    createScholarship,
    updateApplicationStatus,
    getApplicationsByScholarship,
    getScholarshipById,

    // Utility functions
    getPendingApplications,
    getApprovedApplications,
    getRejectedApplications,
    getActiveScholarships,
    getScholarshipStats,
    clearError
  };

  return (
    <ScholarshipContext.Provider value={value}>
      {children}
    </ScholarshipContext.Provider>
  );
};