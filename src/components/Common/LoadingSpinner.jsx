import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

const LoadingSpinner = ({ 
  size = 'md',
  text = 'Loading...',
  showText = true,
  color = 'blue.500'
}) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <VStack spacing={3}>
      <Spinner
        thickness="3px"
        speed="0.8s"
        emptyColor={useColorModeValue('gray.200', 'gray.600')}
        color={color}
        size={size}
      />
      {showText && (
        <Text fontSize="sm" color={textColor} fontWeight="medium">
          {text}
        </Text>
      )}
    </VStack>
  );
};

// Full page loading component
export const FullPageLoader = ({ text = 'Initializing chat...' }) => {
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={9999}
    >
      <LoadingSpinner size="xl" text={text} />
    </Box>
  );
};

// Inline loading for chat messages
export const MessageLoader = () => (
  <Box py={4} textAlign="center">
    <LoadingSpinner 
      size="sm" 
      text="Generating response..." 
      color="blue.400"
    />
  </Box>
);

export default LoadingSpinner;
