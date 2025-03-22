// frontend-new/src/pages/Home.tsx
import React from 'react';
import { Container, Title, Text, Button, Group, Stack } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { fetchMessage } from '../api';

export const Home: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hello'],
    queryFn: fetchMessage
  });

  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Title order={1} ta="center">Hello World!</Title>
        
        <Text ta="center">
          A minimal app with Mantine UI, React Query, and Rollup
        </Text>
        
        {isLoading ? (
          <Text ta="center">Loading message...</Text>
        ) : isError ? (
          <Text c="red" ta="center">Error loading message</Text>
        ) : (
          <Text size="xl" fw={500} ta="center">
            {data?.message}
          </Text>
        )}
        
        <Group justify="center">
          <Button onClick={() => refetch()}>
            Reload Message
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};
