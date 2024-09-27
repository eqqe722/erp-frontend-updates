import React, { useState } from 'react';
import { Box, VStack, HStack, Input, Button, Text, Textarea, useToast } from '@chakra-ui/react';

const UserStoryManagement = () => {
  const [userStories, setUserStories] = useState([]);
  const [newStory, setNewStory] = useState({ title: '', description: '', priority: '' });
  const toast = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStory({ ...newStory, [name]: value });
  };

  const addUserStory = () => {
    if (newStory.title && newStory.description) {
      setUserStories([...userStories, { ...newStory, id: Date.now() }]);
      setNewStory({ title: '', description: '', priority: '' });
      toast({
        title: "تمت إضافة قصة المستخدم",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteUserStory = (id) => {
    setUserStories(userStories.filter(story => story.id !== id));
    toast({
      title: "تم حذف قصة المستخدم",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="عنوان قصة المستخدم"
          name="title"
          value={newStory.title}
          onChange={handleInputChange}
        />
        <Textarea
          placeholder="وصف قصة المستخدم"
          name="description"
          value={newStory.description}
          onChange={handleInputChange}
        />
        <Input
          placeholder="الأولوية"
          name="priority"
          value={newStory.priority}
          onChange={handleInputChange}
        />
        <Button colorScheme="blue" onClick={addUserStory}>إضافة قصة مستخدم</Button>
      </VStack>
      <VStack mt={8} spacing={4} align="stretch">
        {userStories.map((story) => (
          <Box key={story.id} p={4} borderWidth={1} borderRadius="md">
            <HStack justifyContent="space-between">
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">{story.title}</Text>
                <Text>{story.description}</Text>
                <Text fontSize="sm" color="gray.500">الأولوية: {story.priority}</Text>
              </VStack>
              <Button colorScheme="red" size="sm" onClick={() => deleteUserStory(story.id)}>
                حذف
              </Button>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default UserStoryManagement;
