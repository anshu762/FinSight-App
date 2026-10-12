import { useMutation } from '@tanstack/react-query';
import { updateUserProfile } from '../api/user';
import { type AgeGroup, type UserProfile } from '../api/types';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';
import { invalidateHome } from '../api/query-client';

export const useProfile = () => {
  const updateUser = useAuthStore((s) => s.updateUser);
  const showToast = useToastStore((s) => s.show);

  const mutation = useMutation<
    UserProfile,
    Error,
    { name?: string; ageGroup?: AgeGroup }
  >({
    mutationFn: (payload) => updateUserProfile(payload),
    onSuccess: async (updatedUser) => {
      await updateUser(updatedUser);
      invalidateHome();
      showToast('Profile updated successfully', 'success');
    },
    onError: (err) => {
      showToast(err.message || 'Failed to update profile', 'error');
    },
  });

  return mutation;
};
