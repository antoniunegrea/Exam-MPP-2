import { supabase, supabaseAdmin, TABLES, PARTY_TYPES, Candidate, CreateCandidateRequest, UpdateCandidateRequest, PartyStatistics } from '../config/supabase';

export class DatabaseService {
  // Get all candidates
  static async getAllCandidates(): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching candidates:', error);
        throw new Error('Failed to fetch candidates from database');
      }

      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Get candidate by ID
  static async getCandidateById(id: number): Promise<Candidate | null> {
    try {
      const { data, error } = await supabase
        .from(TABLES.CANDIDATES)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching candidate:', error);
        throw new Error('Failed to fetch candidate from database');
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Create new candidate
  static async createCandidate(candidateData: CreateCandidateRequest): Promise<Candidate> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.CANDIDATES)
        .insert([candidateData])
        .select()
        .single();

      if (error) {
        console.error('Error creating candidate:', error);
        throw new Error('Failed to create candidate in database');
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Update candidate
  static async updateCandidate(id: number, updateData: UpdateCandidateRequest): Promise<Candidate | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from(TABLES.CANDIDATES)
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error updating candidate:', error);
        throw new Error('Failed to update candidate in database');
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Delete candidate
  static async deleteCandidate(id: number): Promise<boolean> {
    try {
      const { error } = await supabaseAdmin
        .from(TABLES.CANDIDATES)
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting candidate:', error);
        throw new Error('Failed to delete candidate from database');
      }

      return true;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Get party statistics
  static async getPartyStatistics(): Promise<PartyStatistics[]> {
    try {
      const { data, error } = await supabase
        .from(TABLES.PARTY_STATISTICS)
        .select('*')
        .order('candidate_count', { ascending: false });

      if (error) {
        console.error('Error fetching party statistics:', error);
        throw new Error('Failed to fetch party statistics from database');
      }

      return data || [];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }

  // Generate fake candidate using database function
  static async generateFakeCandidate(): Promise<Candidate> {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('generate_fake_candidate');

      if (error) {
        console.error('Error generating fake candidate:', error);
        // Fallback to manual generation if function doesn't exist
        return this.generateFakeCandidateManually();
      }

      return data;
    } catch (error) {
      console.error('Database error:', error);
      // Fallback to manual generation
      return this.generateFakeCandidateManually();
    }
  }

  // Manual fake candidate generation (fallback)
  private static async generateFakeCandidateManually(): Promise<Candidate> {
    const romanianNames = [
      'Alexandru Popescu', 'Maria Ionescu', 'Victor Dumitrescu', 'Elena Georgescu',
      'Ion Vasilescu', 'Ana Marin', 'Stefan Radu', 'Cristina Munteanu',
      'Mihai Stoica', 'Laura Dragomir', 'Andrei Neagu', 'Diana Popa',
      'Bogdan Tudor', 'Roxana Stan', 'Florin Cirstea', 'Gabriela Lupu'
    ];

    const campaignDescriptions = [
      'Experienced leader focused on economic development and job creation.',
      'Advocate for education reform and digital transformation.',
      'Committed to environmental protection and sustainable development.',
      'Dedicated to healthcare improvement and social welfare.',
      'Focused on infrastructure development and urban planning.',
      'Champion of youth empowerment and innovation.',
      'Expert in public administration and governance reform.',
      'Passionate about cultural preservation and community building.'
    ];

    const randomName = romanianNames[Math.floor(Math.random() * romanianNames.length)];
    const randomDescription = campaignDescriptions[Math.floor(Math.random() * campaignDescriptions.length)];
    const randomParty = PARTY_TYPES[Math.floor(Math.random() * PARTY_TYPES.length)];
    const randomImageId = Math.floor(Math.random() * 1000);

    const fakeCandidate: CreateCandidateRequest = {
      name: randomName,
      description: randomDescription,
      image_url: `https://picsum.photos/200/200?random=${randomImageId}`,
      party: randomParty
    };

    return this.createCandidate(fakeCandidate);
  }

  // Get comprehensive statistics
  static async getComprehensiveStatistics() {
    try {
      const [candidates, partyStats] = await Promise.all([
        this.getAllCandidates(),
        this.getPartyStatistics()
      ]);

      const totalCandidates = candidates.length;
      const mostPopularParty = partyStats.length > 0 ? partyStats[0].party : null;

      return {
        totalCandidates,
        partyStats,
        mostPopularParty
      };
    } catch (error) {
      console.error('Error fetching comprehensive statistics:', error);
      throw error;
    }
  }

  // Validate party type
  static isValidParty(party: string): party is Candidate['party'] {
    return PARTY_TYPES.includes(party as any);
  }
} 