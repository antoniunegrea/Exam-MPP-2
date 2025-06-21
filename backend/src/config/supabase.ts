import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

// Create Supabase client with anon key (for public operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create Supabase client with service role key (for admin operations)
export const supabaseAdmin = createClient(
  supabaseUrl, 
  supabaseServiceKey || supabaseAnonKey
);

// Database table names
export const TABLES = {
  CANDIDATES: 'candidates',
  PARTY_STATISTICS: 'party_statistics'
} as const;

// Party types
export const PARTY_TYPES = ['PSD', 'PNL', 'POT', 'AUR', 'Independent'] as const;
export type PartyType = typeof PARTY_TYPES[number];

// Database types
export interface Candidate {
  id: number;
  name: string;
  description: string;
  image_url: string;
  party: PartyType;
  created_at: string;
  updated_at: string;
}

export interface CreateCandidateRequest {
  name: string;
  description: string;
  image_url: string;
  party: PartyType;
}

export interface UpdateCandidateRequest {
  name?: string;
  description?: string;
  image_url?: string;
  party?: PartyType;
}

export interface PartyStatistics {
  party: PartyType;
  candidate_count: number;
  percentage: number;
} 