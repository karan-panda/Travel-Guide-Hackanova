import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Input,
  Button,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import { RiRobot2Fill, RiCloseLine } from 'react-icons/ri';

const AIChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatHistoryRef = useRef(null);
  const apiKey = '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';

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hello! I'm your AI assistant. How can I help you today?"
        }
      ]);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      const currentInput = input;
      setInput('');

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.href,
          'X-Title': 'Safety App Chat',
        },
        body: JSON.stringify({
          model:"deepseek/deepseek-r1-distill-llama-70b:free",
          messages: [...messages, { role: 'user', content: currentInput }],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content;

      if (assistantMessage) {
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box position="fixed" bottom="20px" right="20px" zIndex="1000">
      <IconButton
        aria-label="Chat with AI"
        icon={isOpen ? 
          <Icon as={RiCloseLine} boxSize={6} /> : 
          <Icon as={RiRobot2Fill} boxSize={6} />
        }
        onClick={() => setIsOpen(!isOpen)}
        colorScheme="blue"
        rounded="full"
        size="lg"
        boxShadow="lg"
      />

      {isOpen && (
        <Box
          position="absolute"
          bottom="70px"
          right="0"
          width="350px"
          height="500px"
          bg={useColorModeValue('white', 'gray.800')}
          borderRadius="lg"
          boxShadow="xl"
          overflow="hidden"
        >
          <VStack h="full" spacing={0}>
            <Box p={4} bg="blue.500" color="white" width="full">
              <Flex align="center" gap={2}>
                <Icon as={RiRobot2Fill} boxSize={5} />
                <Text fontWeight="bold">AI Assistant</Text>
              </Flex>
            </Box>

            <VStack
              ref={chatHistoryRef}
              flex={1}
              w="full"
              overflowY="auto"
              p={4}
              spacing={4}
              alignItems="stretch"
            >
              {messages.map((message, index) => (
                <Flex
                  key={index}
                  justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
                >
                  <Box
                    maxW="70%"
                    bg={message.role === 'user' ? 'blue.500' : 'gray.100'}
                    color={message.role === 'user' ? 'white' : 'black'}
                    p={3}
                    borderRadius="lg"
                  >
                    <Text>{message.content}</Text>
                  </Box>
                </Flex>
              ))}
            </VStack>

            <Box
              p={4}
              borderTop="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              width="full"
            >
              <Flex gap={2}>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                />
                <Button
                  colorScheme="blue"
                  onClick={sendMessage}
                  isLoading={isLoading}
                >
                  Send
                </Button>
              </Flex>
            </Box>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default AIChat;