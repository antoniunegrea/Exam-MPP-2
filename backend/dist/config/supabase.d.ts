export declare const supabase: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const supabaseAdmin: import("@supabase/supabase-js").SupabaseClient<any, "public", any>;
export declare const TABLES: {
    readonly CANDIDATES: "candidates";
    readonly PARTY_STATISTICS: "party_statistics";
};
export declare const PARTY_TYPES: readonly ["PSD", "PNL", "POT", "AUR", "Independent"];
export type PartyType = typeof PARTY_TYPES[number];
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
