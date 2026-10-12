import { useQuery } from '@tanstack/react-query';
import { getHomeDashboard } from '../api/learn';
import { type HomeDashboard } from '../api/types';

export const useHome = () => {
  return useQuery<HomeDashboard>({
    queryKey: ['home'],
    queryFn: getHomeDashboard,
  });
};
