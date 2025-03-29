// src/pages/Home.tsx
import React, { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Stack, 
  Paper, 
  Group, 
  Tabs, 
  Alert, 
  Badge,
  Box,
  Loader,
  Center,
  Button,
  ThemeIcon
} from '@mantine/core';
import { 
  IconAlertCircle, 
  IconClockHour3, 
  IconBook,
  IconBookmark, 
  IconFileText,
  IconNews
} from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { fetchPapers } from '../api';
import { PapersTable } from '../components/PapersTable';
import { SearchBar } from '../components/SearchBar/SearchBar';
import { Paper as PaperType } from '../types';

export const Home: React.FC = () => {
  // State for filtering and UI
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    categories: [] as string[],
    readStatus: null as string | null,
    timeRange: 'all' as string
  });
  const [sortConfig, setSortConfig] = useState({
    field: 'last_visited' as keyof PaperType,
    direction: 'desc' as 'asc' | 'desc'
  });
  const [selectedPaper, setSelectedPaper] = useState<PaperType | null>(null);
  
  // Fetch papers data
  const { 
    data: papers = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['papers'],
    queryFn: fetchPapers,
    retry: 1
  });
  
  // Extract unique categories for filter options
  const allCategories = papers.flatMap(paper => paper.arxiv_tags);
  const uniqueCategories = [...new Set(allCategories)];
  
  // Handle search term changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };
  
  // Handle filter changes
  const handleFilter = (filters: any) => {
    setActiveFilters(filters);
  };
  
  // Handle sort changes
  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSortConfig({
      field: field as keyof PaperType,
      direction
    });
  };
  
  // Handle time range filter
  const handleTimeRangeChange = (range: string) => {
    setActiveFilters({
      ...activeFilters,
      timeRange: range
    });
  };
  
  // Handle opening paper details
  const handlePaperClick = (paper: PaperType) => {
    setSelectedPaper(paper);
    // Additional logic for viewing paper details
  };
  
  // Calculate recent papers (last 7 days)
  const recentPapers = papers.filter(paper => {
    const lastVisited = new Date(paper.last_visited);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return lastVisited >= weekAgo;
  });
  
  // Get reading stats
  const totalReadingTime = papers.reduce(
    (total, paper) => total + (paper.total_reading_time_seconds || 0), 
    0
  );
  const totalReadingTimeHours = Math.floor(totalReadingTime / 3600);
  const totalReadingTimeMinutes = Math.floor((totalReadingTime % 3600) / 60);
  
  return (
    <Container size="xl" py="md">
      <Stack gap="md">
        {/* Header Section */}
        <Group justify="space-between" align="center">
          <div>
            <Title order={1}>ArXiv Papers Feed</Title>
            <Text c="dimmed">
              Browse and search through your collection of research papers
            </Text>
          </div>
          
          {/* Quick Stats */}
          <Group gap="md">
            <Paper withBorder p="xs" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="md" variant="light" color="blue">
                  <IconFileText size={16} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Total Papers</Text>
                  <Text fw={700}>{papers.length}</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper withBorder p="xs" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="md" variant="light" color="green">
                  <IconBook size={16} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Reading Time</Text>
                  <Text fw={700}>{totalReadingTimeHours}h {totalReadingTimeMinutes}m</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper withBorder p="xs" radius="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="md" variant="light" color="orange">
                  <IconNews size={16} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed">Recent Activity</Text>
                  <Text fw={700}>{recentPapers.length} papers</Text>
                </div>
              </Group>
            </Paper>
          </Group>
        </Group>
        
        {/* Search and Filter Bar */}
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
          onTimeRangeChange={handleTimeRangeChange}
          availableCategories={uniqueCategories}
        />
        
        {/* Content Area */}
        {isError ? (
          <Alert 
            icon={<IconAlertCircle size={16} />} 
            title="Data loading error" 
            color="red"
            variant="filled"
          >
            {error instanceof Error 
              ? error.message 
              : 'Failed to load papers. Make sure the papers.json file is available.'}
          </Alert>
        ) : (
          <Paper p="md" shadow="xs" radius="md">
            <Tabs defaultValue="all">
              <Tabs.List>
                <Tabs.Tab 
                  value="all" 
                  leftSection={<IconFileText size={16} />}
                >
                  All Papers 
                  <Badge size="sm" variant="filled" color="blue" ml={5}>
                    {papers.length}
                  </Badge>
                </Tabs.Tab>
                
                <Tabs.Tab 
                  value="recent" 
                  leftSection={<IconClockHour3 size={16} />}
                >
                  Recently Viewed
                  <Badge size="sm" variant="filled" color="blue" ml={5}>
                    {recentPapers.length}
                  </Badge>
                </Tabs.Tab>
                
                <Tabs.Tab 
                  value="bookmarked" 
                  leftSection={<IconBookmark size={16} />}
                >
                  Bookmarked
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="all" pt="md">
                {isLoading ? (
                  <Center h={100}>
                    <Loader color="blue" />
                  </Center>
                ) : (
                  <PapersTable 
                    data={papers} 
                    isLoading={isLoading} 
                    onRowClick={handlePaperClick}
                  />
                )}
              </Tabs.Panel>
              
              <Tabs.Panel value="recent" pt="md">
                {isLoading ? (
                  <Center h={100}>
                    <Loader color="blue" />
                  </Center>
                ) : (
                  <PapersTable 
                    data={recentPapers}
                    isLoading={isLoading} 
                    onRowClick={handlePaperClick}
                  />
                )}
              </Tabs.Panel>
              
              <Tabs.Panel value="bookmarked" pt="md">
                {isLoading ? (
                  <Center h={100}>
                    <Loader color="blue" />
                  </Center>
                ) : (
                  <PapersTable 
                    data={papers.filter(p => p.is_starred)}
                    isLoading={isLoading} 
                    onRowClick={handlePaperClick}
                  />
                )}
              </Tabs.Panel>
            </Tabs>
          </Paper>
        )}
      </Stack>
    </Container>
  );
};
