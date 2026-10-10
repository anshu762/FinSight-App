export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly fields?: Record<string, string>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  static badRequest(message: string, code = 'BAD_REQUEST', fields?: Record<string, string>): ApiError {
    return new ApiError(400, code, message, fields);
  }

  static unauthorized(message: string, code = 'UNAUTHORIZED'): ApiError {
    return new ApiError(401, code, message);
  }

  static forbidden(message: string, code = 'FORBIDDEN'): ApiError {
    return new ApiError(403, code, message);
  }

  static notFound(message: string, code = 'NOT_FOUND'): ApiError {
    return new ApiError(404, code, message);
  }

  static conflict(message: string, code = 'CONFLICT', fields?: Record<string, string>): ApiError {
    return new ApiError(409, code, message, fields);
  }

  static unprocessable(message: string, code = 'VALIDATION_ERROR', fields?: Record<string, string>): ApiError {
    return new ApiError(422, code, message, fields);
  }

  static internal(message = 'Internal server error', code = 'INTERNAL_SERVER_ERROR'): ApiError {
    return new ApiError(500, code, message);
  }
}
