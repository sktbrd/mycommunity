import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons'; 
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/supabase/store';
import { getCategories } from '@/lib/supabase/store';
import ProductModal from './ProductModal'; // Import the new modal component

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category_id: string;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, images: [''], category_id: '' });
  const toast = useToast();

  const fetchProducts = useCallback(async () => {
    const data = await getProducts();
    setProducts(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const data = await getCategories();
    setCategories(data);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleSaveProduct = async (product: Product) => {
    if (isEditing) {
      await updateProduct(editingProduct?.id || '', product.name, product.description, product.price, product.images, product.category_id);
      toast({ title: 'Product updated', status: 'success', duration: 3000, isClosable: true });
    } else {
      await addProduct(product.name, product.description, product.price, product.images, product.category_id);
      toast({ title: 'Product added', status: 'success', duration: 3000, isClosable: true });
    }
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditing(true);
    setNewProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    await deleteProduct(id);
    fetchProducts();
    toast({ title: 'Product deleted', status: 'success', duration: 3000, isClosable: true });
  };

  return (
    <Box>
      <Stack direction="row" align="center" justify="space-between" mb={4}>
        <Text fontSize="2xl">Manage Products</Text>
        <IconButton
          aria-label="Add Product"
          icon={<AddIcon />}
          onClick={() => {
            setIsEditing(false);
            setNewProduct({ name: '', description: '', price: 0, images: [''], category_id: '' });
            setIsModalOpen(true);
          }}
        />
      </Stack>

      <Table>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Category</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map((product) => (
            <Tr key={product.id}>
              <Td>{product.name}</Td>
              <Td>{product.description}</Td>
              <Td>{product.price}</Td>
              <Td>{categories.find((cat) => cat.id === product.category_id)?.name}</Td>
              <Td>
                <IconButton
                  aria-label="Edit Product"
                  icon={<EditIcon />}
                  onClick={() => handleEditProduct(product)}
                />
                <IconButton
                  aria-label="Delete Product"
                  icon={<DeleteIcon />}
                  onClick={() => handleDeleteProduct(product.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        isEditing={isEditing}
        productData={newProduct}
        categories={categories}
      />
    </Box>
  );
};

export default Products;
