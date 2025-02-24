import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { UserModel } from '$lib/models/user';
import { VerificationTokenModel } from '$lib/models/verificationToken';
import { sendEmail, getVerificationEmailContent } from '$lib/email';
import { checkLoginRateLimit } from '$lib/session';
import { logger } from '$lib/logger';

export interface VerifyEmailData {
    error?: string;
    success?: string;
    isResend?: boolean;
}

export const load: PageServerLoad = async ({ url, locals }): Promise<VerifyEmailData> => {
    const token = url.searchParams.get('token');
    const status = url.searchParams.get('status');
    const error = url.searchParams.get('error');

    // Handle status messages
    if (status === 'email-sent') {
        return {
            success: 'Verification email sent successfully. Please check your inbox.'
        };
    }

    // Handle error messages
    if (error) {
        switch (error) {
            case 'already-verified':
                return { error: 'Email already verified' };
            case 'too-many-attempts':
                return { error: 'Too many verification attempts. Please try again later.' };
            case 'max-attempts':
                return { error: 'Maximum verification attempts reached. Please contact support.' };
            case 'send-failed':
                return { error: 'Failed to send verification email. Please try again.' };
        }
    }

    // If no token, show resend form
    if (!token) {
        return {
            isResend: true
        };
    }

    try {
        const verificationToken = await VerificationTokenModel.findByToken(token);
        
        if (!verificationToken) {
            return {
                error: 'Invalid verification token'
            };
        }

        if (new Date() > verificationToken.expires_at) {
            await VerificationTokenModel.delete(token);
            return {
                error: 'Verification token has expired'
            };
        }

        const user = await UserModel.findById(verificationToken.user_id);
        if (!user) {
            return {
                error: 'User not found'
            };
        }

        if (user.email_verified) {
            return {
                success: 'Email already verified'
            };
        }

        // Verify the email
        await UserModel.update(verificationToken.user_id, { email_verified: true });
        await VerificationTokenModel.delete(token);

        return {
            success: 'Email verified successfully'
        };

    } catch (error) {
        logger.error('Email verification error:', error);
        return {
            error: 'An error occurred during verification'
        };
    }
};

export const actions: Actions = {
    resend: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/sign-in');
        }

        const user = await UserModel.findById(locals.user.id);
        if (!user) {
            throw redirect(302, '/sign-in');
        }

        if (user.email_verified) {
            return fail(400, {
                message: 'Email already verified'
            });
        }

        // Check rate limiting
        if (!checkLoginRateLimit(`verify_${user.id}`)) {
            return fail(429, {
                message: 'Too many verification attempts. Please try again later.'
            });
        }

        const attempts = await VerificationTokenModel.incrementAttempts(user.id);
        if (attempts > 3) {
            return fail(400, {
                message: 'Maximum verification attempts reached. Please contact support.'
            });
        }

        // Generate new token and send email
        const token = await VerificationTokenModel.create(user.id);
        const emailContent = getVerificationEmailContent(token, user.first_name);
        const emailSent = await sendEmail({
            to: user.email,
            subject: 'Verify your email address',
            html: emailContent
        });

        if (!emailSent) {
            return fail(500, {
                message: 'Failed to send verification email'
            });
        }

        return {
            success: true,
            message: 'Verification email sent'
        };
    }
}; 