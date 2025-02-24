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
    if (isNaN(brandId)) {
        throw redirect(302, '/admin/brands');
    }

    try {
        const brand = await BrandModel.findById(brandId);
        if (!brand) {
            throw redirect(302, '/admin/brands');
        }

        return { brand };
    } catch (error) {
        logger.error('Error loading brand data:', error);
        throw redirect(302, '/admin/brands');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const term = formData.get('term')?.toString().trim();
        const brandId = parseInt(params.id);

        if (!term) {
            return { error: 'Trademark term is required' };
        }

        try {
            await TrademarkTermModel.create({
                brand_id: brandId,
                term
            });

            return { success: true };
        } catch (error) {
            logger.error('Error creating trademark term:', error);
            return { error: 'Failed to create trademark term' };
        }
    }
}; 