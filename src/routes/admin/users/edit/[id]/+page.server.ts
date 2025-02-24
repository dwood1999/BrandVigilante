import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { hashPassword } from '$lib/auth';
import { z } from 'zod';

// Validation schema for user updates
const UpdateUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    phone: z.string()
        .min(10, 'Phone number is required')
        .transform(val => val.replace(/\D/g, '')),
    role: z.enum(['admin', 'user'])
});

export const load: PageServerLoad = async ({ locals, params }) => {
    // Check if user is admin
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/dashboard');
    }

    try {
        const user = await UserModel.findById(parseInt(params.id));
        if (!user) {
            throw error(404, 'User not found');
        }

        return {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        };
    } catch (err) {
        console.error('Error loading user:', err);
        throw error(500, 'Failed to load user');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);
        const userId = parseInt(params.id);

        try {
            const validatedData = UpdateUserSchema.parse(data);
            const updateData: Partial<typeof validatedData> = {
                first_name: validatedData.first_name,
                last_name: validatedData.last_name,
                email: validatedData.email,
                phone: validatedData.phone,
                role: validatedData.role
            };

            // Only update password if provided
            if (validatedData.password) {
                updateData.password = await hashPassword(validatedData.password);
            }

            await UserModel.update(userId, updateData);
            return { success: true };

        } catch (error) {
            console.error('Error updating user:', error);
            
            if (error instanceof z.ZodError) {
                return fail(400, {
                    success: false,
                    message: 'Please check your input',
                    fieldErrors: error.flatten().fieldErrors,
                    data: {
                        first_name: data.first_name?.toString(),
                        last_name: data.last_name?.toString(),
                        email: data.email?.toString(),
                        phone: data.phone?.toString(),
                        role: data.role?.toString()
                    }
                });
            }

            return fail(500, {
                success: false,
                message: 'Failed to update user',
                data: {
                    first_name: data.first_name?.toString(),
                    last_name: data.last_name?.toString(),
                    email: data.email?.toString(),
                    phone: data.phone?.toString(),
                    role: data.role?.toString()
                }
            });
        }
    }
}; 