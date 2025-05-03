import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { verifyPassword, sessionConfig } from '$lib/server/auth';
import { SignInSchema } from '$lib/auth';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    logger.debug('Sign-in page load:', { 
        user: locals.user,
        sessionCookie: cookies.get(sessionConfig.cookieName),
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
        logger.debug('Form data received:', { 
            email: data.email,
            existingCookies: cookies.getAll().map(c => ({ 
                name: c.name, 
                value: c.value,
                valueType: typeof c.value
            }))
        });

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
                userId: user.id, 
                userData: { ...user, password: undefined } // Don't log password
            });

            // Verify password
            logger.debug('Verifying password');
            const isValidPassword = await verifyPassword(user.password, password);
            if (!isValidPassword) {
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

            // Set session cookie with secure options
            const userIdString = user.id.toString();
            const cookieSettings = {
                ...sessionConfig,  // Use the session config from auth.ts
                secure: !dev,  // Allow non-HTTPS in development
                httpOnly: true,
                sameSite: 'lax' as const,
                path: '/'
            };

            logger.debug('=== COOKIE SETUP START ===', {
                userId: userIdString,
                userIdType: typeof userIdString,
                userIdLength: userIdString.length,
                cookieName: sessionConfig.cookieName,
                cookieSettings,
                currentCookies: cookies.getAll().map(c => ({
                    name: c.name,
                    value: c.value,
                    valueType: typeof c.value,
                    valueLength: c.value?.length
                })),
                requestHeaders: Object.fromEntries(request.headers.entries()),
                requestUrl: request.url
            });
            
            // Set cookie with explicit options
            cookies.set(sessionConfig.cookieName, userIdString, cookieSettings);

            // Verify cookie was set
            const setCookie = cookies.get(sessionConfig.cookieName);
            logger.debug('=== COOKIE SET VERIFICATION ===', {
                cookieName: sessionConfig.cookieName,
                expectedValue: userIdString,
                expectedType: typeof userIdString,
                expectedLength: userIdString.length,
                actualValue: setCookie,
                actualType: typeof setCookie,
                actualLength: setCookie?.length,
                isSet: !!setCookie,
                allCookies: cookies.getAll().map(c => ({
                    name: c.name,
                    value: c.value,
                    valueType: typeof c.value,
                    valueLength: c.value?.length
                })),
                requestHeaders: Object.fromEntries(request.headers.entries()),
                requestUrl: request.url
            });

            logger.info(`User ${email} logged in successfully with ID ${userIdString}`);
            
            // Return success response with redirect
            return {
                success: true,
                redirect: '/dashboard'
            };
        } catch (error) {
            if (error instanceof z.ZodError) {
                logger.debug('Validation error:', { 
                    errors: error.errors,
                    formData: data
                });
                return fail(400, {
                    message: 'Invalid input',
                    errors: error.errors
                });
            }
            // Enhanced error logging
            const errorContext = {
                errorObject: error,
                errorMessage: error instanceof Error ? error.message : String(error),
                errorStack: error instanceof Error ? error.stack : undefined,
                errorType: error?.constructor?.name,
                details: error instanceof Error ? { ...error } : null // Spread properties if it's an Error
            };
            // Explicitly log message and stack
            logger.error('Sign-in error. Message:', errorContext.errorMessage);
            if (errorContext.errorStack) {
                logger.error('Sign-in error. Stack Trace:', errorContext.errorStack);
            }
            logger.error('Sign-in error. Full Context:', errorContext); // Keep for full details
            return fail(500, {
                message: 'An unexpected error occurred. Please try again.'
            });
        }
    }
}; 