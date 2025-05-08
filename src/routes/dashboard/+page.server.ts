import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { UserModel } from '$lib/models/user';
import { BrandModel } from '$lib/models/brand';

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
    brands: {
        id: number;
        name: string;
        display_name: string;
        url: string | null;
        description: string | null;
        status: 'active' | 'inactive';
        created_at: string;
        updated_at: string | null;
        marketplaces: {
            marketplace_id: number;
            name: string;
            url: string;
        }[];
        trademark_terms: {
            id: number;
            brand_id: number | null;
            term: string;
            created_at: string;
        }[];
    }[];
}

export const load: PageServerLoad = async ({ locals }): Promise<DashboardData> => {
    if (!locals.user) {
        console.error('Dashboard Load: No locals.user, redirecting to sign-in.');
        throw redirect(302, '/sign-in');
    }

    try {
        console.log('Dashboard Load: Fetching user by ID:', locals.user.id);
        const user = await UserModel.findById(locals.user.id);
        
        if (!user) {
            console.error('Dashboard Load: User not found by ID in DB, redirecting to sign-in. locals.user.id was:', locals.user.id);
            throw redirect(302, '/sign-in');
        }
        console.log('Dashboard Load: User found in DB:'); // Avoid logging entire user object for brevity if it's large or sensitive

        const brands = await BrandModel.findByUserId(user.id);
        console.log('Dashboard Load: Brands fetched for user ID:', user.id);

        // Ensure created_at is a Date object before calling toISOString
        const createdAtString = user.created_at instanceof Date 
            ? user.created_at.toISOString() 
            : user.created_at // If it's already a string, use as is, or handle if it's null/undefined
              ? new Date(user.created_at).toISOString() // Attempt to parse if string
              : new Date().toISOString(); // Fallback or error

        if (!(user.created_at instanceof Date) && typeof user.created_at !== 'string') {
            console.warn('Dashboard Load: user.created_at was not a Date or string, using current date as fallback. Value was:', user.created_at);
        }


        return {
            user: {
                ...user,
                // Ensure created_at and lastLogin are handled safely
                created_at: createdAtString,
                lastLogin: new Date().toISOString(),
                email_verified: locals.user.email_verified ?? false // Ensure fallback if undefined
            },
            brands
        };
    } catch (error) {
        console.error('Dashboard Load: CATCH BLOCK - Error loading dashboard data:', error);
        // Check if the error is a SvelteKit redirect object
        const errorObj = error as any;
        if (errorObj?.constructor?.name === 'Redirect' && errorObj.status && errorObj.location) {
            console.log('Dashboard Load: CATCH BLOCK - Re-throwing SvelteKit redirect.');
            throw error; // Re-throw the original redirect
        }
        // For other errors, redirect to sign-in
        console.log('Dashboard Load: CATCH BLOCK - Redirecting to /sign-in due to error.');
        throw redirect(302, '/sign-in?error=dashboard_load_failed');
    }
}; 