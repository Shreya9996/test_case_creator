
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export class AIClient {
  constructor(baseURL = BASE_URL) {
    this.baseURL = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL;
    this.maxRetries = 2;
    this.retryDelay = 1000;
  }

  /**
   * Sleep utility for retry delays
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Make API request with retry logic
   */
  async request(endpoint, options = {}, retryCount = 0) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseURL}${cleanEndpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'API request failed';

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }

        // Retry on 5xx errors or network issues
        if (response.status >= 500 && retryCount < this.maxRetries) {
          await this.sleep(this.retryDelay * (retryCount + 1));
          return this.request(endpoint, options, retryCount + 1);
        }

        return { success: false, error: errorMessage };
      }

      const data = await response.json();
      return { success: true, data: data.data || data };
    } catch (error) {
      // Retry on network errors
      if ((error.name === 'TypeError' || error.message.includes('fetch')) && retryCount < this.maxRetries) {
        await this.sleep(this.retryDelay * (retryCount + 1));
        return this.request(endpoint, options, retryCount + 1);
      }

      return { success: false, error: error.message || 'Network error' };
    }
  }

  /**
   * Generate test cases for code
   */
  async generateTests(code, testType = 'unit', userId = null) {
    return this.request('/ai/generate-tests', {
      method: 'POST', 
      body: JSON.stringify({ code, testType, userId })
    });
  }

  /**
   * Get test cases history
   */
  async getTestCases(userId = null, limit = 50) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}&limit=${limit}` : `?limit=${limit}`;
    return this.request(`/ai/test-cases${query}`);
  }

  /**
   * Delete a test case
   */
  async deleteTestCase(id, userId = null) {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
    return this.request(`/ai/test-cases/${id}${query}`, {
      method: 'DELETE'
    });
  }

  /**
   * Generate documentation
   */
  async generateDocumentation(code) {
    return this.request('/ai/document', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  /**
   * Generate code from requirements
   */
  async generateCode(requirement, language = 'javascript') {
    return this.request('/ai/generate-code', {
      method: 'POST',
      body: JSON.stringify({ requirement, language })
    });
  }

  /**
   * Optimize code
   */
  async optimizeCode(code) {
    return this.request('/ai/optimize', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  /**
   * Chat with AI
   */
  async chat(message, code = null, userId = null) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, code, userId })
    });
  }

  /**
   * Check API health
   */
  async health() {
    return this.request('/ai/health');
  }
}

// Export singleton instance
export const aiClient = new AIClient();
export default AIClient;
