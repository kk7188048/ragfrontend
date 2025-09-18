import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
} from '@chakra-ui/react';
import { FiRefreshCw } from "react-icons/fi";


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console or external service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxW="lg" centerContent py={20}>
          <VStack spacing={6} textAlign="center">
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <AlertTitle>Oops! Something went wrong</AlertTitle>
            </Alert>

            <Box>
              <Heading size="lg" mb={4}>
                The application encountered an unexpected error
              </Heading>
              <Text color="gray.600" mb={6}>
                We apologize for the inconvenience. Please try refreshing the page.
              </Text>
            </Box>

            <Button
              leftIcon={<FiRefreshCw />}
              colorScheme="brand"
              onClick={this.handleReload}
              size="lg"
            >
              Refresh Page
            </Button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Alert status="warning" borderRadius="md" textAlign="left">
                <AlertIcon />
                <Box>
                  <AlertTitle>Development Error Details:</AlertTitle>
                  <AlertDescription>
                    <Code fontSize="sm" p={2} borderRadius="md" display="block" mt={2}>
                      {this.state.error.toString()}
                    </Code>
                  </AlertDescription>
                </Box>
              </Alert>
            )}
          </VStack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
