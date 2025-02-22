import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Icon,
  useColorModeValue,
  Flex,
  Divider,
  Button,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import { 
  MdWarning, 
  MdNotifications, 
  MdSearch,
  MdLocationOn,
  MdAccessTime,
  MdPriorityHigh,
} from 'react-icons/md';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  description: string;
  type: 'emergency' | 'warning' | 'info';
  location: string;
  date: Date;
  priority: 'high' | 'medium' | 'low';
}

const Announcement: NextPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Severe Flooding Alert',
      description: 'Attention residents of Dhule, heavy flooding is occurring in the area. Please remain in your homes and avoid traveling on flooded roads. If you are in a low-lying area, please move to higher ground. Emergency services are on alert and will provide assistance as needed.',
      type: 'emergency',
      location: 'Dhule City',
      date: new Date(),
      priority: 'high',
    },
    {
      id: '2',
      title: 'Wildfire Evacuation Notice',
      description: 'Attention residents, a wildfire is approaching the area. Please evacuate immediately and follow the designated evacuation routes. Take only essential items with you and leave pets and livestock behind, if necessary. Stay tuned to local news and social media for updates on the fire spread progress.',
      type: 'emergency',
      location: 'Western District',
      date: new Date(),
      priority: 'high',
    },
    {
      id: '3',
      title: 'Earthquake Safety Alert',
      description: 'This is an earthquake alert for the region. Please drop, cover, and hold on until the shaking stops. If you are outside, move away from buildings and other structures. If you are driving, pull over to a safe area and stay inside your vehicle until the shaking stops.',
      type: 'warning',
      location: 'All Districts',
      date: new Date(),
      priority: 'medium',
    },
  ]);

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'red';
      case 'warning':
        return 'orange';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'red.500', count: 3 };
      case 'medium':
        return { color: 'orange.500', count: 2 };
      case 'low':
        return { color: 'green.500', count: 1 };
      default:
        return { color: 'gray.500', count: 1 };
    }
  };

  const filteredAnnouncements = announcements
    .filter(announcement => 
      filter === 'all' || announcement.type === filter
    )
    .filter(announcement =>
      announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Navbar />
      <Container maxW="container.xl" pt="12vh">
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack>
              <Icon as={MdNotifications as React.ElementType} boxSize={8} color="blue.500" />
              <Heading size="lg">Ready to Help</Heading>
            </HStack>
            <HStack spacing={4}>
              <InputGroup maxW="300px">
                <InputLeftElement>
                  <Icon as={MdSearch as React.ElementType} color="gray.500" />
                </InputLeftElement>
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                w="150px"
              >
                <option value="all">All Types</option>
                <option value="emergency">Emergency</option>
                <option value="warning">Warning</option>
                <option value="info">Information</option>
              </Select>
            </HStack>
          </Flex>

          <VStack spacing={4} align="stretch">
            {filteredAnnouncements.map((announcement) => (
              <Box
                key={announcement.id}
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
                position="relative"
                _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
              >
                <HStack spacing={4} mb={4}>
                  <Badge
                    colorScheme={getTypeColor(announcement.type)}
                    fontSize="sm"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {announcement.type.toUpperCase()}
                  </Badge>
                  <HStack spacing={1}>
                    {[...Array(getPriorityIcon(announcement.priority).count)].map((_, i) => (
                      <Icon
                        key={i}
                        as={MdPriorityHigh as React.ElementType}
                        color={getPriorityIcon(announcement.priority).color}
                      />
                    ))}
                  </HStack>
                </HStack>

                <Heading size="md" mb={2}>
                  {announcement.title}
                </Heading>

                <Text color="gray.600" mb={4}>
                  {announcement.description}
                </Text>

                <Divider mb={4} />

                <HStack spacing={6} color="gray.500" fontSize="sm">
                  <HStack>
                  {/* <Icon as={FaShare as React.ElementType} boxSize={4} /> */}
                    <Icon as={MdLocationOn as React.ElementType} boxSize={4} />
                    <Text>{announcement.location}</Text>
                  </HStack>
                  <HStack>
                    <Icon as={MdAccessTime as React.ElementType} boxSize={4} />
                    <Text>{format(announcement.date, 'MMM dd, yyyy HH:mm')}</Text>
                  </HStack>
                </HStack>

                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  position="absolute"
                  top={4}
                  right={4}
                >
                  Read More
                </Button>
              </Box>
            ))}
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export default Announcement;