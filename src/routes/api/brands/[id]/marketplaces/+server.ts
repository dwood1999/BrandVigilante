import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MarketplaceModel } from '$lib/models/marketplace';
import { logger } from '$lib/logger';

export const POST: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 });
    }

    const brandId = parseInt(params.id);
    if (isNaN(brandId)) {
        return json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    try {
        const { marketplaceIds } = await request.json();
        
        if (!Array.isArray(marketplaceIds) || marketplaceIds.length === 0) {
            return json({ error: 'Invalid marketplace IDs' }, { status: 400 });
        }

        // Add all marketplaces to the brand
        await Promise.all(
            marketplaceIds.map(marketplaceId => 
                MarketplaceModel.addToBrand(brandId, marketplaceId)
            )
        );

        return json({ success: true });
    } catch (error) {
        logger.error('Error associating marketplaces with brand:', error);
        return json({ error: 'Failed to associate marketplaces' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 });
    }

    const brandId = parseInt(params.id);
    if (isNaN(brandId)) {
        return json({ error: 'Invalid brand ID' }, { status: 400 });
    }

    try {
        const { marketplaceIds } = await request.json();
        
        if (!Array.isArray(marketplaceIds) || marketplaceIds.length === 0) {
            return json({ error: 'Invalid marketplace IDs' }, { status: 400 });
        }

        // Remove all marketplaces from the brand
        await Promise.all(
            marketplaceIds.map(marketplaceId => 
                MarketplaceModel.removeFromBrand(brandId, marketplaceId)
            )
        );

        return json({ success: true });
    } catch (error) {
        logger.error('Error removing marketplaces from brand:', error);
        return json({ error: 'Failed to remove marketplaces' }, { status: 500 });
    }
}; 