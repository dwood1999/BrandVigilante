import type { Handle } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { validateSession, sessionConfig } from '$lib/server/auth';
import { logger } from '$lib/logger';
import { handleError, AuthenticationError } from '$lib/error-handler';
import type { RowDataPacket } from 'mysql2';
import type { User } from '$lib/models/user';

interface UserRow extends RowDataPacket, User {
    created_at: string;
    updated_at: string;
}

export const handle: Handle = async ({ event, resolve }) => {
    const startTime = Date.now();
    
    // Skip session validation for sign-out route
    if (event.url.pathname === '/sign-out') {
        return await resolve(event);
    }
    
    const userId = event.cookies.get(sessionConfig.cookieName);
    
    logger.debug('=== HOOKS SERVER START ===', {
        url: event.url.pathname,
        method: event.request.method,
        sessionCookie: userId,
        sessionCookieType: typeof userId,
        sessionCookieLength: userId?.length,
        allCookies: event.cookies.getAll().map(c => ({
            name: c.name,
            value: c.value,
            valueType: typeof c.value,
            valueLength: c.value?.length
        })),
        requestHeaders: Object.fromEntries(event.request.headers.entries()),
        requestUrl: event.url.toString()
    });

    try {
        if (userId) {
            logger.debug('=== SESSION VALIDATION START ===', { 
                userId,
                userIdType: typeof userId,
                userIdLength: userId.length,
                rawCookie: event.cookies.get(sessionConfig.cookieName),
                rawCookieType: typeof event.cookies.get(sessionConfig.cookieName),
                rawCookieLength: event.cookies.get(sessionConfig.cookieName)?.length,
                allCookies: event.cookies.getAll().map(c => ({
                    name: c.name,
                    value: c.value,
                    valueType: typeof c.value,
                    valueLength: c.value?.length
                })),
                requestHeaders: Object.fromEntries(event.request.headers.entries()),
                requestUrl: event.url.toString(),
                cookieOptions: sessionConfig
            });

            if (validateSession(userId)) {
                const parsedUserId = parseInt(userId);
                logger.debug('=== USER LOOKUP START ===', { 
                    userId,
                    userIdType: typeof userId,
                    userIdLength: userId.length,
                    parsedUserId,
                    parsedUserIdType: typeof parsedUserId,
                    parsedUserIdString: parsedUserId.toString(),
                    parsedUserIdLength: parsedUserId.toString().length,
                    isNaN: isNaN(parsedUserId),
                    rawCookie: event.cookies.get(sessionConfig.cookieName),
                    rawCookieType: typeof event.cookies.get(sessionConfig.cookieName),
                    rawCookieLength: event.cookies.get(sessionConfig.cookieName)?.length,
                    allCookies: event.cookies.getAll().map(c => ({
                        name: c.name,
                        value: c.value,
                        valueType: typeof c.value,
                        valueLength: c.value?.length
                    })),
                    requestHeaders: Object.fromEntries(event.request.headers.entries()),
                    requestUrl: event.url.toString()
                });

                try {
                    const user = await UserModel.findById(parsedUserId);
                    logger.debug('=== USER LOOKUP RESULT ===', {
                        userFound: !!user,
                        userId: user?.id,
                        email: user?.email,
                        role: user?.role
                    });

                    if (!user || user.id === undefined) {
                        logger.warn('=== INVALID USER ID IN SESSION ===', { 
                            userId,
                            parsedUserId,
                            rawCookie: event.cookies.get(sessionConfig.cookieName),
                            isNaN: isNaN(parsedUserId),
                            parsedUserIdType: typeof parsedUserId
                        });
                        event.cookies.delete(sessionConfig.cookieName, { path: '/' });
                        return resolve(event);
                    }

                    // Set the user in locals
                    event.locals.user = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email_verified: user.email_verified || false
                    };

                    logger.info('=== USER SESSION VALIDATED ===', { 
                        userId: user.id,
                        email: user.email,
                        role: user.role,
                        userData: {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                            created_at: (user as UserRow).created_at,
                            updated_at: (user as UserRow).updated_at
                        },
                        rawCookie: event.cookies.get(sessionConfig.cookieName),
                        allCookies: event.cookies.getAll().map(c => ({
                            name: c.name,
                            value: c.value
                        })),
                        requestHeaders: Object.fromEntries(event.request.headers.entries()),
                        requestUrl: event.url.toString()
                    });
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    const errorStack = error instanceof Error ? error.stack : undefined;
                    
                    logger.error('=== ERROR LOADING USER ===', { 
                        error,
                        errorMessage,
                        errorStack,
                        userId,
                        parsedUserId,
                        rawCookie: event.cookies.get(sessionConfig.cookieName),
                        allCookies: event.cookies.getAll().map(c => ({
                            name: c.name,
                            value: c.value
                        })),
                        requestHeaders: Object.fromEntries(event.request.headers.entries()),
                        requestUrl: event.url.toString(),
                        parsedUserIdType: typeof parsedUserId,
                        isNaN: isNaN(parsedUserId),
                        errorType: error?.constructor?.name,
                        errorString: error?.toString()
                    });

                    // Delete the invalid session cookie
                    event.cookies.delete(sessionConfig.cookieName, { path: '/' });

                    // Return a proper error response
                    return new Response(JSON.stringify({
                        error: 'Session validation failed',
                        code: 'AUTHENTICATION_ERROR',
                        details: errorMessage
                    }), {
                        status: 401,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            } else {
                logger.warn('=== INVALID SESSION ID FORMAT ===', { 
                    userId,
                    userIdType: typeof userId,
                    userIdLength: userId.length,
                    rawCookie: event.cookies.get(sessionConfig.cookieName)
                });
                event.cookies.delete(sessionConfig.cookieName, { path: '/' });
            }
        } else {
            logger.debug('=== NO SESSION COOKIE FOUND ===', {
                allCookies: event.cookies.getAll().map(c => ({
                    name: c.name,
                    value: c.value
                }))
            });
        }

        // Disable CSRF check in development
        if (process.env.NODE_ENV === 'development') {
            event.request.headers.set('origin', event.url.origin);
        }

        const response = await resolve(event);
        
        // Log request completion
        const duration = Date.now() - startTime;
        logger.info('=== REQUEST COMPLETED ===', {
            method: event.request.method,
            url: event.url.pathname,
            status: response.status,
            duration: `${duration}ms`,
            user: event.locals.user,
            sessionCookie: event.cookies.get(sessionConfig.cookieName),
            responseHeaders: Object.fromEntries(response.headers.entries())
        });

        return response;
    } catch (error) {
        return handleError(error);
    }
}; 