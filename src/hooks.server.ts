import type { Handle } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { validateSession } from '$lib/server/auth';
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
    logger.debug('=== HOOKS SERVER START ===');

    try {
        // Get session ID from cookie
        const sessionId = event.cookies.get(auth.sessionCookieName);
        
        if (!sessionId) {
            logger.debug('=== NO SESSION COOKIE FOUND ===');
            event.locals.user = undefined;
            return await resolve(event);
        }

        logger.debug('=== SESSION VALIDATION START ===');
        logger.debug('Validating session ID');
        
        if (validateSession(sessionId)) {
            try {
                // Get session and user from Lucia
                const { session, user } = await auth.validateSession(sessionId);
                
                if (session && user) {
                    logger.debug('=== LUCIA SESSION VALIDATED ===', {
                        sessionId: session.id,
                        userId: user.id,
                        userEmail: user.email
                    });
                    
                    // Set user in locals from the Lucia user object
                    event.locals.user = {
                        id: Number(user.id),
                        email: user.email,
                        role: user.role,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email_verified: user.email_verified
                    };
                    
                    logger.info('=== USER SESSION VALIDATED ===', {
                        sessionId: session.id,
                        userId: user.id,
                        email: user.email
                    });
                } else {
                    logger.warn('=== INVALID LUCIA SESSION ===', { sessionId });
                    await auth.invalidateSession(sessionId);
                    const sessionCookie = auth.createBlankSessionCookie();
                    event.cookies.set(sessionCookie.name, sessionCookie.value, {
                        path: "/",
                        ...sessionCookie.attributes
                    });
                    event.locals.user = undefined;
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
                event.locals.user = undefined;
            }
        } else {
            logger.warn('=== INVALID SESSION ID FORMAT ===', { sessionId });
            event.locals.user = undefined;
        }

        return await resolve(event);
    } catch (error) {
        logger.error('=== UNHANDLED ERROR IN HOOKS ===', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        return await resolve(event);
    }
}; 