'use client'
import { useEffect, useState } from 'react';
import { useAioha } from '@aioha/react-ui';
import { isAdmin } from '@/lib/store/adminCheck';
import { Box, Heading, Text, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';
import Categories from './Categories'; // Adjust the import path as needed
import Products from './Products';

const AdminDashboard = () => {
  const { user } = useAioha();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const authorized = await isAdmin(user); // Await the result of isAdmin
        setIsAuthorized(authorized);
      }
      setLoading(false); // Set loading to false once the check is complete
    };

    checkAdmin(); // Call the inner async function
  }, [user]);

  if (loading) {
    return (
      <Box>
        <Heading>Loading...</Heading>
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box>
        <Heading>Unauthorized</Heading>
        <Text>You do not have access to this page.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading>Admin Dashboard</Heading>
      <Tabs variant="soft-rounded" colorScheme="teal" mt={4}>
        <TabList>
          <Tab>Categories</Tab>
          <Tab>Products</Tab>
          <Tab>Orders</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Categories />
          </TabPanel>
          <TabPanel>
            <Products />
          </TabPanel>
          <TabPanel>
            <Text>Order management will go here.</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default AdminDashboard;
