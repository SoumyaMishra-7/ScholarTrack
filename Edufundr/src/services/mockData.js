// src/services/mockData.js
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
    maxApplicants: 100
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
    maxApplicants: 50
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
    maxApplicants: 40
  }
];

export const mockApplications = [
  {
    id: 1,
    scholarshipId: 1,
    studentName: "RiyaSharma",
    studentEmail: "riya@example.com",
    status: "pending",
    appliedDate: "2024-01-15",
    documents: ["resume.pdf", "transcript.pdf"]
  }
];