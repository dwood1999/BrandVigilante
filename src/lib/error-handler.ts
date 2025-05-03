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

export class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
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

export function handleError(error: unknown): Response {
    logger.error('Error occurred', { error });

    if (error instanceof AuthenticationError) {
        return new Response(
            JSON.stringify({
                error: error.message,
                code: 'AUTHENTICATION_ERROR'
            }),
            {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    if (error instanceof Error) {
        return new Response(
            JSON.stringify({
                error: error.message,
                code: 'INTERNAL_SERVER_ERROR'
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    return new Response(
        JSON.stringify({
            error: 'An unexpected error occurred',
            code: 'UNKNOWN_ERROR'
        }),
        {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        }
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