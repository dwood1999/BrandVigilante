import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { TrademarkTermModel } from '$lib/models/trademarkTerm';
import { BrandModel } from '$lib/models/brand';
import { logger } from '$lib/logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    const termId = parseInt(params.id);
    if (isNaN(termId)) {
        throw redirect(302, '/admin/terms');
    }

    try {
        const [term, brands] = await Promise.all([
            TrademarkTermModel.findById(termId),
            BrandModel.findAll()
        ]);

        if (!term) {
            throw redirect(302, '/admin/terms');
        }

        console.log('Loading term data:', term);

        return {
            term,
            brands
        };
    } catch (error) {
        logger.error('Error loading term data:', error);
        throw redirect(302, '/admin/terms');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const termId = parseInt(params.id);
        if (isNaN(termId)) {
            return fail(400, { error: 'Invalid term ID' });
        }

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
            await TrademarkTermModel.update(termId, {
                brand_id: parseInt(brandId),
                term
            });

            return { success: true };
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                return fail(400, { error: error.message });
            }
            
            logger.error('Error updating trademark term:', error);
            return fail(500, { error: 'Failed to update trademark term' });
        }
    }
}; 