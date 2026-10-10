import { prisma } from '../../lib/prisma.js';
import { ApiError } from '../../lib/api-error.js';
import { sanitizeUser, type SafeUser } from '../auth/auth.service.js';
import { type PatchMeInput } from './user.schema.js';

export const updateCurrentUser = async (
  userId: string,
  input: PatchMeInput
): Promise<SafeUser> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(input.ageGroup !== undefined ? { ageGroup: input.ageGroup } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
    },
  });

  return sanitizeUser(updatedUser);
};
