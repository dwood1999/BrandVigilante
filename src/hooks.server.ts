import type { Handle } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { validateSession } from '$lib/session';
import { logger } from '$lib/logger';
import { handleError, AuthenticationError } from '$lib/error-handler';
import { executeQueryWithTimeout } from '$lib/db-utils';

export const handle: Handle = async ({ event, resolve }) => {
    const startTime = Date.now();
    const userId = event.cookies.get('userId');

    try {
        if (validateSession(userId)) {
            try {
                const user = await executeQueryWithTimeout(
                    'SELECT * FROM users WHERE id = ?',
                    [parseInt(userId)],
                    5000 // 5 second timeout
                );

                if (user && user.length > 0) {
                    event.locals.user = {
                        id: user[0].id,
                        email: user[0].email,
                        role: user[0].role,
                        first_name: user[0].first_name,
                        last_name: user[0].last_name,
                        email_verified: user[0].email_verified
                    };
                    logger.info('User session validated', { userId: user[0].id });
                } else {
                    logger.warn('Invalid user ID in session', { userId });
                    event.cookies.delete('userId', { path: '/' });
                }
            } catch (error) {
                logger.error('Error loading user in hooks', { error, userId });
                event.cookies.delete('userId', { path: '/' });
                throw new AuthenticationError('Session validation failed');
            }
        }

        // Disable CSRF check in development
        if (process.env.NODE_ENV === 'development') {
            event.request.headers.set('origin', event.url.origin);
        }

        const response = await resolve(event);
        
        // Log request completion
        const duration = Date.now() - startTime;
        logger.info('Request completed', {
            method: event.request.method,
            url: event.url.pathname,
            status: response.status,
            duration: `${duration}ms`
        });

        return response;
    } catch (error) {
        const appError = handleError(error);
        
        // Log error with request context
        logger.error('Request failed', {
            method: event.request.method,
            url: event.url.pathname,
            error: appError
        });

        // Return error response
        return new Response(
            JSON.stringify({
                error: appError.message,
                code: appError.code,
                details: appError.details
            }),
            {
                status: appError.statusCode,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}; 