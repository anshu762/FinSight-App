import { apiClient } from './client';
import { type AuthResponse, type UserProfile } from './types';

export const loginUser = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  return apiClient.post<unknown, AuthResponse>('/api/auth/login', payload);
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  dob: string;
}): Promise<AuthResponse> => {
  return apiClient.post<unknown, AuthResponse>('/api/auth/register', payload);
};

export const getMeUser = async (): Promise<{ user: UserProfile }> => {
  return apiClient.get<unknown, { user: UserProfile }>('/api/auth/me');
};
