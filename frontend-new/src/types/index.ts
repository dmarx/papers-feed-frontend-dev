// Enhanced types to include GitHub Store integration

// Original Paper type
export interface Paper {
  id: string;
  title: string;
  authors: string;
  abstract: string;
  url: string;
  arxivId: string;
  last_visited: string;
  last_read: string;
  total_reading_time_seconds: number;
  published_date: string;
  arxiv_tags: string[];
}

// GitHub Store types
export type Json = { [key: string]: Json } | Json[] | string | number | boolean | null;

export interface ObjectMeta {
  objectId: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

export interface StoredObject {
  meta: ObjectMeta;
  data: Json;
}

export interface CommentMeta {
  client_version: string;
  timestamp: string;
  update_mode: string;
}

export interface CommentPayload {
  _data: Json;
  _meta: CommentMeta;
  type?: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  field: keyof Paper | null;
  direction: SortDirection;
}

export interface GroupedPapers {
  [date: string]: Paper[];
}

export interface FilterState {
  mode: 'any' | 'all' | 'none';
  activeTags: string[];
}

export interface UrlState {
  q?: string;
  fields?: string;
  mode?: 'any' | 'all' | 'none';
  tags?: string;
}

export interface CategoryInfo {
  name: string;
  color: string;
}

export interface GitInfo {
  repo: string;
  branch: string;
  commit: string;
}

export interface AppSettings {
  coloringEnabled: boolean;
  colorBy: 'freshness' | 'readingTime';
  enabledFeatures: Record<string, boolean>;
}
