// src/services/scholarshipService.js
export const mockScholarships = [
  {
    id: 1,
    title: "Tech Innovation Scholarship",
    provider: "Google Inc.",
    amount: 10000,
    deadline: "2024-12-31",
    description: "For students pursuing innovation in technology and computer science fields.",
    eligibility: ["Computer Science", "IT", "Engineering"],
    requirements: ["3.5+ GPA", "Project Portfolio", "Recommendation Letter"],
    category: "Technology",
    status: "active",
    applicants: 45,
    maxApplicants: 100,
    type: "Merit-based",
    createdAt: "2024-01-01"
  },
  {
    id: 2,
    title: "STEM Leadership Award",
    provider: "Microsoft Corporation",
    amount: 7500,
    deadline: "2024-11-30",
    description: "Supporting future leaders in STEM fields with outstanding academic records.",
    eligibility: ["STEM Majors", "3.8+ GPA"],
    requirements: ["Academic Transcript", "Leadership Essay", "Resume"],
    category: "STEM",
    status: "active",
    applicants: 32,
    maxApplicants: 50,
    type: "Merit-based",
    createdAt: "2024-01-01"
  },
  {
    id: 3,
    title: "Women in Engineering",
    provider: "Women Techmakers",
    amount: 5000,
    deadline: "2024-10-15",
    description: "Encouraging female students to pursue engineering careers.",
    eligibility: ["Female Students", "Engineering Majors"],
    requirements: ["Personal Statement", "Academic Records", "Project Examples"],
    category: "Engineering",
    status: "active",
    applicants: 28,
    maxApplicants: 40,
    type: "Need-based",
    createdAt: "2024-01-01"
  },
  {
    id: 4,
    title: "First-Generation Student Grant",
    provider: "Education Foundation",
    amount: 3000,
    deadline: "2024-09-20",
    description: "Supporting first-generation college students in their educational journey.",
    eligibility: ["First-generation Students", "All Majors"],
    requirements: ["Family Background Essay", "Academic Records", "Financial Need"],
    category: "General",
    status: "active",
    applicants: 15,
    maxApplicants: 30,
    type: "Need-based",
    createdAt: "2024-01-01"
  }
];

export const mockApplications = [
  {
    id: 1,
    scholarshipId: 1,
    scholarshipName: "Tech Innovation Scholarship",
    studentId: 12345,
    studentName: "Riya Sharma",
    studentEmail: "riya@example.com",
    status: "pending",
    appliedDate: "2024-01-15",
    personalStatement: "I have been passionate about technology since childhood and have developed several mobile applications that solve real-world problems. I believe this scholarship will help me further my education and contribute to the tech industry.",
    academicRecords: "Maintained a 3.8 GPA throughout my computer science program. Received Dean's List honors for three consecutive semesters.",
    recommendationLetter: "Professor John Smith, Computer Science Department, University of Technology",
    additionalDocuments: "Portfolio of mobile applications, GitHub repository link",
    reviewed: false,
    reviewedBy: null,
    reviewedDate: null,
    notes: ""
  },
  {
    id: 2,
    scholarshipId: 2,
    scholarshipName: "STEM Leadership Award",
    studentId: 12346,
    studentName: "Aarav Patel",
    studentEmail: "aarav@example.com",
    status: "approved",
    appliedDate: "2024-01-10",
    personalStatement: "As the president of our university's STEM club, I have organized multiple workshops and mentorship programs to encourage younger students to pursue STEM careers.",
    academicRecords: "3.9 GPA in Mechanical Engineering, recipient of the Excellence in Engineering award",
    recommendationLetter: "Dr. Sarah Johnson, Head of Mechanical Engineering Department",
    additionalDocuments: "Leadership certificates, workshop photos",
    reviewed: true,
    reviewedBy: "Admin User",
    reviewedDate: "2024-01-20",
    notes: "Strong leadership experience and excellent academic record. Recommended for approval."
  }
];

const STORAGE_KEYS = {
  SCHOLARSHIPS: 'scholartrack_scholarships',
  APPLICATIONS: 'scholartrack_applications',
  USERS: 'scholartrack_users'
};

