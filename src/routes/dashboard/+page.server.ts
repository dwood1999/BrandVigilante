import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';

interface DashboardData {
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        phone: string;
        role: 'admin' | 'user';
        email_verified: boolean;
        created_at: string;
        lastLogin: string;
    };
}

export const load: PageServerLoad = async ({ locals }): Promise<DashboardData> => {
    if (!locals.user) {
        throw redirect(302, '/sign-in');
    }

    try {
        const user = await UserModel.findById(locals.user.id);
        if (!user) {
            throw redirect(302, '/sign-in');
        }

        return {
            user: {
                ...user,
                created_at: user.created_at.toISOString(),
                lastLogin: new Date().toISOString(), // You might want to store this in the database
                email_verified: locals.user.email_verified
            }
        };
    } catch (error) {
        console.error('Error loading dashboard:', error);
        throw redirect(302, '/sign-in');
    }
}; 