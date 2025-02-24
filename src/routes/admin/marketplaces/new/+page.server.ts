import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const name = formData.get('name')?.toString().trim();
        const url = formData.get('url')?.toString().trim();

        if (!name || !url) {
            return fail(400, { error: 'Name and URL are required' });
        }

        if (!isValidUrl(url)) {
            return fail(400, { error: 'Please enter a valid URL' });
        }

        try {
            await MarketplaceModel.create({
                name,
                url
            });

            return { success: true };
        } catch (error) {
            logger.error('Error creating marketplace:', error);
            return fail(500, { error: 'Failed to create marketplace' });
        }
    }
};

function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
} 