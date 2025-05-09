import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { UserModel } from '$lib/models/user';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        console.error('Profile Load: No locals.user, redirecting to sign-in.');
        throw redirect(302, '/sign-in');
    }

    try {
        console.log('Profile Load: Fetching user by ID:', locals.user.id);
        const user = await UserModel.findById(locals.user.id);
        if (!user) {
            console.error('Profile Load: User not found by ID in DB, redirecting to sign-in. locals.user.id was:', locals.user.id);
            throw redirect(302, '/sign-in');
        }
        console.log('Profile Load: User found in DB.');

        const createdAtString = user.created_at instanceof Date 
            ? user.created_at.toISOString() 
            : user.created_at 
              ? new Date(user.created_at).toISOString() 
              : new Date().toISOString(); // Fallback

        if (!(user.created_at instanceof Date) && typeof user.created_at !== 'string') {
            console.warn('Profile Load: user.created_at was not a Date or string, using current date as fallback. Value was:', user.created_at);
        }

        return {
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                role: user.role,
                created_at: createdAtString,
                email_verified: locals.user.email_verified ?? false,
                lastLogin: new Date().toISOString() // For now using current time
            }
        };
    } catch (error) {
        console.error('Profile Load: CATCH BLOCK - Error loading profile data:', error);
        const errorObj = error as any;
        if (errorObj?.constructor?.name === 'Redirect' && errorObj.status && errorObj.location) {
            console.log('Profile Load: CATCH BLOCK - Re-throwing SvelteKit redirect.');
            throw error; // Re-throw the original redirect
        }
        console.log('Profile Load: CATCH BLOCK - Redirecting to /sign-in due to error.');
        throw redirect(302, '/sign-in?error=profile_load_failed');
    }
}; 