import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../lib/api-error.js';

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // 1. ApiError
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        ...(err.fields ? { fields: err.fields } : {}),
      },
    });
    return;
  }

  // 2. Zod validation error -> 422
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      // Key can be path inside body (e.g. ['body', 'email'] -> 'email')
      const pathSegments = issue.path.filter((segment) => segment !== 'body');
      const fieldKey = pathSegments.length > 0 ? pathSegments.join('.') : 'root';
      if (!fields[fieldKey]) {
        fields[fieldKey] = issue.message;
      }
    }

    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        fields,
      },
    });
    return;
  }

  // 3. Prisma database errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = Array.isArray(err.meta?.target)
        ? (err.meta.target as string[]).join(', ')
        : 'Unique constraint failed';
      res.status(409).json({
        success: false,
        error: {
          code: 'CONFLICT',
          message: `Record conflict: ${target}`,
        },
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Requested record was not found',
        },
      });
      return;
    }
  }

  // 4. Fallback internal server error (never leak internal stack trace to client)
  console.error(`[Unhandled Internal Error]: ${err.message}`, process.env.NODE_ENV !== 'production' ? err.stack : undefined);
  res.status(500).json({

    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred',
    },
  });
};
