import type { NextPage } from 'next'
import Navbar from '../components/Navbar'
import { 
    Box, 
    Button, 
    Image, 
    Input, 
    Select, 
    Textarea, 
    VStack, 
    useToast, 
    useDisclosure, 
    Text, 
    Heading,
    Container,
    FormControl,
    FormLabel,
    FormHelperText,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage'
import { auth, firestore, storage } from '../firebase'
import { addDoc, collection, query, where, getDocs, doc, getDoc, updateDoc } from '@firebase/firestore'
import { useRouter } from 'next/router'
import LoginModal from '../components/LoginModal'
import { onAuthStateChanged } from '@firebase/auth'

interface GeoLocation {
    latitude: number;
    longitude: number;
}

const ReportIncident: NextPage = () => {
    const { isOpen: isOpenmodal, onOpen: onOpenmodal, onClose: onClosemodal } = useDisclosure()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const finalRef = useRef(null)
    const toast = useToast()
    const router = useRouter()

    // State management
    const [imgurl, setImgurl] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [submitloading, setSubmitloading] = useState<boolean>(false)
    const [type, setType] = useState<string>("")
    const [description, setDescription] = useState<string>("")
    const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null)
    const hiddenFileInput = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Check authentication status
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                onOpenmodal()
            }
        })

        // Get geolocation
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setGeoLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
                console.error("Error getting location:", error)
                toast({
                    title: "Location Error",
                    description: "Unable to get your location. Please enable location services.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            }
        )
    }, [])

    const handleClick = () => {
        hiddenFileInput.current?.click()
    }

    const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            setLoading(true)
            const fileUploaded = files[0]
            try {
                const imgname = fileUploaded.name + v4()
                const imageref = ref(storage, `reportimages/${imgname}`)
                await uploadBytes(imageref, fileUploaded)
                const link = await getDownloadURL(imageref)
                setImgurl(link)
                toast({
                    title: "Image uploaded successfully",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                })
            } catch (err) {
                console.error(err)
                toast({
                    title: "Error uploading image",
                    description: "Please try again",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            } finally {
                setLoading(false)
            }
        }
    }
    const submithandler = async () => {
        if (!auth.currentUser) {
            toast({
                title: "Sign in required",
                description: "Please sign in to report an incident",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            onOpenmodal()
            return
        }

        if (!type || !description) {
            toast({
                title: 'Missing information',
                description: "Please provide incident type and description",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return
        }

        if (!geoLocation) {
            toast({
                title: 'Location required',
                description: "Please enable location services",
                status: 'error',
                duration: 5000,
                isClosable: true,
            })
            return
        }

        try {
            setSubmitloading(true)
            
            // Add incident report
            const reportData = {
                type,
                description,
                imgurl,
                latitude: geoLocation.latitude,
                longitude: geoLocation.longitude,
                timestamp: new Date(),
                reportedBy: auth.currentUser.uid
            }

            await addDoc(collection(firestore, "reportincident"), reportData)

            // Update user credits
            const userRef = doc(firestore, "users", auth.currentUser.uid)
            const userDoc = await getDoc(userRef)
            const currentCredits = userDoc.exists() ? (userDoc.data()?.credits || 0) : 0
            
            await updateDoc(userRef, {
                credits: currentCredits + 5
            })

            // Show success modal
            onOpen()
            
        } catch (error) {
            console.error("Error submitting report:", error)
            toast({
                title: "Error submitting report",
                description: "Please try again",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        } finally {
            setSubmitloading(false)
        }
    }

    const handleClose = () => {
        router.push("/")
        onClose()
    }

    return (
        <Box minH="100vh" bg="gray.50">
            <LoginModal isOpen={isOpenmodal} onClose={onClosemodal} onOpen={onOpenmodal} />
            <Navbar />
            
            <Container maxW="container.md" py={10}>
                <Box 
                    bg="white" 
                    p={8} 
                    borderRadius="xl" 
                    boxShadow="lg"
                    mt="20"
                >
                    <Heading 
                        size="lg" 
                        mb={8}
                        color="blue.700"
                        textAlign="center"
                    >
                        Report an Incident
                    </Heading>

                    <VStack spacing={6}>
                        <FormControl isRequired>
                            <FormLabel>Incident Type</FormLabel>
                            <Select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                placeholder='Select type of incident'
                                size="lg"
                            >
                                <option value='Fire'>Fire Emergency</option>
                                <option value='Accident'>Accident</option>
                                <option value='Medical Emergency'>Medical Emergency</option>
                                <option value='Crime'>Crime</option>
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Please describe the incident in detail'
                                size='lg'
                                rows={5}
                            />
                            <FormHelperText>
                                Provide as much detail as possible
                            </FormHelperText>
                        </FormControl>

                        <FormControl>
                            <FormLabel>Evidence Image</FormLabel>
                            <Button
                                onClick={handleClick}
                                isLoading={loading}
                                loadingText="Uploading..."
                                w="full"
                                colorScheme="blue"
                                variant="outline"
                                size="lg"
                            >
                                Upload Image
                                <Input 
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChange}
                                    ref={hiddenFileInput}
                                    display="none"
                                />
                            </Button>
                        </FormControl>

                        {imgurl && (
                            <Box w="full">
                                <Image
                                    src={imgurl}
                                    alt="Incident image"
                                    borderRadius="md"
                                    maxH="300px"
                                    mx="auto"
                                />
                            </Box>
                        )}

                        <Button
                            onClick={submithandler}
                            isLoading={submitloading}
                            loadingText="Submitting..."
                            colorScheme="blue"
                            size="lg"
                            w="full"
                        >
                            Submit Report
                        </Button>
                    </VStack>
                </Box>
            </Container>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader bg="green.500" color="white">
                        Report Submitted Successfully
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody py={6}>
                        <VStack spacing={4}>
                            <Heading size="md" color="green.500">
                                You earned 5 credits!
                            </Heading>
                            <Text align="center">
                                Thank you for helping keep our community safe.
                                Your report has been submitted successfully.
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            colorScheme="green" 
                            w="full"
                            onClick={handleClose}
                        >
                            Return to Home
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default ReportIncident