import { useState, useEffect, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (valueToStore === null || valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove from localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

// Specialized hook for chat persistence
export const useChatPersistence = () => {
  const [persistedSession, setPersistedSession, removePersistedSession] = useLocalStorage('chat-session', null);
  const [persistedMessages, setPersistedMessages, removePersistedMessages] = useLocalStorage('chat-messages', []);

  const saveSession = useCallback((sessionId) => {
    setPersistedSession({
      sessionId,
      timestamp: Date.now(),
      lastActivity: Date.now()
    });
  }, [setPersistedSession]);

  const saveMessages = useCallback((messages) => {
    if (messages && messages.length > 0) {
      setPersistedMessages(messages);
    }
  }, [setPersistedMessages]);

  const clearPersistedData = useCallback(() => {
    removePersistedSession();
    removePersistedMessages();
  }, [removePersistedSession, removePersistedMessages]);

  const isSessionValid = useCallback(() => {
    if (!persistedSession) return false;
    
    // Check if session is less than 24 hours old
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const sessionAge = Date.now() - persistedSession.timestamp;
    
    return sessionAge < maxAge;
  }, [persistedSession]);

  return {
    persistedSession,
    persistedMessages,
    saveSession,
    saveMessages,
    clearPersistedData,
    isSessionValid
  };
};
