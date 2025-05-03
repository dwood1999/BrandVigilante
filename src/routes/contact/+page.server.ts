import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';
import { logger } from '$lib/logger';

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

            // TODO: Send email notification
            // For now, just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000));

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