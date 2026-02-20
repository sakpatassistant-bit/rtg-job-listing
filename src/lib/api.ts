import {
  JobPosting,
  JobApplicationInput,
  JobApplicationResponse,
  JobApplicationData,
  FileUploadResponse,
  ApiError,
} from '@/types';

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

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only set Content-Type for non-FormData bodies
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers,
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

  async uploadFile(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<FileUploadResponse>('/api/public/jobs/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async getApplicationByToken(token: string): Promise<JobApplicationData> {
    return this.request<JobApplicationData>(
      `/api/public/jobs/applications/by-token/${token}`
    );
  }

  async updateApplication(
    token: string,
    data: Partial<JobApplicationInput>
  ): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      `/api/public/jobs/applications/by-token/${token}`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    );
  }
}

export const api = new ApiClient();

// Server-side fetching (for SSR/SSG)
export async function fetchJobs(): Promise<JobPosting[]> {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  try {
    const response = await fetch(`${apiUrl}/api/public/jobs`, {
      next: { revalidate: 86400 },
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

export async function fetchApplicationByToken(
  token: string
): Promise<JobApplicationData | null> {
  const apiUrl = process.env.API_URL || 'http://localhost:3000';

  try {
    const response = await fetch(
      `${apiUrl}/api/public/jobs/applications/by-token/${token}`,
      { cache: 'no-store' }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}
