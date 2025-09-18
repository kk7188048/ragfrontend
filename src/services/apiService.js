import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('📡 API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  // Session management
  async createSession() {
    try {
      const response = await this.client.post('/api/chat/session');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  async clearSession(sessionId) {
    try {
      const response = await this.client.delete(`/api/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to clear session: ${error.message}`);
    }
  }

  // Chat operations
  async sendMessage(sessionId, message) {
    try {
      const response = await this.client.post('/api/chat/message', {
        sessionId,
        message,
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async getChatHistory(sessionId) {
    try {
      const response = await this.client.get(`/api/chat/history/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error.message}`);
    }
  }

  // System stats
  async getStats() {
    try {
      const response = await this.client.get('/api/chat/stats');
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get stats: ${error.message}`);
    }
  }

  // Streaming message (Server-Sent Events)
  async *sendStreamingMessage(sessionId, message) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/message/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, message }),
      });

      if (!response.ok) {
        throw new Error(`Streaming failed: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                yield data;
              } catch (parseError) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      throw new Error(`Streaming message failed: ${error.message}`);
    }
  }
}

export default new ApiService();
