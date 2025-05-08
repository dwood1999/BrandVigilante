import type { Handle } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { validateSession, sessionConfig } from '$lib/server/auth';
import { auth } from '$lib/server/lucia';
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
    
    // Use Lucia's cookie name from sessionConfig
    const sessionId = event.cookies.get(sessionConfig.cookieName);
    
    logger.debug('=== HOOKS SERVER START ===', {
        url: event.url.pathname,
        method: event.request.method,
        sessionCookie: sessionId,
        cookieName: sessionConfig.cookieName,
        allCookies: event.cookies.getAll().map(c => ({
            name: c.name,
            value: c.value ? c.value.substring(0, 10) + '...' : null
        }))
    });

    try {
        if (sessionId) {
            logger.debug('=== SESSION VALIDATION START ===', { 
                sessionId,
                cookieName: sessionConfig.cookieName
            });

            if (validateSession(sessionId)) {
                // Use Lucia to validate the session
                try {
                    // Get session and user from Lucia
                    const validated = await auth.validateSession(sessionId);
                    
                    if (validated && validated.session && validated.user) {
                        const { session, user } = validated;
                        logger.debug('=== LUCIA SESSION VALIDATED ===', {
                            sessionId: session.id,
                            userId: user.id, // Assuming user object has the ID we need
                            userEmail: user.email
                        });
                        
                        // Use user.id directly if it's already a number, or parse if needed
                        const userIdNum = typeof user.id === 'number' ? user.id : Number(user.id);

                        if (isNaN(userIdNum)) {
                             logger.error('=== CRITICAL: FAILED TO GET VALID NUMERIC USER ID FROM LUCIA USER OBJECT ===', {
                                sessionId: session.id,
                                userIdFromUserObject: user.id,
                                userIdType: typeof user.id
                            });
                            await auth.invalidateSession(sessionId);
                            const blankCookie = auth.createBlankSessionCookie();
                            event.cookies.set(blankCookie.name, blankCookie.value, { path: '/', ...blankCookie.attributes });
                            event.locals.user = undefined; // Ensure user is not set (use undefined, not null)
                        } else {
                            // Set user in locals from the Lucia user object
                            event.locals.user = {
                                id: userIdNum, 
                                email: user.email,
                                role: user.role,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                email_verified: user.email_verified
                            };
                            
                            logger.info('=== USER SESSION VALIDATED (hooks.server.ts) ===', {
                                sessionId: session.id,
                                userId: user.id, 
                                parsedUserId: userIdNum,
                                email: user.email
                            });
                        }
                    } else {
                        logger.warn('=== INVALID LUCIA SESSION ===', { sessionId });
                        
                        // If the session is invalid, clear it
                        if (sessionId) {
                            await auth.invalidateSession(sessionId);
                            const sessionCookie = auth.createBlankSessionCookie();
                            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                                path: "/",
                                ...sessionCookie.attributes
                            });
                        }
                    }
                } catch (error) {
                    logger.error('=== ERROR VALIDATING LUCIA SESSION ===', {
                        sessionId,
                        error: error instanceof Error ? error.message : String(error),
                        stack: error instanceof Error ? error.stack : undefined
                    });
                    
                    // If there was an error, clear the session
                    if (sessionId) {
                        try {
                            await auth.invalidateSession(sessionId);
                            const sessionCookie = auth.createBlankSessionCookie();
                            event.cookies.set(sessionCookie.name, sessionCookie.value, {
                                path: "/",
                                ...sessionCookie.attributes
                            });
                        } catch (clearError) {
                            logger.error('=== ERROR CLEARING SESSION ===', {
                                sessionId,
                                error: clearError instanceof Error ? clearError.message : String(clearError)
                            });
                        }
                    }
                }
            } else {
                logger.warn('=== INVALID SESSION ID FORMAT ===', { 
                    sessionId,
                    sessionIdType: typeof sessionId,
                    sessionIdLength: sessionId.length
                });
                
                // Clear the invalid session cookie
                event.cookies.delete(sessionConfig.cookieName, { path: '/' });
            }
        } else {
            logger.debug('=== NO SESSION COOKIE FOUND ===', {
                allCookies: event.cookies.getAll().map(c => ({
                    name: c.name,
                    value: c.value ? c.value.substring(0, 5) + '...' : null
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
            sessionCookie: event.cookies.get(sessionConfig.cookieName)
        });

        return response;
    } catch (error) {
        return handleError(error);
    }
}; 