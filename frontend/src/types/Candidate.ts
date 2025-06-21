// Define the allowed party values
export type Party = 'PSD' | 'PNL' | 'POT' | 'AUR' | 'Independent';

// Define the Candidate interface
export interface Candidate {
  id: number;
  name: string;
  description: string;
  image: string; // URL to the candidate's image
  party: Party;
}

export interface CreateCandidateRequest {
  name: string;
  description: string;
  image: string;
  party: Party;
}

export interface UpdateCandidateRequest {
  name?: string;
  description?: string;
  image?: string;
  party?: Party;
}

export const ALLOWED_PARTIES: Party[] = ['PSD', 'PNL', 'POT', 'AUR', 'Independent'];

const API_BASE_URL = 'http://localhost:3001/api';

// API service functions
export const getCandidates = async (): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

export const getCandidateById = async (id: number): Promise<Candidate | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching candidate:', error);
    throw error;
  }
};

export const createCandidate = async (candidateData: CreateCandidateRequest): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

export const updateCandidate = async (id: number, candidateData: UpdateCandidateRequest): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

export const deleteCandidate = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Statistics API functions
export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

export const generateFakeCandidate = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics/generate`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating candidate:', error);
    throw error;
  }
}; 