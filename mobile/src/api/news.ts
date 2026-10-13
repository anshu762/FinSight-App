import { apiClient } from './client';
import {
  type NewsCategory,
  type NewsListResponse,
  type NewsArticleDetail,
  type ReadNewsResult,
} from './types';

export const getNewsArticles = async (params?: {
  category?: NewsCategory | 'ALL';
  cursor?: string;
  limit?: number;
}): Promise<NewsListResponse> => {
  return apiClient.get<unknown, NewsListResponse>('/api/news', {
    params,
  });
};

export const getNewsArticleDetail = async (id: string): Promise<NewsArticleDetail> => {
  return apiClient.get<unknown, NewsArticleDetail>(`/api/news/${id}`);
};

export const markArticleAsRead = async (id: string): Promise<ReadNewsResult> => {
  return apiClient.post<unknown, ReadNewsResult>(`/api/news/${id}/read`);
};
