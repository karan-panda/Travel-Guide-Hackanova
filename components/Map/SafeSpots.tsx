import { safeHouse } from "./SafeHouse"
import { Marker, Popup } from 'react-leaflet';
import { Box, Button, Text } from "@chakra-ui/react";
import {PhoneIcon} from "@chakra-ui/icons"


const SafeSpots: React.FC = () => {

    return (
        <>

        {
            data.map(d => (
<Marker key={d.UID} icon={safeHouse} position={[d.Lattitude, d.Longitude]}>
                <Popup>
                <Box>
                    <Text fontSize={"lg"} as="b" >{d.Name}</Text> <br />
                    <Text fontSize={"md"} as="i" >{d.Type}</Text>
                    <Text fontSize={"sm"} >{d.Address}
                    <br />
                    {d.POC}
                    <br />
                    {d.Contact}
                    </Text>
                    <a href={`https://www.google.com/maps/dir/?api=1&origin=48.819141912303,2.2297863639837&destination=${d.Lattitude},${d.Longitude}`} > <Button size={"sm"} >Go Here</Button> </a>
                    <a href={`tel:${d.Contact}`}> 
                    <Button size="sm" >
                        <PhoneIcon />
                    </Button>
                    </a>
                </Box>
                </Popup>
              </Marker>
            )) 
        }

        
        </>
    )
}

export default SafeSpots

