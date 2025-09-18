import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const colors = {
  brand: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1',
  },
  accent: {
    50: '#e0f2f1',
    100: '#b2dfdb',
    200: '#80cbc4',
    300: '#4db6ac',
    400: '#26a69a',
    500: '#009688',
    600: '#00897b',
    700: '#00796b',
    800: '#00695c',
    900: '#004d40',
  }
};

const fonts = {
  heading: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
};

const components = {
  Button: {
    defaultProps: {
      colorScheme: 'brand',
    },
    variants: {
      gradient: {
        bg: 'linear-gradient(135deg, brand.500, accent.500)',
        color: 'white',
        _hover: {
          bg: 'linear-gradient(135deg, brand.600, accent.600)',
          transform: 'translateY(-1px)',
        },
        _active: {
          transform: 'translateY(0)',
        },
      },
    },
  },
  Card: {
    baseStyle: {
      container: {
        borderRadius: 'xl',
        boxShadow: 'sm',
      },
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'brand.500',
    },
  },
};

const styles = {
  global: (props) => ({
    'html, body': {
      fontSize: '16px',
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
      lineHeight: 1.6,
    },
    '*::placeholder': {
      color: props.colorMode === 'dark' ? 'gray.400' : 'gray.500',
    },
  }),
};

const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  styles,
});

export default theme;
