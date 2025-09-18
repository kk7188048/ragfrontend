import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  connect() {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      console.log('🔌 Connecting to Socket.IO server...');

      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to Socket.IO server');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        this.isConnected = false;
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error(`Failed to connect after ${this.maxReconnectAttempts} attempts`));
        }
      });

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from Socket.IO server:', reason);
        this.isConnected = false;
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconnected to Socket.IO server (attempt ${attemptNumber})`);
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });

      this.socket.on('reconnect_error', (error) => {
        this.reconnectAttempts++;
        console.error(`❌ Reconnection attempt ${this.reconnectAttempts} failed:`, error);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting from Socket.IO server');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Session operations
  createSession() {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    
    console.log('📝 Creating new session');
    this.socket.emit('create_session');
  }

  sendMessage(sessionId, message) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('💬 Sending message:', message);
    this.socket.emit('send_message', { sessionId, message });
  }

  getHistory(sessionId) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('📚 Requesting chat history');
    this.socket.emit('get_history', { sessionId });
  }

  clearSession(sessionId) {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }

    console.log('🗑️ Clearing session');
    this.socket.emit('clear_session', { sessionId });
  }

  // Event listeners
  onSessionCreated(callback) {
    if (this.socket) {
      this.socket.on('session_created', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('message_received', callback);
    }
  }

  onBotTyping(callback) {
    if (this.socket) {
      this.socket.on('bot_typing', callback);
    }
  }

  onHistoryLoaded(callback) {
    if (this.socket) {
      this.socket.on('history_loaded', callback);
    }
  }

  onSessionCleared(callback) {
    if (this.socket) {
      this.socket.on('session_cleared', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }

  // Remove event listeners
  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }
}

export default new SocketService();
