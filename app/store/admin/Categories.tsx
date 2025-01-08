'use client'

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'; // Import necessary icons
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/lib/supabase/store';
import { useAioha } from '@aioha/react-ui';

type Category = {
  id: string;
  name: string;
  description: string;
  created_at?: string;
};

const Categories = () => {
  const { user } = useAioha();
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const toast = useToast();

  // Fetches categories from Supabase
  const fetchCategories = useCallback(async () => {
    try {
      const data: Category[] = await getCategories();
      setCategories(data);
    } catch (error) {
      toast({
        title: 'Error loading categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  // Effect to load categories when the component is mounted
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handles adding a new category
  const handleAddCategory = async () => {
    try {
      await addCategory(newCategory.name, newCategory.description);
      fetchCategories();
      setNewCategory({ name: '', description: '' });
      setIsModalOpen(false);
      toast({
        title: 'Category added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error adding category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handles opening the edit modal
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handles updating a category
  const handleUpdateCategory = async () => {
    if (editingCategory) {
      try {
        await updateCategory(editingCategory.id, newCategory.name, newCategory.description);
        fetchCategories();
        setNewCategory({ name: '', description: '' });
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingCategory(null);
        toast({
          title: 'Category updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Error updating category',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  // Handles deleting a category
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      toast({
        title: 'Category deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting category',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Stack direction="row" align="center" justify="space-between" mb={4}>
        <Text fontSize="2xl">Manage Categories</Text>
        <IconButton
          aria-label="Add Category"
          icon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          colorScheme="teal"
        />
      </Stack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>{new Date(category.created_at!).toLocaleDateString()}</Td>
              <Td>
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  onClick={() => handleEditCategory(category)}
                  colorScheme="blue"
                  mr={2}
                />
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteCategory(category.id)}
                  colorScheme="red"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for Adding/Editing Category */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setIsEditing(false); setEditingCategory(null); }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Category' : 'Add Category'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Enter category name"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Enter category description"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => { isEditing ? handleUpdateCategory() : handleAddCategory(); }} colorScheme="teal">
              {isEditing ? 'Update Category' : 'Add Category'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Categories;
