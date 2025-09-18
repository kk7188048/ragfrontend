import React from 'react';
import {
  Box,
  Container,
  Flex,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import ChatContainer from '../Chat/ChatContainer';
import Sidebar from './Sidebar';

const Layout = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex h="100vh">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isOpen} 
          onClose={onClose}
        />

        {/* Main Content */}
        <Flex flex="1" direction="column">
          <Container maxW="container.xl" p={0} h="100%">
            <ChatContainer onMenuClick={onOpen} />
          </Container>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Layout;
