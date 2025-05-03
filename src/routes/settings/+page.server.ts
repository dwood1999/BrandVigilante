import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { z } from 'zod';
import { UserModel } from '$lib/models/user';
import { logger } from '$lib/logger';
import { hashPassword, verifyPassword } from '$lib/server/auth';

// Profile update schema
const profileSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address')
});

// Password update schema
const passwordSchema = z.object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string().min(8, 'Password must be at least 8 characters')
}).refine(data => data.new_password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password']
});

// Notification settings schema
const notificationSchema = z.object({
    email_notifications: z.boolean().optional(),
    browser_notifications: z.boolean().optional()
});

export const actions = {
    updateProfile: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        try {
            if (!locals.user) {
                return fail(401, {
                    type: 'error',
                    error: 'You must be logged in to update your profile'
                });
            }

            const validatedData = profileSchema.parse(formData);

            // Check if email is already taken by another user
            if (validatedData.email !== locals.user.email) {
                const existingUser = await UserModel.findByEmail(validatedData.email);
                if (existingUser && existingUser.id !== locals.user.id) {
                    return fail(400, {
                        type: 'error',
                        error: 'Email is already taken'
                    });
                }
            }

            // Update user profile
            const updatedUser = await UserModel.update(locals.user.id, validatedData);

            if (!updatedUser) {
                return fail(500, {
                    type: 'error',
                    error: 'Failed to update profile'
                });
            }

            return {
                type: 'success',
                status: 200,
                data: {
                    message: 'Profile updated successfully'
                }
            };
        } catch (error) {
            logger.error('Profile update error:', error);
            
            if (error instanceof z.ZodError) {
                return fail(400, {
                    type: 'error',
                    error: 'Validation failed',
                    errors: error.errors
                });
            }

            return fail(500, {
                type: 'error',
                error: 'Failed to update profile'
            });
        }
    },

    updatePassword: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        try {
            if (!locals.user?.id) {
                return fail(401, {
                    type: 'error',
                    error: 'You must be logged in to update your password'
                });
            }

            const validatedData = passwordSchema.parse(formData);

            // Get current user with password
            const user = await UserModel.findById(locals.user.id);
            if (!user?.id) {
                return fail(404, {
                    type: 'error',
                    error: 'User not found'
                });
            }

            // Verify current password
            const isValid = await verifyPassword(user.password, validatedData.current_password);
            if (!isValid) {
                return fail(400, {
                    type: 'error',
                    error: 'Current password is incorrect'
                });
            }

            // Hash new password
            const hashedPassword = await hashPassword(validatedData.new_password);

            // Update password
            const updatedUser = await UserModel.update(user.id, {
                password: hashedPassword
            });

            if (!updatedUser) {
                return fail(500, {
                    type: 'error',
                    error: 'Failed to update password'
                });
            }

            return {
                type: 'success',
                status: 200,
                data: {
                    message: 'Password updated successfully'
                }
            };
        } catch (error) {
            logger.error('Error updating password:', error);
            return fail(500, {
                type: 'error',
                error: 'An unexpected error occurred. Please try again.'
            });
        }
    },

    updateNotifications: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        try {
            if (!locals.user) {
                return fail(401, {
                    type: 'error',
                    error: 'You must be logged in to update notification settings'
                });
            }

            const validatedData = notificationSchema.parse({
                email_notifications: formData.email_notifications === 'on',
                browser_notifications: formData.browser_notifications === 'on'
            });

            // TODO: Update notification settings in database
            // For now, just log the settings
            logger.info('Notification settings update:', {
                userId: locals.user.id,
                settings: validatedData
            });

            return {
                type: 'success',
                status: 200,
                data: {
                    message: 'Notification settings updated successfully'
                }
            };
        } catch (error) {
            logger.error('Notification settings update error:', error);
            
            if (error instanceof z.ZodError) {
                return fail(400, {
                    type: 'error',
                    error: 'Validation failed',
                    errors: error.errors
                });
            }

            return fail(500, {
                type: 'error',
                error: 'Failed to update notification settings'
            });
        }
    }
} satisfies Actions; 