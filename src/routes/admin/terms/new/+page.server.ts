import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { BrandModel } from '$lib/models/brand';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    try {
        const brands = await BrandModel.findAll();
        return {
            brands
        };
    } catch (error) {
        logger.error('Error loading brands:', error);
        throw redirect(302, '/admin/terms');
    }
};

export const actions: Actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const brandId = formData.get('brandId')?.toString();
        const term = formData.get('term')?.toString().trim();

        if (!brandId) {
            return fail(400, { error: 'Please select a brand' });
        }

        if (!term) {
            return fail(400, { error: 'Trademark term is required' });
        }

        try {
            await TrademarkTermModel.create({
                brand_id: parseInt(brandId),
                term
            });

            return { success: true };
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                return fail(400, { error: error.message });
            }
            
            logger.error('Error creating trademark term:', error);
            return fail(500, { error: 'Failed to create trademark term' });
        }
    }
}; 