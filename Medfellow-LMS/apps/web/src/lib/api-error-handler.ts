/**
 * Centralized API Error Handler
 * Provides consistent error responses and logging
 */

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
  path?: string;
}

/**
 * Handle and format errors for API routes
 */
export function handleAPIError(error: unknown, path?: string): NextResponse<ErrorResponse> {
  console.error('[API Error]', {
    error,
    path,
    timestamp: new Date().toISOString(),
  });

  // Custom API Error
  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        message: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
        path,
      },
      { status: error.statusCode }
    );
  }

  // Zod validation error
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation Error',
        message: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: error.errors,
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 400 }
    );
  }

  // Database errors (generic handler since we don't use Prisma directly)
  if (error instanceof Error && error.message?.includes('database')) {
    return NextResponse.json(
      {
        error: 'Database Error',
        message: 'An error occurred while processing your request',
        code: 'DATABASE_ERROR',
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 500 }
    );
  }

  // Generic Error
  if (error instanceof Error) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        details: isDevelopment ? { stack: error.stack } : undefined,
        timestamp: new Date().toISOString(),
        path,
      },
      { status: 500 }
    );
  }

  // Unknown error
  return NextResponse.json(
    {
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      timestamp: new Date().toISOString(),
      path,
    },
    { status: 500 }
  );
}

/**
 * Create a standard success response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<{ success: true; data: T; message?: string; timestamp: string }> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: statusCode }
  );
}

/**
 * Middleware wrapper for API routes with automatic error handling
 */
export function withErrorHandler<T = any>(
  handler: (req: Request, context?: any) => Promise<NextResponse<T>>
) {
  return async (req: Request, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleAPIError(error, req.url);
    }
  };
}

/**
 * Common API errors
 */
export const commonErrors = {
  unauthorized: () => new APIError(401, 'Unauthorized', 'UNAUTHORIZED'),
  forbidden: () => new APIError(403, 'Forbidden', 'FORBIDDEN'),
  notFound: (resource: string = 'Resource') =>
    new APIError(404, `${resource} not found`, 'NOT_FOUND'),
  badRequest: (message: string = 'Bad request') =>
    new APIError(400, message, 'BAD_REQUEST'),
  conflict: (message: string = 'Resource already exists') =>
    new APIError(409, message, 'CONFLICT'),
  tooManyRequests: () =>
    new APIError(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED'),
  internalError: (message: string = 'Internal server error') =>
    new APIError(500, message, 'INTERNAL_ERROR'),
  serviceUnavailable: (service: string) =>
    new APIError(503, `${service} is currently unavailable`, 'SERVICE_UNAVAILABLE'),
};

export default handleAPIError;

