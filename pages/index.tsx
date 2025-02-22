import { Box, Button, Container, Text } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Navbar from '../components/Navbar'
import Map from '../components/Map';
import { useEffect, useState } from 'react';
import { Icon } from '@chakra-ui/react';
import { FaHome, FaMapMarkerAlt } from 'react-icons/fa';  


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
        <Button 
  onClick={() => router.push("/Sos")} 
  colorScheme="green"  // Changed from bg to colorScheme
  variant="solid"      // Added variant for better styling
  size="lg"           // Optional: for larger button
  leftIcon={<Icon as={FaHome as React.ElementType} />}  // Optional: adds home icon
  _hover={{ bg: "green.500" }}    // Optional: darker green on hover
>
  Safe Spot
</Button> 
        <Button onClick={() => router.push("/reportIncident")}  bg={"blackAlpha.800"} color="white" my="5" >Report Incident</Button>
        <Button onClick={() => router.push("/Sos")}  bg={"whiteAlpha.800"} >SoS Emergency</Button>
             </Box>
      
    </Box>
  )
}

export default Home
