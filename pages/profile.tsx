import type { NextPage } from 'next';
import Navbar from '../components/Navbar';
import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  useDisclosure,
  useToast,
  VStack,
  Container,
  Flex,
  Avatar,
  Badge,
  SimpleGrid,
  Icon,
  Divider,
  Card,
  CardBody,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { doc, updateDoc, getDoc } from '@firebase/firestore';
import LoginModal from '../components/LoginModal';
import { onAuthStateChanged } from 'firebase/auth';
import { FaMedal, FaStar, FaTrophy, FaUserShield } from 'react-icons/fa';

const Home: NextPage = () => {
  // ... existing state and functions ...
const [name, setname] = useState<string>()
    const [age, setage] = useState<number>()
    const [gender, setgender] = useState<string>()
    const [number1, setnumber1] = useState<string>()
    const [number2, setnumber2] = useState<string>()
    const [number3, setnumber3] = useState<string>()
    const toast = useToast()
    const [loading, setloading] = useState(false)
    const { isOpen: isOpenmodal, onOpen: onOpenmodal, onClose: onClosemodal } = useDisclosure()
    const [userData, setUserData] = useState<any>()
    const [credits, setcredits] = useState<number>(0)
    // useEffect(() => {
    //     if (!auth.currentUser) onOpenmodal()
    // }, [])
    // const toast = useToast()
    const loadvalues = async () => {
        if (auth.currentUser) {
            const uid = auth.currentUser!.uid

            const docRef = doc(firestore, "users", uid);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data())
            setUserData(docSnap.data())

        }

    }

    useEffect(() => {
        if (!!userData) {
            setname(userData["name"] as string)
            setage(userData["age"] as number)
            setgender(userData["gender"] as string)
            setnumber1(userData["number1"] as string)
            setnumber2(userData["number2"] as string)
            setnumber3(userData["number3"] as string)
            setcredits(userData["credits"])
        }
    }, [userData])

    useEffect(() => {
        // if (auth.currentUser) {
        //     loadvalues()
        // }        
        onAuthStateChanged(auth, user => {
            if (user) loadvalues()
        })
    }, [])

    const handleClick = async () => {

        if (userData) {

            setloading(true)

            try {
                const uid = auth.currentUser!.uid
                const docRef = doc(firestore, "users", uid?.toString());

                let data: any = {}

                if(name) data.name = name
                if(age) data.age = age
                if(number1) data.number1 = "+91"+number1 
                if(number2) data.number2 = "+91"+number2 
                if(number3) data.number3 = "+91"+number3 


                updateDoc(docRef, data)
                    .then(docRef => {
                        console.log("done")
                        toast({
                            title: "Profile updated",
                            status: 'success',
                            duration: 6000,
                            isClosable: true,
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })




            } catch (err) {
                console.log(err)
            }
        } else {
            onOpenmodal()
            toast({
                title: "Sign in to continue",
                description: "profile is for signed in users only",
                status: 'error',
                duration: 6000,
                isClosable: true,
            })
        }

        setloading(false)
    }

  // Hardcoded badges data
  const badges = [
    { id: 1, name: "First Responder", icon: FaUserShield, color: "red.500", description: "Helped in 5 emergencies" },
    { id: 2, name: "Community Hero", icon: FaTrophy, color: "yellow.500", description: "Top contributor" },
    { id: 3, name: "Safety Expert", icon: FaMedal, color: "blue.500", description: "Completed safety training" },
    { id: 4, name: "Guardian Angel", icon: FaStar, color: "purple.500", description: "Saved a life" },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <LoginModal isOpen={isOpenmodal} onClose={onClosemodal} onOpen={onOpenmodal} />
      <Navbar />
      
      <Container maxW="container.xl" py={8} mt="10vh">
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Left Column - Profile Info */}
          <VStack spacing={6} align="stretch">
            <Flex
              bg="white"
              p={6}
              borderRadius="xl"
              boxShadow="base"
              direction="column"
              align="center"
            >
              <Avatar
                size="2xl"
                name={name || "User"}
                src={auth.currentUser?.photoURL || ""}
                mb={4}
              />
              <Text fontSize="2xl" fontWeight="bold">{name || "Your Name"}</Text>
              <HStack spacing={2} mt={2}>
                <Badge colorScheme="green">Active</Badge>
                <Badge colorScheme="blue">Verified</Badge>
              </HStack>
            </Flex>

            {/* Credits and Level Section */}
            <SimpleGrid columns={2} spacing={4}>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Credits</StatLabel>
                    <StatNumber>{credits || 0}</StatNumber>
                    <StatHelpText>Safety Points</StatHelpText>
                  </Stat>
                  <Progress value={credits ? (credits % 100) : 0} colorScheme="green" mt={2} />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <Stat>
                    <StatLabel>Level</StatLabel>
                    <StatNumber>{Math.floor((credits || 0) / 100) + 1}</StatNumber>
                    <StatHelpText>Community Status</StatHelpText>
                  </Stat>
                  <Progress value={(credits || 0) % 100} colorScheme="blue" mt={2} />
                </CardBody>
              </Card>
            </SimpleGrid>

            {/* Badges Section */}
            <Box bg="white" p={6} borderRadius="xl" boxShadow="base">
              <Text fontSize="xl" fontWeight="bold" mb={4}>Achievements</Text>
              <SimpleGrid columns={2} spacing={4}>
                {badges.map((badge) => (
                  <Flex
                    key={badge.id}
                    bg="gray.50"
                    p={4}
                    borderRadius="lg"
                    align="center"
                    gap={3}
                  >
                    <Icon as={badge.icon as React.ElementType} boxSize={8} color={badge.color} />
                    <Box>
                      <Text fontWeight="bold">{badge.name}</Text>
                      <Text fontSize="sm" color="gray.600">{badge.description}</Text>
                    </Box>
                  </Flex>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>

          {/* Right Column - Form */}
          <Box bg="white" p={6} borderRadius="xl" boxShadow="base">
            <Text fontSize="2xl" fontWeight="bold" mb={6}>Personal Information</Text>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontWeight="medium">Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                  placeholder="Enter name"
                  size="lg"
                  bg="gray.50"
                  border="2px solid"
                  borderColor="gray.200"
                  _focus={{ borderColor: "blue.500", boxShadow: "none" }}
                />
              </FormControl>

              <HStack w="full" spacing={4}>
                <FormControl>
                  <FormLabel fontWeight="medium">Age</FormLabel>
                  <Input
                    value={age}
                    onChange={(e) => setage(e.target.value as unknown as number)}
                    placeholder="Enter age"
                    type="number"
                    size="lg"
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontWeight="medium">Gender</FormLabel>
                  <Select
                    value={gender}
                    onChange={(e) => setgender(e.target.value)}
                    placeholder="Select gender"
                    size="lg"
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </Select>
                </FormControl>
              </HStack>

              <Divider my={2} />
              <Text fontSize="xl" fontWeight="bold" alignSelf="start">Emergency Contacts</Text>

              {[
                { label: "Primary Contact", value: number1, setter: setnumber1 },
                { label: "Secondary Contact", value: number2, setter: setnumber2 },
                { label: "Tertiary Contact", value: number3, setter: setnumber3 },
              ].map((contact, index) => (
                <FormControl key={index}>
                  <FormLabel fontWeight="medium">{contact.label}</FormLabel>
                  <Input
                    value={contact.value}
                    onChange={(e) => contact.setter(e.target.value)}
                    placeholder={`Enter contact number`}
                    size="lg"
                    bg="gray.50"
                    border="2px solid"
                    borderColor="gray.200"
                  />
                </FormControl>
              ))}

              <Button
                isLoading={loading}
                onClick={handleClick}
                colorScheme="blue"
                size="lg"
                w="full"
                mt={4}
              >
                Update Profile
              </Button>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default Home;