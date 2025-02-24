import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '$lib/models/brand';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const brandId = parseInt(params.id);
    const termId = parseInt(params.termId);
    
    if (isNaN(brandId) || isNaN(termId)) {
        throw redirect(302, '/admin/brands');
    }

    try {
        const [brand, term] = await Promise.all([
            BrandModel.findById(brandId),
            TrademarkTermModel.findById(termId)
        ]);

        if (!brand || !term || term.brand_id !== brandId) {
            throw redirect(302, '/admin/brands');
        }

        return { brand, term };
    } catch (error) {
        logger.error('Error loading term data:', error);
        throw redirect(302, '/admin/brands');
    }
};

export const actions: Actions = {
    update: async ({ request, params }) => {
        const formData = await request.formData();
        const term = formData.get('term')?.toString().trim();
        const termId = parseInt(params.termId);

        if (!term) {
            return { error: 'Trademark term is required' };
        }

        try {
            await TrademarkTermModel.update(termId, { term });
            return { success: true };
        } catch (error) {
            logger.error('Error updating trademark term:', error);
            return { error: 'Failed to update trademark term' };
        }
    },

    delete: async ({ params }) => {
        const termId = parseInt(params.termId);

        try {
            await TrademarkTermModel.delete(termId);
            return { success: true };
        } catch (error) {
            logger.error('Error deleting trademark term:', error);
            return { error: 'Failed to delete trademark term' };
        }
    }
}; 