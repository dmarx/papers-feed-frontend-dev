// src/components/PapersTable.tsx
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  ScrollArea, 
  Text, 
  Group, 
  Badge, 
  Tooltip, 
  Box,
  Anchor,
  UnstyledButton,
  Center,
  Progress,
  ActionIcon,
  rem
} from '@mantine/core';
import { 
  IconChevronDown, 
  IconChevronUp, 
  IconSelector, 
  IconStar, 
  IconStarFilled, 
  IconFileText, 
  IconDotsVertical 
} from '@tabler/icons-react';
import { Paper } from '../types';
import classes from './PapersTable.module.css';

interface PapersTableProps {
  data: Paper[];
  isLoading: boolean;
  onRowClick?: (paper: Paper) => void;
}

interface ThProps {
  children: React.ReactNode;
  sortKey?: keyof Paper;
  sortBy: keyof Paper | null;
  reverseSortDirection: boolean;
  onSort: (key: keyof Paper) => void;
}

function Th({ children, sortKey, sortBy, reverseSortDirection, onSort }: ThProps) {
  const isSorted = sortBy === sortKey;
  const Icon = isSorted 
    ? (reverseSortDirection ? IconChevronUp : IconChevronDown) 
    : IconSelector;

  return (
    <Table.Th className={classes.th}>
      {sortKey ? (
        <UnstyledButton onClick={() => sortKey && onSort(sortKey)} className={classes.control}>
          <Group justify="space-between" wrap="nowrap">
            <Text fw={500} size="sm" className={classes.headerText}>{children}</Text>
            <Center className={classes.icon}>
              <Icon size={14} stroke={1.5} />
            </Center>
          </Group>
        </UnstyledButton>
      ) : (
        <Text fw={500} size="sm" className={classes.headerText}>{children}</Text>
      )}
    </Table.Th>
  );
}

// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format relative time (for last viewed)
const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    // Check if it's today
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return `Today ${date.toLocaleTimeString(undefined, { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
    
    // Simple relative time implementation
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch (e) {
    return 'Unknown';
  }
};

// Format reading time
const formatReadingTime = (seconds: number): string => {
  if (!seconds) return '0m';
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m`;
};

// Calculate reading progress percentage
const calculateProgress = (readingTime: number, totalTime: number): number => {
  if (!totalTime || !readingTime) return 0;
  return Math.min(Math.round((readingTime / totalTime) * 100), 100);
};

// Function to filter data based on search term
function filterData(data: Paper[], search: string): Paper[] {
  if (!search.trim()) return data;

  const query = search.toLowerCase().trim();
  return data.filter((paper) => 
    paper.title.toLowerCase().includes(query) ||
    paper.authors.toLowerCase().includes(query) ||
    paper.abstract.toLowerCase().includes(query) ||
    paper.arxivId.toLowerCase().includes(query) ||
    paper.arxiv_tags.some(tag => tag.toLowerCase().includes(query))
  );
}

// Function to sort data
function sortData(
  data: Paper[],
  payload: { sortBy: keyof Paper | null; reversed: boolean; search: string }
): Paper[] {
  const { sortBy, reversed, search } = payload;

  if (!sortBy) {
    return filterData(data, search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return reversed
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return reversed ? bValue - aValue : aValue - bValue;
      }

      // Handle date strings
      if (
        sortBy === 'published_date' || 
        sortBy === 'last_visited' || 
        sortBy === 'last_read'
      ) {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return reversed ? bDate - aDate : aDate - bDate;
      }

      return 0;
    }),
    search
  );
}

