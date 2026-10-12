import { useQuery } from '@tanstack/react-query';
import { getBadges } from '../api/learn';
import { type BadgeItem } from '../api/types';

export const useBadges = () => {
  return useQuery<BadgeItem[]>({
    queryKey: ['badges'],
    queryFn: getBadges,
  });
};
