import React, { useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  useToast,
  Alert,
  AlertIcon,
  Text,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import { useChat } from '../../hooks/useChat';

const ChatContainer = ({ onMenuClick }) => {
  const {
    messages,
    isLoading,
    isTyping,
    isStreaming,
    isRestoringSession,
    isConnected,
    sendMessage,
    clearChat,
  } = useChat();

  const toast = useToast();
  const messagesEndRef = useRef(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (message, useStreaming = false) => {
    try {
      await sendMessage(message, useStreaming);
    } catch (error) {
      toast({
        title: 'Message Failed',
        description: 'Unable to send message. Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleClearChat = async () => {
    try {
      await clearChat();
    } catch (error) {
      toast({
        title: 'Clear Failed',
        description: 'Unable to clear chat history.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // Show restoration loading state
  if (isRestoringSession) {
    return (
      <Flex
        direction="column"
        h="100vh"
        maxW="100%"
        bg={bgColor}
        borderRadius={{ base: 0, md: 'lg' }}
        border={{ base: 'none', md: '1px' }}
        borderColor={borderColor}
        overflow="hidden"
        align="center"
        justify="center"
      >
        <VStack spacing={4}>
          <Spinner size="lg" color="blue.500" thickness="3px" />
          <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
            Restoring your chat session...
          </Text>
          <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.500')}>
            Loading previous messages
          </Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      h="100vh"
      maxW="100%"
      bg={bgColor}
      borderRadius={{ base: 0, md: 'lg' }}
      border={{ base: 'none', md: '1px' }}
      borderColor={borderColor}
      overflow="hidden"
      className="chat-container"
    >
      {/* Session Restored Notification */}
      {messages.length > 0 && (
        <Alert status="info" size="sm" mb={2}>
          <AlertIcon />
          <Text fontSize="sm">
            Previous conversation restored • {messages.length} messages
          </Text>
        </Alert>
      )}

      {/* Header */}
      <ChatHeader
        onMenuClick={onMenuClick}
        onClearChat={handleClearChat}
        isConnected={isConnected}
        messageCount={messages.length}
      />

      {/* Messages Area */}
      <Box flex="1" overflowY="auto" position="relative">
        <ChatMessages
          messages={messages}
          isTyping={isTyping}
          isStreaming={isStreaming}
        />
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        isConnected={isConnected}
        disabled={isLoading || isTyping}
      />
    </Flex>
  );
};

export default ChatContainer;
