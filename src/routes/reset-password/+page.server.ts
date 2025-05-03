import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { z } from 'zod';
import { logger } from '$lib/logger';

// Schema for password reset
const ResetPasswordSchema = z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const load: PageServerLoad = async ({ url, locals }) => {
    // If user is already logged in, redirect to dashboard
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }

    const token = url.searchParams.get('token');
    if (!token) {
        throw redirect(302, '/forgot-password');
    }

    // Validate token
    const userId = await UserModel.validatePasswordResetToken(token);
    if (!userId) {
        throw redirect(302, '/forgot-password?error=invalid_token');
    }

    return { token };
};

export const actions: Actions = {
    default: async ({ request }) => {
        logger.debug('Reset password action started');
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            logger.debug('Validating input data');
            const validatedData = ResetPasswordSchema.parse(data);
            const { token, password } = validatedData;
            logger.debug('Input validation successful');

            // Validate token and get user ID
            const userId = await UserModel.validatePasswordResetToken(token);
            if (!userId) {
                return fail(400, {
                    message: 'Invalid or expired reset token. Please request a new password reset link.'
                });
            }

            // Update password
            await UserModel.updatePassword(userId, password);
            
            // Delete used token
            await UserModel.deletePasswordResetToken(token);
            
            logger.info('Password reset successful for user:', { userId });
            
            return {
                success: true,
                message: 'Your password has been reset successfully.'
            };
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
            
            logger.error('Reset password error. Message:', errorContext.errorMessage);
            if (errorContext.errorStack) {
                logger.error('Reset password error. Stack Trace:', errorContext.errorStack);
            }
            logger.error('Reset password error. Full Context:', errorContext);

            // Return a generic error message
            return fail(500, {
                message: 'An unexpected error occurred. Please try again.'
            });
        }
    }
}; 