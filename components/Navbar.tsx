import { 
    Box, 
    Button, 
    Heading, 
    Text, 
    useDisclosure, 
    IconButton,
    VStack,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Badge,
    Divider
} from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'
import { FaBell, FaThermometerHalf, FaWind, FaCloudRain, FaExclamationTriangle } from 'react-icons/fa'
import Link from "next/link"
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useRef } from 'react'

// Types for weather data
interface WeatherData {
    temperature: number;
    windSpeed: number;
    humidity: number;
    alerts: string[];
    isSafe: boolean;
}

interface SafetyStatus {
    color: string;
    text: string;
    description: string;
}

const Navbar: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    // Mock weather data - replace with actual data fetching
    const weatherData: WeatherData = {
        temperature: 32.5,
        windSpeed: 12.3,
        humidity: 65,
        alerts: ["Heavy rainfall expected"],
        isSafe: false
    }

    const safetyStatus: SafetyStatus = {
        color: weatherData.isSafe ? "green" : "red",
        text: weatherData.isSafe ? "Safe Conditions" : "Exercise Caution",
        description: weatherData.isSafe 
            ? "Current conditions are safe for outdoor activities."
            : "Weather conditions may pose risks. Stay alert and follow safety guidelines."
    }

    const handleCommunity = () => {
        router.push('/community')
    }

    return (
        <>
            {/* Main Navbar */}
            <Box 
                px={8} 
                py={4} 
                zIndex={1000}
                w="full"
                bg="rgba(0, 0, 0, 0.8)"
                backdropFilter="blur(10px)"
                display="flex"
                position="fixed"
                top={0}
                left={0}
                alignItems="center"
                justifyContent="space-between"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
            >
                <Box>
                    <Link href="/" passHref>
                        <Heading 
                            as="a"
                            fontSize="24px" 
                            color="white"
                            bgGradient="linear(to-r, teal.500, blue.500)"
                            bgClip="text"
                            _hover={{ 
                                transform: "scale(1.05)",
                                transition: "all 0.3s ease"
                            }}
                            cursor="pointer"
                        >
                            मार्गdarshak
                        </Heading>
                    </Link>
                </Box>

                <Box display="flex" alignItems="center" gap={4}>
                    <Popover placement="bottom-end">
                        <PopoverTrigger>
                            <IconButton
                                aria-label="Weather and Safety Info"
                                icon={<FaBell />}
                                variant="ghost"
                                color="white"
                                _hover={{ bg: "whiteAlpha.200" }}
                                size="lg"
                                animation={weatherData.isSafe ? undefined : "pulse 2s infinite"}
                                sx={{
                                    '@keyframes pulse': {
                                        '0%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0.4)' },
                                        '70%': { boxShadow: '0 0 0 10px rgba(229, 62, 62, 0)' },
                                        '100%': { boxShadow: '0 0 0 0 rgba(229, 62, 62, 0)' }
                                    }
                                }}
                            />
                        </PopoverTrigger>
                        <PopoverContent bg="rgba(0, 0, 0, 0.95)" border="1px solid" borderColor="whiteAlpha.200" width="300px">
                            <PopoverArrow bg="rgba(0, 0, 0, 0.95)" />
                            <PopoverCloseButton color="white" />
                            <PopoverHeader borderBottom="1px solid" borderColor="whiteAlpha.200" color="white">
                                Kandivali Weather & Safety Status
                            </PopoverHeader>
                            <PopoverBody color="white">
                                <VStack align="stretch" spacing={3} p={2}>
                                    <Badge colorScheme={safetyStatus.color} p={2} fontSize="md" textAlign="center">
                                        {safetyStatus.text}
                                    </Badge>
                                    
                                    <Text fontSize="sm" color="whiteAlpha.800">
                                        {safetyStatus.description}
                                    </Text>

                                    <Divider />

                                    <Box>
                                        <Text fontSize="sm" mb={2} fontWeight="bold" color="whiteAlpha.900">
                                            Current Conditions:
                                        </Text>
                                        <VStack align="stretch" spacing={2}>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaThermometerHalf />
                                                <Text fontSize="sm">{weatherData.temperature.toFixed(1)}°C</Text>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaWind />
                                                <Text fontSize="sm">{weatherData.windSpeed.toFixed(1)} km/h</Text>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={2}>
                                                <FaCloudRain />
                                                <Text fontSize="sm">Humidity: {weatherData.humidity.toFixed(0)}%</Text>
                                            </Box>
                                        </VStack>
                                    </Box>

                                    <Divider />

                                    {weatherData.alerts.length > 0 && (
                                        <Box>
                                            <Text fontSize="sm" mb={2} fontWeight="bold" color="whiteAlpha.900">
                                                Active Alerts:
                                            </Text>
                                            {weatherData.alerts.map((alert, index) => (
                                                <Box key={index} display="flex" alignItems="center" gap={2} color="yellow.400">
                                                    <FaExclamationTriangle />
                                                    <Text fontSize="sm">{alert}</Text>
                                                </Box>
                                            ))}
                                        </Box>
                                    )}
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>

                    <IconButton
                        aria-label="Menu"
                        icon={<HamburgerIcon />}
                        onClick={onOpen}
                        ref={btnRef}
                        variant="ghost"
                        color="white"
                        _hover={{ bg: "whiteAlpha.200" }}
                        size="lg"
                    />
                </Box>
            </Box>

            {/* Drawer */}
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent 
                    bg="rgba(0, 0, 0, 0.95)"
                    color="white"
                >
                    <DrawerCloseButton 
                        color="white"
                        size="lg"
                        _hover={{ bg: "whiteAlpha.200" }}
                    />
                    <DrawerHeader
                        borderBottom="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        <Heading
                            bgGradient="linear(to-r, teal.500, blue.500)"
                            bgClip="text"
                            fontSize="2xl"
                        >
                            मार्गdarshak
                        </Heading>
                    </DrawerHeader>

                    <DrawerBody>
                        <VStack w="full" spacing={4} mt={4}>
                            {[
                                { text: "Home", path: "/" },
                                { text: "Profile", path: "/profile" },
                                { text: "ApdaMitra", path: "/Sos" },
                                { text: "Report Incident", path: "/reportIncident" },
                                { text: "Community", onClick: handleCommunity },
                                { text: "Explore Safe spot", path: "/safespot" },
                                { text: "Ready to Help", path: "/announcement" }
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    w="full"
                                    p={4}
                                    cursor="pointer"
                                    borderRadius="md"
                                    transition="all 0.3s ease"
                                    _hover={{
                                        bg: "whiteAlpha.200",
                                        transform: "translateX(10px)"
                                    }}
                                    onClick={() => item.onClick ? item.onClick() : router.push(item.path)}
                                >
                                    <Text fontSize="18px">{item.text}</Text>
                                </Box>
                            ))}
                        </VStack>
                    </DrawerBody>

                    <DrawerFooter
                        borderTop="1px solid"
                        borderColor="whiteAlpha.200"
                    >
                        <Button 
                            w="full"
                            bgGradient="linear(to-r, teal.500, blue.500)"
                            color="white"
                            _hover={{
                                bgGradient: "linear(to-r, teal.600, blue.600)",
                                transform: "translateY(-2px)"
                            }}
                            transition="all 0.3s ease"
                            fontSize="18px"
                            onClick={() => router.push('/')}
                        >
                            Home
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Navbar