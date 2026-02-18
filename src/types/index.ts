// Job Posting types
export interface Company {
  id: string;
  name: string;
  code: string;
}

export interface JobPosting {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  salary: string | null;
  positions: number;
  closingDate: string | null;
  publishedAt: string | null;
  createdAt: string;
  company: Company;
}

export interface JobListResponse {
  jobs: JobPosting[];
}

// Application types
export interface JobApplicationInput {
  fullName: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  resumeUrl?: string;
}

export interface JobApplicationResponse {
  id: string;
  message: string;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
