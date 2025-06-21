export interface User {
  id: number;
  cnp: string;
  created_at: string;
}

export interface RegisterRequest {
  cnp: string;
}

export interface LoginRequest {
  cnp: string;
} 