import React from 'react';
import {
  Box,
  VStack,
  Text,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { FiMessageSquare } from 'react-icons/fi';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatMessages = ({ messages, isTyping, isStreaming }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.400');

  // Empty state
  if (messages.length === 0 && !isTyping) {
    return (
      <Flex
        h="100%"
        align="center"
        justify="center"
        direction="column"
        p={8}
        bg={bgColor}
        className="empty-chat-state"
      >
        <Box
          p={6}
          borderRadius="full"
          bg={useColorModeValue('white', 'gray.800')}
          mb={4}
          boxShadow="md"
        >
          <FiMessageSquare size={48} color={emptyStateColor} />
        </Box>
        
        <Text fontSize="xl" fontWeight="semibold" color={emptyStateColor} mb={2}>
          Welcome to News Assistant
        </Text>
        
        <Text 
          fontSize="md" 
          color={emptyStateColor} 
          textAlign="center" 
          maxW="md"
          mb={4}
        >
          Ask me anything about current news, technology, business, sports, or world events.
        </Text>

        <VStack spacing={2} opacity={0.8}>
          <Text fontSize="sm" color={emptyStateColor} fontWeight="medium">
            Try asking:
          </Text>
          <VStack spacing={1} fontSize="sm" color={emptyStateColor}>
            <Text>"What's the latest in technology?"</Text>
            <Text>"Tell me about recent business news"</Text>
            <Text>"What's happening in sports?"</Text>
          </VStack>
        </VStack>
      </Flex>
    );
  }

  return (
    <Box
      p={4}
      bg={bgColor}
      minH="100%"
      className="chat-messages"
    >
      <VStack spacing={4} align="stretch">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isStreaming={isStreaming && index === messages.length - 1}
          />
        ))}
        
        {isTyping && (
          <TypingIndicator />
        )}

        {messages.length > 10 && (
          <Alert status="info" borderRadius="md" mt={4}>
            <AlertIcon />
            Chat history is automatically saved. You can scroll up to see earlier messages.
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default ChatMessages;
