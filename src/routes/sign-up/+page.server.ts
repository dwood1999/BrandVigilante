import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { hashPassword } from '$lib/auth';
import { sessionConfig } from '$lib/session';
import { SignUpSchema } from '$lib/auth';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';
import { VerificationTokenModel } from '$lib/models/verificationToken';
import { sendEmail, getVerificationEmailContent } from '$lib/email';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/dashboard');
    }
};

export const actions: Actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            const validatedData = SignUpSchema.parse(data);
            const { email, password, phone, first_name, last_name } = validatedData;

            // Check if user exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return fail(400, {
                    message: 'Email already registered',
                    data: { email, phone, first_name, last_name }
                });
            }

            // Hash password and create user
            const hashedPassword = await hashPassword(password);
            const user = await UserModel.create({
                email,
                password: hashedPassword,
                phone,
                first_name,
                last_name,
                role: 'user',
                email_verified: false
            });

            // Generate verification token
            const token = await VerificationTokenModel.create(user.id);

            // Send verification email
            const emailContent = getVerificationEmailContent(token, first_name);
            const emailSent = await sendEmail({
                to: email,
                subject: 'Verify your email address',
                html: emailContent
            });

            if (!emailSent) {
                logger.error(`Failed to send verification email to ${email}`);
            }

            // Set session cookie
            cookies.set(sessionConfig.cookieName, user.id.toString(), {
                ...sessionConfig,
                secure: !dev // Allow non-HTTPS in development
            });

            logger.info(`New user registered: ${email}`);

            // Return success before redirect
            return { success: true, userId: user.id };

        } catch (error) {
            logger.error('Registration error:', error);

            if (error.errors) {
                // Format Zod validation errors
                const fieldErrors = error.flatten().fieldErrors;
                return fail(400, {
                    fieldErrors,
                    data: {
                        email: data.email,
                        phone: data.phone,
                        first_name: data.first_name,
                        last_name: data.last_name
                    }
                });
            }

            return fail(500, {
                message: 'An unexpected error occurred. Please try again.',
                data: {
                    email: data.email,
                    phone: data.phone,
                    first_name: data.first_name,
                    last_name: data.last_name
                }
            });
        }
    }
}; 