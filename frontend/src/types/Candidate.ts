// Define the allowed party values
export const ALLOWED_PARTIES = ['PSD', 'PNL', 'POT', 'AUR', 'Independent'] as const;
export type Party = typeof ALLOWED_PARTIES[number];

// Define the Candidate interface
export interface Candidate {
  id: number;
  name: string;
  description: string;
  image: string; // URL to the candidate's image
  party: Party;
}

// Sample list of candidates
export const candidates: Candidate[] = [
  {
    id: 1,
    name: "Calin Georgescu",
    description: "An experienced leader focused on education and healthcare reform.",
    image: "https://example.com/images/maria-popescu.jpg",
    party: "Independent"
  },
  {
    id: 2,
    name: "Victor Ponta",
    description: "Advocates for technology and innovation in public administration.",
    image: "https://example.com/images/ion-ionescu.jpg",
    party: "PSD"
  },
  {
    id: 3,
    name: "George Simion",
    description: "Focused on environmental sustainability and green energy.",
    image: "https://example.com/images/elena-georgescu.jpg",
    party: "AUR"
  }
];

// Service function to get candidates (ready for backend integration)
export const getCandidates = async (): Promise<Candidate[]> => {
  // TODO: Replace with actual API call
  // return fetch('/api/candidates').then(res => res.json());
  
  // For now, return hardcoded data
  return Promise.resolve(candidates);
};

// Service function to get a single candidate by ID
export const getCandidateById = async (id: number): Promise<Candidate | null> => {
  // TODO: Replace with actual API call
  // return fetch(`/api/candidates/${id}`).then(res => res.json());
  
  // For now, return hardcoded data
  const candidate = candidates.find(c => c.id === id);
  return Promise.resolve(candidate || null);
};

// Service function to create a new candidate
export const createCandidate = async (candidate: Omit<Candidate, 'id'>): Promise<Candidate> => {
  // TODO: Replace with actual API call
  // return fetch('/api/candidates', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(candidate)
  // }).then(res => res.json());
  
  // For now, simulate creation with a new ID
  const newCandidate: Candidate = {
    ...candidate,
    id: Math.max(...candidates.map(c => c.id)) + 1
  };
  candidates.push(newCandidate);
  return Promise.resolve(newCandidate);
};

// Service function to update a candidate
export const updateCandidate = async (id: number, candidate: Partial<Candidate>): Promise<Candidate> => {
  // TODO: Replace with actual API call
  // return fetch(`/api/candidates/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(candidate)
  // }).then(res => res.json());
  
  // For now, update the local data
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Candidate not found');
  }
  
  candidates[index] = { ...candidates[index], ...candidate };
  return Promise.resolve(candidates[index]);
};

// Service function to delete a candidate
export const deleteCandidate = async (id: number): Promise<void> => {
  // TODO: Replace with actual API call
  // return fetch(`/api/candidates/${id}`, {
  //   method: 'DELETE'
  // }).then(res => res.json());
  
  // For now, remove from local data
  const index = candidates.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Candidate not found');
  }
  
  candidates.splice(index, 1);
  return Promise.resolve();
}; 