import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { hashPassword, sessionConfig } from '$lib/server/auth';
import { SignUpSchema } from '$lib/auth';
import { dev } from '$app/environment';
import { logger } from '$lib/logger';
import { VerificationTokenModel } from '$lib/models/verificationToken';
import { sendEmail, getVerificationEmailContent } from '$lib/email';
import { z } from 'zod';

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

            if (!user?.id) {
                throw new Error('Failed to create user');
            }

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

            // Set session cookie with secure options
            cookies.set(sessionConfig.cookieName, user.id.toString(), {
                ...sessionConfig,
                secure: !dev, // Allow non-HTTPS in development
                httpOnly: true,
                sameSite: 'strict',
                path: '/'
            });

            logger.info(`New user registered: ${email}`);

            // Redirect to success page with email parameter
            throw redirect(303, `/registration-success?email=${encodeURIComponent(email)}`);

        } catch (error) {
            console.error('Error in sign-up action:', error);
            
            if (error instanceof z.ZodError) {
                return fail(400, {
                    message: 'Please check your input',
                    fieldErrors: error.flatten().fieldErrors,
                    data: {
                        email: data.email?.toString(),
                        phone: data.phone?.toString(),
                        first_name: data.first_name?.toString(),
                        last_name: data.last_name?.toString()
                    }
                });
            }

            return fail(500, {
                message: 'An unexpected error occurred. Please try again.',
                data: {
                    email: data.email?.toString(),
                    phone: data.phone?.toString(),
                    first_name: data.first_name?.toString(),
                    last_name: data.last_name?.toString()
                }
            });
        }
    }
}; 