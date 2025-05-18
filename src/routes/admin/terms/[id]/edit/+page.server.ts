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
    update: async ({ request, params }) => {
        const termId = parseInt(params.id);
        if (isNaN(termId)) {
            return fail(400, { error: 'Invalid term ID' });
        }

        const formData = await request.formData();
        const term = formData.get('term')?.toString().trim();
        const brandId = formData.get('brandId')?.toString();

        if (!term) {
            return fail(400, { 
                error: 'Term is required',
                fieldErrors: {
                    term: 'Term is required'
                }
            });
        }

        if (!brandId) {
            return fail(400, { 
                error: 'Brand is required',
                fieldErrors: {
                    brandId: 'Brand is required'
                }
            });
        }

        try {
            const updatedTerm = await TrademarkTermModel.update(termId, {
                term,
                brand_id: parseInt(brandId)
            });

            return { 
                success: true,
                message: 'Term updated successfully!',
                data: updatedTerm
            };
        } catch (error) {
            logger.error('Error updating term:', error);
            return fail(500, { 
                error: 'Failed to update term',
                data: {
                    term,
                    brand_id: brandId
                }
            });
        }
    }
}; 