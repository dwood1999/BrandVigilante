import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sessionConfig } from '$lib/server/auth';

export const POST: RequestHandler = async ({ cookies }) => {
    cookies.delete(sessionConfig.cookieName, { path: '/' });
    throw redirect(302, '/sign-in');
}; 