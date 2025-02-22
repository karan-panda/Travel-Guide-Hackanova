import { useEffect, useRef, useState } from "react";
import type { NextPage } from "next";

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Textarea,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { BiPoll, BiBarChart, BiLineChart } from 'react-icons/bi'

import { RiImageLine, RiVideoLine, RiLinkM } from "react-icons/ri";
import { storage, firestore, auth } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { v4 } from "uuid";
import DisplayPosts from "../components/DisplayPosts";
import AIChat from "../components/AIChat";

const Community: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState("");
  const [imgurl, setImgurl] = useState("");
  const [loading, setLoading] = useState(false);
  const [postLoading, setPostLoading] = useState(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const imageRef = ref(storage, `posts/${v4()}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setImgurl(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error uploading image",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!content.trim()) {
      toast({
        title: "Please enter some content",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      setPostLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(firestore, "posts"), {
        content,
        link: imgurl,
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorAvatar: user.photoURL,
        createdAt: Timestamp.now(),
        likes: 0,
        comments: 0,
      });

      setContent("");
      setImgurl("");
      onClose();
      toast({
        title: "Post created successfully",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error creating post",
        status: "error",
        duration: 3000,
      });
    } finally {
      setPostLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: "1fr", lg: "1fr 300px" }} gap={8}>
        <GridItem>
          <VStack spacing={6} align="stretch">
            <Flex
              bg={bgColor}
              p={4}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              align="center"
              gap={4}
            >
              <Button
                flex={1}
                variant="outline"
                leftIcon={<AddIcon />}
                onClick={onOpen}
              >
                Create a post
              </Button>
              <IconButton
                aria-label="Search"
                icon={<Icon as={SearchIcon} boxSize={4} />}
                variant="ghost"
              />
            </Flex>

            <Tabs variant="soft-rounded" colorScheme="blue">
              <TabList>
                <Tab>Recent</Tab>
                <Tab>Popular</Tab>
                <Tab>Following</Tab>
              </TabList>

              <TabPanels>
                <TabPanel px={0}>
                  <DisplayPosts onUpdate={() => {}} />
                </TabPanel>
                <TabPanel px={0}>
                  <DisplayPosts onUpdate={() => {}} />
                </TabPanel>
                <TabPanel px={0}>
                  <DisplayPosts onUpdate={() => {}} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </GridItem>

        <GridItem display={{ base: "none", lg: "block" }}>
          <VStack spacing={6}>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              w="full"
            >
              <Heading size="md" mb={4}>
                Community Guidelines
              </Heading>
              <VStack align="stretch" spacing={3}>
                <Text>1. Be respectful to others</Text>
                <Text>2. No hate speech or bullying</Text>
                <Text>3. No spam or self-promotion</Text>
                <Text>4. Keep it family-friendly</Text>
                <Text>5. Follow our terms of service</Text>
              </VStack>
            </Box>

            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="sm"
              border="1px"
              borderColor={borderColor}
              w="full"
            >
              <Heading size="md" mb={4}>
                Trending Topics
              </Heading>
              <VStack align="stretch" spacing={3}>
                <Text color="blue.500">#SafetyCommunity</Text>
                <Text color="blue.500">#EmergencyResponse</Text>
                <Text color="blue.500">#CommunityWatch</Text>
                <Text color="blue.500">#SafetyFirst</Text>
                <Text color="blue.500">#NeighborhoodSafety</Text>
              </VStack>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                minH="150px"
              />
              <Flex gap={2}>
                <IconButton
                  aria-label="Upload image"
                  icon={<Icon as={RiImageLine as React.ElementType} w={4} h={4} />}
                  onClick={() => hiddenFileInput.current?.click()}
                  isLoading={loading}
                />
                <IconButton
                  aria-label="Add video"
                  icon={<Icon as={RiVideoLine as React.ElementType} w={4} h={4} />}
                  variant="ghost"
                />
                <IconButton
                  aria-label="Create poll"
                  icon={<Icon as={BiPoll as React.ElementType} w={4} h={4} />}
                  variant="ghost"
                />
                <IconButton
                  aria-label="Add link"
                  icon={<Icon as={RiLinkM as React.ElementType} w={4} h={4} />}
                  variant="ghost"
                />
                <Input
                  type="file"
                  accept="image/*"
                  ref={hiddenFileInput}
                  display="none"
                  onChange={handleImageUpload}
                />
              </Flex>

              {imgurl && (
                <Box position="relative" w="full">
                  <img
                    src={imgurl}
                    alt="Upload preview"
                    style={{
                      borderRadius: "8px",
                      maxHeight: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    aria-label="Remove image"
                    icon={<AddIcon />}
                    size="sm"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => setImgurl("")}
                  />
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handlePost}
              isLoading={postLoading}
              leftIcon={<AddIcon />}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AIChat />
    </Container>
  );
};

export default Community;
