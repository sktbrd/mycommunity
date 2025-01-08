import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Wrap,
  Image,
  IconButton,
  Box,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';
import ImageUploader from '@/components/homepage/ImageUploader'; // <-- Corrected path for Next.js 13
import { getFileSignature, uploadImage } from '@/lib/hive/client-functions';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newProduct: any) => void;
  isEditing: boolean;
  productData: any;
  categories: { id: string; name: string }[];
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isEditing,
  productData,
  categories,
}) => {
  const initialProductState = isEditing ? productData : { name: '', description: '', price: '', category_id: '', images: [] };
  
  const [product, setProduct] = useState(initialProductState);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(productData?.images || []);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // Reset the modal fields when the modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      // Reset form if modal is opened as a new product
      setProduct(isEditing ? productData : { name: '', description: '', price: '', category_id: '', images: [] });
      setExistingImages(isEditing ? productData.images : []);
      setImages([]);
    }
  }, [isOpen, isEditing, productData]);

  const handleSave = async () => {
    setIsLoading(true);
    setUploadProgress([]);

    let allImages: string[] = [...existingImages];

    // Handle new image upload if images exist
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(async (image, index) => {
          const signature = await getFileSignature(image);
          try {
            const uploadUrl = await uploadImage(image, signature, index, setUploadProgress);
            return uploadUrl;
          } catch (error) {
            console.error('Error uploading image:', error);
            return null;
          }
        })
      );
      const validUrls = uploadedImages.filter(Boolean) as string[]; // Filter out null and cast to string[]
      allImages = [...allImages, ...validUrls]; // Append new images to the existing ones
    }

    if (!product.category_id) {
      toast({
        title: 'Category is required',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const updatedProduct = {
      ...product,
      images: allImages, // Save the combined image list (existing + new)
    };

    onSave(updatedProduct);
    setIsLoading(false);
    onClose();
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isEditing ? 'Edit Product' : 'Add Product'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Product form fields */}
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Price</FormLabel>
            <Input
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
            />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Category</FormLabel>
            <Select
              placeholder="Select category"
              value={product.category_id}
              onChange={(e) => setProduct({ ...product, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>

          {/* Display existing images */}
          <FormLabel mt={4}>Existing Images</FormLabel>
          <Wrap spacing={4}>
            {existingImages.map((url, index) => (
              <Box key={index} position="relative">
                <Image alt="" src={url} boxSize="100px" borderRadius="base" />
                <IconButton
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top="0"
                  right="0"
                  onClick={() => handleRemoveExistingImage(index)}
                  isDisabled={isLoading}
                />
              </Box>
            ))}
          </Wrap>

          {/* Image uploader for adding new images */}
          <FormControl mb={4}>
            <FormLabel>Upload Images</FormLabel>
            <ImageUploader
              images={images}
              onUpload={setImages}
              onRemove={(index) => setImages((prev) => prev.filter((_, i) => i !== index))}
            />
          </FormControl>

          {/* Preview and progress for new images */}
          <Wrap spacing={4}>
            {images.map((image, index) => (
              <Box key={index} position="relative">
                <Image alt="" src={URL.createObjectURL(image)} boxSize="100px" borderRadius="base" />
                <IconButton
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top="0"
                  right="0"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  isDisabled={isLoading}
                />
                <Progress value={uploadProgress[index]} size="xs" colorScheme="green" mt={2} />
              </Box>
            ))}
          </Wrap>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave} isLoading={isLoading}>
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductModal;
