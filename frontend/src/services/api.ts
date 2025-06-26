import { Session, SessionCreate } from '../types/session';

// For Vercel deployment, API routes will be at /api
// For local development, use localhost:8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000');

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle FastAPI validation errors (422)
        if (response.status === 422 && errorData.detail && Array.isArray(errorData.detail)) {
          const validationErrors = errorData.detail.map((error: any) => {
            const field = error.loc?.slice(-1)[0] || 'field';
            return `${field}: ${error.msg}`;
          }).join(', ');
          throw new Error(`Validation error: ${validationErrors}`);
        }
        
        // Handle other API errors
        const errorMessage = typeof errorData.detail === 'string' 
          ? errorData.detail 
          : `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Session endpoints
  async getSessions(): Promise<Session[]> {
    return this.request<Session[]>('/sessions/');
  }

  async getSession(id: number): Promise<Session> {
    return this.request<Session>(`/sessions/${id}`);
  }

  async createSession(sessionData: SessionCreate): Promise<Session> {
    return this.request<Session>('/sessions/', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(id: number, sessionData: Partial<SessionCreate>): Promise<Session> {
    return this.request<Session>(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id: number): Promise<void> {
    return this.request<void>(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }
}

export const apiService = new ApiService(); 