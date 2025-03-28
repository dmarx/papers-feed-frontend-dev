// src/components/PaperDetails.tsx
import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Badge,
  Group,
  Text,
  Title,
  Anchor,
  Stack,
  Divider,
  Box,
  Code,
  ScrollArea,
  Timeline,
  Button,
  Paper,
  LoadingOverlay
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { 
  IconCalendar, 
  IconClock, 
  IconDownload, 
  IconExternalLink, 
  IconHistory, 
  IconLink
} from '@tabler/icons-react';
import { fetchPaperDetails, fetchPaperHistory } from '../services/ghStoreService';

interface PaperDetailsProps {
  arxivId: string | null;
  onClose: () => void;
}

export function PaperDetails({ arxivId, onClose }: PaperDetailsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('details');
  
  // Fetch paper details directly from GitHub Store
  const { 
    data: paperDetails, 
    isLoading: isLoadingDetails, 
    error: detailsError 
  } = useQuery({
    queryKey: ['paper-details', arxivId],
    queryFn: () => fetchPaperDetails(arxivId as string),
    enabled: !!arxivId,
    retry: 1
  });
  
  // Fetch paper history once we have the paper details
  const { 
    data: paperHistory,
    isLoading: isLoadingHistory
  } = useQuery({
    queryKey: ['paper-history', paperDetails?.meta?.objectId],
    queryFn: () => fetchPaperHistory(paperDetails?.meta?.objectId as string),
    enabled: !!paperDetails?.meta?.objectId,
    retry: 1
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  // Format reading time
  const formatReadingTime = (seconds: number | undefined) => {
    if (seconds === undefined) return 'Unknown';
    
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  if (!arxivId) return null;
  
  const isLoading = isLoadingDetails || isLoadingHistory;
  const hasError = !!detailsError;
  
  return (
    <Modal 
      opened={!!arxivId} 
      onClose={onClose}
      title={<Title order={3}>Paper Details</Title>}
      size="xl"
      scrollAreaComponent={ScrollArea}
      zIndex={1000}
      centered
      overlayProps={{
        color: '#000',
        opacity: 0.55,
        blur: 3
      }}
      styles={{
        content: {
          maxHeight: '85vh',
          overflowY: 'auto'
        },
        header: {
          marginBottom: '0.5rem',
          borderBottom: '1px solid #eee',
          paddingBottom: '0.5rem'
        }
      }}
    >
      <Box pos="relative" mih={200}>
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        
        {hasError ? (
          <Text color="red">Error loading paper details: {String(detailsError)}</Text>
        ) : paperDetails ? (
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="details">Paper Details</Tabs.Tab>
              <Tabs.Tab value="abstract">Abstract</Tabs.Tab>
              <Tabs.Tab value="metadata">Metadata</Tabs.Tab>
              <Tabs.Tab value="raw">Raw GH Store Object</Tabs.Tab>
              <Tabs.Tab value="history">History</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="details" pt="md">
              <Stack spacing="md">
                <Title order={4}>{paperDetails.data.title}</Title>
                
                <Group>
                  <Badge size="lg" color="blue">{paperDetails.data.arxivId}</Badge>
                  <Anchor href={paperDetails.data.url} target="_blank" size="sm">
                    <Group gap={5}>
                      <IconExternalLink size={16} />
                      <Text>View on ArXiv</Text>
                    </Group>
                  </Anchor>
                </Group>
                
                <Paper p="md" withBorder>
                  <Stack spacing="xs">
                    <Text size="sm" fw={500}>Authors</Text>
                    <Text>{paperDetails.data.authors}</Text>
                    
                    <Group mt="xs">
                      <Group gap={5}>
                        <IconCalendar size={16} stroke={1.5} />
                        <Text size="sm">Published: {formatDate(paperDetails.data.published_date)}</Text>
                      </Group>
                      
                      <Group gap={5}>
                        <IconClock size={16} stroke={1.5} />
                        <Text size="sm">Reading time: {formatReadingTime(paperDetails.data.total_reading_time_seconds)}</Text>
                      </Group>
                    </Group>
                  </Stack>
                </Paper>
                
                <Text size="sm" fw={500}>Tags</Text>
                <Group gap={8}>
                  {Array.isArray(paperDetails.data.arxiv_tags) && 
                   paperDetails.data.arxiv_tags.map((tag: string) => (
                    <Badge key={tag} size="sm" variant="outline">{tag}</Badge>
                  ))}
                </Group>
                
                {paperDetails.data.significance_rating && (
                  <>
                    <Text size="sm" fw={500}>Significance Rating</Text>
                    <Text>{paperDetails.data.significance_rating}/5</Text>
                  </>
                )}
                
                {paperDetails.data.review_status && (
                  <>
                    <Text size="sm" fw={500}>Review Status</Text>
                    <Badge>{paperDetails.data.review_status}</Badge>
                  </>
                )}
                
                {paperDetails.data.internal_comments && (
                  <>
                    <Text size="sm" fw={500}>Internal Comments</Text>
                    <Paper p="xs" withBorder>
                      <Text>{paperDetails.data.internal_comments}</Text>
                    </Paper>
                  </>
                )}
                
                {paperDetails.data.implementation_details && (
                  <>
                    <Text size="sm" fw={500}>Implementation Details</Text>
                    <Group>
                      <Badge color={paperDetails.data.implementation_details.code_available ? "green" : "gray"}>
                        Code {paperDetails.data.implementation_details.code_available ? "Available" : "Unavailable"}
                      </Badge>
                      
                      {paperDetails.data.implementation_details.github_repo && (
                        <Anchor href={paperDetails.data.implementation_details.github_repo} target="_blank">
                          <Group gap={5}>
                            <IconLink size={16} />
                            <Text size="sm">GitHub Repository</Text>
                          </Group>
                        </Anchor>
                      )}
                    </Group>
                  </>
                )}
                
                {paperDetails.data.related_papers && (
                  <>
                    <Text size="sm" fw={500}>Related Papers</Text>
                    <Group>
                      {Array.isArray(paperDetails.data.related_papers) && 
                       paperDetails.data.related_papers.map((id: string) => (
                        <Badge key={id} size="sm" variant="outline">{id}</Badge>
                      ))}
                    </Group>
                  </>
                )}
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="abstract" pt="md">
              <Paper p="md" withBorder>
                <Text>{paperDetails.data.abstract}</Text>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="metadata" pt="md">
              <Stack spacing="xs">
                <Text fw={700}>GitHub Store Metadata</Text>
                <Divider />
                
                <Group>
                  <Text fw={500}>Object ID:</Text>
                  <Text>{paperDetails.meta.objectId}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Label:</Text>
                  <Text>{paperDetails.meta.label}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Created:</Text>
                  <Text>{paperDetails.meta.createdAt.toString()}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Last Updated:</Text>
                  <Text>{paperDetails.meta.updatedAt.toString()}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Version:</Text>
                  <Text>{paperDetails.meta.version}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Issue Number:</Text>
                  <Text>{paperDetails.meta.issueNumber}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Last Visited:</Text>
                  <Text>{formatDate(paperDetails.data.last_visited)}</Text>
                </Group>
                
                <Group>
                  <Text fw={500}>Last Read:</Text>
                  <Text>{formatDate(paperDetails.data.last_read)}</Text>
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="raw" pt="md">
              <Box mb="md">
                <Text size="sm">Raw GitHub Store Object Data:</Text>
              </Box>
              <ScrollArea.Autosize mah={400}>
                <Code block>{JSON.stringify(paperDetails, null, 2)}</Code>
              </ScrollArea.Autosize>
            </Tabs.Panel>

            <Tabs.Panel value="history" pt="md">
              <Box mb="md">
                <Text fw={500}>Object Update History</Text>
              </Box>
              
              {paperHistory ? (
                <Timeline active={paperHistory.length - 1} bulletSize={24} lineWidth={2}>
                  {paperHistory.map((entry, index) => (
                    <Timeline.Item key={index} title={entry.type === 'initial_state' ? 'Initial State' : 'Update'}>
                      <Text size="sm" c="dimmed">{new Date(entry.timestamp).toLocaleString()}</Text>
                      <Text size="sm" mt={4}>{entry.data?.notes || 'No notes'}</Text>
                      <Badge mt={4}>{entry.data?.status || 'Unknown'}</Badge>
                      
                      <Box mt={8}>
                        <Code block fz="xs">{JSON.stringify(entry.data, null, 2)}</Code>
                      </Box>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <Text>Loading history...</Text>
              )}
            </Tabs.Panel>
          </Tabs>
        ) : (
          <Text fw={500}>No data available for this paper.</Text>
        )}
        
        <Group position="right" mt="xl">
          <Button onClick={onClose} variant="outline">Close</Button>
        </Group>
      </Box>
    </Modal>
  );
}
