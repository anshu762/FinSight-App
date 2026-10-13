import { apiClient } from './client';
import {
  type HomeDashboard,
  type TopicSummary,
  type TopicDetailResponse,
  type BadgeItem,
  type LessonDetail,
  type CompleteLessonPayload,
  type CompleteLessonResponse,
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

export const getLessonById = async (id: string): Promise<LessonDetail> => {
  return apiClient.get<unknown, LessonDetail>(`/api/lessons/${id}`);
};

export const completeLesson = async (
  id: string,
  payload: CompleteLessonPayload
): Promise<CompleteLessonResponse> => {
  return apiClient.post<unknown, CompleteLessonResponse>(`/api/lessons/${id}/complete`, payload);
};
