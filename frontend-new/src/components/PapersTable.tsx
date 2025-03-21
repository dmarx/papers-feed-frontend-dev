// frontend-new/src/components/PapersTable.tsx
import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TextInput, 
  Group, 
  Text, 
  Badge, 
  ScrollArea, 
  Center,
  Anchor,
  UnstyledButton,
  Tooltip
} from '@mantine/core';
import { IconSearch, IconSelector, IconChevronDown, IconChevronUp, IconCalendar, IconClock } from '@tabler/icons-react';
import { Paper } from '../types';
import classes from './PapersTable.module.css';

interface PapersTableProps {
  data: Paper[];
  isLoading: boolean;
}

interface ThProps {
  children: React.ReactNode;
  sortKey?: keyof Paper;
  sortBy: keyof Paper | null;
  reverseSortDirection: boolean;
  onSort: (key: keyof Paper) => void;
}

function Th({ children, sortKey, sortBy, reverseSortDirection, onSort }: ThProps) {
  const sorted = sortBy === sortKey;
  const Icon = sorted 
    ? (reverseSortDirection ? IconChevronUp : IconChevronDown) 
    : IconSelector;

  if (!sortKey) {
    return <Table.Th>{children}</Table.Th>;
  }

  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={() => onSort(sortKey)} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon size={16} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: Paper[], search: string) {
  if (!search.trim()) {
    return data;
  }

  const query = search.toLowerCase().trim();
  return data.filter((paper) => 
    paper.title.toLowerCase().includes(query) ||
    paper.authors.toLowerCase().includes(query) ||
    paper.abstract.toLowerCase().includes(query) ||
    paper.arxivId.toLowerCase().includes(query) ||
    paper.arxiv_tags.some(tag => tag.toLowerCase().includes(query))
  );
}

function sortData(
  data: Paper[],
  payload: { sortBy: keyof Paper | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return payload.reversed
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return payload.reversed ? bValue - aValue : aValue - bValue;
      }

      // Handle date strings
      if (
        sortBy === 'published_date' || 
        sortBy === 'last_visited' || 
        sortBy === 'last_read'
      ) {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return payload.reversed ? bDate - aDate : aDate - bDate;
      }

      return 0;
    }),
    payload.search
  );
}

export function PapersTable({ data, isLoading }: PapersTableProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<keyof Paper | null>('published_date');
  const [reverseSortDirection, setReverseSortDirection] = useState(true);

  const setSorting = (field: keyof Paper) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  };

  const sortedData = useMemo(() => {
    return sortData(data, { 
      sortBy, 
      reversed: reverseSortDirection, 
      search
    });
  }, [data, sortBy, reverseSortDirection, search]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format reading time
  const formatReadingTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const rows = sortedData.map((paper) => (
    <Table.Tr key={paper.id}>
      <Table.Td>
        <Anchor 
          href={paper.url} 
          target="_blank" 
          rel="noopener noreferrer"
          size="sm"
        >
          {paper.arxivId}
        </Anchor>
      </Table.Td>
      
      <Table.Td>
        <Tooltip label={paper.title} multiline width={300}>
          <Anchor 
            href={paper.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={classes.paperTitle}
            lineClamp={2}
          >
            {paper.title}
          </Anchor>
        </Tooltip>
      </Table.Td>
      
      <Table.Td>
        <Text size="sm" lineClamp={1} className={classes.truncate}>
          {paper.authors}
        </Text>
      </Table.Td>
      
      <Table.Td>
        <Group gap={5} wrap="nowrap">
          <IconCalendar size={14} stroke={1.5} />
          <Text size="sm">
            {formatDate(paper.published_date)}
          </Text>
        </Group>
      </Table.Td>
      
      <Table.Td>
        <Group gap={5} wrap="nowrap">
          <IconClock size={14} stroke={1.5} />
          <Text size="sm">
            {formatReadingTime(paper.total_reading_time_seconds)}
          </Text>
        </Group>
      </Table.Td>
      
      <Table.Td>
        <Group gap={5} wrap="wrap">
          {paper.arxiv_tags.map((tag) => (
            <Badge key={tag} size="sm" variant="light">
              {tag}
            </Badge>
          ))}
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <TextInput
        placeholder="Search papers by title, author, abstract, ID, or tags..."
        mb="md"
        leftSection={<IconSearch size={16} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      
      <ScrollArea h={500}>
        <Table horizontalSpacing="md" verticalSpacing="xs" miw={800} layout="fixed">
          <Table.Thead>
            <Table.Tr>
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
                sortKey="total_reading_time_seconds"
                sortBy={sortBy}
                reverseSortDirection={reverseSortDirection}
                onSort={setSorting}
              >
                Read Time
              </Th>
              
              <Th
                onSort={() => {}}
              >
                Tags
              </Th>
            </Table.Tr>
          </Table.Thead>
          
          <Table.Tbody>
            {isLoading ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">Loading papers...</Text>
                </Table.Td>
              </Table.Tr>
            ) : rows.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Text fw={500} ta="center">No matching papers found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              rows
            )}
          </Table.Tbody>
        </Table>
      </ScrollArea>
    </>
  );
}
