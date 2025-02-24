import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';

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
                created_at: user.created_at.toISOString()
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