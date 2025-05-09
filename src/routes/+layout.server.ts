import type { LayoutServerLoad } from './$types';
import { sessionConfig } from '$lib/server/auth';
import { logger } from '$lib/logger';

export const load: LayoutServerLoad = async ({ locals }) => {
    logger.debug('Root +layout.server.ts load: locals.user is:', locals.user ? { id: locals.user.id, email: locals.user.email } : null);
    
    return {
        user: locals.user,
        cookieNameToClear: sessionConfig.cookieName
    };
}; 