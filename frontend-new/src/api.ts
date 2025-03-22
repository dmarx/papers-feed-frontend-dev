// frontend-new/src/api.ts
import { Paper } from './types';

export interface MessageResponse {
  message: string;
}

export const fetchMessage = async (): Promise<MessageResponse> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ 
        message: "Configuration successful! Your Mantine UI + React Query + Rollup app is working correctly!"
      });
    }, 500);
  });
};

export const fetchPapers = async (): Promise<Paper[]> => {
  try {
    const response = await fetch('/web/data/papers.json');
    if (!response.ok) {
      throw new Error('Failed to fetch papers');
    }
    const data = await response.json();
    return Object.values(data) as Paper[];
  } catch (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
};
