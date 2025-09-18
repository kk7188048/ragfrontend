import { useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import socketService from '../services/socketService';

export const useSocket = () => {
  const toast = useToast();
  const reconnectTimeoutRef = useRef(null);

  const connect = useCallback(async () => {
    try {
      await socketService.connect();
      
      toast({
        title: 'Connected',
        description: 'Real-time connection established',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Socket connection failed:', error);
      
      toast({
        title: 'Connection Failed',
        description: 'Falling back to HTTP requests',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    socketService.disconnect();
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected: socketService.isSocketConnected(),
    connect,
    disconnect,
    socket: socketService,
  };
};
