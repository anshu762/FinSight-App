import { useQuery } from '@tanstack/react-query';
import { getTopics } from '../api/learn';
import { type TopicSummary } from '../api/types';

export const useTopics = () => {
  return useQuery<TopicSummary[]>({
    queryKey: ['topics'],
    queryFn: getTopics,
  });
};
