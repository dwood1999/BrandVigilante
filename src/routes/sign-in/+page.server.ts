import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { verifyPassword } from '$lib/server/auth';
import { SignInSchema } from '$lib/auth';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';
import { z } from 'zod';
import { auth } from '$lib/server/lucia';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    logger.debug('Sign-in page load:', { 
        user: locals.user,
        sessionCookie: cookies.get(auth.sessionCookieName),
        allCookies: cookies.getAll().map(c => ({ 
            name: c.name, 
            value: c.value,
            valueType: typeof c.value
        }))
    });
    if (locals.user) {
        logger.debug('User already logged in, redirecting to dashboard');
        throw redirect(302, '/dashboard');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        logger.debug('Sign-in action started');
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            logger.debug('Validating input data');
            const validatedData = SignInSchema.parse(data);
            const { email, password } = validatedData;
            logger.debug('Input validation successful');

            // Find user
            logger.debug('Looking up user:', { email });
            const user = await UserModel.findByEmail(email);
            
            if (!user) {
                logger.debug('User not found:', { email });
                return fail(400, {
                    message: 'Invalid email or password',
                    data: { email }
                });
            }

            logger.debug('User found:', { 
                id: user.id,
                email: user.email,
                role: user.role
            });

            // Verify password
            logger.debug('Verifying password');
            const isValid = await verifyPassword(user.password, password);
            
            if (!isValid) {
                logger.debug('Invalid password for user:', { email });
                return fail(400, {
                    message: 'Invalid email or password',
                    data: { email }
                });
            }

            logger.debug('Password verified successfully');

            // Ensure user has an ID
            if (!user.id) {
                logger.error('User has no ID:', { email });
                return fail(500, {
                    message: 'An unexpected error occurred. Please try again.',
                    data: { email }
                });
            }

            try {
                // Create a new session using Lucia
                const session = await auth.createSession(user.id.toString(), {});
                const sessionCookie = auth.createSessionCookie(session.id);
                
                // Set the session cookie with proper attributes
                cookies.set(sessionCookie.name, sessionCookie.value, {
                    path: '/',
                    ...sessionCookie.attributes,
                    secure: !dev,
                    sameSite: 'lax'
                });

                logger.info('User logged in successfully with ID', { userId: user.id, email: user.email });
                
                // Redirect to dashboard
                return {
                    success: true,
                    redirect: '/dashboard'
                };
            } catch (sessionError) {
                logger.error('Session creation error:', {
                    error: sessionError instanceof Error ? sessionError.message : String(sessionError),
                    stack: sessionError instanceof Error ? sessionError.stack : undefined
                });
                return fail(500, {
                    message: 'Failed to create session. Please try again.'
                });
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.debug('Validation error:', { 
                    errors: error.errors,
                    formData: data
                });
                return fail(400, {
                    message: 'Please check your input and try again.',
                    fieldErrors: error.errors.reduce((acc, err) => {
                        const path = err.path.join('.');
                        acc[path] = [err.message];
                        return acc;
                    }, {} as Record<string, string[]>)
                });
            }

            // Enhanced error logging
            const errorContext = {
                errorObject: error,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                errorType: error?.constructor?.name,
                details: error instanceof Error ? { ...error } : null
            };
            
            logger.error('Sign-in error. Message:', errorContext.errorMessage);
            if (errorContext.errorStack) {
                logger.error('Sign-in error. Stack Trace:', errorContext.errorStack);
            }
            logger.error('Sign-in error. Full Context:', errorContext);

            // Return a generic error message
            return fail(500, {
                message: 'An unexpected error occurred. Please try again.'
            });
        }
    }
}; 