import React from 'react';
import {
  Box,
  HStack,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMessageSquare } from 'react-icons/fi';

const TypingIndicator = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <HStack align="start" spacing={3} className="typing-indicator fade-in-up">
      <Avatar
        size="sm"
        icon={<FiMessageSquare />}
        bg="blue.500"
        color="white"
        name="News Assistant"
      />

      <Box
        bg={bgColor}
        px={4}
        py={3}
        borderRadius="18px"
        borderBottomLeftRadius="4px"
        border="1px"
        borderColor={borderColor}
        boxShadow="sm"
      >
        <HStack spacing={1}>
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            className="typing-dot"
          />
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            className="typing-dot"
          />
          <Box
            w={2}
            h={2}
            bg="gray.400"
            borderRadius="full"
            className="typing-dot"
          />
        </HStack>
      </Box>
    </HStack>
  );
};

export default TypingIndicator;
