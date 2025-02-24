import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const marketplaceId = parseInt(params.id);
    if (isNaN(marketplaceId)) {
        throw redirect(302, '/admin/marketplaces');
    }

    try {
        const marketplace = await MarketplaceModel.findById(marketplaceId);
        if (!marketplace) {
            throw redirect(302, '/admin/marketplaces');
        }

        return {
            marketplace
        };
    } catch (error) {
        logger.error('Error loading marketplace:', error);
        throw redirect(302, '/admin/marketplaces');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const marketplaceId = parseInt(params.id);
        if (isNaN(marketplaceId)) {
            return fail(400, { error: 'Invalid marketplace ID' });
        }

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
            await MarketplaceModel.update(marketplaceId, {
                name,
                url
            });

            return { success: true };
        } catch (error) {
            logger.error('Error updating marketplace:', error);
            return fail(500, { error: 'Failed to update marketplace' });
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