export interface Vote {
  id: number;
  user_id: number;
  candidate_id: number;
  created_at: string;
}

export interface CreateVoteRequest {
  candidate_id: number;
}

export interface VoteStatistics {
  candidate_id: number;
  candidate_name: string;
  vote_count: number;
  percentage: number;
} 