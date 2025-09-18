import React, { useState } from 'react';
import {
  Box,
  Text,
  HStack,
  VStack,
  Avatar,
  Badge,
  Button,
  Collapse,
  useColorModeValue,
  IconButton,
  Tooltip,
  Link,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  FiUser,
  FiMessageSquare,
  FiClock,
  FiExternalLink,
  FiChevronDown,
  FiChevronUp,
  FiCopy,
} from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const MessageBubble = ({ message, isStreaming = false }) => {
  const [showSources, setShowSources] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.type === 'user';
  
  // Theme colors
  const userBubbleBg = useColorModeValue('blue.500', 'blue.600');
  const botBubbleBg = useColorModeValue('white', 'gray.700');
  const userTextColor = 'white';
  const botTextColor = useColorModeValue('gray.800', 'white');
  const timestampColor = useColorModeValue('gray.500', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  const renderContent = () => {
    const content = message.content || '';
    
    // Simple markdown-like rendering
    const lines = content.split('\n');
    return lines.map((line, index) => {
      // Handle bold text
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = line.split(boldRegex);
      
      return (
        <Text key={index} mb={index < lines.length - 1 ? 2 : 0}>
          {parts.map((part, partIndex) => {
            if (partIndex % 2 === 1) {
              return <strong key={partIndex}>{part}</strong>;
            }
            return part;
          })}
          {isStreaming && index === lines.length - 1 && (
            <Box as="span" className="cursor-blink">|</Box>
          )}
        </Text>
      );
    });
  };

  return (
    <HStack
      align="start"
      justify={isUser ? 'flex-end' : 'flex-start'}
      spacing={3}
      className={`message-bubble ${isUser ? 'user-message' : 'bot-message'}`}
    >
      {!isUser && (
        <Avatar
          size="sm"
          icon={<FiMessageSquare/>}
          bg="blue.500"
          color="white"
          name="News Assistant"
        />
      )}

      <VStack
        align={isUser ? 'flex-end' : 'flex-start'}
        spacing={2}
        maxW="70%"
        flex="1"
      >
        {/* Message bubble */}
        <Box
          bg={isUser ? userBubbleBg : botBubbleBg}
          color={isUser ? userTextColor : botTextColor}
          px={4}
          py={3}
          borderRadius="18px"
          borderBottomRightRadius={isUser ? "4px" : "18px"}
          borderBottomLeftRadius={!isUser ? "4px" : "18px"}
          border={!isUser ? "1px" : "none"}
          borderColor={borderColor}
          position="relative"
          boxShadow="sm"
          className="message-content"
        >
          {renderContent()}

          {/* Copy button for bot messages */}
          {!isUser && (
            <Tooltip label={copied ? "Copied!" : "Copy message"}>
              <IconButton
                icon={<FiCopy />}
                size="xs"
                variant="ghost"
                position="absolute"
                top={1}
                right={1}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                onClick={handleCopyMessage}
                aria-label="Copy message"
                color={botTextColor}
              />
            </Tooltip>
          )}
        </Box>

        {/* Timestamp and sources */}
        <HStack spacing={2} fontSize="xs" color={timestampColor}>
          <HStack spacing={1}>
            <FiClock size={10} />
            <Text>{formatTime(message.timestamp)}</Text>
          </HStack>

          {message.sources && message.sources.length > 0 && (
            <Button
              size="xs"
              variant="ghost"
              leftIcon={showSources ? <FiChevronUp /> : <FiChevronDown />}
              onClick={() => setShowSources(!showSources)}
              color={timestampColor}
            >
              {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
            </Button>
          )}
        </HStack>

        {/* Sources section */}
        {message.sources && message.sources.length > 0 && (
          <Collapse in={showSources} animateOpacity>
            <Box
              mt={2}
              p={3}
              bg={useColorModeValue('gray.50', 'gray.800')}
              borderRadius="md"
              border="1px"
              borderColor={borderColor}
              maxW="100%"
            >
              <Text fontSize="xs" fontWeight="semibold" mb={2} color={timestampColor}>
                Sources:
              </Text>
              <VStack spacing={2} align="stretch">
                {message.sources.slice(0, 3).map((source, index) => (
                  <HStack
                    key={index}
                    spacing={2}
                    p={2}
                    bg={useColorModeValue('white', 'gray.700')}
                    borderRadius="md"
                    fontSize="xs"
                  >
                    <Badge colorScheme="blue" size="sm">
                      {source.source || 'News'}
                    </Badge>
                    <Text
                      flex="1"
                      noOfLines={1}
                      color={useColorModeValue('gray.700', 'gray.300')}
                    >
                      {source.title}
                    </Text>
                    {source.link && (
                      <Link href={source.link} isExternal>
                        <IconButton
                          icon={<FiExternalLink />}
                          size="xs"
                          variant="ghost"
                          aria-label="Open source"
                        />
                      </Link>
                    )}
                  </HStack>
                ))}
                {message.sources.length > 3 && (
                  <Text fontSize="xs" color={timestampColor} textAlign="center">
                    +{message.sources.length - 3} more sources
                  </Text>
                )}
              </VStack>
            </Box>
          </Collapse>
        )}
      </VStack>

      {isUser && (
        <Avatar
          size="sm"
          icon={<FiUser />}
          bg="gray.500"
          color="white"
          name="You"
        />
      )}
    </HStack>
  );
};

export default MessageBubble;
