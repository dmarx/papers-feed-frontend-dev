export interface Paper {
  id: string;
  arxivId: string;
  title: string;
  authors: string;
  abstract: string;
  published_date: string;
  last_visited: string;
  url: string;
  arxiv_tags: string[];
  total_reading_time_seconds: number;
  features_path?: Record<string, string>;
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
