import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { type User } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../lib/api-error.js';
import { getLevelInfo, type LevelInfo } from '../gamification/level.js';
import { type RegisterInput, type LoginInput } from './auth.schema.js';

export type SafeUser = Omit<User, 'passwordHash'> & LevelInfo;

export const sanitizeUser = (user: User): SafeUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _passwordHash, ...safeUser } = user;
  const levelInfo = getLevelInfo(user.xp);
  return {
    ...safeUser,
    ...levelInfo,
  };
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
};

export const registerUser = async (
  input: RegisterInput
): Promise<{ token: string; user: SafeUser }> => {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'Email already registered', {
      email: 'Email is already registered',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(input.password, saltRounds);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      dob: input.dob,
    },
  });

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const loginUser = async (
  input: LoginInput
): Promise<{ token: string; user: SafeUser }> => {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const token = generateToken(user.id);

  return {
    token,
    user: sanitizeUser(user),
  };
};

export const getUserProfile = async (userId: string): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw ApiError.notFound('User not found', 'USER_NOT_FOUND');
  }

  return sanitizeUser(user);
};
