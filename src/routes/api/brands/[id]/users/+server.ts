import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { BrandModel } from '$lib/models/brand';
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
        const { userIds } = await request.json();
        
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return json({ error: 'Invalid user IDs' }, { status: 400 });
        }

        // Add all users to the brand
        await Promise.all(
            userIds.map(userId => BrandModel.addUser(brandId, userId))
        );

        return json({ success: true });
    } catch (error) {
        logger.error('Error associating users with brand:', error);
        return json({ error: 'Failed to associate users with brand' }, { status: 500 });
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
        const { userIds } = await request.json();
        
        if (!Array.isArray(userIds) || userIds.length === 0) {
            return json({ error: 'Invalid user IDs' }, { status: 400 });
        }

        // Remove all users from the brand
        await Promise.all(
            userIds.map(userId => BrandModel.removeUser(brandId, userId))
        );

        return json({ success: true });
    } catch (error) {
        logger.error('Error removing users from brand:', error);
        return json({ error: 'Failed to remove users from brand' }, { status: 500 });
    }
}; 