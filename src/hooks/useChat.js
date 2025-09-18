import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { v4 as uuidv4 } from 'uuid';
import apiService from '../services/apiService';
import { useSocket } from './useSocket';

export const useChat = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const toast = useToast();
  const { socket, isConnected } = useSocket();
  const abortControllerRef = useRef(null);

  // Initialize session
  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (isConnected) {
        // Use Socket.IO
        socket.createSession();
      } else {
        // Use REST API
        const response = await apiService.createSession();
        setSessionId(response.sessionId);
        console.log('Session created:', response.sessionId);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
      setError(error.message);
      
      toast({
        title: 'Session Error',
        description: 'Failed to create chat session',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, socket, toast]);

  // Send message
  const sendMessage = useCallback(async (message, useStreaming = false) => {
    if (!sessionId || !message.trim()) return;

    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: message.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (isConnected) {
        // Use Socket.IO
        socket.sendMessage(sessionId, message);
      } else if (useStreaming) {
        // Use Server-Sent Events for streaming
        setIsStreaming(true);
        const botMessage = {
          id: uuidv4(),
          type: 'bot',
          content: '',
          timestamp: Date.now(),
          sources: [],
        };

        setMessages(prev => [...prev, botMessage]);

        try {
          for await (const chunk of apiService.sendStreamingMessage(sessionId, message)) {
            if (abortControllerRef.current?.signal.aborted) {
              break;
            }

            if (chunk.type === 'chunk') {
              setMessages(prev => prev.map(msg => 
                msg.id === botMessage.id 
                  ? { ...msg, content: msg.content + chunk.text }
                  : msg
              ));
            } else if (chunk.type === 'sources') {
              setMessages(prev => prev.map(msg => 
                msg.id === botMessage.id 
                  ? { ...msg, sources: chunk.sources }
                  : msg
              ));
            } else if (chunk.type === 'end') {
              break;
            } else if (chunk.type === 'error') {
              throw new Error(chunk.error);
            }
          }
        } catch (streamError) {
          if (streamError.name !== 'AbortError') {
            throw streamError;
          }
        }
      } else {
        // Use regular REST API
        const response = await apiService.sendMessage(sessionId, message);
        
        const botMessage = {
          id: uuidv4(),
          type: 'bot',
          content: response.response,
          timestamp: Date.now(),
          sources: response.sources || [],
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Failed to send message:', error);
        setError(error.message);
        
        toast({
          title: 'Message Failed',
          description: 'Failed to send message. Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, [sessionId, isConnected, socket, toast]);

  // Clear chat
  const clearChat = useCallback(async () => {
    if (!sessionId) return;

    try {
      if (isConnected) {
        socket.clearSession(sessionId);
      } else {
        await apiService.clearSession(sessionId);
        setMessages([]);
        
        toast({
          title: 'Chat Cleared',
          description: 'All messages have been cleared',
          status: 'info',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Failed to clear chat:', error);
      
      toast({
        title: 'Clear Failed',
        description: 'Failed to clear chat history',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [sessionId, isConnected, socket, toast]);

  // Load chat history
  const loadHistory = useCallback(async () => {
    if (!sessionId) return;

    try {
      setIsLoading(true);
      
      if (isConnected) {
        socket.getHistory(sessionId);
      } else {
        const response = await apiService.getChatHistory(sessionId);
        setMessages(response.history || []);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, isConnected, socket]);

  // Socket event handlers
  useEffect(() => {
    if (!isConnected) return;

    const handleSessionCreated = (data) => {
      setSessionId(data.sessionId);
      console.log('Socket session created:', data.sessionId);
    };

    const handleMessageReceived = (data) => {
      const botMessage = {
        id: uuidv4(),
        type: 'bot',
        content: data.content,
        timestamp: data.timestamp,
        sources: data.sources || [],
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      setIsTyping(false);
    };

    const handleBotTyping = (isTypingNow) => {
      setIsTyping(isTypingNow);
    };

    const handleHistoryLoaded = (data) => {
      setMessages(data.history || []);
      setIsLoading(false);
    };

    const handleSessionCleared = () => {
      setMessages([]);
      
      toast({
        title: 'Chat Cleared',
        description: 'All messages have been cleared',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    };

    const handleError = (error) => {
      console.error('Socket error:', error);
      setError(error.message);
      setIsLoading(false);
      setIsTyping(false);
      
      toast({
        title: 'Connection Error',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    };

    // Register event handlers
    socket.onSessionCreated(handleSessionCreated);
    socket.onMessageReceived(handleMessageReceived);
    socket.onBotTyping(handleBotTyping);
    socket.onHistoryLoaded(handleHistoryLoaded);
    socket.onSessionCleared(handleSessionCleared);
    socket.onError(handleError);

    // Cleanup
    return () => {
      socket.off('session_created', handleSessionCreated);
      socket.off('message_received', handleMessageReceived);
      socket.off('bot_typing', handleBotTyping);
      socket.off('history_loaded', handleHistoryLoaded);
      socket.off('session_cleared', handleSessionCleared);
      socket.off('error', handleError);
    };
  }, [isConnected, socket, toast]);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [sessionId, initializeSession]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    sessionId,
    messages,
    isLoading,
    isTyping,
    isStreaming,
    error,
    isConnected,
    sendMessage,
    clearChat,
    loadHistory,
    initializeSession,
  };
};
