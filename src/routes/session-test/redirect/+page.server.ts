import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ cookies, request, url }) => {
    const allCookies = cookies.getAll();
    const sessionCookie = cookies.get('session');
    const requestHeaders = Object.fromEntries(request.headers.entries());
    
    logger.debug('Redirect test page load:', {
        sessionCookie,
        sessionCookieExists: !!sessionCookie,
        sessionCookieValue: sessionCookie,
        allCookies: allCookies.map(c => ({
            name: c.name,
            value: c.value
        })),
        requestHeaders,
        requestUrl: request.url,
        protocol: url.protocol,
        host: url.host,
        cookieHeader: requestHeaders.cookie
    });

    // Add a small delay to ensure cookie is processed
    await new Promise(resolve => setTimeout(resolve, 100));

    // Use SvelteKit's redirect helper
    throw redirect(302, '/session-test');
}; 