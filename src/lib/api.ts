import { JobPosting, JobApplicationInput, JobApplicationResponse, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
      }));
      throw error;
    }

    return response.json();
  }

  // Public endpoints
  async getJobs(): Promise<JobPosting[]> {
    return this.request<JobPosting[]>('/api/public/jobs');
  }

  async getJob(id: string): Promise<JobPosting> {
    return this.request<JobPosting>(`/api/public/jobs/${id}`);
  }

  async submitApplication(
    jobId: string,
    application: JobApplicationInput
  ): Promise<JobApplicationResponse> {
    return this.request<JobApplicationResponse>(`/api/public/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(application),
    });
  }
}

export const api = new ApiClient();

// Server-side fetching (for SSR/SSG)
export async function fetchJobs(): Promise<JobPosting[]> {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api/public/jobs`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      console.error('Failed to fetch jobs:', response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function fetchJob(id: string): Promise<JobPosting | null> {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${apiUrl}/api/public/jobs/${id}`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Failed to fetch job:', response.statusText);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    return null;
  }
}
