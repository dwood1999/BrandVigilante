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
        throw redirect(302, '/sign-in');
    }

    try {
        const user = await UserModel.findById(locals.user.id);
        if (!user) {
            throw redirect(302, '/sign-in');
        }

        const brands = await BrandModel.findByUserId(user.id);

        return {
            user: {
                ...user,
                created_at: user.created_at.toISOString(),
                lastLogin: new Date().toISOString(), // You might want to store this in the database
                email_verified: locals.user.email_verified
            },
            brands
        };
    } catch (error) {
        console.error('Error loading dashboard:', error);
        throw redirect(302, '/sign-in');
    }
}; 