import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { pool } from '$lib/db';
import { logger } from '$lib/logger';

export const PUT: RequestHandler = async ({ params, request, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        return new Response('Unauthorized', { status: 401 });
    }

    const brandId = parseInt(params.id);
    const marketplaceId = parseInt(params.marketplaceId);
    
    if (isNaN(brandId) || isNaN(marketplaceId)) {
        return json({ error: 'Invalid IDs' }, { status: 400 });
    }

    try {
        const { status } = await request.json();
        
        if (status !== 'active' && status !== 'inactive') {
            return json({ error: 'Invalid status' }, { status: 400 });
        }

        await pool.query(
            'UPDATE brand_marketplaces SET status = ? WHERE brand_id = ? AND marketplace_id = ?',
            [status, brandId, marketplaceId]
        );

        return json({ success: true });
    } catch (error) {
        logger.error('Error updating marketplace status:', error);
        return json({ error: 'Failed to update status' }, { status: 500 });
    }
}; 