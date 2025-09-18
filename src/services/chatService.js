import apiService from './apiService';
import socketService from './socketService';
import { generateMessageId } from '../utils/helpers';

class ChatService {
  constructor() {
    this.currentSessionId = null;
    this.messageQueue = [];
    this.isProcessing = false;
  }

  // Initialize chat service
  async initialize() {
    try {
      // Try to connect to Socket.IO first
      await socketService.connect();
      console.log('✅ Chat service initialized with Socket.IO');
      return { mode: 'socket', connected: true };
    } catch (error) {
      console.warn('⚠️ Socket.IO unavailable, using REST API');
      return { mode: 'rest', connected: false };
    }
  }

  // Create new chat session
  async createSession() {
    try {
      if (socketService.isSocketConnected()) {
        return new Promise((resolve) => {
          socketService.createSession();
          socketService.onSessionCreated((data) => {
            this.currentSessionId = data.sessionId;
            resolve(data.sessionId);
          });
        });
      } else {
        const response = await apiService.createSession();
        this.currentSessionId = response.sessionId;
        return response.sessionId;
      }
    } catch (error) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  // Send message with automatic retry
  async sendMessage(message, options = {}) {
    const {
      useStreaming = false,
      retries = 3,
      onProgress = null,
      onComplete = null,
      onError = null,
    } = options;

    if (!this.currentSessionId) {
      throw new Error('No active session');
    }

    const messageData = {
      id: generateMessageId(),
      sessionId: this.currentSessionId,
      content: message,
      timestamp: Date.now(),
      type: 'user',
    };

    // Add to queue
    this.messageQueue.push(messageData);

    try {
      if (socketService.isSocketConnected()) {
        return this._sendViaSocket(messageData, options);
      } else if (useStreaming) {
        return this._sendViaStreaming(messageData, options);
      } else {
        return this._sendViaRest(messageData, options);
      }
    } catch (error) {
      if (retries > 0) {
        console.log(`🔄 Retrying message send (${retries} attempts left)`);
        return this.sendMessage(message, { ...options, retries: retries - 1 });
      }
      
      if (onError) onError(error);
      throw error;
    }
  }

  async _sendViaSocket(messageData, { onProgress, onComplete }) {
    return new Promise((resolve, reject) => {
      socketService.sendMessage(messageData.sessionId, messageData.content);

      // Handle typing indicator
      socketService.onBotTyping((isTyping) => {
        if (onProgress) onProgress({ type: 'typing', isTyping });
      });

      // Handle response
      socketService.onMessageReceived((response) => {
        const botMessage = {
          id: generateMessageId(),
          type: 'bot',
          content: response.content,
          sources: response.sources || [],
          timestamp: response.timestamp,
        };

        if (onComplete) onComplete(botMessage);
        resolve(botMessage);
      });

      // Handle errors
      socketService.onError((error) => {
        reject(new Error(error.message));
      });

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Socket response timeout'));
      }, 30000);
    });
  }

  async _sendViaStreaming(messageData, { onProgress, onComplete }) {
    let fullResponse = '';
    const botMessage = {
      id: generateMessageId(),
      type: 'bot',
      content: '',
      sources: [],
      timestamp: Date.now(),
    };

    try {
      for await (const chunk of apiService.sendStreamingMessage(
        messageData.sessionId,
        messageData.content
      )) {
        if (chunk.type === 'chunk') {
          fullResponse += chunk.text;
          botMessage.content = fullResponse;
          
          if (onProgress) {
            onProgress({ 
              type: 'streaming', 
              message: { ...botMessage },
              isComplete: false 
            });
          }
        } else if (chunk.type === 'sources') {
          botMessage.sources = chunk.sources;
        } else if (chunk.type === 'end') {
          break;
        } else if (chunk.type === 'error') {
          throw new Error(chunk.error);
        }
      }

      if (onComplete) onComplete(botMessage);
      return botMessage;
    } catch (error) {
      throw new Error(`Streaming failed: ${error.message}`);
    }
  }

  async _sendViaRest(messageData, { onComplete }) {
    try {
      const response = await apiService.sendMessage(
        messageData.sessionId,
        messageData.content
      );

      const botMessage = {
        id: generateMessageId(),
        type: 'bot',
        content: response.response,
        sources: response.sources || [],
        timestamp: Date.now(),
      };

      if (onComplete) onComplete(botMessage);
      return botMessage;
    } catch (error) {
      throw new Error(`REST API failed: ${error.message}`);
    }
  }

  // Get chat history
  async getHistory() {
    if (!this.currentSessionId) return [];

    try {
      if (socketService.isSocketConnected()) {
        return new Promise((resolve) => {
          socketService.getHistory(this.currentSessionId);
          socketService.onHistoryLoaded((data) => {
            resolve(data.history || []);
          });
        });
      } else {
        const response = await apiService.getChatHistory(this.currentSessionId);
        return response.history || [];
      }
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  }

  // Clear current session
  async clearSession() {
    if (!this.currentSessionId) return;

    try {
      if (socketService.isSocketConnected()) {
        socketService.clearSession(this.currentSessionId);
        return new Promise((resolve) => {
          socketService.onSessionCleared(() => {
            this.currentSessionId = null;
            this.messageQueue = [];
            resolve();
          });
        });
      } else {
        await apiService.clearSession(this.currentSessionId);
        this.currentSessionId = null;
        this.messageQueue = [];
      }
    } catch (error) {
      throw new Error(`Failed to clear session: ${error.message}`);
    }
  }

  // Get current session info
  getSessionInfo() {
    return {
      sessionId: this.currentSessionId,
      messageCount: this.messageQueue.length,
      isConnected: socketService.isSocketConnected(),
    };
  }

  // Clean up
  disconnect() {
    socketService.disconnect();
    this.currentSessionId = null;
    this.messageQueue = [];
  }
}

export default new ChatService();
