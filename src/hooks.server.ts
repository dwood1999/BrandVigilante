import type { Handle } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { validateSession } from '$lib/session';
import { logger } from '$lib/logger';

export const handle: Handle = async ({ event, resolve }) => {
    const userId = event.cookies.get('userId');

    if (validateSession(userId)) {
        try {
            const user = await UserModel.findById(parseInt(userId));
            if (user) {
                event.locals.user = {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email_verified: user.email_verified
                };
            } else {
                // Invalid user ID, clear the cookie
                event.cookies.delete('userId', { path: '/' });
            }
        } catch (error) {
            logger.error('Error loading user in hooks:', error);
            // Clear invalid session
            event.cookies.delete('userId', { path: '/' });
        }
    }

    // Disable CSRF check in development
    if (process.env.NODE_ENV === 'development') {
        event.request.headers.set('origin', event.url.origin);
    }

    const response = await resolve(event);
    return response;
}; 