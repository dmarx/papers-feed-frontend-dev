// frontend-new/src/api.ts
// This file is kept for backward compatibility and references
// For active API calls, use services/ghStoreService.ts directly

import { StoredObject } from './types';
import { fetchAllPapers } from './services/ghStoreService';

// Legacy API interface - maintained for compatibility
export interface MessageResponse {
  message: string;
}

// Legacy test function - can be removed later
export const fetchMessage = async (): Promise<MessageResponse> => {
  return {
    message: "GitHub Store is connected and ready to use!"
  };
};

// Legacy function - redirects to the appropriate GitHub Store service call
export const fetchPapers = async (): Promise<any[]> => {
  try {
    // Use the GitHub Store service instead
    const storedObjects = await fetchAllPapers();
    
    // Transform the objects to ensure backward compatibility
    return storedObjects.map((obj: StoredObject) => {
      const paperData = obj.data as any;
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
  } catch (error) {
    console.error('Error fetching papers from GitHub Store:', error);
    return [];
  }
};
