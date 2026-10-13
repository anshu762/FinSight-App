import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export const invalidateHome = () => queryClient.invalidateQueries({ queryKey: ['home'] });
export const invalidateTopics = () => queryClient.invalidateQueries({ queryKey: ['topics'] });
export const invalidateTopic = (slug: string) => queryClient.invalidateQueries({ queryKey: ['topic', slug] });
export const invalidateBadges = () => queryClient.invalidateQueries({ queryKey: ['badges'] });
export const invalidateNews = () => queryClient.invalidateQueries({ queryKey: ['news'] });
export const invalidateAllData = () => {
  queryClient.invalidateQueries({ queryKey: ['home'] });
  queryClient.invalidateQueries({ queryKey: ['topics'] });
  queryClient.invalidateQueries({ queryKey: ['badges'] });
  queryClient.invalidateQueries({ queryKey: ['news'] });
};
