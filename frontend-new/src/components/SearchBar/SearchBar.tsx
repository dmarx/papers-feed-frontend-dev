// src/components/SearchBar/SearchBar.tsx
import React, { useState } from 'react';
import { 
  TextInput, 
  Group, 
  ActionIcon, 
  SegmentedControl, 
  Menu, 
  Badge, 
  rem,
  Chip,
  Box
} from '@mantine/core';
import { 
  IconSearch, 
  IconFilter, 
  IconSortAscending, 
  IconSortDescending, 
  IconAdjustments, 
  IconCalendar,
  IconX,
  IconChevronDown
} from '@tabler/icons-react';
import classes from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (value: string) => void;
  onFilter: (filters: FilterState) => void;
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  onTimeRangeChange: (range: string) => void;
  availableCategories: string[];
}

interface FilterState {
  categories: string[];
  readStatus: string | null;
  timeRange: string;
}

export function SearchBar({ 
  onSearch, 
  onFilter, 
  onSort, 
  onTimeRangeChange,
  availableCategories = []
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState('');
  const [timeRange, setTimeRange] = useState('all');
  const [viewMode, setViewMode] = useState('compact');
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    readStatus: null,
    timeRange: 'all'
  });
  
  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setSearchValue(value);
    onSearch(value);
  };
  
  // Clear search input
  const clearSearch = () => {
    setSearchValue('');
    onSearch('');
  };
  
  // Apply category filter
  const handleCategoryFilter = (category: string) => {
    const updatedCategories = activeFilters.categories.includes(category)
      ? activeFilters.categories.filter(c => c !== category)
      : [...activeFilters.categories, category];
      
    const newFilters = {
      ...activeFilters,
      categories: updatedCategories
    };
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };
  
  // Apply reading status filter
  const handleReadStatusFilter = (status: string | null) => {
    const newFilters = {
      ...activeFilters,
      readStatus: status
    };
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };
  
  // Apply time range filter
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    onTimeRangeChange(range);
    
    const newFilters = {
      ...activeFilters,
      timeRange: range
    };
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };
  
  // Remove a specific filter
  const removeFilter = (type: 'category' | 'readStatus' | 'timeRange', value?: string) => {
    let newFilters = { ...activeFilters };
    
    if (type === 'category' && value) {
      newFilters.categories = activeFilters.categories.filter(c => c !== value);
    } else if (type === 'readStatus') {
      newFilters.readStatus = null;
    } else if (type === 'timeRange') {
      newFilters.timeRange = 'all';
      setTimeRange('all');
    }
    
    setActiveFilters(newFilters);
    onFilter(newFilters);
  };
  
  // Get display name for time range
  const getTimeRangeDisplay = (range: string): string => {
    switch (range) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'Last 7 days';
      case 'month': return 'Last 30 days';
      case 'year': return 'Last year';
      default: return 'All time';
    }
  };
  
  // Get display name for read status
  const getReadStatusDisplay = (status: string | null): string => {
    if (!status) return '';
    switch (status) {
      case 'read': return 'Read';
      case 'unread': return 'Unread';
      case 'in_progress': return 'In Progress';
      default: return status;
    }
  };
  
  // Generate active filter badges
  const filterBadges = () => {
    const badges = [];
    
    // Category filters
    for (const category of activeFilters.categories) {
      badges.push(
        <Badge 
          key={`cat-${category}`}
          className={classes.filterBadge}
          rightSection={
            <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => removeFilter('category', category)}>
              <IconX size={rem(14)} />
            </ActionIcon>
          }
        >
          {category}
        </Badge>
      );
    }
    
    // Read status filter
    if (activeFilters.readStatus) {
      badges.push(
        <Badge 
          key="read-status" 
          className={classes.filterBadge}
          rightSection={
            <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => removeFilter('readStatus')}>
              <IconX size={rem(14)} />
            </ActionIcon>
          }
        >
          {getReadStatusDisplay(activeFilters.readStatus)}
        </Badge>
      );
    }
    
    // Time range filter (if not 'all')
    if (activeFilters.timeRange !== 'all') {
      badges.push(
        <Badge 
          key="time-range" 
          className={classes.filterBadge}
          rightSection={
            <ActionIcon size="xs" color="blue" radius="xl" variant="transparent" onClick={() => removeFilter('timeRange')}>
              <IconX size={rem(14)} />
            </ActionIcon>
          }
        >
          {getTimeRangeDisplay(activeFilters.timeRange)}
        </Badge>
      );
    }
    
    return badges;
  };
  
  return (
    <Box className={classes.searchBarContainer}>
      <Group justify="space-between" align="flex-start" className={classes.controls}>
        <Group gap="xs">
          {/* Search Input */}
          <TextInput
            placeholder="Search papers by title, author, ID, content..."
            value={searchValue}
            onChange={handleSearchChange}
            leftSection={<IconSearch size={16} />}
            rightSection={
              searchValue ? (
                <ActionIcon variant="subtle" onClick={clearSearch}>
                  <IconX size={16} />
                </ActionIcon>
              ) : null
            }
            className={classes.searchInput}
          />
          
          {/* Time Quick Filters */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon 
                variant="light" 
                color="blue" 
                aria-label="Filter by time range"
                className={activeFilters.timeRange !== 'all' ? classes.activeFilterButton : ''}
              >
                <IconCalendar size={18} />
              </ActionIcon>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Label>Time Range</Menu.Label>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('today')}
                rightSection={activeFilters.timeRange === 'today' ? '✓' : null}
              >
                Today
              </Menu.Item>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('yesterday')}
                rightSection={activeFilters.timeRange === 'yesterday' ? '✓' : null}
              >
                Yesterday
              </Menu.Item>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('week')}
                rightSection={activeFilters.timeRange === 'week' ? '✓' : null}
              >
                Last 7 days
              </Menu.Item>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('month')}
                rightSection={activeFilters.timeRange === 'month' ? '✓' : null}
              >
                Last 30 days
              </Menu.Item>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('year')}
                rightSection={activeFilters.timeRange === 'year' ? '✓' : null}
              >
                Last year
              </Menu.Item>
              <Menu.Item 
                onClick={() => handleTimeRangeChange('all')}
                rightSection={activeFilters.timeRange === 'all' ? '✓' : null}
              >
                All time
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          
          {/* Advanced Filters */}
          <Menu shadow="md" width={250}>
            <Menu.Target>
              <ActionIcon 
                variant="light" 
                color="blue" 
                aria-label="Advanced filters"
                className={
                  activeFilters.categories.length > 0 || activeFilters.readStatus 
                    ? classes.activeFilterButton 
                    : ''
                }
              >
                <IconFilter size={18} />
              </ActionIcon>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Label>Categories</Menu.Label>
              {availableCategories.slice(0, 6).map(category => (
                <Menu.Item
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  rightSection={activeFilters.categories.includes(category) ? '✓' : null}
                >
                  {category}
                </Menu.Item>
              ))}
              
              {availableCategories.length > 6 && (
                <Menu.Item>
                  More categories...
                </Menu.Item>
              )}
              
              <Menu.Divider />
              
              <Menu.Label>Reading Status</Menu.Label>
              <Menu.Item
                onClick={() => handleReadStatusFilter('read')}
                rightSection={activeFilters.readStatus === 'read' ? '✓' : null}
              >
                Read
              </Menu.Item>
              <Menu.Item
                onClick={() => handleReadStatusFilter('in_progress')}
                rightSection={activeFilters.readStatus === 'in_progress' ? '✓' : null}
              >
                In Progress
              </Menu.Item>
              <Menu.Item
                onClick={() => handleReadStatusFilter('unread')}
                rightSection={activeFilters.readStatus === 'unread' ? '✓' : null}
              >
                Unread
              </Menu.Item>
              <Menu.Item
                onClick={() => handleReadStatusFilter(null)}
                rightSection={!activeFilters.readStatus ? '✓' : null}
              >
                All
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          
          {/* Sort Options */}
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="light" color="blue" aria-label="Sort options">
                <IconSortDescending size={18} />
              </ActionIcon>
            </Menu.Target>
            
            <Menu.Dropdown>
              <Menu.Label>Sort By</Menu.Label>
              <Menu.Item onClick={() => onSort('last_visited', 'desc')} rightSection="↓">
                Last Viewed
              </Menu.Item>
              <Menu.Item onClick={() => onSort('first_visited', 'desc')} rightSection="↓">
                First Viewed
              </Menu.Item>
              <Menu.Item onClick={() => onSort('published_date', 'desc')} rightSection="↓">
                Publication Date
              </Menu.Item>
              <Menu.Item onClick={() => onSort('title', 'asc')} rightSection="↑">
                Title
              </Menu.Item>
              <Menu.Item onClick={() => onSort('total_reading_time_seconds', 'desc')} rightSection="↓">
                Reading Time
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        
                  {/* View mode selector (compact or grid) */}
        <SegmentedControl
          value={viewMode}
          onChange={setViewMode}
          data={[
            { label: 'Compact', value: 'compact' },
            { label: 'Grid', value: 'grid' },
          ]}
          size="xs"
          className={classes.viewModeControl}
        />
      </Group>
      
      {/* Active Filters Section */}
      {(activeFilters.categories.length > 0 || activeFilters.readStatus || activeFilters.timeRange !== 'all') && (
        <Group gap="xs" mt="xs" className={classes.activeFilters}>
          <Badge size="sm" color="gray" variant="outline">Filters:</Badge>
          {filterBadges()}
          
          <ActionIcon 
            size="xs" 
            variant="subtle" 
            color="gray"
            onClick={() => {
              setActiveFilters({
                categories: [],
                readStatus: null,
                timeRange: 'all'
              });
              setTimeRange('all');
              onFilter({
                categories: [],
                readStatus: null,
                timeRange: 'all'
              });
            }}
          >
            <IconX size={12} />
            <span className={classes.clearText}>Clear all</span>
          </ActionIcon>
        </Group>
      )}
    </Box>
  );
}
