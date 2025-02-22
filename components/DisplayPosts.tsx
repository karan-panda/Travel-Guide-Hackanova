import { Box, Image, Text, VStack, Flex, Avatar, Button, IconButton, HStack, useColorModeValue, Icon } from '@chakra-ui/react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { firestore, auth } from '../firebase';
import { useEffect, useState } from 'react';
import { FaHeart, FaComment, FaShare, FaTrash } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  link: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  likes: number;
  comments: number;
}

const DisplayPosts: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const loadPosts = async () => {
    try {
      const q = query(
        collection(firestore, "posts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const postsData: Post[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Post, 'id'>;
        postsData.push({ ...data, id: docSnap.id });
      });
      
      setPosts(postsData);
    } catch (error) {
      console.error("Error loading posts:", error);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(firestore, "posts", postId));
      onUpdate();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <VStack spacing={6} width="100%" maxW="800px" mx="auto">
      {posts.map((post) => (
        <Box
          key={post.id}
          w="100%"
          bg={cardBg}
          borderRadius="lg"
          boxShadow="md"
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
        >
          <Flex p={4} alignItems="center">
            <Avatar 
              size="md" 
              src={post.authorAvatar || 'https://bit.ly/broken-link'} 
              name={post.authorName}
            />
            <Box ml={4}>
              <Text fontWeight="bold">{post.authorName}</Text>
              <Text fontSize="sm" color="gray.500">
                {post.createdAt?.toDate() 
                  ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
                  : 'some time ago'}
              </Text>
            </Box>
            {auth.currentUser?.uid === post.authorId && (
              <IconButton
                aria-label="Delete post"
                icon={<Icon as={FaTrash as React.ElementType} boxSize={4} />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                ml="auto"
                onClick={() => handleDelete(post.id)}
              />
            )}
          </Flex>

          {post.link && (
            <Box position="relative" maxH="400px" overflow="hidden">
              <Image
                width="100%"
                objectFit="cover"
                src={post.link}
                alt="Post image"
                fallbackSrc="https://via.placeholder.com/400x300?text=Loading..."
              />
            </Box>
          )}

          <Box p={4}>
            <Text fontSize="md" mb={4}>
              {post.content}
            </Text>

            <HStack spacing={4} color="gray.500">
              <Button
                leftIcon={<Icon as={FaHeart as React.ElementType} boxSize={4} />}
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                {post.likes || 0}
              </Button>
              <Button
                leftIcon={<Icon as={FaComment as React.ElementType} boxSize={4} />}
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                {post.comments || 0}
              </Button>
              <Button
                leftIcon={<Icon as={FaShare as React.ElementType} boxSize={4} />}
                variant="ghost"
                size="sm"
                onClick={() => {}}
              >
                Share
              </Button>
            </HStack>
          </Box>
        </Box>
      ))}
    </VStack>
  );
};

export default DisplayPosts;
