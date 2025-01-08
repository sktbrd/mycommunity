'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Text,
  Stack,
  SimpleGrid,
  Spinner,
  Heading,
} from '@chakra-ui/react';
import { getProducts, getCategories } from '@/lib/supabase/store';
import ProductCard from './ProductCard'; // Adjust the import path if necessary

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
  categories: string[]; // Ensure categories is an array of strings
};

const PublicComponent = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setFilteredProducts(fetchedProducts); // Initialize with all products
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = (selectedCategory: string) => {
    const filtered = selectedCategory
      ? products.filter(product => 
          Array.isArray(product.categories) && 
          product.categories.includes(selectedCategory)
        )
      : products;
    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Stack spacing={6}>
        <Heading as="h2" size="xl">Categories</Heading>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button onClick={() => handleCategoryChange('')} colorScheme="blue" variant="outline">All</Button>
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => handleCategoryChange(category.name)}
              colorScheme="blue"
              variant="solid"
            >
              {category.name}
            </Button>
          ))}
        </Stack>
      </Stack>

      <SimpleGrid columns={{ sm: 1, md: 2, lg: 3 }} spacing={6} mt={4}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PublicComponent;
