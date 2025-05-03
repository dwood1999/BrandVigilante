import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    // If user is already logged in, redirect to dashboard
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }

    // Get email from URL parameters
    const email = url.searchParams.get('email');

    // If no email provided, redirect to sign up
    if (!email) {
        throw redirect(302, '/sign-up');
    }

    return {
        email,
        meta: {
            title: 'Registration Successful - JanusIPM',
            description: 'Your registration was successful. Please check your email to verify your account.'
        }
    };
}; 