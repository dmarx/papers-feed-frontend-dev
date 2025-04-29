// src/services/ghStoreService.ts
import { GitHubStoreClient } from 'gh-store-client';
import { StoredObject } from '../types';

// GitHub token should be provided via environment variables in a real app
// For development, we're using a placeholder
// In production, this would come from an environment variable or user authentication
//const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN || 'placeholder_token';
//const REPO = import.meta.env.VITE_GITHUB_REPO || 'owner/repo';
const REPO = "dmarx/papers-feed-frontend-dev" // TODO: remove `-frontend-dev`
const GITHUB_TOKEN = null;
  
// Initialize the GitHub Store client
const ghClient = new GitHubStoreClient(GITHUB_TOKEN, REPO);

/**
 * Fetches the complete GitHub Store object for a paper by its ID
 * @param paperArxivId The ArXiv ID of the paper to fetch
 * @returns The complete GitHub Store object
 */
export async function fetchPaperDetails(paperArxivId: string): Promise<StoredObject | null> {
  try {
    // In a real implementation, you would fetch from the actual GitHub Store
    // For now, we'll use a simulated response based on the papers.json data
    
    // Simulate a network request
    const response = await fetch('./papers.json');
    if (!response.ok) {
      throw new Error('Failed to fetch papers');
    }
    
    const papers = await response.json();
    
    // Find the paper by ArXiv ID
    const paper = Object.values(papers).find(
      (p: any) => p.arxivId === paperArxivId
    );
    
    if (!paper) {
      throw new Error(`Paper with ID ${paperArxivId} not found`);
    }
    
    // Simulate additional GitHub Store object data
    // In a real implementation, you would use:
    // const fullObject = await ghClient.getObject(paper.id);
    
    // Create an enhanced object with the paper data plus simulated gh-store metadata
    const simulatedGhStoreObject: StoredObject = {
      meta: {
        objectId: paper.id,
        label: `UID:${paper.id}`,
        createdAt: new Date(paper.published_date),
        updatedAt: new Date(paper.last_visited),
        version: 1
      },
      data: {
        ...paper,
        // Simulated additional data that would be in the gh-store but not in papers.json
        internal_comments: "This paper is highly relevant to our current research",
        review_status: "peer_reviewed",
        significance_rating: 4.5,
        implementation_details: {
          code_available: true,
          github_repo: "https://github.com/example/paper-implementation"
        },
        citations_count: 127,
        related_papers: [
          "2204.01382",
          "2103.14030",
          "2105.05233"
        ]
      }
    };
    
    return simulatedGhStoreObject;
  } catch (error) {
    console.error('Error fetching paper details:', error);
    return null;
  }
}

/**
 * Fetches the history of changes for a paper
 * @param paperId The ID of the paper
 * @returns Array of history entries
 */
export async function fetchPaperHistory(paperId: string): Promise<Array<{timestamp: string; type: string; data: any}> | null> {
  try {
    // Simulate a history response
    // In a real implementation, you would use:
    // return await ghClient.getObjectHistory(paperId);
    
    return [
      {
        timestamp: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
        type: "initial_state",
        data: { status: "added_to_collection", notes: "Initial import from ArXiv" }
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
        type: "update",
        data: { status: "reading", notes: "Started reading this paper" }
      },
      {
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: "update",
        data: { status: "completed", notes: "Finished reading, very informative" }
      }
    ];
  } catch (error) {
    console.error('Error fetching paper history:', error);
    return null;
  }
}
