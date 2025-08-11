import { API_BASE_URL } from '../config';

export const api = {
  // AI Insights endpoints
  async getAIInsights(params?: { period?: string; severity?: string; type?: string; department?: string; companyId?: string }) {
    try {
      const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
      const response = await fetch(`${API_BASE_URL}/ai-insights${qs}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      throw error;
    }
  },

  async deleteAIInsight(id: string, token?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting AI insight:', error);
      throw error;
    }
  },

  async postToUrl(fullUrl: string, token?: string) {
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} body: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error posting to custom URL:', error);
      throw error;
    }
  },

  async generateAIInsights(period: string, token?: string, companyId?: string, count?: number) {
    try {
      const qs = new URLSearchParams({ period, ...(companyId ? { companyId } : {}), ...(count ? { count: String(count) } : {}) }).toString();
      const response = await fetch(`${API_BASE_URL}/ai-insights/generate?${qs}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP error! status: ${response.status} body: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error generating AI insights:', error);
      throw error;
    }
  },

  async createSampleInsights() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights/sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating sample insights:', error);
      throw error;
    }
  },

  async patchAIInsight(id: string, body: any, token?: string) {
    const response = await fetch(`${API_BASE_URL}/ai-insights/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async getAIInsightsStats(params: { from?: string; to?: string; companyId?: string }) {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const response = await fetch(`${API_BASE_URL}/ai-insights/stats${qs}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  // Payroll endpoints
  async getPayrolls() {
    try {
      const response = await fetch(`${API_BASE_URL}/payrolls`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      throw error;
    }
  },

  async getPayrollById(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/payrolls/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching payroll:', error);
      throw error;
    }
  },

  async createSamplePayrolls() {
    try {
      const response = await fetch(`${API_BASE_URL}/payrolls/sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating sample payrolls:', error);
      throw error;
    }
  },

  // Employees endpoints  
  async getEmployees(token?: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Generic helper for other endpoints
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  },

  async post(endpoint: string, data: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }
};
