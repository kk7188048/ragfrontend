import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  IconButton,
  Badge,
  HStack,
  useColorModeValue,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiMoreVertical,
  FiTrash2,
  FiWifi,
  FiWifiOff,
  FiMessageCircle,
} from 'react-icons/fi';

const ChatHeader = ({ 
  onMenuClick, 
  onClearChat, 
  isConnected, 
  messageCount = 0 
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtextColor = useColorModeValue('gray.500', 'gray.400');

  return (
    <Box
      p={4}
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
      className="chat-header"
    >
      <Flex align="center" justify="space-between">
        {/* Left Section */}
        <HStack spacing={3}>
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Open menu"
            onClick={onMenuClick}
            display={{ base: 'flex', md: 'none' }}
          />
          
          <Box>
            <Heading size="md" color={textColor}>
              News Assistant
            </Heading>
            <HStack spacing={2} mt={1}>
              <Text fontSize="xs" color={subtextColor}>
                Powered by AI
              </Text>
              <Tooltip 
                label={isConnected ? 'Real-time connected' : 'HTTP mode'}
                placement="bottom"
              >
                <Badge
                  size="sm"
                  colorScheme={isConnected ? 'green' : 'yellow'}
                  variant="subtle"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  {isConnected ? <FiWifi size={10} /> : <FiWifiOff size={10} />}
                  {isConnected ? 'Live' : 'HTTP'}
                </Badge>
              </Tooltip>
            </HStack>
          </Box>
        </HStack>

        {/* Right Section */}
        <HStack spacing={2}>
          {messageCount > 0 && (
            <Tooltip label={`${messageCount} messages`}>
              <Badge
                colorScheme="blue"
                variant="subtle"
                display="flex"
                alignItems="center"
                gap={1}
                px={2}
                py={1}
                borderRadius="md"
              >
                <FiMessageCircle size={12} />
                {messageCount}
              </Badge>
            </Tooltip>
          )}

          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FiMoreVertical />}
              variant="ghost"
              aria-label="Chat options"
              size="sm"
            />
            <MenuList>
              <MenuItem
                icon={<FiTrash2 />}
                onClick={onClearChat}
                color="red.500"
              >
                Clear Chat
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};

export default ChatHeader;
