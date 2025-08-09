import { API_BASE_URL } from '../config';

export const api = {
  // AI Insights endpoints
  async getAIInsights() {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-insights`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching AI insights:', error);
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
  async getEmployees() {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
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
