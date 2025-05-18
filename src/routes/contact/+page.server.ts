import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';
import { logger } from '$lib/logger';
import { sendEmail } from '$lib/email';

// Contact form schema
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters long')
});

export const actions = {
    default: async ({ request }) => {
        const formData = Object.fromEntries(await request.formData());

        try {
            // Validate form data
            const validatedData = contactSchema.parse(formData);

            // Log the contact form submission
            logger.info('Contact form submission:', {
                name: validatedData.name,
                email: validatedData.email,
                subject: validatedData.subject,
                timestamp: new Date().toISOString()
            });

            // Send notification email to admin
            const emailSent = await sendEmail({
                to: 'cbreaux@janusipm.com',
                subject: `New Contact Form Submission: ${validatedData.subject}`,
                html: `
                    <p>A new contact form submission has been received:</p>
                    <ul>
                        <li><strong>Name:</strong> ${validatedData.name}</li>
                        <li><strong>Email:</strong> ${validatedData.email}</li>
                        <li><strong>Subject:</strong> ${validatedData.subject}</li>
                        <li><strong>Message:</strong> ${validatedData.message}</li>
                    </ul>
                `
            });

            if (!emailSent) {
                logger.error('Failed to send contact form notification email');
                return fail(500, {
                    type: 'error',
                    error: 'Failed to send message'
                });
            }

            return {
                type: 'success',
                status: 200,
                data: {
                    message: 'Message sent successfully'
                }
            };
        } catch (error) {
            logger.error('Contact form validation error:', error);
            
            if (error instanceof z.ZodError) {
                const errors = error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }));

                return fail(400, {
                    type: 'error',
                    error: 'Validation failed',
                    errors
                });
            }

            return fail(500, {
                type: 'error',
                error: 'Failed to send message'
            });
        }
    }
} satisfies Actions; 