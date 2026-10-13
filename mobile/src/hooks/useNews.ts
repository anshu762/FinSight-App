import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNewsArticles, getNewsArticleDetail, markArticleAsRead } from '../api/news';
import {
  type NewsCategory,
  type NewsListResponse,
  type NewsArticleDetail,
  type ReadNewsResult,
} from '../api/types';

export const useNewsArticles = (category: NewsCategory | 'ALL' = 'ALL') => {
  return useInfiniteQuery<NewsListResponse>({
    queryKey: ['news', category],
    queryFn: ({ pageParam }) =>
      getNewsArticles({
        category: category === 'ALL' ? undefined : category,
        cursor: pageParam as string | undefined,
        limit: 10,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useNewsArticleDetail = (id: string) => {
  return useQuery<NewsArticleDetail>({
    queryKey: ['news', 'detail', id],
    queryFn: () => getNewsArticleDetail(id),
    enabled: Boolean(id),
  });
};

export const useMarkArticleRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ReadNewsResult, Error, string>({
    mutationFn: (id: string) => markArticleAsRead(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });

      queryClient.setQueryData<NewsArticleDetail>(
        ['news', 'detail', id],
        (old: NewsArticleDetail | undefined) => {
          if (!old) return old;
        return {
          ...old,
          isRead: true,
        };
      });
    },
  });
};
