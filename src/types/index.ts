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
  nickname: string;
  phone: string;
  lineId?: string;
  facebook?: string;
  resumeUrl?: string;
  transcriptUrl?: string;
  selfIntroduction?: string;
}

export interface JobApplicationResponse {
  id: string;
  editToken: string;
  message: string;
}

export interface JobApplicationData {
  id: string;
  fullName: string;
  nickname: string | null;
  phone: string | null;
  lineId: string | null;
  facebook: string | null;
  resumeUrl: string | null;
  transcriptUrl: string | null;
  selfIntroduction: string | null;
  jobTitle: string;
  companyName: string;
  jobId: string;
}

export interface FileUploadResponse {
  url: string;
}

// API Error
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
