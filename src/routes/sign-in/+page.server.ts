import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { verifyPassword } from '$lib/auth';
import { sessionConfig, checkLoginRateLimit } from '$lib/session';
import { SignInSchema } from '$lib/auth';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    // Redirect if already logged in
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }

    return {
        meta: {
            title: 'Sign In - JanusIPM',
            description: 'Sign in to your JanusIPM account'
        }
    };
};

export const actions: Actions = {
    default: async ({ request, cookies, getClientAddress }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            const validatedData = SignInSchema.parse(data);
            const { email, password } = validatedData;

            // Check rate limiting
            const ipAddress = getClientAddress();
            if (!checkLoginRateLimit(ipAddress)) {
                return fail(429, {
                    message: 'Too many login attempts. Please try again later.',
                });
            }

            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return fail(400, {
                    message: 'Invalid email or password',
                    data: { email }
                });
            }

            // Verify password
            const isValid = await verifyPassword(user.password, password);
            if (!isValid) {
                logger.warn(`Failed login attempt for user ${email} from IP ${ipAddress}`);
                return fail(400, {
                    message: 'Invalid email or password',
                    data: { email }
                });
            }

            // Set session cookie
            cookies.set(sessionConfig.cookieName, user.id.toString(), {
                ...sessionConfig,
                secure: !dev // Allow non-HTTPS in development
            });

            logger.info(`User ${email} logged in successfully`);
            throw redirect(302, '/dashboard');

        } catch (error) {
            logger.error('Login error:', error);
            
            if (error.errors) {
                return fail(400, {
                    fieldErrors: error.flatten().fieldErrors,
                    data: { email: data.email }
                });
            }

            return fail(500, {
                message: 'An unexpected error occurred. Please try again.',
                data: { email: data.email }
            });
        }
    }
}; 