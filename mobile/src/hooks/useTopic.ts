import { useQuery } from '@tanstack/react-query';
import { getTopicBySlug } from '../api/learn';
import { type TopicDetailResponse } from '../api/types';

export const useTopic = (slug: string) => {
  return useQuery<TopicDetailResponse>({
    queryKey: ['topic', slug],
    queryFn: () => getTopicBySlug(slug),
    enabled: Boolean(slug),
  });
};
