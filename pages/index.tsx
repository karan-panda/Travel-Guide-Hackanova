import { Box, Button, Container, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Navbar from '../components/Navbar'
import Map from '../components/Map';
import { useEffect, useState } from 'react';
import { Icon } from '@chakra-ui/react';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';  
import { ArrowForwardIcon } from '@chakra-ui/icons';



import { useRouter } from 'next/router';

// const DEFAULT_CENTER = [21.6983,
//   79.9585]
interface HomeProps {
  sendMessage: (message: string) => Promise<void>;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  isLoading: boolean;
}

const Home: NextPage = () => {
  const [geoLocation, setGeoLocation] = useState<any>(null)
  const router = useRouter()
  useEffect(() => {
      navigator.geolocation.getCurrentPosition(function (position) {
          console.log("Latitude is :", position.coords.latitude);
          console.log("Longitude is :", position.coords.longitude);
          setGeoLocation([position.coords.latitude, position.coords.longitude])
          // console.log("geoLocation: ", geoLocation)
      });
  }, [])
  return (
    <Box>
      <Navbar />

      <Box zIndex="base" position={"fixed"} >
      {geoLocation && <Map className="homeMap" center={[geoLocation[0], geoLocation[1]]} zoom={12} ><></></Map>}
              {/* <Map /> */}
      </Box >
      <Box bottom="5" left="5"  width="auto" display={"flex"} flexDir="column" zIndex="docked" position={"fixed"} >
      <div style={{
  position: 'fixed',
  bottom: '2rem',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 10,
 
  width: '100%',
  maxWidth: '300px',
  
  margin: '0 auto',
  textAlign: 'center',
  backdropFilter: 'blur(4px)',
  // backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderRadius: '40px',
  padding: '1rem',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
}}>
  <Button 
    onClick={() => router.push("/Sos")}
    colorScheme="green"
    variant="solid"
    size="lg"
    leftIcon={<Icon as={FaHome as React.ElementType } />}
    _hover={{ 
      transform: 'scale(1.05)',
      boxShadow: 'lg'
    }}
    transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
    px={8}
    py={6}
    borderRadius="full"
    fontWeight="semibold"
  >
    Safety Precautions
  </Button>
</div>
        <Button onClick={() => router.push("/reportIncident")}  bg={"blackAlpha.800"} color="white" my="5" >Report Incident</Button>
        {/* <Button onClick={() => router.push("/Sos")}  bg={"whiteAlpha.800"} >SoS Emergency</Button> */}
        <Button
  onClick={() => router.push("/Planner")}
  bgGradient="linear(to-r, blue.600, cyan.600)"
  _hover={{
    bgGradient: "linear(to-r, blue.700, cyan.700)",
    transform: "translateY(-2px)",
    boxShadow: "md"
  }}
  _active={{
    bgGradient: "linear(to-r, blue.800, cyan.800)",
    transform: "translateY(0)"
  }}
  color="white"
  fontWeight="semibold"
  px={8}
  py={5}
  rounded="lg"
  transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
  letterSpacing="wide"
  fontSize="lg"
  rightIcon={<ArrowForwardIcon />}
>
  Travel Planner
</Button>
             </Box>
      
    </Box>
  )
}

export default Home