export const scholarshipService = {
  initializeData() {
    // Only initialize if no data exists
    if (!localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS)) {
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(mockScholarships));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(mockApplications));
    }
  },

  // Scholarship methods
  getAllScholarships() {
    try {
      const scholarships = localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS);
      return Promise.resolve(JSON.parse(scholarships || '[]'));
    } catch (error) {
      console.error('Error getting scholarships:', error);
      return Promise.resolve([]);
    }
  },

  getScholarshipById(id) {
    try {
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || '[]');
      const scholarship = scholarships.find(s => s.id === parseInt(id));
      return Promise.resolve(scholarship || null);
    } catch (error) {
      console.error('Error getting scholarship by ID:', error);
      return Promise.resolve(null);
    }
  },

  createScholarship(scholarshipData) {
    try {
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || '[]');
      const newScholarship = {
        ...scholarshipData,
        id: Date.now(),
        applicants: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      scholarships.push(newScholarship);
      localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
      return Promise.resolve(newScholarship);
    } catch (error) {
      console.error('Error creating scholarship:', error);
      return Promise.reject('Failed to create scholarship');
    }
  },

  // Application methods
  applyForScholarship(applicationData) {
    try {
      const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      
      const newApplication = {
        id: Date.now(),
        scholarshipId: applicationData.scholarshipId,
        scholarshipName: applicationData.scholarshipName,
        studentId: applicationData.studentId,
        studentName: applicationData.studentName,
        studentEmail: applicationData.studentEmail,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
        personalStatement: applicationData.personalStatement || '',
        academicRecords: applicationData.academicRecords || '',
        recommendationLetter: applicationData.recommendationLetter || '',
        additionalDocuments: applicationData.additionalDocuments || '',
        reviewed: false,
        reviewedBy: null,
        reviewedDate: null,
        notes: ''
      };

      applications.push(newApplication);
      
      // Update applicant count in scholarship
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || '[]');
      const scholarshipIndex = scholarships.findIndex(s => s.id === applicationData.scholarshipId);
      if (scholarshipIndex !== -1) {
        scholarships[scholarshipIndex].applicants += 1;
        localStorage.setItem(STORAGE_KEYS.SCHOLARSHIPS, JSON.stringify(scholarships));
      }
      
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
      return Promise.resolve(newApplication);
    } catch (error) {
      console.error('Error applying for scholarship:', error);
      return Promise.reject('Failed to apply for scholarship');
    }
  },

  getAllApplications() {
    try {
      const applications = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return Promise.resolve(JSON.parse(applications || '[]'));
    } catch (error) {
      console.error('Error getting applications:', error);
      return Promise.resolve([]);
    }
  },

  getApplicationsByScholarship(scholarshipId) {
    try {
      const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const scholarshipApplications = applications.filter(app => app.scholarshipId === parseInt(scholarshipId));
      return Promise.resolve(scholarshipApplications);
    } catch (error) {
      console.error('Error getting applications by scholarship:', error);
      return Promise.resolve([]);
    }
  },

  updateApplicationStatus(applicationId, status, adminName, notes = '') {
    try {
      const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const applicationIndex = applications.findIndex(app => app.id === parseInt(applicationId));
      
      if (applicationIndex !== -1) {
        applications[applicationIndex].status = status;
        applications[applicationIndex].reviewed = true;
        applications[applicationIndex].reviewedBy = adminName;
        applications[applicationIndex].reviewedDate = new Date().toISOString().split('T')[0];
        applications[applicationIndex].notes = notes;
        
        localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
        return Promise.resolve(applications[applicationIndex]);
      }
      return Promise.reject('Application not found');
    } catch (error) {
      console.error('Error updating application status:', error);
      return Promise.reject('Failed to update application status');
    }
  },

  // Utility methods
  getApplicationStats() {
    try {
      const applications = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const scholarships = JSON.parse(localStorage.getItem(STORAGE_KEYS.SCHOLARSHIPS) || '[]');
      
      const totalApplications = applications.length;
      const pendingApplications = applications.filter(app => app.status === 'pending').length;
      const approvedApplications = applications.filter(app => app.status === 'approved').length;
      const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
      const totalScholarships = scholarships.length;
      const activeScholarships = scholarships.filter(s => s.status === 'active').length;

      return Promise.resolve({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalScholarships,
        activeScholarships
      });
    } catch (error) {
      console.error('Error getting application stats:', error);
      return Promise.resolve({
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        totalScholarships: 0,
        activeScholarships: 0
      });
    }
  }
};