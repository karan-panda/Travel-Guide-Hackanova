import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useToast,
  ModalHeader,
  ModalBody,
  Input,
  ModalFooter,
  Button,
  Box,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@chakra-ui/react';
import { addDoc, collection, doc, getDoc, setDoc } from '@firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';

interface ILogin {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const LoginModal: React.FC<ILogin> = ({ isOpen, onClose }) => {
  const [geoLocation, setGeoLocation] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('Latitude:', position.coords.latitude);
      console.log('Longitude:', position.coords.longitude);
      setGeoLocation([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const uid = user.uid;
        const email = user.email;
        const displayName = user.displayName;
        const photoURL = user.photoURL;

        // Check if user already exists in Firestore
        const userExists = await checkUserExists(uid);

        if (!userExists) {
          // Add user to Firestore if they don't exist
          await setDoc(doc(firestore, 'users', uid), {
            uid,
            email,
            displayName,
            photoURL,
            latitude: geoLocation[0],
            longitude: geoLocation[1],
          });
          console.log('User added to Firestore');
        } else {
          console.log('User already exists in Firestore');
        }

        toast({
          title: 'Login Successful',
          description: `Welcome, ${displayName || 'User'}!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        onClose();
      }
    } catch (error: any) {
      console.error('Error during Google sign-in:', error);
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserExists = async (uid: string) => {
    const userDoc = await getDoc(doc(firestore, 'users', uid));
    return userDoc.exists();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Login with Google</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Sign in with your Google account</FormLabel>
            <FormHelperText>
              We'll use your Google account to authenticate you.
            </FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            isLoading={loading}
            onClick={handleGoogleSignIn}
            leftIcon={<GoogleIcon />} // Add a Google icon if desired
          >
            Sign in with Google
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Example Google icon component (you can use any icon library)
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default LoginModal;