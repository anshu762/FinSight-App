import { apiClient } from './client';
import {
  type HomeDashboard,
  type TopicSummary,
  type TopicDetailResponse,
  type BadgeItem,
} from './types';

export const getHomeDashboard = async (): Promise<HomeDashboard> => {
  return apiClient.get<unknown, HomeDashboard>('/api/home');
};

export const getTopics = async (): Promise<TopicSummary[]> => {
  const res = await apiClient.get<unknown, { topics: TopicSummary[] }>('/api/topics');
  return res.topics;
};

export const getTopicBySlug = async (slug: string): Promise<TopicDetailResponse> => {
  return apiClient.get<unknown, TopicDetailResponse>(`/api/topics/${slug}`);
};

export const getBadges = async (): Promise<BadgeItem[]> => {
  const res = await apiClient.get<unknown, { badges: BadgeItem[] }>('/api/badges');
  return res.badges;
};
