import React from 'react';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import theme from './styles/themes/chakra-theme';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/Common/ErrorBoundary';

// Import global styles directly
import './styles/globals.scss';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <QueryClientProvider client={queryClient}>
          <Layout />
        </QueryClientProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;
