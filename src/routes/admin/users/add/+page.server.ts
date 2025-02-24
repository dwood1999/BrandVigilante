import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { hashPassword } from '$lib/auth';
import { z } from 'zod';

// Validation schema for new user
const NewUserSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    phone: z.string()
        .min(10, 'Phone number is required')
        .transform(val => val.replace(/\D/g, '')),
    role: z.enum(['admin', 'user'])
});

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/dashboard');
    }

    return {
        meta: {
            title: 'Add User - Admin Panel',
            description: 'Add a new user to the system'
        }
    };
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            const validatedData = NewUserSchema.parse(data);
            const hashedPassword = await hashPassword(validatedData.password);

            await UserModel.create({
                ...validatedData,
                password: hashedPassword
            });

            return { success: true };

        } catch (error) {
            console.error('Error creating user:', error);
            
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
                message: 'Failed to create user',
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