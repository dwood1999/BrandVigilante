import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    try {
        const marketplaces = await MarketplaceModel.findAll();
        return {
            marketplaces
        };
    } catch (error) {
        logger.error('Error loading marketplaces:', error);
        return {
            marketplaces: []
        };
    }
};

export const actions: Actions = {
    deleteMarketplace: async ({ request }) => {
        const formData = await request.formData();
        const marketplaceId = formData.get('marketplaceId');

        if (!marketplaceId) {
            return fail(400, { error: 'Marketplace ID is required' });
        }

        try {
            await MarketplaceModel.delete(parseInt(marketplaceId.toString()));
            return { success: true };
        } catch (error) {
            logger.error('Error deleting marketplace:', error);
            return fail(500, { error: 'Failed to delete marketplace' });
        }
    }
}; 