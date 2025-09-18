export const API_ENDPOINTS = {
  HEALTH: '/health',
  CREATE_SESSION: '/api/chat/session',
  SEND_MESSAGE: '/api/chat/message',
  SEND_STREAMING: '/api/chat/message/stream',
  GET_HISTORY: '/api/chat/history',
  CLEAR_SESSION: '/api/chat/session',
  GET_STATS: '/api/chat/stats',
  GET_USAGE: '/api/chat/usage',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CREATE_SESSION: 'create_session',
  SEND_MESSAGE: 'send_message',
  GET_HISTORY: 'get_history',
  CLEAR_SESSION: 'clear_session',
  SESSION_CREATED: 'session_created',
  MESSAGE_SENT: 'message_sent',
  MESSAGE_RECEIVED: 'message_received',
  BOT_TYPING: 'bot_typing',
  HISTORY_LOADED: 'history_loaded',
  SESSION_CLEARED: 'session_cleared',
  ERROR: 'error',
};

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

export const CONNECTION_STATES = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  DISCONNECTED: 'disconnected',
  RECONNECTING: 'reconnecting',
};

export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_HISTORY_LENGTH: 100,
  TYPING_TIMEOUT: 3000,
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
};

export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px',
  WIDE: '1200px',
};
