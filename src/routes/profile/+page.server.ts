import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';

export const load: PageServerLoad = async ({ locals }) => {
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
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                role: user.role,
                created_at: user.created_at.toISOString(),
                lastLogin: new Date().toISOString() // For now using current time
            }
        };
    } catch (error) {
        console.error('Error loading dashboard:', error);
        throw redirect(302, '/sign-in');
    }
}; 