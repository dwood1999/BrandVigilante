import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { BrandModel } from '../../../lib/models/brand';
import { UserModel } from '../../../lib/models/user';
import { TrademarkTermModel } from '../../../lib/models/trademarkTerm';
import { MarketplaceModel } from '../../../lib/models/marketplace';
import { logger } from '../../../lib/logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'admin') {
        throw redirect(302, '/');
    }

    try {
        const brands = await BrandModel.findAll();
        return { brands };
    } catch (error) {
        logger.error('Error loading brands:', error);
        throw error;
    }
};

export const actions: Actions = {
    deleteBrand: async ({ request }) => {
        const formData = await request.formData();
        const brandId = formData.get('brandId');

        if (!brandId) {
            return { success: false, message: 'Brand ID is required' };
        }

        try {
            await BrandModel.delete(parseInt(brandId.toString()));
            return { success: true };
        } catch (error) {
            logger.error('Error deleting brand:', error);
            return { success: false, message: 'Failed to delete brand' };
        }
    }
}; 