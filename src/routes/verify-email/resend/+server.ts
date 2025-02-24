import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UserModel } from '$lib/models/user';
import { VerificationTokenModel } from '$lib/models/verificationToken';
import { sendEmail, getVerificationEmailContent } from '$lib/email';
import { checkLoginRateLimit } from '$lib/session';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/sign-in');
    }

    const user = await UserModel.findById(locals.user.id);
    if (!user) {
        throw redirect(302, '/sign-in');
    }

    if (user.email_verified) {
        throw redirect(302, '/verify-email?error=already-verified');
    }

    // Check rate limiting
    if (!checkLoginRateLimit(`verify_${user.id}`)) {
        throw redirect(302, '/verify-email?error=too-many-attempts');
    }

    const attempts = await VerificationTokenModel.incrementAttempts(user.id);
    if (attempts > 3) {
        throw redirect(302, '/verify-email?error=max-attempts');
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
        throw redirect(302, '/verify-email?error=send-failed');
    }

    // Redirect to verification page with success message
    throw redirect(302, '/verify-email?status=email-sent');
}; 