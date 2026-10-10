export interface AppError {
  code: string;
  message: string;
  fields?: Record<string, string>;
  isNetwork: boolean;
  status?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}

export type AgeGroup =
  | 'TEEN_BEGINNER'
  | 'TEEN_ADVANCED'
  | 'YOUNG_ADULT'
  | 'YOUNG_PROFESSIONAL';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  dob: string;
  ageGroup?: AgeGroup | null;
  xp: number;
  streak: number;
  longestStreak: number;
  lastActiveDate?: string | null;
  cashBalance: number;
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}
