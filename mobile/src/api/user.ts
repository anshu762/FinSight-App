import { apiClient } from './client';
import {
  type CheckInResponse,
  type UserProfile,
  type AgeGroup,
} from './types';

export const checkIn = async (): Promise<CheckInResponse> => {
  return apiClient.post<unknown, CheckInResponse>('/api/me/checkin');
};

export const updateUserProfile = async (payload: {
  name?: string;
  ageGroup?: AgeGroup;
}): Promise<UserProfile> => {
  const res = await apiClient.patch<unknown, { user: UserProfile }>(
    '/api/users/me',
    payload
  );
  return res.user;
};

export const getMe = async (): Promise<UserProfile> => {
  const res = await apiClient.get<unknown, { user: UserProfile }>('/api/auth/me');
  return res.user;
};