const data = [
  // ... Keep other states' entries as they are ...
  
  // Maharashtra NGOs (updated entries)
  {
    "UID": "S105",
    "Name": "Pratham Mumbai Education Initiative",
    "Type": "Education & Disaster Relief",
    "Address": "Y.B. Chavan Centre, Gen. J. Bhosale Marg, Nariman Point, Mumbai 400021",
    "POC": "Ms. Farida Lambay",
    "Contact": 9876543210,
    "State/UT": "Maharashtra",
    "City": "Mumbai",
    "Lattitude": 18.9260,
    "Longitude": 72.8222,
    "": "",
    "__1": ""
  },
  {
    "UID": "S112",
    "Name": "Akanksha Foundation",
    "Type": "Education & Community Development",
    "Address": "Shanti Nagar, Mankhurd, Mumbai 400088",
    "POC": "Mr. Saurabh Taneja",
    "Contact": 9876543211,
    "State/UT": "Maharashtra",
    "City": "Mumbai",
    "Lattitude": 19.0502,
    "Longitude": 72.9306,
    "": "",
    "__1": ""
  },
  {
    "UID": "M116",
    "Name": "Teach For India",
    "Type": "Education Equity",
    "Address": "Mantri Commercial, Pune 411038",
    "POC": "Ms. Shaheen Mistri",
    "Contact": 9876543212,
    "State/UT": "Maharashtra",
    "City": "Pune",
    "Lattitude": 18.5626,
    "Longitude": 73.8087,
    "": "",
    "__1": ""
  },
  {
    "UID": "M117",
    "Name": "Sahyadri Hospital Foundation",
    "Type": "Healthcare Relief",
    "Address": "Kothrud, Pune 411029",
    "POC": "Dr. Abhay Mahajan",
    "Contact": 9876543213,
    "State/UT": "Maharashtra",
    "City": "Pune",
    "Lattitude": 18.5082,
    "Longitude": 73.8140,
    "": "",
    "__1": ""
  },
  {
    "UID": "M118",
    "Name": "Vanarai Trust",
    "Type": "Environmental Relief",
    "Address": "Shivaji Nagar, Nagpur 440010",
    "POC": "Mr. Popatrao Pawar",
    "Contact": 9876543214,
    "State/UT": "Maharashtra",
    "City": "Nagpur",
    "Lattitude": 21.1458,
    "Longitude": 79.0882,
    "": "",
    "__1": ""
  },
  {
  "UID": "M119",
  "Name": "Magic Bus India Foundation",
  "Type": "Youth Development",
  "Address": "801, 8th Floor, Hubtown Solaris, Andheri East, Mumbai 400069",
  "POC": "Ms. Shweta Mukesh",
  "Contact": 9876543215,
  "State/UT": "Maharashtra",
  "City": "Mumbai",
  "Lattitude": 19.1175,
  "Longitude": 72.8568,
  "": "",
  "__1": ""
},
{
  "UID": "M120",
  "Name": "Shivaji Nagar Slum Rehabilitation Trust",
  "Type": "Urban Poverty",
  "Address": "Ghatkopar West, Mumbai 400086",
  "POC": "Mr. Rajesh Patil",
  "Contact": 9876543216,
  "State/UT": "Maharashtra",
  "City": "Mumbai",
  "Lattitude": 19.0854,
  "Longitude": 72.9136,
  "": "",
  "__1": ""
},
{
  "UID": "M121",
  "Name": "Green Thumb Environmental Group",
  "Type": "Ecological Conservation",
  "Address": "Survey No. 44, Hinjewadi, Pune 411057",
  "POC": "Dr. Anjali Deshpande",
  "Contact": 9876543217,
  "State/UT": "Maharashtra",
  "City": "Pune",
  "Lattitude": 18.5924,
  "Longitude": 73.7189,
  "": "",
  "__1": ""
},
{
  "UID": "M122",
  "Name": "Women's Empowerment Collective",
  "Type": "Gender Equality",
  "Address": "Shop No.5, Laxmi Road, Pune 411030",
  "POC": "Ms. Meera Joshi",
  "Contact": 9876543218,
  "State/UT": "Maharashtra",
  "City": "Pune",
  "Lattitude": 18.5104,
  "Longitude": 73.8567,
  "": "",
  "__1": ""
},
{
  "UID": "M123",
  "Name": "Nagpur Tribal Welfare Society",
  "Type": "Tribal Development",
  "Address": "Ramdaspeth, Nagpur 440010",
  "POC": "Mr. Arjun Wankhede",
  "Contact": 9876543219,
  "State/UT": "Maharashtra",
  "City": "Nagpur",
  "Lattitude": 21.1450,
  "Longitude": 79.0884,
  "": "",
  "__1": ""
},
{
  "UID": "M124",
  "Name": "Mumbai Street Medicine Project",
  "Type": "Healthcare Outreach",
  "Address": "Sion Hospital Campus, Sion East, Mumbai 400022",
  "POC": "Dr. Vikram Salunke",
  "Contact": 9876543220,
  "State/UT": "Maharashtra",
  "City": "Mumbai",
  "Lattitude": 19.0395,
  "Longitude": 72.8607,
  "": "",
  "__1": ""
},
{
  "UID": "M125",
  "Name": "Nashik Farmers Cooperative",
  "Type": "Agricultural Support",
  "Address": "Gangapur Road, Nashik 422013",
  "POC": "Mr. Sanjay Pawar",
  "Contact": 9876543221,
  "State/UT": "Maharashtra",
  "City": "Nashik",
  "Lattitude": 19.9975,
  "Longitude": 73.7898,
  "": "",
  "__1": ""
},
{
  "UID": "M126",
  "Name": "Aurangabad Heritage Preservation Trust",
  "Type": "Cultural Conservation",
  "Address": "Station Road, Aurangabad 431001",
  "POC": "Ms. Fatima Khan",
  "Contact": 9876543222,
  "State/UT": "Maharashtra",
  "City": "Aurangabad",
  "Lattitude": 19.8762,
  "Longitude": 75.3433,
  "": "",
  "__1": ""
},
{
  "UID": "M127",
  "Name": "Thane Disability Support Network",
  "Type": "Special Needs Advocacy",
  "Address": "Vasant Vihar, Thane West 400610",
  "POC": "Mr. Ramesh Iyer",
  "Contact": 9876543223,
  "State/UT": "Maharashtra",
  "City": "Thane",
  "Lattitude": 19.2183,
  "Longitude": 72.9781,
  "": "",
  "__1": ""
},
{
  "UID": "M128",
  "Name": "Konkan Coastal Protection Alliance",
  "Type": "Marine Conservation",
  "Address": "Ratnagiri Port Area, Ratnagiri 415612",
  "POC": "Ms. Priya Malvankar",
  "Contact": 9876543224,
  "State/UT": "Maharashtra",
  "City": "Ratnagiri",
  "Lattitude": 16.9944,
  "Longitude": 73.3000,
  "": "",
  "__1": ""
}
  
  // ... Keep other states' entries unchanged ...
];