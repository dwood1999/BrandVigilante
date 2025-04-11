import { logger } from './logger';
import { DatabaseError, QueryError, ConnectionError } from './db-utils';

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string,
        public details?: Record<string, any>
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: Record<string, any>) {
        super(message, 400, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication failed') {
        super(message, 401, 'AUTHENTICATION_ERROR');
        this.name = 'AuthenticationError';
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Not authorized') {
        super(message, 403, 'AUTHORIZATION_ERROR');
        this.name = 'AuthorizationError';
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export function handleError(error: unknown): AppError {
    // Log the error
    logger.error('Error occurred', { error });

    // Handle known error types
    if (error instanceof AppError) {
        return error;
    }

    if (error instanceof DatabaseError) {
        return new AppError(
            'Database error occurred',
            500,
            'DATABASE_ERROR',
            {
                code: error.code,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage
            }
        );
    }

    if (error instanceof QueryError) {
        return new AppError(
            'Database query error occurred',
            500,
            'QUERY_ERROR',
            {
                code: error.code,
                sqlState: error.sqlState,
                sqlMessage: error.sqlMessage
            }
        );
    }

    if (error instanceof ConnectionError) {
        return new AppError(
            'Database connection error occurred',
            503,
            'CONNECTION_ERROR'
        );
    }

    // Handle unknown errors
    if (error instanceof Error) {
        return new AppError(
            error.message || 'An unexpected error occurred',
            500,
            'INTERNAL_SERVER_ERROR'
        );
    }

    // Handle non-Error objects
    return new AppError(
        'An unexpected error occurred',
        500,
        'INTERNAL_SERVER_ERROR'
    );
}

export function isOperationalError(error: Error): boolean {
    if (error instanceof AppError) {
        // 4xx errors are operational errors
        if (error.statusCode >= 400 && error.statusCode < 500) {
            return true;
        }
        // 5xx errors are not operational errors
        return false;
    }
    // Unknown errors are not operational errors
    return false;
} 