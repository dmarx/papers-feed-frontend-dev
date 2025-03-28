// src/services/ghStoreService.ts
import { GitHubStoreClient } from 'gh-store-client';
import { StoredObject } from '../types';

// Repository info
const REPO = "dmarx/papers-feed";
const GITHUB_TOKEN = null;

// Initialize the GitHub Store client
// In a production app, you'd want to handle GitHub auth
// For public repositories or read-only access, null token is fine
const ghClient = new GitHubStoreClient(GITHUB_TOKEN, REPO);

/**
 * Fetches paper details directly from GitHub Store by arxivId
 */
export async function fetchPaperDetails(arxivId: string): Promise<StoredObject> {
  try {
    // Query the GitHub Store for the paper by arxivId
    const paper = await ghClient.getObjectByQuery({ arxivId });
    
    if (!paper) {
      throw new Error(`Paper with arxivId ${arxivId} not found`);
    }
    
    return paper;
  } catch (error) {
    console.error('Error fetching paper details:', error);
    throw error;
  }
}

/**
 * Fetches the history of a paper object from GitHub Store
 */
export async function fetchPaperHistory(objectId: string): Promise<Array<{timestamp: string; type: string; data: any}>> {
  try {
    // Get the object history directly from GitHub Store
    return await ghClient.getObjectHistory(objectId);
  } catch (error) {
    console.error('Error fetching paper history:', error);
    throw error;
  }
}

/**
 * Fetches all papers from GitHub Store
 */
export async function fetchAllPapers(): Promise<StoredObject[]> {
  try {
    // Get all objects from GitHub Store
    //return await ghClient.getAllObjects();
    return await ghClient.listAll();
  } catch (error) {
    console.error('Error fetching all papers:', error);
    throw error;
  }
}

/**
 * Updates a paper in GitHub Store
 */
export async function updatePaper(objectId: string, data: any): Promise<StoredObject> {
  try {
    return await ghClient.updateObject(objectId, data);
  } catch (error) {
    console.error('Error updating paper:', error);
    throw error;
  }
}

/**
 * Creates a new paper in GitHub Store
 */
export async function createPaper(data: any): Promise<StoredObject> {
  try {
    return await ghClient.createObject(data);
  } catch (error) {
    console.error('Error creating paper:', error);
    throw error;
  }
}
