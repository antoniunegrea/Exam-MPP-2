import { Candidate, CreateCandidateRequest, UpdateCandidateRequest, PartyStatistics } from '../config/supabase';
export declare class DatabaseService {
    static getAllCandidates(): Promise<Candidate[]>;
    static getCandidateById(id: number): Promise<Candidate | null>;
    static createCandidate(candidateData: CreateCandidateRequest): Promise<Candidate>;
    static updateCandidate(id: number, updateData: UpdateCandidateRequest): Promise<Candidate | null>;
    static deleteCandidate(id: number): Promise<boolean>;
    static getPartyStatistics(): Promise<PartyStatistics[]>;
    static generateFakeCandidate(): Promise<Candidate>;
    private static generateFakeCandidateManually;
    static getComprehensiveStatistics(): Promise<{
        totalCandidates: number;
        partyStats: PartyStatistics[];
        mostPopularParty: "PSD" | "PNL" | "POT" | "AUR" | "Independent" | null;
    }>;
    static isValidParty(party: string): party is Candidate['party'];
}
