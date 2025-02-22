import { Box, Grid, Heading, Icon, Text, VStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import { useState } from 'react'
import { 
    FaFire, 
    FaAmbulance, 
    FaCarCrash, 
    FaRunning, 
    FaUsers, 
    FaQuestionCircle, 
    FaWater, 
    FaSkull, 
    FaExclamationTriangle, 
    FaBolt,
    FaGlobe // Using this instead of MdEarthquake
} from 'react-icons/fa'

interface EmergencyInfo {
    title: string
    icon: IconType,
    color: string
    instructions: string[]
    emergencyNumbers: string[]
    immediateActions: string[]
}

const emergencyData: EmergencyInfo[] = [
    {
        title: "Fire Emergency",
        icon: FaFire,
        color: "red.500",
        instructions: [
            "Cover your nose and mouth with a wet cloth",
            "Stay low to the ground where air is clearer",
            "Check doors for heat before opening",
            "Close doors behind you to slow fire spread",
            "Stop, drop, and roll if clothes catch fire",
            "Never use elevators during a fire",
            "Meet at designated assembly point",
            "Help others if safe to do so"
        ],
        emergencyNumbers: [
            "Fire Department: 101",
            "Emergency Services: 112"
        ],
        immediateActions: [
            "Evacuate immediately",
            "Alert others in the building",
            "Call emergency services",
            "Don't go back inside",
            "Follow evacuation plan"
        ]
    },
    {
        title: "Medical Emergency",
        icon: FaAmbulance,
        color: "green.500",
        instructions: [
            "Check for breathing and consciousness",
            "If unconscious, place in recovery position",
            "Apply direct pressure to stop bleeding",
            "Do not move the person unless in immediate danger",
            "Keep the person warm and comfortable",
            "Monitor vital signs until help arrives",
            "Collect information about medications",
            "Document time of incidents/symptoms"
        ],
        emergencyNumbers: [
            "Ambulance: 102",
            "Emergency Services: 112",
            "Poison Control: 1066"
        ],
        immediateActions: [
            "Call emergency services immediately",
            "Check ABC (Airway, Breathing, Circulation)",
            "Clear the area to give space",
            "Locate nearest first aid kit",
            "Find someone with medical training"
        ]
    },
    {
        title: "Road Accident",
        icon: FaCarCrash,
        color: "yellow.500",
        instructions: [
            "Secure the accident scene with hazard lights/triangles",
            "Check for injuries and provide first aid",
            "Document the scene with photos",
            "Exchange information with other parties",
            "Don't leave the scene until authorized",
            "Collect witness information if possible"
        ],
        emergencyNumbers: [
            "Police: 100",
            "Ambulance: 102",
            "Traffic Police: 103"
        ],
        immediateActions: [
            "Move to a safe location if possible",
            "Call emergency services",
            "Turn on hazard lights",
            "Check for injuries",
            "Prevent secondary accidents"
        ]
    },
    {
        title: "Robbery/Assault",
        icon: FaRunning,
        color: "purple.500",
        instructions: [
            "Stay calm and don't resist",
            "Observe physical details of perpetrator",
            "Note direction of escape",
            "Preserve evidence - don't touch anything",
            "Lock doors after incident",
            "Write down everything you remember"
        ],
        emergencyNumbers: [
            "Police: 100",
            "Emergency Services: 112",
            "Women Helpline: 1091"
        ],
        immediateActions: [
            "Get to a safe location",
            "Call police immediately",
            "Alert nearby security",
            "Document incident details",
            "Seek medical attention if needed"
        ]
    },
    {
        title: "Mob Violence",
        icon: FaUsers,
        color: "orange.500",
        instructions: [
            "Stay away from windows and doors",
            "Lock all entrances",
            "Stay in a safe room",
            "Keep emergency contacts ready",
            "Monitor news and official announcements",
            "Have escape route planned"
        ],
        emergencyNumbers: [
            "Police: 100",
            "Emergency Services: 112",
            "Local Authority: 108"
        ],
        immediateActions: [
            "Move inside immediately",
            "Lock and secure premises",
            "Contact authorities",
            "Stay away from conflict areas",
            "Follow official instructions"
        ]
    },
    {
        title: "Flood Emergency",
        icon: FaWater,
        color: "blue.500",
        instructions: [
            "Move to higher ground immediately",
            "Avoid walking through flowing water",
            "Don't drive through flooded areas",
            "Keep emergency supplies ready",
            "Listen to weather updates",
            "Turn off utilities if instructed"
        ],
        emergencyNumbers: [
            "Disaster Management: 108",
            "Emergency Services: 112",
            "Coast Guard: 1554"
        ],
        immediateActions: [
            "Evacuate to safe location",
            "Grab emergency kit",
            "Follow evacuation routes",
            "Help elderly and children",
            "Stay informed via radio/TV"
        ]
    },
    {
        title: "Earthquake",
        icon: FaGlobe, // Changed from MdEarthquake
        color: "brown.500",
        instructions: [
            "Drop, Cover, and Hold On",
            "Stay away from windows and exterior walls",
            "If inside, stay inside",
            "If outside, move to open area",
            "Be prepared for aftershocks",
            "Check for structural damage"
        ],
        emergencyNumbers: [
            "Disaster Management: 108",
            "Emergency Services: 112",
            "Fire Service: 101"
        ],
        immediateActions: [
            "Take immediate cover",
            "Protect head and neck",
            "Move away from buildings",
            "Check for injuries",
            "Listen for official instructions"
        ]
    },
    {
        title: "Poisoning",
        icon: FaSkull,
        color: "pink.500",
        instructions: [
            "Identify the poison if possible",
            "Keep poison container for medical team",
            "Do not induce vomiting unless instructed",
            "Save any vomit for analysis",
            "Remove contaminated clothing",
            "Flush skin with water if contact poison"
        ],
        emergencyNumbers: [
            "Poison Control: 1066",
            "Ambulance: 102",
            "Emergency Services: 112"
        ],
        immediateActions: [
            "Call poison control immediately",
            "Follow their instructions exactly",
            "Keep victim comfortable",
            "Monitor breathing",
            "Collect poison information"
        ]
    },
    {
        title: "Electric Shock",
        icon: FaBolt,
        color: "yellow.300",
        instructions: [
            "Don't touch the person if still in contact with power",
            "Turn off power source if possible",
            "Check for breathing and pulse",
            "Begin CPR if necessary",
            "Cool any burns with clean water",
            "Keep victim warm"
        ],
        emergencyNumbers: [
            "Ambulance: 102",
            "Emergency Services: 112",
            "Electricity Board: 1912"
        ],
        immediateActions: [
            "Ensure scene is safe",
            "Cut power if possible",
            "Call emergency services",
            "Check vital signs",
            "Provide first aid"
        ]
    },
    {
        title: "Gas Leak",
        icon: FaExclamationTriangle,
        color: "red.300",
        instructions: [
            "Open all doors and windows",
            "Don't switch on/off any electrical devices",
            "Don't use phones near leak",
            "Evacuate the area immediately",
            "Don't light matches or lighters",
            "Check on elderly neighbors"
        ],
        emergencyNumbers: [
            "Gas Emergency: 1906",
            "Fire Service: 101",
            "Emergency Services: 112"
        ],
        immediateActions: [
            "Evacuate immediately",
            "Don't use electrical switches",
            "Call emergency services",
            "Alert neighbors",
            "Move to safe distance"
        ]
    }
]

const Sos = () => {
    const [selectedEmergency, setSelectedEmergency] = useState<EmergencyInfo | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleEmergencyClick = (emergency: EmergencyInfo) => {
        setSelectedEmergency(emergency)
        onOpen()
    }

    return (
        <Box minH="100vh" bg="gray.900">
            <Navbar />
            
            <Box 
                pt="20vh" 
                px={4}
                maxW="1200px" 
                mx="auto"
            >
                <VStack spacing={8} align="stretch">
                    <Box textAlign="center" mb={8}>
                        <Heading 
                            size="2xl" 
                            color="red.500"
                            bgGradient="linear(to-r, red.500, orange.500)"
                            bgClip="text"
                            mb={4}
                        >
                            Emergency SOS
                        </Heading>
                        <Text color="whiteAlpha.800" fontSize="lg">
                            Select the type of emergency for immediate guidance
                        </Text>
                    </Box>

                    <Grid 
                        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
                        gap={6}
                    >
                        {emergencyData.map((emergency, index) => (
                            <Box
                                key={index}
                                bg="whiteAlpha.100"
                                p={6}
                                borderRadius="xl"
                                cursor="pointer"
                                position="relative"
                                transition="all 0.3s"
                                _hover={{
                                    transform: "translateY(-5px)",
                                    bg: "whiteAlpha.200"
                                }}
                                onClick={() => handleEmergencyClick(emergency)}
                            >
                                <VStack spacing={4}>
                                    <Icon 
                                        as={emergency.icon} 
                                        w={12} 
                                        h={12} 
                                        color={emergency.color}
                                    />
                                    <Heading size="md" color="white">
                                        {emergency.title}
                                    </Heading>
                                    <Icon 
                                        as={FaQuestionCircle as React.ElementType}
                                        position="absolute"
                                        top={2}
                                        right={2}
                                        color="whiteAlpha.600"
                                    />
                                </VStack>
                            </Box>
                        ))}
                    </Grid>
                </VStack>
            </Box>

            {/* Emergency Information Modal */}
            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay backdropFilter="blur(10px)" />
                <ModalContent bg="gray.900" color="white">
                    <ModalHeader 
                        borderBottom="1px solid" 
                        borderColor="whiteAlpha.200"
                        display="flex"
                        alignItems="center"
                        gap={3}
                    >
                        {selectedEmergency && (
                            <>
                                <Icon 
                                    as={selectedEmergency.icon} 
                                    color={selectedEmergency.color}
                                    w={6}
                                    h={6}
                                />
                                {selectedEmergency.title}
                            </>
                        )}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody py={6}>
                        {selectedEmergency && (
                            <VStack spacing={6} align="stretch">
                                <Box>
                                    <Heading size="sm" color="red.400" mb={3}>
                                        Immediate Actions
                                    </Heading>
                                    <VStack align="stretch" spacing={2}>
                                        {selectedEmergency.immediateActions.map((action, index) => (
                                            <Text 
                                                key={index}
                                                bg="whiteAlpha.100"
                                                p={3}
                                                borderRadius="md"
                                            >
                                                {action}
                                            </Text>
                                        ))}
                                    </VStack>
                                </Box>

                                <Box>
                                    <Heading size="sm" color="orange.400" mb={3}>
                                        Emergency Numbers
                                    </Heading>
                                    <VStack align="stretch" spacing={2}>
                                        {selectedEmergency.emergencyNumbers.map((number, index) => (
                                            <Text 
                                                key={index}
                                                fontSize="lg"
                                                fontWeight="bold"
                                            >
                                                {number}
                                            </Text>
                                        ))}
                                    </VStack>
                                </Box>

                                <Box>
                                    <Heading size="sm" color="blue.400" mb={3}>
                                        Detailed Instructions
                                    </Heading>
                                    <VStack align="stretch" spacing={2}>
                                        {selectedEmergency.instructions.map((instruction, index) => (
                                            <Text 
                                                key={index}
                                                bg="whiteAlpha.50"
                                                p={3}
                                                borderRadius="md"
                                            >
                                                {instruction}
                                            </Text>
                                        ))}
                                    </VStack>
                                </Box>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Sos