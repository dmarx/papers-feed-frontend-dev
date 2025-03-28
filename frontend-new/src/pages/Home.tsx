// frontend-new/src/pages/Home.tsx
import React from 'react';
import { Container, Title, Text, Stack, Tabs, Alert, Paper, LoadingOverlay } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { PapersTable } from '../components/PapersTable';
import { fetchAllPapers } from '../services/ghStoreService';
import { Paper as PaperType, StoredObject } from '../types';

export const Home: React.FC = () => {
  // Fetch all papers from GitHub Store
  const { 
    data: storedObjects = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['papers'],
    queryFn: fetchAllPapers,
    refetchOnWindowFocus: false
  });

  // Transform stored objects to paper objects
  const papers: PaperType[] = storedObjects.map((obj: StoredObject) => {
    // Extract the paper data from the stored object
    const paperData = obj.data as any;
    
    // Ensure the object has the expected structure
    return {
      id: obj.meta.objectId,
      title: paperData.title || 'Unknown Title',
      authors: paperData.authors || 'Unknown Authors',
      abstract: paperData.abstract || '',
      url: paperData.url || `https://arxiv.org/abs/${paperData.arxivId}`,
      arxivId: paperData.arxivId || 'unknown',
      last_visited: paperData.last_visited || new Date().toISOString(),
      last_read: paperData.last_read || new Date().toISOString(),
      total_reading_time_seconds: paperData.total_reading_time_seconds || 0,
      published_date: paperData.published_date || new Date().toISOString(),
      arxiv_tags: Array.isArray(paperData.arxiv_tags) ? paperData.arxiv_tags : []
    };
  });

  // Count papers that were read in the last 30 days
  const recentlyRead = papers.filter(p => {
    const lastRead = new Date(p.last_read);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastRead >= thirtyDaysAgo;
  }).length;

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
            {error instanceof Error ? error.message : 'Failed to load papers from GitHub Store'}
          </Alert>
        ) : (
          <Paper p="md" shadow="sm" radius="md" pos="relative">
            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
            
            <Tabs defaultValue="all">
              <Tabs.List>
                <Tabs.Tab value="all">All Papers ({papers.length})</Tabs.Tab>
                <Tabs.Tab value="recent">Recently Read ({recentlyRead})</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="all" pt="md">
                <PapersTable data={papers} isLoading={isLoading} />
              </Tabs.Panel>
              
              <Tabs.Panel value="recent" pt="md">
                <PapersTable 
                  data={papers.filter(p => {
                    const lastRead = new Date(p.last_read);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return lastRead >= thirtyDaysAgo;
                  })} 
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
