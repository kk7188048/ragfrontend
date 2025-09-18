import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Flex,
  Textarea,
  IconButton,
  Button,
  HStack,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import {
  FiSend,
  FiMic,
  FiSettings,
  FiZap,
  FiType,
} from 'react-icons/fi';

const ChatInput = ({ 
  onSendMessage, 
  isLoading = false, 
  isConnected = false, 
  disabled = false 
}) => {
  const [message, setMessage] = useState('');
  const [useStreaming, setUseStreaming] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  
  const textareaRef = useRef(null);
  const maxLength = 1000;

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), useStreaming);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
    // For now, just a placeholder
  };

  const getSuggestions = () => [
    "What's the latest technology news?",
    "Tell me about recent business developments",
    "What's happening in sports today?",
    "Any major world news updates?",
    "Recent health and science news?",
  ];

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <Box
      p={4}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      className="chat-input"
    >
      {/* Quick suggestions (show when input is empty) */}
      {!message.trim() && (
        <Box mb={3}>
          <Text fontSize="xs" color={placeholderColor} mb={2} fontWeight="medium">
            Quick suggestions:
          </Text>
          <Flex gap={2} flexWrap="wrap">
            {getSuggestions().slice(0, 3).map((suggestion, index) => (
              <Button
                key={index}
                size="xs"
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                fontSize="xs"
                h={6}
                px={2}
              >
                {suggestion}
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      <Flex direction="column" gap={3}>
        {/* Main input area */}
        <Flex gap={2} align="end">
          <Box flex="1" position="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isConnected 
                  ? "Ask me about the news... (Press Enter to send)"
                  : "Ask me about the news... (HTTP mode)"
              }
              disabled={disabled}
              resize="none"
              minH="44px"
              maxH="120px"
              bg={useColorModeValue('gray.50', 'gray.700')}
              border="2px"
              borderColor={borderColor}
              _focus={{
                borderColor: 'blue.500',
                boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)',
              }}
              _disabled={{
                opacity: 0.6,
                cursor: 'not-allowed',
              }}
              fontSize="sm"
            />
            
            {/* Character counter */}
            <Text
              position="absolute"
              bottom={1}
              right={2}
              fontSize="xs"
              color={message.length > maxLength * 0.9 ? 'red.500' : placeholderColor}
            >
              {message.length}/{maxLength}
            </Text>
          </Box>

          {/* Voice input button */}
          <Tooltip label={isRecording ? "Stop recording" : "Voice input"}>
            <IconButton
              icon={<FiMic />}
              variant={isRecording ? "solid" : "outline"}
              colorScheme={isRecording ? "red" : "gray"}
              onClick={handleVoiceToggle}
              disabled={disabled}
              aria-label="Voice input"
              className={isRecording ? "pulse" : ""}
            />
          </Tooltip>

          {/* Send button */}
          <Tooltip label={useStreaming ? "Send with streaming" : "Send message"}>
            <IconButton
              icon={useStreaming ? <FiZap /> : <FiSend />}
              colorScheme="blue"
              variant="solid"
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              isLoading={isLoading}
              loadingText="Sending..."
              aria-label="Send message"
              size="md"
            />
          </Tooltip>
        </Flex>

        {/* Input options */}
        <HStack justify="space-between" fontSize="xs" color={placeholderColor}>
          <HStack spacing={4}>
            <HStack spacing={1}>
              <Switch
                size="sm"
                isChecked={useStreaming}
                onChange={(e) => setUseStreaming(e.target.checked)}
                colorScheme="blue"
                disabled={!isConnected}
              />
              <FormLabel mb={0} fontSize="xs">
                <HStack spacing={1}>
                  {useStreaming ? <FiZap size={10} /> : <FiType size={10} />}
                  <Text>{useStreaming ? "Streaming" : "Standard"}</Text>
                </HStack>
              </FormLabel>
            </HStack>

            {!isConnected && (
              <Text color="orange.500" fontSize="xs">
                Real-time features unavailable
              </Text>
            )}
          </HStack>

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="xs"
              leftIcon={<FiSettings />}
              disabled={disabled}
            >
              Options
            </MenuButton>
            <MenuList fontSize="sm">
              <MenuItem
                icon={<FiZap />}
                onClick={() => setUseStreaming(!useStreaming)}
              >
                {useStreaming ? "Disable" : "Enable"} Streaming
              </MenuItem>
              <MenuItem icon={<FiType />}>
                Change Input Mode
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default ChatInput;
