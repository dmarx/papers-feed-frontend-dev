// frontend-new/src/pages/Home.tsx
import React from 'react';
import { Container, Title, Text, Stack, Tabs, Alert, Paper } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPapers } from '../api';
import { PapersTable } from '../components/PapersTable';

export const Home: React.FC = () => {
  const { data: papers = [], isLoading, isError, error } = useQuery({
    queryKey: ['papers'],
    queryFn: fetchPapers,
    retry: 1
  });

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={1} ta="center">ArXiv Papers Feed</Title>
        
        <Text ta="center" c="dimmed" mb="xl">
          Browse and search through your collection of ArXiv papers
        </Text>
        
        {isError ? (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Data loading error" 
            color="red"
            variant="filled"
          >
            {error instanceof Error ? error.message : 'Failed to load papers. Make sure the papers.json file is available at /web/data/papers.json'}
          </Alert>
        ) : (
          <Paper p="md" shadow="sm" radius="md">
            <Tabs defaultValue="all">
              <Tabs.List>
                <Tabs.Tab value="all">All Papers ({papers.length})</Tabs.Tab>
                <Tabs.Tab value="recent">Recently Visited ({Math.min(papers.length, 10)})</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="all" pt="md">
                <PapersTable data={papers} isLoading={isLoading} />
              </Tabs.Panel>
              
              <Tabs.Panel value="recent" pt="md">
                <PapersTable 
                  data={papers.slice()
                    .sort((a, b) => new Date(b.last_visited).getTime() - new Date(a.last_visited).getTime())
                    .slice(0, 10)
                  } 
                  isLoading={isLoading} 
                />
              </Tabs.Panel>
            </Tabs>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};