export function PapersTable({ data, isLoading, onRowClick }: PapersTableProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Paper | null>('last_visited');
  const [reverseSortDirection, setReverseSortDirection] = useState(true);

  const setSorting = (field: keyof Paper) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const sortedData = useMemo(() => {
    return sortData(data, {
      sortBy,
      reversed: reverseSortDirection,
      search,
    });
  }, [data, sortBy, reverseSortDirection, search]);

  // Check if a paper was viewed recently (last 24 hours)
  const isRecentlyViewed = (dateString: string): boolean => {
    try {
      const viewDate = new Date(dateString);
      const now = new Date();
      const diffTime = now.getTime() - viewDate.getTime();
      const diffHours = diffTime / (1000 * 60 * 60);
      return diffHours < 24;
    } catch (e) {
      return false;
    }
  };

  const rows = sortedData.map((paper) => {
    const isRecent = isRecentlyViewed(paper.last_visited);
    const readingProgress = calculateProgress(paper.current_reading_time_seconds || 0, paper.total_reading_time_seconds);
    
    return (
      <Table.Tr 
        key={paper.id} 
        className={isRecent ? classes.recentRow : ''}
        onClick={() => onRowClick && onRowClick(paper)}
      >
        {/* Star column */}
        <Table.Td className={classes.starColumn}>
          <ActionIcon variant="subtle" color="yellow" aria-label="Star paper">
            {paper.is_starred ? <IconStarFilled size={16} /> : <IconStar size={16} />}
          </ActionIcon>
        </Table.Td>
        
        {/* Paper ID */}
        <Table.Td className={classes.idColumn}>
          <Group gap={8} wrap="nowrap">
            <IconFileText size={16} stroke={1.5} className={classes.fileIcon} />
            <Text className={classes.paperIdText} ff="monospace" size="sm">
              {paper.arxivId}
            </Text>
          </Group>
        </Table.Td>
        
        {/* Title */}
        <Table.Td className={classes.titleColumn}>
          <Tooltip
            label={paper.title}
            multiline
            w={300}
            withArrow
            position="top-start"
          >
            <Box>
              <Text size="sm" fw={500} className={classes.titleText}>
                {paper.title}
              </Text>
              <Text size="xs" c="dimmed" className={classes.subtitleText}>
                {paper.abstract.substring(0, 80)}...
              </Text>
            </Box>
          </Tooltip>
          
          <Group gap={6} mt={4}>
            {paper.arxiv_tags.map((tag) => (
              <Badge key={tag} size="xs" variant="light" className={classes.categoryBadge}>
                {tag}
              </Badge>
            ))}
          </Group>
        </Table.Td>
        
        {/* Authors */}
        <Table.Td className={classes.authorsColumn}>
          <Text size="sm" className={classes.truncate}>
            {paper.authors}
          </Text>
        </Table.Td>
        
        {/* Published Date */}
        <Table.Td className={classes.dateColumn}>
          <Text size="sm">{formatDate(paper.published_date)}</Text>
        </Table.Td>
        
        {/* First Visited Date */}
        <Table.Td className={classes.dateColumn}>
          <Text size="sm">{formatDate(paper.first_visited || paper.last_visited)}</Text>
        </Table.Td>
        
        {/* Last Visited Date */}
        <Table.Td className={classes.dateColumn}>
          <Text size="sm" fw={isRecent ? 500 : 400} className={isRecent ? classes.recentDate : ''}>
            {formatRelativeTime(paper.last_visited)}
          </Text>
        </Table.Td>
        
        {/* Reading Time */}
        <Table.Td className={classes.readingColumn}>
          <Box>
            <Progress 
              value={readingProgress} 
              size="sm" 
              color={readingProgress === 100 ? 'teal' : 'blue'} 
              mb={4}
            />
            <Text size="xs" c="dimmed">
              {formatReadingTime(paper.total_reading_time_seconds)} ({readingProgress}%)
            </Text>
          </Box>
        </Table.Td>
        
        {/* Actions */}
        <Table.Td className={classes.actionsColumn}>
          <ActionIcon variant="subtle" aria-label="More options">
            <IconDotsVertical size={16} stroke={1.5} />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <ScrollArea h={500}>
      <Table withTableBorder highlightOnHover stickyHeader>
        <Table.Thead className={classes.header}>
          <Table.Tr>
            <Th>⭐</Th>
            <Th 
              sortKey="arxivId"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              ID
            </Th>
            <Th 
              sortKey="title"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              Title
            </Th>
            <Th 
              sortKey="authors"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              Authors
            </Th>
            <Th 
              sortKey="published_date"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              Published
            </Th>
            <Th 
              sortKey="first_visited"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              First Viewed
            </Th>
            <Th 
              sortKey="last_visited"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              Last Viewed
            </Th>
            <Th 
              sortKey="total_reading_time_seconds"
              sortBy={sortBy}
              reverseSortDirection={reverseSortDirection}
              onSort={setSorting}
            >
              Reading
            </Th>
            <Th>Actions</Th>
          </Table.Tr>
        </Table.Thead>
        
        <Table.Tbody>
          {isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={9}>
                <Text fw={500} ta="center">Loading papers...</Text>
              </Table.Td>
            </Table.Tr>
          ) : rows.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={9}>
                <Text fw={500} ta="center">No matching papers found</Text>
              </Table.Td>
            </Table.Tr>
          ) : rows}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
