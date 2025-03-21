// frontend-new/src/App.jsx
import React from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchMessage } from './api.js';

const App = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hello'],
    queryFn: fetchMessage
  });

  return (
    <Container size="sm" py="xl">
      <Stack spacing="md">
        <Title order={1} align="center">Hello World!</Title>
        
        <Text align="center">
          A minimal app with Mantine UI, React Query, and Rollup
        </Text>
        
        {isLoading ? (
          <Text align="center">Loading message...</Text>
        ) : isError ? (
          <Text color="red" align="center">Error loading message</Text>
        ) : (
          <Text size="xl" weight={500} align="center">
            {data.message}
          </Text>
        )}
        
        <Group position="center">
          <Button onClick={() => refetch()}>
            Reload Message
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default App;
