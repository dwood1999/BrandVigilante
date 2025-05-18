import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { z } from 'zod';
import { logger } from '$lib/logger';
import { dev } from '$app/environment';
import { sendEmail } from '$lib/email';
import { env } from '$env/dynamic/private';

// Schema for forgot password
const ForgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address')
});

export const load: PageServerLoad = async ({ locals }) => {
    // If user is already logged in, redirect to dashboard
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        logger.debug('Forgot password action started');
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            logger.debug('Validating input data');
            const validatedData = ForgotPasswordSchema.parse(data);
            const { email } = validatedData;
            logger.debug('Input validation successful');

            // Find user
            logger.debug('Looking up user:', { email });
            const user = await UserModel.findByEmail(email);
            
            if (user?.id) {
                // Generate reset token
                const resetToken = await UserModel.createPasswordResetToken(user.id.toString());
                
                // Send reset email
                const resetUrl = `${env.ORIGIN}/reset-password?token=${resetToken}`;
                const emailContent = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #1a56db;">Reset Your Password</h2>
                        <p>Hi ${user.first_name},</p>
                        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
                        <p>To reset your password, click the button below:</p>
                        <div style="margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background-color: #1a56db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all;">${resetUrl}</p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you have any questions, please contact our support team.</p>
                        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
                    </div>
                `;

                const emailSent = await sendEmail({
                    to: email,
                    subject: 'Reset your JanusIPM password',
                    html: emailContent
                });

                if (!emailSent) {
                    logger.error('Failed to send password reset email:', { email });
                    return fail(500, {
                        message: 'Failed to send password reset email. Please try again.'
                    });
                }
                
                logger.info('Password reset email sent:', { email });
            }
            
            // Always return success to prevent email enumeration
            return {
                success: true,
                message: 'If an account exists with that email, you will receive password reset instructions.'
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
            
            logger.error('Forgot password error. Message:', errorContext.errorMessage);
            if (errorContext.errorStack) {
                logger.error('Forgot password error. Stack Trace:', errorContext.errorStack);
            }
            logger.error('Forgot password error. Full Context:', errorContext);

            // Return a generic error message
            return fail(500, {
                message: 'An unexpected error occurred. Please try again.'
            });
        }
    }
}; 