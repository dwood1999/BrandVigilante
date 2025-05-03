import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { sessionConfig } from '$lib/server/auth';
import { logger } from '$lib/logger';

export const actions: Actions = {
    default: async ({ cookies }) => {
        const cookieName = sessionConfig.cookieName;
        const cookieValueBefore = cookies.get(cookieName);
        const allCookiesBefore = cookies.getAll().map(c => ({ name: c.name, value: c.value }));

        logger.debug('=== SIGN-OUT ACTION START ===', {
            cookieName,
            cookieValueBefore,
            allCookiesBefore,
        });

        // Define exact options for deletion/clearing
        const deleteOptions = {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'lax' as const,
            maxAge: 0, // Set maxAge to 0 for immediate expiry
            expires: new Date(0) // Also set expires to the past
        };

        logger.debug('=== DELETING/CLEARING COOKIE ===', { cookieName, options: deleteOptions });

        // Clear the cookie by setting empty value and immediate expiry
        cookies.set(cookieName, '', deleteOptions);
        
        // Double-check if it was cleared from the server-side context
        const cookieValueAfter = cookies.get(cookieName);
        const allCookiesAfter = cookies.getAll().map(c => ({ name: c.name, value: c.value }));

        logger.debug('=== COOKIE AFTER DELETE/CLEAR ATTEMPT ===', {
            cookieName,
            cookieValueAfter: cookieValueAfter || 'undefined (expected)',
            allCookiesAfter,
        });
        
        logger.debug('=== SIGN-OUT ACTION COMPLETED - Returning success ===');
        // Return a plain success object
        return { success: true };
    }
}; 