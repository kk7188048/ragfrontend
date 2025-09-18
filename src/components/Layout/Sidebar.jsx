import React, { useState } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Button,
  Divider,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  useColorMode,
  Switch,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';
import {
  FiSettings,
  FiSun,
  FiMoon,
  FiTrash2,
  FiRefreshCw,
  FiInfo,
  FiWifi,
  FiWifiOff,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { useChat } from '../../hooks/useChat';
import apiService from '../../services/apiService';

const Sidebar = ({ isOpen, onClose }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { clearChat, isConnected, initializeSession } = useChat();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Fetch system stats
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['systemStats'],
    queryFn: apiService.getStats,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleClearChat = async () => {
    try {
      await clearChat();
      toast({
        title: 'Chat Cleared',
        description: 'All messages have been removed',
        status: 'success',
        duration: 2000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear chat',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleNewSession = async () => {
    try {
      await initializeSession();
      toast({
        title: 'New Session',
        description: 'Started a fresh chat session',
        status: 'success',
        duration: 2000,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create new session',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="sm">
      <DrawerOverlay />
      <DrawerContent bg={bgColor}>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px" borderColor={borderColor}>
          <HStack>
            <Icon as={FiSettings} />
            <Text>Settings & Info</Text>
          </HStack>
        </DrawerHeader>

        <DrawerBody>
          <VStack spacing={6} align="stretch">
            {/* Connection Status */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                Connection Status
              </Text>
              <Alert
                status={isConnected ? 'success' : 'warning'}
                borderRadius="md"
                size="sm"
              >
                <AlertIcon />
                <HStack>
                  <Icon as={isConnected ? FiWifi : FiWifiOff} />
                  <Text fontSize="sm">
                    {isConnected ? 'Real-time Connected' : 'HTTP Mode'}
                  </Text>
                </HStack>
              </Alert>
            </Box>

            {/* System Stats */}
            {stats && (
              <Box>
                <Text fontSize="sm" fontWeight="semibold" mb={2}>
                  System Information
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Articles Loaded:</Text>
                    <Badge colorScheme="blue">
                      {stats.stats?.articleCount || 0}
                    </Badge>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Status:</Text>
                    <Badge 
                      colorScheme={stats.stats?.isInitialized ? 'green' : 'red'}
                    >
                      {stats.stats?.isInitialized ? 'Ready' : 'Loading'}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Theme Toggle */}
            <FormControl display="flex" alignItems="center">
              <HStack justify="space-between" w="100%">
                <FormLabel htmlFor="theme-toggle" mb="0" fontSize="sm">
                  <HStack>
                    <Icon as={colorMode === 'light' ? FiSun : FiMoon} />
                    <Text>Dark Mode</Text>
                  </HStack>
                </FormLabel>
                <Switch
                  id="theme-toggle"
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                  colorScheme="brand"
                />
              </HStack>
            </FormControl>

            <Divider />

            {/* Chat Actions */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="sm" fontWeight="semibold">
                Chat Actions
              </Text>
              
              <Button
                leftIcon={<FiRefreshCw />}
                variant="outline"
                size="sm"
                onClick={handleNewSession}
              >
                New Session
              </Button>
              
              <Button
                leftIcon={<FiTrash2 />}
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={handleClearChat}
              >
                Clear Chat
              </Button>
            </VStack>

            <Divider />

            {/* App Info */}
            <Box>
              <Text fontSize="sm" fontWeight="semibold" mb={2}>
                <HStack>
                  <Icon as={FiInfo} />
                  <Text>About</Text>
                </HStack>
              </Text>
              <VStack spacing={1} align="stretch" fontSize="xs" color="gray.500">
                <Text>News RAG Chatbot</Text>
                <Text>Version {import.meta.env.VITE_APP_VERSION || '1.0.0'}</Text>
                <Text>Powered by Gemini AI</Text>
                <Text>Real-time with Socket.IO</Text>
              </VStack>
            </Box>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
