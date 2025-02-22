import { Box, Button, Heading, Text, useDisclosure, VStack, IconButton } from "@chakra-ui/react"
import { HamburgerIcon } from '@chakra-ui/icons'
import Link from "next/link"
import { Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, DrawerCloseButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useRef } from 'react'

const Navbar: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef<HTMLButtonElement>(null)
    const router = useRouter()

    const handleCommunity = () => {
        router.push('/community')
    }
    const handleHome = () => {
        router.push('/') // Goes to landing page
      }
    
      const handleDashboard = () => {
        router.push('/dashboard') // Goes to map/dashboard
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