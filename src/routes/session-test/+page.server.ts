import type { PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    logger.debug('Session test page load:', {
        user: locals.user,
        sessionCookie: cookies.get('session'),
        allCookies: cookies.getAll().map(c => ({
            name: c.name,
            value: c.value
        }))
    });

    return {
        user: locals.user
    };
}; 