import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLessonById, completeLesson } from '../api/learn';
import {
  type LessonDetail,
  type CompleteLessonPayload,
  type CompleteLessonResponse,
  type AppError,
} from '../api/types';

export const useLesson = (lessonId: string) => {
  return useQuery<LessonDetail, AppError>({
    queryKey: ['lesson', lessonId],
    queryFn: () => getLessonById(lessonId),
    enabled: Boolean(lessonId),
    retry: (failureCount, error) => {
      // Do not retry 403 (LOCKED) or 404 (NOT_FOUND) errors
      if (error?.status === 403 || error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useCompleteLesson = (lessonId: string, topicSlug?: string) => {
  const queryClient = useQueryClient();

  return useMutation<CompleteLessonResponse, AppError, CompleteLessonPayload>({
    mutationFn: (payload) => completeLesson(lessonId, payload),
    onSuccess: () => {
      // Task 8: Invalidate react-query keys: home, topics, topic detail, badges, me/profile
      queryClient.invalidateQueries({ queryKey: ['home'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      if (topicSlug) {
        queryClient.invalidateQueries({ queryKey: ['topic', topicSlug] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['topic'] });
      }
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['lesson', lessonId] });
    },
  });
};
