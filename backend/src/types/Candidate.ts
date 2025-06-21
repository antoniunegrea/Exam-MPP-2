export type Party = 'PSD' | 'PNL' | 'POT' | 'AUR' | 'Independent';

export interface Candidate {
  id: number;
  name: string;
  description: string;
  image: string;
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