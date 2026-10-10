import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { ApiError } from '../lib/api-error.js';

interface JwtPayload {
  userId: string;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      ApiError.unauthorized('Authentication token is missing or malformed', 'UNAUTHORIZED')
    );
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(
      ApiError.unauthorized('Authentication token is missing', 'UNAUTHORIZED')
    );
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    if (!decoded.userId) {
      return next(ApiError.unauthorized('Invalid token payload', 'UNAUTHORIZED'));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true },
    });

    if (!user) {
      return next(
        ApiError.unauthorized('User associated with this token no longer exists', 'UNAUTHORIZED')
      );
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        ApiError.unauthorized('Authentication token has expired. Please log in again.', 'TOKEN_EXPIRED')
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(
        ApiError.unauthorized('Invalid authentication token', 'UNAUTHORIZED')
      );
    }
    next(error);
  }
};
