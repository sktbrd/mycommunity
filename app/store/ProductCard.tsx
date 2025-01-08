import { Box, Image, Text, Badge, VStack } from '@chakra-ui/react';

type Product = {
  id: string;
  name: string;
  price: number;
  images: string[];
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Box 
      borderWidth="1px" 
      borderRadius="lg" 
      overflow="hidden" 
      boxShadow="lg" 
      _hover={{ transform: 'scale(1.05)', boxShadow: 'xl', transition: '0.3s' }} 
      transition="0.3s"
    >
      <Box p="6">
        <VStack spacing={2} align="start">
            {Array.isArray(product.images) && product.images.length > 0 && (
                <Image src={product.images[0]} alt={product.name} boxSize="100%" objectFit="cover" />
            )}
          <Text fontWeight="bold" fontSize="lg">{product.name}</Text>
          <Text color="gray.600">${product.price.toFixed(2)}</Text>
          <Badge colorScheme="green">In Stock</Badge> {/* Example badge, modify as needed */}
        </VStack>
      </Box>
    </Box>
  );
};

export default ProductCard;
