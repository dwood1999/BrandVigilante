import { redirect, error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';
import { z } from 'zod';

// Validation schema for user updates
const UpdateUserSchema = z.object({
    id: z.number(),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    role: z.enum(['admin', 'user'])
});

export const load: PageServerLoad = async ({ locals, url }) => {
    console.log('Admin page load - user:', locals.user); // Debug log

    // Check if user is admin
    if (!locals.user) {
        console.log('No user found, redirecting to sign in');
        throw redirect(302, '/sign-in');
    }

    if (locals.user.role !== 'admin') {
        console.log('User is not admin, redirecting to dashboard');
        throw redirect(302, '/dashboard');
    }

    const page = Number(url.searchParams.get('page')) || 1;
    const perPage = Number(url.searchParams.get('perPage')) || 10;
    const search = url.searchParams.get('search') || undefined;
    const role = url.searchParams.get('role') as 'admin' | 'user' | undefined;

    try {
        const users = await UserModel.list({ page, perPage, search, role });
        return {
            users: users.users.map(user => ({
                ...user,
                created_at: typeof user.created_at === 'string' ? new Date(user.created_at).toISOString() : null
            })),
            pagination: {
                total: users.total,
                page: users.page,
                perPage: users.perPage,
                totalPages: users.totalPages
            },
            meta: {
                title: 'User Management - Admin Panel',
                description: 'Manage users in your system'
            }
        };
    } catch (err) {
        console.error('Error loading users:', err);
        throw error(500, 'Failed to load users');
    }
};

export const actions: Actions = {
    update: async ({ request, locals }) => {
        // Check if user is admin
        if (!locals.user || locals.user.role !== 'admin') {
            return fail(403, {
                error: 'Unauthorized'
            });
        }

        const formData = await request.formData();
        const data = Object.fromEntries(formData);

        try {
            // Validate input
            const validatedData = UpdateUserSchema.parse({
                ...data,
                id: Number(data.id)
            });

            // Update user
            const updatedUser = await UserModel.update(validatedData.id, {
                first_name: validatedData.first_name,
                last_name: validatedData.last_name,
                email: validatedData.email,
                role: validatedData.role
            });

            if (!updatedUser) {
                return fail(404, {
                    error: 'User not found'
                });
            }

            return {
                success: true,
                message: 'User updated successfully'
            };
        } catch (error) {
            console.error('Error updating user:', error);
            if (error instanceof z.ZodError) {
                return fail(400, {
                    error: 'Invalid input',
                    details: error.errors
                });
            }
            return fail(500, {
                error: 'Failed to update user'
            });
        }
    }
}; 