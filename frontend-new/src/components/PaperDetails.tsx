// src/components/PaperDetails.tsx
import React, { useEffect, useState } from 'react';
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
  Paper
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
import { StoredObject } from '../types';

interface PaperDetailsProps {
  arxivId: string | null;
  onClose: () => void;
}

export function PaperDetails({ arxivId, onClose }: PaperDetailsProps) {
  const [activeTab, setActiveTab] = useState<string | null>('details');
  
  const { data: paperDetails, isLoading, error } = useQuery({
    queryKey: ['paper-details', arxivId],
    queryFn: () => fetchPaperDetails(arxivId as string),
    enabled: !!arxivId
  });
  
  const { data: paperHistory } = useQuery({
    queryKey: ['paper-history', paperDetails?.meta?.objectId],
    queryFn: () => fetchPaperHistory(paperDetails?.meta?.objectId as string),
    enabled: !!paperDetails?.meta?.objectId
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format reading time
  const formatReadingTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  };

  if (!arxivId) return null;
  
  return (
    <Modal 
      opened={!!arxivId} 
      onClose={onClose}
      title={<Title order={3}>Paper Details</Title>}
      size="xl"
      scrollAreaComponent={ScrollArea}
    >
      {isLoading ? (
        <Text>Loading paper details...</Text>
      ) : error ? (
        <Text color="red">Error loading paper details: {String(error)}</Text>
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
            <Stack>
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
              
              <Text size="sm" fw={500}>Authors</Text>
              <Text>{paperDetails.data.authors}</Text>
              
              <Group>
                <Group gap={5}>
                  <IconCalendar size={16} stroke={1.5} />
                  <Text size="sm">Published: {formatDate(paperDetails.data.published_date)}</Text>
                </Group>
                
                <Group gap={5}>
                  <IconClock size={16} stroke={1.5} />
                  <Text size="sm">Reading time: {formatReadingTime(paperDetails.data.total_reading_time_seconds)}</Text>
                </Group>
              </Group>
              
              <Text size="sm" fw={500}>Tags</Text>
              <Group gap={8}>
                {paperDetails.data.arxiv_tags.map((tag: string) => (
                  <Badge key={tag} size="sm" variant="outline">{tag}</Badge>
                ))}
              </Group>
              
              {/* Additional GH-Store specific data that wouldn't be in papers.json */}
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
                    {paperDetails.data.related_papers.map((id: string) => (
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
                    <Text size="sm" mt={4}>{entry.data.notes || 'No notes'}</Text>
                    <Badge mt={4}>{entry.data.status}</Badge>
                    
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
      ) : null}
    </Modal>
  );
}
